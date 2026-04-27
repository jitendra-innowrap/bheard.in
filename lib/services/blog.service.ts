import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import type { BlogPostInput, BlogPostUpdateInput } from "@/lib/validators/blog.validator";

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

export async function listPublishedBlogPosts() {
  requireDb();
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function listAllBlogPosts() {
  requireDb();
  return prisma.blogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getPublishedBlogPostBySlug(slug: string) {
  requireDb();
  return prisma.blogPost.findFirst({
    where: { slug, published: true },
  });
}

export async function getBlogPostBySlug(slug: string) {
  requireDb();
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getBlogPostById(id: string) {
  requireDb();
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function createBlogPost(input: BlogPostInput) {
  requireDb();
  const publishedAt =
    input.published && !input.publishedAt ? new Date() : input.publishedAt ? new Date(input.publishedAt) : null;
  return prisma.blogPost.create({
    data: {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category,
      readTime: input.readTime,
      published: input.published ?? false,
      publishedAt,
    },
  });
}

export async function updateBlogPostBySlug(slug: string, input: BlogPostUpdateInput) {
  requireDb();
  const data: Prisma.BlogPostUpdateInput = { ...input };
  if (input.publishedAt) {
    data.publishedAt = new Date(input.publishedAt);
  }
  if (input.published === true && !input.publishedAt) {
    data.publishedAt = new Date();
  }
  if (input.published === false) {
    data.publishedAt = null;
  }
  return prisma.blogPost.update({
    where: { slug },
    data,
  });
}

export async function updateBlogPostById(id: string, input: BlogPostUpdateInput) {
  requireDb();
  const data: Prisma.BlogPostUpdateInput = { ...input };
  if (input.publishedAt) {
    data.publishedAt = new Date(input.publishedAt);
  }
  if (input.published === true && !input.publishedAt) {
    data.publishedAt = new Date();
  }
  if (input.published === false) {
    data.publishedAt = null;
  }
  return prisma.blogPost.update({
    where: { id },
    data,
  });
}

export async function deleteBlogPostBySlug(slug: string) {
  requireDb();
  return prisma.blogPost.delete({ where: { slug } });
}

export async function deleteBlogPostById(id: string) {
  requireDb();
  return prisma.blogPost.delete({ where: { id } });
}
