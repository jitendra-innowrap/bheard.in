import type { MetadataRoute } from "next";
import { getCaseStudySlugs } from "@/lib/case-studies";
import { seedBlogPosts } from "@/lib/content/blogSeed";
import { seedCareers } from "@/lib/content/careersSeed";
import { listPublishedBlogPosts } from "@/lib/services/blog.service";
import { listActiveCareers } from "@/lib/services/careers.service";
import { listPublishedStories } from "@/lib/services/stories.service";
import { getSiteUrl } from "@/lib/seo/site";

const STATIC_PATHS = [
  "",
  "/about",
  "/contact",
  "/brand-solutions",
  "/tech-solutions",
  "/blog",
  "/success-stories",
  "/careers",
  "/privacy-policy",
  "/terms-and-conditions",
] as const;

function asDate(value: unknown): Date | undefined {
  if (value == null) return undefined;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();

  const setEntry = (path: string, partial: Omit<MetadataRoute.Sitemap[number], "url">) => {
    const normalized = path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
    const url = `${base}${normalized}`;
    byUrl.set(url, { url, ...partial });
  };

  for (const seg of STATIC_PATHS) {
    setEntry(seg, {
      lastModified: now,
      changeFrequency: seg === "" ? "weekly" : "monthly",
      priority: seg === "" ? 1 : 0.75,
    });
  }

  let blogRows: Array<{ slug: string; updatedAt?: unknown; publishedAt?: unknown }> = [];
  try {
    blogRows = await listPublishedBlogPosts();
  } catch {
    blogRows = seedBlogPosts.filter((p) => p.published).map((p) => ({
      slug: p.slug,
      publishedAt: p.publishedAt,
    }));
  }
  for (const post of blogRows) {
    const lastModified = asDate(post.updatedAt) ?? asDate(post.publishedAt) ?? now;
    setEntry(`/blog/${post.slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  const storyLast = new Map<string, Date>();
  for (const slug of getCaseStudySlugs()) {
    storyLast.set(slug, now);
  }
  try {
    const rows = await listPublishedStories();
    for (const row of rows) {
      const r = row as { slug?: string; updatedAt?: unknown };
      if (!r.slug) continue;
      const lm = asDate(r.updatedAt) ?? now;
      storyLast.set(r.slug, lm);
    }
  } catch {
    /* keep static case-study slugs only */
  }
  for (const [slug, lastModified] of storyLast) {
    setEntry(`/success-stories/${slug}`, {
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  let careerRows: Array<{ slug: string; updatedAt?: unknown }> = [];
  try {
    careerRows = (await listActiveCareers()) as Array<{ slug: string; updatedAt?: unknown }>;
  } catch {
    careerRows = seedCareers.filter((c) => c.active).map((c) => ({ slug: c.slug }));
  }
  for (const c of careerRows) {
    const lastModified = asDate(c.updatedAt) ?? now;
    setEntry(`/careers/${c.slug}`, {
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return Array.from(byUrl.values());
}
