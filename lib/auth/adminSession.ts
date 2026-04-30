import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "bheard_admin_session";

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "local-dev-secret";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function createSessionValue(email: string) {
  const payload = `${email}|${Date.now()}`;
  return `${payload}|${sign(payload)}`;
}

export function createAdminSessionValue(email: string) {
  return createSessionValue(email);
}

function verifySession(value: string) {
  const parts = value.split("|");
  if (parts.length < 3) return false;
  const signature = parts.pop() as string;
  const payload = parts.join("|");
  const expected = sign(payload);

  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isValidAdminSessionValue(value: string | undefined) {
  if (!value) return false;
  return verifySession(value);
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const session = store.get(COOKIE_NAME)?.value;
  if (!session) return false;
  return verifySession(session);
}

export async function requireAdminAuth() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect("/admin/login");
}

export async function setAdminSession(email: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionValue(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function assertAdminApiAuth() {
  const ok = await isAdminAuthenticated();
  return ok;
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  return email === adminEmail && password === adminPassword;
}
