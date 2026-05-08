import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { BlogPostModel } from "@/lib/db/models";
import type { BlogPostRecord } from "@/lib/db/models";
import type { BlogPostInput, BlogPostUpdateInput } from "@/lib/validators/blog.validator";

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

const objectIdRegex = /^[a-f\d]{24}$/i;
function isObjectId(value: string) {
  return objectIdRegex.test(value);
}

function toPlain<T>(doc: { toJSON: () => T } | null): T | null {
  return doc ? doc.toJSON() : null;
}

export async function listPublishedBlogPosts(): Promise<BlogPostRecord[]> {
  requireDb();
  await connectToDatabase();
  const rows = await BlogPostModel.find({ published: true }).sort({ publishedAt: -1, createdAt: -1 });
  return rows.map((row) => row.toJSON() as BlogPostRecord);
}

export async function listAllBlogPosts(): Promise<BlogPostRecord[]> {
  requireDb();
  await connectToDatabase();
  const rows = await BlogPostModel.find({}).sort({ updatedAt: -1 });
  return rows.map((row) => row.toJSON() as BlogPostRecord);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  requireDb();
  await connectToDatabase();
  const row = await BlogPostModel.findOne({ slug, published: true });
  return toPlain(row) as BlogPostRecord | null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  requireDb();
  await connectToDatabase();
  const row = await BlogPostModel.findOne({ slug });
  return toPlain(row) as BlogPostRecord | null;
}

export async function getBlogPostById(id: string): Promise<BlogPostRecord | null> {
  requireDb();
  if (!isObjectId(id)) return null;
  try {
    await connectToDatabase();
    const row = await BlogPostModel.findById(id);
    return toPlain(row) as BlogPostRecord | null;
  } catch {
    return null;
  }
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPostRecord> {
  requireDb();
  await connectToDatabase();
  const publishedAt =
    input.published && !input.publishedAt ? new Date() : input.publishedAt ? new Date(input.publishedAt) : null;
  const row = await BlogPostModel.create({
    slug: input.slug,
    title: input.title,
    subtitle: input.subtitle || null,
    showAuthorDetails: input.showAuthorDetails ?? true,
    author: input.author || null,
    authorImage: input.authorImage || null,
    excerpt: input.excerpt,
    thumbnailUrl: input.thumbnailUrl || null,
    thumbnailAlt: input.thumbnailAlt || null,
    content: input.content,
    category: input.category,
    readTime: input.readTime,
    published: input.published ?? false,
    publishedAt,
  });
  return row.toJSON() as BlogPostRecord;
}

function buildBlogUpdateData(input: BlogPostUpdateInput) {
  const data: Record<string, unknown> = { ...input };
  if (typeof input.subtitle === "string") data.subtitle = input.subtitle || null;
  if (typeof input.author === "string") data.author = input.author || null;
  if (typeof input.authorImage === "string") data.authorImage = input.authorImage || null;
  if (typeof input.thumbnailUrl === "string") data.thumbnailUrl = input.thumbnailUrl || null;
  if (typeof input.thumbnailAlt === "string") data.thumbnailAlt = input.thumbnailAlt || null;
  if (input.publishedAt) {
    data.publishedAt = new Date(input.publishedAt);
  }
  if (input.published === true && !input.publishedAt) {
    data.publishedAt = new Date();
  }
  if (input.published === false) {
    data.publishedAt = null;
  }
  return data;
}

export async function updateBlogPostBySlug(slug: string, input: BlogPostUpdateInput): Promise<BlogPostRecord> {
  requireDb();
  await connectToDatabase();
  const row = await BlogPostModel.findOneAndUpdate({ slug }, { $set: buildBlogUpdateData(input) }, { new: true });
  if (!row) {
    throw new Error("Blog post not found");
  }
  return row.toJSON() as BlogPostRecord;
}

function parseObjectId(id: string) {
  if (!isObjectId(id)) {
    throw new Error("Invalid blog id");
  }
  return new Types.ObjectId(id);
}

export async function updateBlogPostById(id: string, input: BlogPostUpdateInput): Promise<BlogPostRecord> {
  requireDb();
  await connectToDatabase();
  const objectId = parseObjectId(id);
  const row = await BlogPostModel.findOneAndUpdate({ _id: objectId }, { $set: buildBlogUpdateData(input) }, { new: true });
  if (!row) {
    throw new Error("Blog post not found");
  }
  return row.toJSON() as BlogPostRecord;
}

export async function deleteBlogPostBySlug(slug: string): Promise<BlogPostRecord> {
  requireDb();
  await connectToDatabase();
  const row = await BlogPostModel.findOneAndDelete({ slug });
  if (!row) {
    throw new Error("Blog post not found");
  }
  return row.toJSON() as BlogPostRecord;
}

export async function deleteBlogPostById(id: string): Promise<BlogPostRecord> {
  requireDb();
  await connectToDatabase();
  const objectId = parseObjectId(id);
  const row = await BlogPostModel.findOneAndDelete({ _id: objectId });
  if (!row) {
    throw new Error("Blog post not found");
  }
  return row.toJSON() as BlogPostRecord;
}
