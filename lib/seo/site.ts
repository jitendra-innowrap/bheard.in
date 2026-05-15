/**
 * Canonical site origin for sitemap, robots, and metadata.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://bheard.in).
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}` : "") ||
    "https://bheard.in";
  return raw.replace(/\/+$/, "");
}
