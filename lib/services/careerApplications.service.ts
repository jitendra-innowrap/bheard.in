import { prisma } from "@/lib/db/prisma";
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

export async function createCareerApplication(data: CreateCareerApplicationInput) {
  requireDb();
  return prisma.careerApplication.create({
    data: {
      careerId: data.careerId,
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
    },
  });
}

export async function listCareerApplications(careerId?: string) {
  requireDb();
  return prisma.careerApplication.findMany({
    where: careerId ? { careerId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { career: { select: { slug: true, title: true } } },
  });
}

export async function getCareerApplicationById(id: string) {
  requireDb();
  return prisma.careerApplication.findUnique({
    where: { id },
    include: { career: { select: { id: true, slug: true, title: true } } },
  });
}
