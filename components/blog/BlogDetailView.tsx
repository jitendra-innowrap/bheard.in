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

const COVER_FALLBACK = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80";

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
  categories,
  recent,
}: {
  post: BlogDetail;
  related: BlogDetail[];
  categories: Array<{ label: string; count: number }>;
  recent: BlogDetail[];
}) {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '[data-blog-detail="intro"], [data-blog-detail="meta"], [data-blog-detail="excerpt"], [data-blog-detail="article"], [data-blog-detail="related"], [data-blog-detail="sidebar"]',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.62, stagger: 0.08, ease: "power3.out" }
      );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="bg-surface py-12 md:py-16">
      <div className="mx-auto grid max-w-content-max gap-8 px-4 md:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="min-w-0">
          <div data-blog-detail="intro">
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{post.category}</p>
            <h1 className="text-balance font-headline text-[clamp(2rem,4.2vw,3.7rem)] font-black uppercase leading-[0.97] tracking-tight text-on-background">
              {post.title}
            </h1>
            <p className="mt-3 font-body text-xs uppercase tracking-[0.14em] text-on-surface-variant">
              Updated <span className="font-semibold text-on-background">{formatDateTime(post.updatedAt ?? post.publishedAt)}</span>
            </p>
            <div className="relative mt-5 w-full overflow-hidden border border-outline-variant/60 bg-surface-container-low shadow-sm">
              <div className="relative aspect-[16/9]">
                <Image
                  src={post.thumbnailUrl || COVER_FALLBACK}
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
            {post.subtitle ? <p className="mt-3 font-body text-lg leading-relaxed text-on-surface-variant">{post.subtitle}</p> : null}
            
            <p data-blog-detail="excerpt" className="mt-6 max-w-[72ch] font-body text-lg leading-relaxed text-on-surface-variant">
              {post.excerpt}
            </p>
          </div>

          <article
            data-blog-detail="article"
            className="prose prose-neutral mt-10 max-w-content-max border border-outline-variant/60 bg-white px-6 py-8 prose-pre:overflow-x-auto prose-table:overflow-x-auto md:px-10 md:py-10"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>

          <div data-blog-detail="related" className="mx-auto mt-16 max-w-content-max">
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
        </div>

        <aside data-blog-detail="sidebar" className="space-y-5 lg:sticky lg:top-24">
          <div className="border border-outline-variant/60 bg-surface-container-low p-5">
            <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">Categories</p>
            <div className="mt-4 space-y-2">
              {categories.map((cat) => (
                <div key={cat.label} className="flex items-center justify-between bg-white px-3 py-2 text-sm">
                  <span className="font-medium text-on-background">{cat.label}</span>
                  <span className="text-on-surface-variant">{cat.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-outline-variant/60 bg-surface-container-low p-5">
            <p className="font-label text-xs uppercase tracking-[0.2em] text-primary">Recent posts</p>
            <div className="mt-4 space-y-4">
              {recent.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="group block">
                  <p className="line-clamp-2 font-body text-sm font-semibold text-on-background group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-on-surface-variant">{item.category}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
