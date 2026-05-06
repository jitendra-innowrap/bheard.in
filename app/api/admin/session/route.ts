import { NextResponse } from "next/server";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";

export async function GET() {
  const authenticated = await assertAdminApiAuth();
  return NextResponse.json({ authenticated });
}

