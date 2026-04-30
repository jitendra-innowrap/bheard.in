import { z } from "zod";

export const pageUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(20),
});

export type PageUpdateInput = z.infer<typeof pageUpdateSchema>;
