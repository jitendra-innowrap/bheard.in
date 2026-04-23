import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { setAdminSession, verifyAdminCredentials } from "@/lib/auth/adminSession";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return apiError(400, "Email and password are required");
    }
    const ok = verifyAdminCredentials(email, password);
    if (!ok) return apiError(401, "Invalid credentials");
    await setAdminSession(email);
    return NextResponse.json({ ok: true });
  } catch {
    return apiError(500, "Login failed");
  }
}
