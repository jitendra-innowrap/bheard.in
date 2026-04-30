import { z } from "zod";

function checkOptionalUrl(
  data: { portfolioUrl?: string; linkedInUrl?: string },
  ctx: z.RefinementCtx,
  field: "portfolioUrl" | "linkedInUrl",
  label: string
) {
  const raw = (data[field] ?? "").trim();
  if (!raw) return;
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      ctx.addIssue({ code: "custom", path: [field], message: `${label} must start with http:// or https://` });
    }
  } catch {
    ctx.addIssue({ code: "custom", path: [field], message: `Enter a valid ${label} URL` });
  }
}

export const careerApplicationFieldsSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(8).max(40),
    city: z.string().trim().min(2).max(120),
    yearsExperience: z.string().trim().min(1).max(40),
    roleTitleApplied: z.string().trim().min(2).max(200),
    currentCompany: z.string().trim().max(200).optional().or(z.literal("")),
    portfolioUrl: z.string().trim().max(800).optional().or(z.literal("")),
    linkedInUrl: z.string().trim().max(800).optional().or(z.literal("")),
    expectedSalary: z.string().trim().max(120).optional().or(z.literal("")),
    noticePeriod: z.string().trim().min(1).max(120),
    coverLetter: z.string().trim().min(40).max(20000),
    referralSource: z.string().trim().max(160).optional().or(z.literal("")),
    workAuthorization: z.string().trim().max(160).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    checkOptionalUrl(data, ctx, "portfolioUrl", "Portfolio");
    checkOptionalUrl(data, ctx, "linkedInUrl", "LinkedIn");
  });

export type CareerApplicationFields = z.infer<typeof careerApplicationFieldsSchema>;

const allowedResumeMime = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const allowedExt = new Set([".pdf", ".doc", ".docx"]);

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export function isAllowedResumeMime(mime: string, originalName: string) {
  const lower = originalName.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf("."));
  if (!allowedExt.has(ext)) return false;
  return allowedResumeMime.has(mime) || mime === "application/octet-stream";
}

/** Normalize optional string fields for persistence */
export function normalizeApplicationFields(input: CareerApplicationFields) {
  const trimOrUndef = (s: string | undefined) => {
    const t = (s ?? "").trim();
    return t.length ? t : undefined;
  };
  return {
    ...input,
    currentCompany: trimOrUndef(input.currentCompany),
    portfolioUrl: trimOrUndef(input.portfolioUrl),
    linkedInUrl: trimOrUndef(input.linkedInUrl),
    expectedSalary: trimOrUndef(input.expectedSalary),
    referralSource: trimOrUndef(input.referralSource),
    workAuthorization: trimOrUndef(input.workAuthorization),
  };
}
