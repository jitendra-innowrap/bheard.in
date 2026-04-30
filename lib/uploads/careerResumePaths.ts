import path from "node:path";

/** Directory for stored career application resumes (not web-public). */
export const CAREER_RESUME_UPLOAD_DIR = path.join(process.cwd(), "uploads", "career-resumes");

export function absoluteResumePath(storedRelative: string) {
  const normalized = path.normalize(storedRelative).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(CAREER_RESUME_UPLOAD_DIR, normalized);
}
