import { connectToDatabase } from "@/lib/db/mongoose";
import { ContactLeadModel } from "@/lib/db/models";
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
  await connectToDatabase();
  const row = await ContactLeadModel.create({
    fullName: input.fullName,
    email: input.email,
    phone: input.phone || null,
    company: input.company || null,
    message: input.message,
    sourcePage: input.sourcePage || null,
    ipAddress: input.ipAddress || null,
    userAgent: input.userAgent || null,
  });
  return row.toJSON();
}

export async function listContactLeads() {
  requireDb();
  await connectToDatabase();
  const rows = await ContactLeadModel.find({}).sort({ createdAt: -1 });
  return rows.map((row) => row.toJSON());
}

