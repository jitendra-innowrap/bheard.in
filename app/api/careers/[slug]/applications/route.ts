import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "@imagekit/nodejs";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { createCareerApplication } from "@/lib/services/careerApplications.service";
import { getActiveCareerBySlug } from "@/lib/services/careers.service";
import {
  careerApplicationFieldsSchema,
  isAllowedResumeMime,
  MAX_RESUME_BYTES,
  normalizeApplicationFields,
} from "@/lib/validators/careerApplication.validator";

type Params = { slug: string };

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

function extFromFilename(name: string) {
  const lower = name.toLowerCase();
  const i = lower.lastIndexOf(".");
  if (i === -1) return "";
  return lower.slice(i);
}

export async function POST(req: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await context.params;

  let career = null as Awaited<ReturnType<typeof getActiveCareerBySlug>>;
  try {
    career = await getActiveCareerBySlug(slug);
  } catch {
    return apiError(503, "Applications are temporarily unavailable. Please try again later or email careers@bheard.in.");
  }

  if (!career || career.slug !== slug) {
    return apiError(404, "This role is not open for applications.");
  }

  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return apiError(400, "Invalid form submission");
  }

  const resume = fd.get("resume");
  if (!resume || typeof resume === "string") {
    return apiError(400, "Resume file is required");
  }

  if (resume.size > MAX_RESUME_BYTES) {
    return apiError(400, `Resume must be under ${MAX_RESUME_BYTES / (1024 * 1024)} MB`);
  }

  if (!isAllowedResumeMime(resume.type || "application/octet-stream", resume.name)) {
    return apiError(400, "Resume must be a PDF or Word document (.pdf, .doc, .docx)");
  }

  const ext = extFromFilename(resume.name);
  if (!ext || ![".pdf", ".doc", ".docx"].includes(ext)) {
    return apiError(400, "Invalid resume file extension");
  }

  const raw = {
    fullName: fd.get("fullName"),
    email: fd.get("email"),
    phone: fd.get("phone"),
    city: fd.get("city"),
    yearsExperience: fd.get("yearsExperience"),
    roleTitleApplied: career.title,
    currentCompany: fd.get("currentCompany"),
    portfolioUrl: fd.get("portfolioUrl"),
    linkedInUrl: fd.get("linkedInUrl"),
    expectedSalary: fd.get("expectedSalary"),
    noticePeriod: fd.get("noticePeriod"),
    coverLetter: fd.get("coverLetter"),
    referralSource: fd.get("referralSource"),
    workAuthorization: fd.get("workAuthorization"),
  };

  let fields;
  try {
    fields = normalizeApplicationFields(careerApplicationFieldsSchema.parse(raw));
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Please check the form fields", error.flatten());
    }
    return apiError(400, "Invalid application data");
  }

  const storedName = `${randomUUID()}${ext}`;
  const buffer = Buffer.from(await resume.arrayBuffer());
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return apiError(503, "Resume upload is temporarily unavailable. Please try again later.");
  }

  let uploadedUrl = "";
  try {
    const uploaded = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: storedName,
      folder: "/bheard/career-resumes",
      useUniqueFileName: false,
    });
    if (!uploaded.url) {
      return apiError(500, "Resume upload did not return a file URL.");
    }
    uploadedUrl = uploaded.url;
  } catch {
    return apiError(500, "Could not upload resume. Please try again or email careers@bheard.in.");
  }

  try {
    const created = await createCareerApplication({
      ...fields,
      careerId: career.id,
      careerSlug: career.slug,
      careerTitle: career.title,
      resumeFileName: resume.name,
      resumeStoredPath: uploadedUrl,
      resumeMime: resume.type || "application/octet-stream",
      resumeSize: resume.size,
    });

    return NextResponse.json(
      { ok: true, id: created.id, message: "Application received" },
      { status: 201 }
    );
  } catch {
    return apiError(500, "Could not save your application. Please try again or email careers@bheard.in.");
  }
}
