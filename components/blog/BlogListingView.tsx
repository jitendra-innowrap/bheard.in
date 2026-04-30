"use client";

import "@/lib/motion/config";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { sectionPageX, sectionTitleMarginCompact } from "@/components/system/sectionTheme";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type BlogListItem = {
  slug: string;
  title: string;
  subtitle?: string | null;
  showAuthorDetails?: boolean | null;
  author?: string | null;
  excerpt: string;
  thumbnailUrl?: string | null;
  thumbnailAlt?: string | null;
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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [featured, ...rest] = posts;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '[data-blog-banner="eyebrow"], [data-blog-banner="title"], [data-blog-banner="copy"]',
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" }
      );

      gsap.fromTo(
        '[data-blog-featured]',
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.64,
          ease: "power3.out",
          scrollTrigger: { trigger: '[data-blog-featured]', start: "top 86%", once: true },
        }
      );

      gsap.fromTo(
        '[data-blog-card]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: '[data-blog-grid]', start: "top 88%", once: true },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 px-8 pb-20 pt-36 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-[130px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-fixed/20 blur-[110px]" />
        <div className="mx-auto max-w-content-max">
          <p data-blog-banner="eyebrow" className="font-label text-label-sm uppercase tracking-[0.2em] text-primary-fixed">
            Think & Build
          </p>
          <h1
            data-blog-banner="title"
            className="mt-4 max-w-4xl font-headline text-[clamp(2.3rem,7vw,4.8rem)] font-black uppercase leading-[0.94] tracking-tight text-white"
          >
            Perspectives on
            <br />
            Brand & Build
          </h1>
          <p
            data-blog-banner="copy"
            className="mt-6 max-w-2xl font-body text-base leading-relaxed text-neutral-300 md:text-lg"
          >
            We publish practical frameworks, campaign lessons, and product execution insights from real client work.
          </p>
        </div>
      </section>

      <section className={`bg-surface ${sectionPageX} py-section-y-sm md:py-section-y`}>
        <div className="mx-auto max-w-content-max">
          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              data-blog-featured
              className="group mx-auto grid max-w-5xl border border-outline-variant/60 bg-surface-container-low transition-colors hover:bg-surface-container md:grid-cols-[1fr_1.12fr] md:items-stretch"
            >
              <div className="relative min-h-[220px] border-b border-outline-variant/60 bg-surface-container-high md:min-h-[320px] md:border-b-0 md:border-r">
                {featured.thumbnailUrl ? (
                  <Image
                    src={featured.thumbnailUrl}
                    alt={featured.thumbnailAlt || featured.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 46vw"
                  />
                ) : <div className="h-full w-full bg-gradient-to-br from-neutral-800 to-neutral-700" />}
              </div>
              <div className="flex flex-col justify-center p-7 md:p-9">
                <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Featured</p>
                <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{featured.category}</p>
                <h2 className="mt-4 font-headline text-[clamp(1.65rem,2.6vw,2.5rem)] font-black uppercase leading-tight tracking-tight text-on-background">
                  {featured.title}
                </h2>
                <p className="mt-4 font-body text-base leading-relaxed text-on-surface-variant">{featured.excerpt}</p>
                <p className="mt-5 font-body text-sm text-on-surface-variant">
                  {formatDate(featured.publishedAt)} · {featured.readTime} min read
                </p>
                {featured.showAuthorDetails && featured.author ? (
                  <p className="mt-2 font-body text-sm text-on-surface-variant">By {featured.author}</p>
                ) : null}
                <span className="mt-7 inline-flex w-fit items-center gap-2 border-b border-primary pb-1 font-label text-sm font-bold uppercase tracking-[0.18em] text-on-background transition-transform group-hover:translate-x-0.5">
                  Read article <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ) : null}

          <div className={`mt-14 ${sectionTitleMarginCompact}`}>
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Latest posts</p>
            <h3 className="mt-3 font-headline text-[clamp(1.8rem,3vw,2.5rem)] font-black uppercase tracking-tight text-on-background">
              Editorial notes from the team
            </h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" data-blog-grid>
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                data-blog-card
                className="group block border border-outline-variant/60 bg-surface-container-low p-6 transition-colors hover:bg-surface-container"
              >
                {post.thumbnailUrl ? (
                  <div className="mb-4 overflow-hidden rounded-lg border border-outline-variant/60">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.thumbnailAlt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                ) : null}
                <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{post.category}</p>
                <h4 className="mt-4 font-headline text-2xl font-black uppercase leading-tight text-on-background">
                  {post.title}
                </h4>
                <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">{post.excerpt}</p>
                <p className="mt-6 font-body text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                  {formatDate(post.publishedAt)} · {post.readTime} min
                </p>
                {post.showAuthorDetails && post.author ? (
                  <p className="mt-2 font-body text-sm text-on-surface-variant">By {post.author}</p>
                ) : null}
                <span className="mt-4 inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-[0.16em] text-on-background transition-transform group-hover:translate-x-0.5">
                  Read <span aria-hidden>→</span>
                </span>
              </Link>
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
    </div>
  );
}
