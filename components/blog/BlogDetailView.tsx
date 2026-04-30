"use client";

import "@/lib/motion/config";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef } from "react";
import { CircleUserRound } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP);

export type BlogDetail = {
  slug: string;
  title: string;
  subtitle?: string | null;
  showAuthorDetails?: boolean | null;
  author?: string | null;
  authorImage?: string | null;
  excerpt: string;
  thumbnailUrl?: string | null;
  thumbnailAlt?: string | null;
  content: string;
  category: string;
  readTime: number;
  publishedAt: Date | string | null;
  updatedAt?: Date | string | null;
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

function formatDateTime(value: Date | string | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogDetailView({
  post,
  related,
}: {
  post: BlogDetail;
  related: BlogDetail[];
}) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '[data-blog-detail="intro"], [data-blog-detail="meta"], [data-blog-detail="excerpt"], [data-blog-detail="article"], [data-blog-detail="related"]',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.62, stagger: 0.08, ease: "power3.out" }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="bg-surface py-14 md:py-20">
      <div className="mx-auto max-w-[900px] px-4 md:px-6" data-blog-detail="intro">
        <h1 className="text-balance font-headline text-[clamp(2.15rem,4.3vw,3.9rem)] font-black uppercase leading-[0.97] tracking-tight text-on-background">
          {post.title}
        </h1>
        {post.thumbnailUrl ? (
          <div className="relative mt-6 w-full overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container-low shadow-sm">
            <div className="relative aspect-[16/9]">
              <Image
                src={post.thumbnailUrl}
                alt={post.thumbnailAlt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/72 via-black/20 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 md:inset-x-6 md:bottom-6">
              {post.showAuthorDetails && post.author ? (
                <div className="flex items-center gap-3 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-white backdrop-blur-sm">
                  {post.authorImage ? (
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/30">
                      <Image src={post.authorImage} alt={post.author} fill className="object-cover" sizes="32px" />
                    </div>
                  ) : (
                    <CircleUserRound className="h-5 w-5 text-white/90" />
                  )}
                  <span className="font-body text-sm font-medium">{post.author}</span>
                </div>
              ) : (
                <span />
              )}
              <div className="rounded-full border border-white/20 bg-black/35 px-3 py-2 font-body text-sm font-medium text-white backdrop-blur-sm">
                {post.readTime} minutes
              </div>
            </div>
          </div>
        ) : null}
        <p className="mt-6 font-label text-label-sm uppercase tracking-[0.2em] text-primary">{post.category}</p>
        {post.subtitle ? <p className="mt-3 font-body text-lg leading-relaxed text-on-surface-variant">{post.subtitle}</p> : null}
        <div data-blog-detail="meta" className="mt-6 grid gap-3 border-y border-outline-variant/60 py-4 md:grid-cols-2">
          {post.showAuthorDetails && post.author ? (
            <p className="font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant">
              By <span className="font-semibold text-on-background">{post.author}</span>
            </p>
          ) : null}
          <p className="font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant">
            Published <span className="font-semibold text-on-background">{formatDate(post.publishedAt)}</span>
          </p>
          <p className="font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant">
            Updated <span className="font-semibold text-on-background">{formatDateTime(post.updatedAt ?? post.publishedAt)}</span>
          </p>
          <p className="font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant">
            Read time <span className="font-semibold text-on-background">{post.readTime} min</span>
          </p>
        </div>
        <p data-blog-detail="excerpt" className="mt-6 max-w-[72ch] font-body text-lg leading-relaxed text-on-surface-variant">
          {post.excerpt}
        </p>
      </div>

      <article
        data-blog-detail="article"
        className="prose prose-neutral mx-auto mt-10 min-w-0 max-w-[900px] rounded-2xl border border-outline-variant/60 bg-white px-6 py-8 prose-pre:overflow-x-auto prose-table:overflow-x-auto md:px-10 md:py-10"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>

      <div data-blog-detail="related" className="mx-auto mt-16 max-w-[980px] px-4 md:px-6">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Related posts</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {related.map((item) => (
            <article key={item.slug} className="border border-outline-variant/60 bg-surface-container-low p-5">
              <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{item.category}</p>
              <h2 className="mt-3 font-headline text-xl font-black uppercase leading-tight text-on-background">
                {item.title}
              </h2>
              <Link
                href={`/blog/${item.slug}`}
                className="mt-4 inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-background"
              >
                Read article <span aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
