# SEO and performance — phased rollout

## Constraints (all phases)

- **UI and animations:** No visual or motion regressions; do not remove `"use client"` from animated sections for SEO work.
- **Crawler-friendly HTML:** Prefer server `metadata` / `generateMetadata`, JSON-LD in server `page.tsx`, and keep article/list copy in SSR’d DOM (existing pattern: server pages fetch data → pass props to client views that still SSR initial HTML).

---

## Phase 1 — Discovery (first) — **done**

**Goal:** Expose `/sitemap.xml` and `/robots.txt` via Next.js Metadata Route conventions (no UI changes).

**Files added (implemented)**

1. [`lib/seo/site.ts`](lib/seo/site.ts) — `getSiteUrl()` from `NEXT_PUBLIC_SITE_URL`, then `VERCEL_URL`, else `https://bheard.in` (trim trailing slashes).
2. [`app/sitemap.ts`](app/sitemap.ts) — `export default async function sitemap()` returning static marketing URLs plus dynamic URLs:
   - **Static:** `/`, `/about`, `/contact`, `/brand-solutions`, `/tech-solutions`, `/blog`, `/success-stories`, `/careers`, `/privacy-policy`, `/terms-and-conditions`
   - **Blog:** `listPublishedBlogPosts()`; on failure (no `DATABASE_URL` / DB error) fall back to published [`seedBlogPosts`](lib/content/blogSeed.ts)
   - **Success stories:** union of [`getCaseStudySlugs()`](lib/case-studies/data.ts) and `listPublishedStories()` (with `updatedAt` when DB works)
   - **Careers:** `listActiveCareers()`; on failure fall back to active [`seedCareers`](lib/content/careersSeed.ts)
   - Use sensible `lastModified`, `changeFrequency`, and `priority` per URL type.
3. [`app/robots.ts`](app/robots.ts) — `allow: "/"`, `disallow: ["/admin", "/admin/"]`, `sitemap: \`${base}/sitemap.xml\``, optional `host`.

**Environment**

- Production: set `NEXT_PUBLIC_SITE_URL=https://bheard.in` (or your canonical origin) so sitemap/robots URLs match the live domain.

**Verification**

- After implementation: open `/sitemap.xml` and `/robots.txt` locally and in production; confirm admin paths are disallowed and all public routes appear.

---

## Later phases (unchanged direction)

- Root `metadataBase`, title template, per-route canonical / OG / Twitter parity, JSON-LD on blog/story/career detail, `not-found` metadata split, admin `noindex`, `force-dynamic` / `revalidate` audit, LCP/image tuning.

---

## Implementation status

- **Phase 1:** Implemented in the repo (`lib/seo/site.ts`, `app/sitemap.ts`, `app/robots.ts`). No page or layout UI was modified.
- **Next:** Phase 2+ items in “Later phases” below; pick up with `metadataBase`, per-route metadata, JSON-LD expansion, admin `noindex`, and caching audit.

---

## Phase 2 — Metadata and schema (planned)

- Root [`app/layout.tsx`](app/layout.tsx): `metadataBase`, title `template`, default OG/Twitter.
- Per-route canonical, OG, Twitter where missing (especially dynamic `generateMetadata` routes).
- JSON-LD: `BlogPosting` / `Article`, case study, `JobPosting` as appropriate; optional sitewide `Organization` / `WebSite`.
- [`app/not-found.tsx`](app/not-found.tsx): server metadata + client animation split.
- Admin segment: `robots: { index: false }` on admin layout(s).

## Phase 3 — Performance (planned)

- Replace unnecessary `force-dynamic` with `revalidate` or static generation where data allows.
- LCP: `next/image` `priority` / `sizes` on above-the-fold heroes; optional bundle analysis.
