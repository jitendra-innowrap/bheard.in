import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { createCareer, listActiveCareers, listAllCareers } from "@/lib/services/careers.service";
import { careerSchema } from "@/lib/validators/careers.validator";

export async function GET(req: NextRequest) {
  try {
    const includeInactive = req.nextUrl.searchParams.get("includeInactive") === "true";
    if (includeInactive) {
      const isAuthed = await assertAdminApiAuth();
      if (!isAuthed) return apiError(401, "Unauthorized");
      const rows = await listAllCareers();
      return NextResponse.json({ data: rows });
    }
    const rows = await listActiveCareers();
    return NextResponse.json({ data: rows });
  } catch {
    return apiError(500, "Failed to fetch careers");
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const payload = await req.json();
    const input = careerSchema.parse(payload);
    const created = await createCareer(input);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Invalid career payload", error.flatten());
    }
    return apiError(500, "Failed to create career");
  }
}
