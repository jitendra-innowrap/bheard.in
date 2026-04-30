import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { listCareerApplications } from "@/lib/services/careerApplications.service";

export async function GET(req: Request) {
  const ok = await assertAdminApiAuth();
  if (!ok) return apiError(401, "Unauthorized");

  const url = new URL(req.url);
  const careerId = url.searchParams.get("careerId") || undefined;

  try {
    const rows = await listCareerApplications(careerId || undefined);
    return NextResponse.json({ data: rows });
  } catch {
    return apiError(500, "Failed to load applications");
  }
}
