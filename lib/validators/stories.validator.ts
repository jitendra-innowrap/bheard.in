import { z } from "zod";

export const storySchema = z.object({
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(4).max(180),
  industry: z.string().min(2).max(100),
  listImage: z.union([z.string().url().max(1200), z.literal(""), z.null()]).optional(),
  heroImage: z.union([z.string().url().max(1200), z.literal(""), z.null()]).optional(),
  caseData: z.any().optional().nullable(),
  summary: z.string().min(20).max(400),
  about: z.string().min(40),
  challenge: z.string().min(40),
  solution: z.string().min(40),
  results: z.string().min(40),
  contactCta: z.string().min(5).max(180),
  published: z.boolean().optional().default(true),
});

export const storyUpdateSchema = storySchema.partial().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field is required",
});

export type StoryInput = z.infer<typeof storySchema>;
export type StoryUpdateInput = z.infer<typeof storyUpdateSchema>;
