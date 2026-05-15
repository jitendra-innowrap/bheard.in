import nodemailer from "nodemailer";

export type LeadMailPayload = {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  sourcePage?: string | null;
  submittedAtIso: string;
};

const CONSUMER_MAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
]);

function getFirstEnv(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value?.trim()) return value.trim();
  }
  return "";
}

function parseRecipientList(value: string) {
  return value
    .split(/[,;]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function getLeadNotificationRecipients() {
  const keys = ["LEAD_NOTIFICATION_TO", "FORM_NOTIFICATION_TO", "NOTIFICATION_EMAIL"];
  for (const key of keys) {
    const value = getFirstEnv([key]);
    if (value) return parseRecipientList(value);
  }
  return [];
}

const LEAD_SOURCE_PATH_LABELS: Record<string, string> = {
  "/": "Homepage",
  "/contact": "Contact page",
};

const LEAD_SOURCE_HASH_LABELS: Record<string, string> = {
  cta: "Let's Talk button",
};

function titleCaseWords(value: string) {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatPathToPageLabel(path: string) {
  const segments = path.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
  if (segments.length === 0) return "Homepage";
  return `${titleCaseWords(segments[segments.length - 1])} page`;
}

export function formatLeadSourceLabel(sourcePage?: string | null) {
  const raw = sourcePage?.trim();
  if (!raw) return "Website";

  const [pathPart, hashPart] = raw.split("#");
  const path = pathPart || "/";
  const pageLabel = LEAD_SOURCE_PATH_LABELS[path] ?? formatPathToPageLabel(path);

  if (!hashPart) return pageLabel;

  const hashLabel =
    LEAD_SOURCE_HASH_LABELS[hashPart.toLowerCase()] ?? `${titleCaseWords(hashPart)} section`;
  return `${pageLabel} â€” ${hashLabel}`;
}

function getSenderEmail() {
  return getFirstEnv(["SMTP_FROM", "SMTP_USER", "AZURE_SENDER_EMAIL", "MS_GRAPH_SENDER_USER"]);
}

function getSenderDomain(email: string) {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

function isConsumerMailbox(email: string) {
  return CONSUMER_MAIL_DOMAINS.has(getSenderDomain(email));
}

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromAddress: string;
  fromName: string;
};

function resolveSmtpConfig(): SmtpConfig | null {
  const pass = getFirstEnv(["SMTP_PASS", "SMTP_PASSWORD", "GMAIL_APP_PASSWORD"]);
  const fromAddress = getSenderEmail();
  const fromName = getFirstEnv(["AZURE_SENDER_NAME", "SMTP_FROM_NAME", "MAIL_FROM_NAME"]) || "BHEARD";

  if (!fromAddress) return null;

  const explicitHost = getFirstEnv(["SMTP_HOST"]);
  if (explicitHost) {
    const user = getFirstEnv(["SMTP_USER"]) || fromAddress;
    const portRaw = getFirstEnv(["SMTP_PORT"]);
    const port = portRaw ? Number(portRaw) : 587;
    const secure = getFirstEnv(["SMTP_SECURE"]) === "true" || port === 465;
    if (!pass) return null;
    return {
      host: explicitHost,
      port,
      secure,
      user,
      pass,
      fromAddress: getFirstEnv(["SMTP_FROM"]) || fromAddress,
      fromName,
    };
  }

  const domain = getSenderDomain(fromAddress);
  if (!pass) return null;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      user: getFirstEnv(["SMTP_USER"]) || fromAddress,
      pass,
      fromAddress,
      fromName,
    };
  }

  if (domain === "outlook.com" || domain === "hotmail.com" || domain === "live.com") {
    return {
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false,
      user: getFirstEnv(["SMTP_USER"]) || fromAddress,
      pass,
      fromAddress,
      fromName,
    };
  }

  return null;
}

function hasGraphConfig() {
  const sender = getSenderEmail();
  if (!sender || isConsumerMailbox(sender)) return false;

  return Boolean(
    getFirstEnv(["AZURE_TENANT_ID", "MICROSOFT_GRAPH_API_TENANT_ID"]) &&
      getFirstEnv(["AZURE_CLIENT_ID", "MICROSOFT_GRAPH_API_CLIENT_ID"]) &&
      getFirstEnv(["AZURE_CLIENT_SECRET", "MICROSOFT_GRAPH_API_CLIENT_SECRET"]) &&
      getFirstEnv(["AZURE_SENDER_EMAIL", "MS_GRAPH_SENDER_USER"])
  );
}

export function isFormMailTransportConfigured() {
  return Boolean(resolveSmtpConfig()) || hasGraphConfig();
}

export function getFormMailSetupError(): string | null {
  const sender = getSenderEmail();
  if (!sender) {
    return "Set AZURE_SENDER_EMAIL or SMTP_FROM to the mailbox used for sending.";
  }

  if (isConsumerMailbox(sender) && !resolveSmtpConfig()) {
    return (
      `${sender} is a personal mailbox. Microsoft Graph cannot send from Gmail/Yahoo/etc. ` +
      "Add SMTP_PASS (Gmail App Password) to .env â€” SMTP_HOST is optional for Gmail."
    );
  }

  if (!isFormMailTransportConfigured()) {
    return "Email transport is not configured. Set SMTP_* variables or Azure Graph for a Microsoft 365 mailbox.";
  }

  return null;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getBrandBaseUrl(requestOrigin: string) {
  return getFirstEnv(["NEXT_PUBLIC_SITE_URL"]) || requestOrigin;
}

function formatSubmittedAt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function buildLeadEmailHtml(payload: LeadMailPayload, logoUrl: string) {
  const fullName = escapeHtml(payload.fullName);
  const email = escapeHtml(payload.email);
  const phone = escapeHtml(payload.phone || "Not provided");
  const company = escapeHtml(payload.company || "Not provided");
  const source = escapeHtml(formatLeadSourceLabel(payload.sourcePage));
  const message = escapeHtml(payload.message).replaceAll("\n", "<br/>");
  const submitted = formatSubmittedAt(payload.submittedAtIso);

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f6f7;font-family:Arial,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:linear-gradient(135deg,#0f172a 0%,#1f2937 100%);padding:20px 24px;">
                <table role="presentation" width="100%">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${logoUrl}" alt="BHEARD" width="42" height="42" style="display:block;border-radius:8px;background:#fff;padding:6px;"/>
                    </td>
                    <td style="vertical-align:middle;text-align:right;">
                      <div style="font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#f59e0b;font-weight:700;">New Lead Submission</div>
                      <div style="font-size:13px;color:#e5e7eb;margin-top:4px;">BHEARD Contact Form</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px 10px;">
                <h2 style="margin:0;font-size:22px;line-height:1.3;color:#111827;">New inquiry from ${fullName}</h2>
                <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#4b5563;">A new lead was submitted from the website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 24px 22px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 8px;">
                  <tr><td style="font-size:13px;color:#6b7280;">Full name</td><td style="font-size:14px;color:#111827;font-weight:600;">${fullName}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Email</td><td style="font-size:14px;color:#111827;font-weight:600;">${email}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Phone</td><td style="font-size:14px;color:#111827;">${phone}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Company</td><td style="font-size:14px;color:#111827;">${company}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Submitted from</td><td style="font-size:14px;color:#111827;">${source}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Submitted at</td><td style="font-size:14px;color:#111827;">${submitted}</td></tr>
                </table>
                <div style="margin-top:14px;border:1px solid #e5e7eb;border-radius:12px;background:#f9fafb;padding:14px;">
                  <div style="font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#f59e0b;font-weight:700;">Message</div>
                  <div style="margin-top:8px;font-size:14px;line-height:1.7;color:#111827;">${message}</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}


async function getGraphAccessToken(tenantId: string, clientId: string, clientSecret: string) {
  const tokenRes = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  });

  const tokenBody = await tokenRes.json().catch(() => null);
  if (!tokenRes.ok || !tokenBody?.access_token) {
    throw new Error("Could not obtain Microsoft Graph access token.");
  }

  return tokenBody.access_token as string;
}

function createSmtpTransporter(cfg: SmtpConfig) {
  return nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });
}

