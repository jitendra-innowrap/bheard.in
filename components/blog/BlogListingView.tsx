import Link from "next/link";
import InnerPageHero from "@/components/system/InnerPageHero";
import { sectionPageX, sectionTitleMarginCompact } from "@/components/system/sectionTheme";

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: Date | string | null;
};

function formatDate(value: Date | string | null) {
  if (!value) return "Draft";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogListingView({ posts }: { posts: BlogListItem[] }) {
  const [featured, ...rest] = posts;

  return (
    <>
      <InnerPageHero
        watermark="THINK"
        heading="Perspectives on Brand & Build"
        subtext="We publish to share working principles, practical frameworks, and hard-earned product lessons."
        theme="dark"
      />

      <section className={`bg-surface ${sectionPageX} py-section-y-sm md:py-section-y`}>
        <div className="mx-auto max-w-content-max">
          {featured ? (
            <article className="grid border border-outline-variant/60 bg-surface-container-low md:grid-cols-[1.2fr_1fr]">
              <div className="border-b border-outline-variant/60 bg-inverse-surface/95 p-8 md:border-b-0 md:border-r md:p-10">
                <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Featured</p>
                <h2 className="mt-4 font-headline text-[clamp(2rem,3.2vw,3rem)] font-black uppercase leading-tight text-inverse-on-surface">
                  {featured.title}
                </h2>
                <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-secondary-fixed-dim">
                  {featured.excerpt}
                </p>
              </div>
              <div className="p-8 md:p-10">
                <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{featured.category}</p>
                <p className="mt-3 font-body text-sm text-on-surface-variant">
                  {formatDate(featured.publishedAt)} · {featured.readTime} min read
                </p>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="mt-8 inline-flex items-center gap-2 border-b border-primary pb-1 font-label text-sm font-bold uppercase tracking-[0.18em] text-on-background"
                >
                  Read article <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ) : null}

          <div className={`mt-14 ${sectionTitleMarginCompact}`}>
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Latest posts</p>
            <h3 className="mt-3 font-headline text-[clamp(1.8rem,3vw,2.5rem)] font-black uppercase tracking-tight text-on-background">
              Editorial notes from the team
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.slug}
                className="border border-outline-variant/60 bg-surface-container-low p-6 transition-colors hover:bg-surface-container"
              >
                <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{post.category}</p>
                <h4 className="mt-4 font-headline text-2xl font-black uppercase leading-tight text-on-background">
                  {post.title}
                </h4>
                <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">{post.excerpt}</p>
                <p className="mt-6 font-body text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                  {formatDate(post.publishedAt)} · {post.readTime} min
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-[0.16em] text-on-background"
                >
                  Read <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>

          <p className="mt-14 border-t border-outline-variant/60 pt-6 font-body text-sm text-on-surface-variant">
            Have a topic you want us to cover?{" "}
            <a className="font-semibold text-on-background underline decoration-primary underline-offset-4" href="mailto:hello@bheard.in">
              hello@bheard.in
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
