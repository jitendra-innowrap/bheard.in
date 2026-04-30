import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { sendLeadNotificationMail } from "@/lib/integrations/microsoftGraphMail";
import { createContactLead, listContactLeads } from "@/lib/services/contactLeads.service";
import { contactLeadSchema } from "@/lib/validators/contactLead.validator";

export async function GET(req: NextRequest) {
  try {
    const adminView = req.nextUrl.searchParams.get("admin") === "true";
    if (!adminView) return apiError(403, "Forbidden");
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const rows = await listContactLeads();
    return NextResponse.json({ data: rows });
  } catch {
    return apiError(500, "Failed to fetch contact leads");
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const input = contactLeadSchema.parse(payload);

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;
    const userAgent = req.headers.get("user-agent");

    const created = await createContactLead({
      ...input,
      ipAddress,
      userAgent,
    });

    try {
      await sendLeadNotificationMail(
        {
          fullName: created.fullName,
          email: created.email,
          phone: created.phone,
          company: created.company,
          message: created.message,
          sourcePage: created.sourcePage,
          submittedAtIso: created.createdAt.toISOString(),
        },
        req.nextUrl.origin
      );
    } catch (mailError) {
      console.error("Lead saved but Graph mail send failed:", mailError);
      return apiError(500, "Lead saved, but email notification failed. Please retry.");
    }

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Invalid contact lead payload", error.flatten());
    }
    return apiError(500, "Failed to submit contact form");
  }
}