async function sendViaSmtp({
  cfg,
  to,
  subject,
  html,
}: {
  cfg: SmtpConfig;
  to: string[];
  subject: string;
  html: string;
}) {
  const transporter = createSmtpTransporter(cfg);
  await transporter.sendMail({
    from: { name: cfg.fromName, address: cfg.fromAddress },
    to,
    subject,
    html,
  });
}

async function sendViaGraph({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  const tenantId = getFirstEnv(["AZURE_TENANT_ID", "MICROSOFT_GRAPH_API_TENANT_ID"]);
  const clientId = getFirstEnv(["AZURE_CLIENT_ID", "MICROSOFT_GRAPH_API_CLIENT_ID"]);
  const clientSecret = getFirstEnv(["AZURE_CLIENT_SECRET", "MICROSOFT_GRAPH_API_CLIENT_SECRET"]);
  const senderUser = getFirstEnv(["AZURE_SENDER_EMAIL", "MS_GRAPH_SENDER_USER"]);

  if (!tenantId || !clientId || !clientSecret || !senderUser) {
    throw new Error("Microsoft Graph email configuration is missing required environment variables.");
  }

  const token = await getGraphAccessToken(tenantId, clientId, clientSecret);

  const sendRes = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(senderUser)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: html },
          toRecipients: to.map((address) => ({ emailAddress: { address } })),
        },
        saveToSentItems: true,
      }),
    }
  );

  if (!sendRes.ok) {
    const errorText = await sendRes.text().catch(() => "");
    throw new Error(`Graph sendMail failed with ${sendRes.status}: ${errorText}`);
  }
}

async function sendHtmlMail({
  to,
  subject,
  html,
}: {
  to: string[];
  subject: string;
  html: string;
}) {
  if (to.length === 0) {
    console.warn("[formMail] No LEAD_NOTIFICATION_TO configured; skipping email.");
    return;
  }

  const setupError = getFormMailSetupError();
  if (setupError) {
    throw new Error(setupError);
  }

  const smtp = resolveSmtpConfig();
  if (smtp) {
    await sendViaSmtp({ cfg: smtp, to, subject, html });
    return;
  }

  if (hasGraphConfig()) {
    await sendViaGraph({ to, subject, html });
    return;
  }

  throw new Error("Email transport is not configured.");
}

export async function sendLeadNotificationMail(payload: LeadMailPayload, requestOrigin: string) {
  const logoUrl = `${getBrandBaseUrl(requestOrigin)}/icon`;
  const html = buildLeadEmailHtml(payload, logoUrl);
  const sourceLabel = formatLeadSourceLabel(payload.sourcePage);
  const subject = `New Website Lead: ${payload.fullName} (${sourceLabel})`;

  await sendHtmlMail({
    to: getLeadNotificationRecipients(),
    subject,
    html,
  });
}
