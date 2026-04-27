import { prisma } from "@/lib/db/prisma";
import type { CareerInput, CareerUpdateInput } from "@/lib/validators/careers.validator";

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

export async function listActiveCareers() {
  requireDb();
  return prisma.career.findMany({
    where: { active: true },
    orderBy: [{ createdAt: "desc" }],
  });
}

export async function listAllCareers() {
  requireDb();
  return prisma.career.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getActiveCareerBySlug(slug: string) {
  requireDb();
  return prisma.career.findFirst({ where: { slug, active: true } });
}

export async function getCareerBySlug(slug: string) {
  requireDb();
  return prisma.career.findUnique({ where: { slug } });
}

export async function getCareerById(id: string) {
  requireDb();
  return prisma.career.findUnique({ where: { id } });
}

export async function createCareer(input: CareerInput) {
  requireDb();
  return prisma.career.create({
    data: input,
  });
}

export async function updateCareerBySlug(slug: string, input: CareerUpdateInput) {
  requireDb();
  return prisma.career.update({
    where: { slug },
    data: input,
  });
}

export async function updateCareerById(id: string, input: CareerUpdateInput) {
  requireDb();
  return prisma.career.update({
    where: { id },
    data: input,
  });
}

export async function deleteCareerBySlug(slug: string) {
  requireDb();
  return prisma.career.delete({ where: { slug } });
}

export async function deleteCareerById(id: string) {
  requireDb();
  return prisma.career.delete({ where: { id } });
}
