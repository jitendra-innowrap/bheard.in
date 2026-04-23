import { z } from "zod";

export const careerSchema = z.object({
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(4).max(160),
  department: z.string().min(2).max(80),
  type: z.string().min(2).max(40),
  location: z.string().min(2).max(120),
  description: z.string().min(120),
  active: z.boolean().optional().default(true),
});

export const careerUpdateSchema = careerSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field is required for update"
);

export type CareerInput = z.infer<typeof careerSchema>;
export type CareerUpdateInput = z.infer<typeof careerUpdateSchema>;
