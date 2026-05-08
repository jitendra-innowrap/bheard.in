import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { CareerApplicationModel } from "@/lib/db/models";
import type { CareerApplicationRecord } from "@/lib/db/models";
function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

export type CreateCareerApplicationInput = {
  careerId: string;
  careerSlug: string;
  careerTitle: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  yearsExperience: string;
  roleTitleApplied: string;
  currentCompany?: string | null;
  portfolioUrl?: string | null;
  linkedInUrl?: string | null;
  expectedSalary?: string | null;
  noticePeriod: string;
  coverLetter: string;
  referralSource?: string | null;
  workAuthorization?: string | null;
  resumeFileName: string;
  resumeStoredPath: string;
  resumeMime: string;
  resumeSize: number;
};

export async function createCareerApplication(data: CreateCareerApplicationInput): Promise<CareerApplicationRecord> {
  requireDb();
  await connectToDatabase();
  const row = await CareerApplicationModel.create({
    careerId: Types.ObjectId.isValid(data.careerId) ? new Types.ObjectId(data.careerId) : null,
    careerSlug: data.careerSlug,
    careerTitle: data.careerTitle,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    city: data.city,
    yearsExperience: data.yearsExperience,
    roleTitleApplied: data.roleTitleApplied,
    currentCompany: data.currentCompany,
    portfolioUrl: data.portfolioUrl,
    linkedInUrl: data.linkedInUrl,
    expectedSalary: data.expectedSalary,
    noticePeriod: data.noticePeriod,
    coverLetter: data.coverLetter,
    referralSource: data.referralSource,
    workAuthorization: data.workAuthorization,
    resumeFileName: data.resumeFileName,
    resumeStoredPath: data.resumeStoredPath,
    resumeMime: data.resumeMime,
    resumeSize: data.resumeSize,
  });
  const created = row.toJSON() as CareerApplicationRecord;
  created.career = null;
  return created;
}

export async function listCareerApplications(careerId?: string): Promise<CareerApplicationRecord[]> {
  requireDb();
  await connectToDatabase();
  const query =
    careerId && Types.ObjectId.isValid(careerId)
      ? { careerId: new Types.ObjectId(careerId) }
      : careerId
        ? { careerId: null }
        : {};
  const rows = await CareerApplicationModel.find(query)
    .sort({ createdAt: -1 })
    .populate({ path: "careerId", select: "slug title", options: { lean: true } });
  return rows.map((row) => {
    const data = row.toJSON() as CareerApplicationRecord & Record<string, unknown> & {
      careerId: unknown;
    };
    const career = data.careerId as { _id?: Types.ObjectId; slug?: string; title?: string } | null;
    data.career = career
      ? {
          id: career._id?.toString(),
          slug: career.slug,
          title: career.title,
        }
      : null;
    delete data.careerId;
    return data as CareerApplicationRecord;
  });
}

export async function getCareerApplicationById(id: string): Promise<CareerApplicationRecord | null> {
  requireDb();
  await connectToDatabase();
  if (!Types.ObjectId.isValid(id)) return null;
  const row = await CareerApplicationModel.findById(id).populate({
    path: "careerId",
    select: "slug title",
    options: { lean: true },
  });
  if (!row) return null;
  const data = row.toJSON() as CareerApplicationRecord & Record<string, unknown> & {
    careerId: unknown;
  };
  const career = data.careerId as { _id?: Types.ObjectId; slug?: string; title?: string } | null;
  data.career = career
    ? {
        id: career._id?.toString(),
        slug: career.slug,
        title: career.title,
      }
    : null;
  delete data.careerId;
  return data as CareerApplicationRecord;
}
