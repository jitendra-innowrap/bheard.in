import { prisma } from "@/lib/db/prisma";
import type { ContactLeadInput } from "@/lib/validators/contactLead.validator";

function requireDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }
}

export type CreateContactLeadInput = ContactLeadInput & {
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function createContactLead(input: CreateContactLeadInput) {
  requireDb();
  return prisma.contactLead.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || null,
      company: input.company || null,
      message: input.message,
      sourcePage: input.sourcePage || null,
      ipAddress: input.ipAddress || null,
      userAgent: input.userAgent || null,
    },
  });
}

export async function listContactLeads() {
  requireDb();
  return prisma.contactLead.findMany({
    orderBy: { createdAt: "desc" },
  });
}

