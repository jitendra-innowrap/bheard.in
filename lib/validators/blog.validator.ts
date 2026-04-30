import { z } from "zod";

export const blogPostSchema = z.object({
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(5).max(180),
  subtitle: z.string().max(240).optional().or(z.literal("")),
  showAuthorDetails: z.boolean().optional().default(true),
  author: z.string().max(120).optional().or(z.literal("")),
  authorImage: z.string().url().max(1200).optional().or(z.literal("")),
  excerpt: z.string().min(20).max(400),
  thumbnailUrl: z.string().url().max(1200).optional().or(z.literal("")),
  thumbnailAlt: z.string().max(240).optional().or(z.literal("")),
  content: z.string().min(100),
  category: z.string().min(2).max(80),
  readTime: z.number().int().min(1).max(60),
  published: z.boolean().optional().default(false),
  publishedAt: z.union([z.string().datetime(), z.date()]).optional().nullable(),
});

export const blogPostUpdateSchema = blogPostSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required for update"
);

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type BlogPostUpdateInput = z.infer<typeof blogPostUpdateSchema>;
