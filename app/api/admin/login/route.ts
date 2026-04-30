import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { createAdminSessionValue, verifyAdminCredentials } from "@/lib/auth/adminSession";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const email = payload?.email;
    const password = payload?.password;
    if (typeof email !== "string" || typeof password !== "string") {
      return apiError(400, "Email and password are required");
    }
    const ok = verifyAdminCredentials(email, password);
    if (!ok) return apiError(401, "Invalid credentials");
    const res = NextResponse.json({ ok: true });
    res.cookies.set("bheard_admin_session", createAdminSessionValue(email), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch (error) {
    console.error("Admin login failed:", error);
    return apiError(500, "Login failed");
  }
}
