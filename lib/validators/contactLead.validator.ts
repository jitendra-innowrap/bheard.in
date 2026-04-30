import { z } from "zod";

export const contactLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(20).max(5000),
  sourcePage: z.string().trim().max(240).optional().or(z.literal("")),
});

export type ContactLeadInput = z.infer<typeof contactLeadSchema>;

