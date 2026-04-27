import { prisma } from "@/lib/db/prisma";
import type { StoryInput, StoryUpdateInput } from "@/lib/validators/stories.validator";

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

export async function listPublishedStories() {
  requireDb();
  return prisma.successStory.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function listAllStories() {
  requireDb();
  return prisma.successStory.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getStoryBySlug(slug: string) {
  requireDb();
  return prisma.successStory.findUnique({ where: { slug } });
}

export async function getStoryById(id: string) {
  requireDb();
  return prisma.successStory.findUnique({ where: { id } });
}

export async function createStory(input: StoryInput) {
  requireDb();
  return prisma.successStory.create({ data: input });
}

export async function updateStoryBySlug(slug: string, input: StoryUpdateInput) {
  requireDb();
  return prisma.successStory.update({ where: { slug }, data: input });
}

export async function updateStoryById(id: string, input: StoryUpdateInput) {
  requireDb();
  return prisma.successStory.update({ where: { id }, data: input });
}

export async function deleteStoryBySlug(slug: string) {
  requireDb();
  return prisma.successStory.delete({ where: { slug } });
}
