import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { listAllPages } from "@/lib/services/page.service";

export async function GET() {
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const pages = await listAllPages();
    return NextResponse.json({ data: pages });
  } catch {
    return apiError(500, "Failed to fetch pages");
  }
}
