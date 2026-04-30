import { prisma } from "@/lib/db/prisma";
import type { PageUpdateInput } from "@/lib/validators/page.validator";

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

export async function getPageBySlug(slug: string) {
  requireDb();
  return prisma.page.findUnique({ where: { slug } });
}

export async function listAllPages() {
  requireDb();
  return prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function upsertPage(slug: string, input: PageUpdateInput) {
  requireDb();
  return prisma.page.upsert({
    where: { slug },
    create: {
      slug,
      title: input.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      content: input.content,
    },
    update: {
      ...(input.title ? { title: input.title } : {}),
      content: input.content,
    },
  });
}
