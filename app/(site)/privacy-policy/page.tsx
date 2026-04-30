import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import InnerPageHero from "@/components/system/InnerPageHero";
import { getPageBySlug } from "@/lib/services/page.service";
import { seedPages } from "@/lib/content/pagesSeed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy | BHEARD",
  description: "How BHEARD collects, uses, and protects your personal information.",
};

export default async function PrivacyPolicyPage() {
  let content = "";
  let title = "Privacy Policy";
  let updatedAt: Date | null = null;
  try {
    const page = await getPageBySlug("privacy-policy");
    if (page) {
      title = page.title;
      content = page.content;
      updatedAt = page.updatedAt;
    }
  } catch {
    /* DB unavailable */
  }

  if (!content) {
    const seed = seedPages.find((p) => p.slug === "privacy-policy");
    title = seed?.title ?? title;
    content = seed?.content ?? "";
  }

  return (
    <>
      <InnerPageHero
        watermark="Privacy"
        heading={title}
        subtext="How we collect, use, and protect your information."
      />

      <section className="bg-surface px-gutter-sm py-section-y-sm md:px-gutter md:py-section-y">
        <div className="mx-auto mb-5 flex max-w-3xl items-center justify-between gap-4 rounded-lg border border-outline-variant/50 bg-white px-4 py-3 text-xs uppercase tracking-[0.14em] text-on-surface-variant">
          <span>{title}</span>
          <span>
            Last Updated:{" "}
            {updatedAt
              ? new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "—"}
          </span>
        </div>
        <article className="prose prose-neutral mx-auto max-w-3xl lg:prose-lg prose-headings:tracking-tight prose-h1:text-3xl prose-h2:mt-12 prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-on-background prose-blockquote:border-primary prose-blockquote:text-on-surface-variant prose-li:marker:text-primary prose-hr:border-outline-variant/40 md:prose-h1:text-4xl md:prose-h2:text-2xl md:prose-h3:text-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </section>
    </>
  );
}
