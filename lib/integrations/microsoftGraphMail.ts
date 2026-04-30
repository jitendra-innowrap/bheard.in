type LeadMailPayload = {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  sourcePage?: string | null;
  submittedAtIso: string;
};

const LEAD_NOTIFICATION_TO = process.env.LEAD_NOTIFICATION_TO || "";

function getFirstEnv(keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) return value.trim();
  }
  return "";
}

function getGraphConfig() {
  const tenantId = getFirstEnv(["MICROSOFT_GRAPH_API_TENANT_ID"]);
  const clientId = getFirstEnv(["MICROSOFT_GRAPH_API_CLIENT_ID"]);
  const clientSecret = getFirstEnv(["MICROSOFT_GRAPH_API_CLIENT_SECRET"]);
  const senderUser = getFirstEnv(["MS_GRAPH_SENDER_USER"]);
  const brandBaseUrl = getFirstEnv(["NEXT_PUBLIC_SITE_URL"]);

  return { tenantId, clientId, clientSecret, senderUser, brandBaseUrl };
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function buildLeadEmailHtml(payload: LeadMailPayload, logoUrl: string) {
  const fullName = escapeHtml(payload.fullName);
  const email = escapeHtml(payload.email);
  const phone = escapeHtml(payload.phone || "Not provided");
  const company = escapeHtml(payload.company || "Not provided");
  const source = escapeHtml(payload.sourcePage || "Unknown");
  const message = escapeHtml(payload.message).replaceAll("\n", "<br/>");
  const submitted = new Date(payload.submittedAtIso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

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
                <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#4b5563;">
                  A new lead was submitted from the website. Details are below.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 24px 22px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 8px;">
                  <tr><td style="font-size:13px;color:#6b7280;">Full name</td><td style="font-size:14px;color:#111827;font-weight:600;">${fullName}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Email</td><td style="font-size:14px;color:#111827;font-weight:600;">${email}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Phone</td><td style="font-size:14px;color:#111827;">${phone}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Company</td><td style="font-size:14px;color:#111827;">${company}</td></tr>
                  <tr><td style="font-size:13px;color:#6b7280;">Source page</td><td style="font-size:14px;color:#111827;">${source}</td></tr>
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

export async function sendLeadNotificationMail(payload: LeadMailPayload, requestOrigin: string) {
  const cfg = getGraphConfig();
  if (!cfg.tenantId || !cfg.clientId || !cfg.clientSecret || !cfg.senderUser) {
    throw new Error("Microsoft Graph email configuration is missing required environment variables.");
  }

  const token = await getGraphAccessToken(cfg.tenantId, cfg.clientId, cfg.clientSecret);
  const logoUrl = `${cfg.brandBaseUrl || requestOrigin}/icon`;
  const html = buildLeadEmailHtml(payload, logoUrl);

  const subject = `New Website Lead: ${payload.fullName} (${payload.sourcePage || "Contact"})`;

  const sendRes = await fetch(`https://graph.microsoft.com/v1.0/users/${encodeURIComponent(cfg.senderUser)}/sendMail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: html,
        },
        toRecipients: [{ emailAddress: { address: LEAD_NOTIFICATION_TO } }],
      },
      saveToSentItems: true,
    }),
  });

  if (!sendRes.ok) {
    const errorText = await sendRes.text().catch(() => "");
    throw new Error(`Graph sendMail failed with ${sendRes.status}: ${errorText}`);
  }
}

