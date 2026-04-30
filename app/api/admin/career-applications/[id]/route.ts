import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { getCareerApplicationById } from "@/lib/services/careerApplications.service";

type Params = { id: string };

export async function GET(_req: Request, context: { params: Promise<Params> }) {
  const ok = await assertAdminApiAuth();
  if (!ok) return apiError(401, "Unauthorized");

  const { id } = await context.params;

  try {
    const row = await getCareerApplicationById(id);
    if (!row) return apiError(404, "Application not found");
    return NextResponse.json({ data: row });
  } catch {
    return apiError(500, "Failed to load application");
  }
}
