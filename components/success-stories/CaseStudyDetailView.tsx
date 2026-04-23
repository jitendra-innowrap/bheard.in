"use client";

import "@/lib/motion/config";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { CaseStudyContent } from "@/lib/case-studies";
import { sectionPageX } from "@/components/system/sectionTheme";
import {
  initHeadingLetterScrub,
  parallaxScroll,
  prefersReducedMotion,
  scrollScrub,
} from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP);

function splitHeadingChars(text: string) {
  return text.split("").map((ch, i) => (
    <span key={`${i}-${ch}`} data-hchar className="inline-block will-change-transform">
      {ch === " " ? "\u00a0" : ch}
    </span>
  ));
}

const strategyCardPattern =
  "linear-gradient(90deg,rgba(17,24,39,0.06) 1px,transparent 1px),linear-gradient(rgba(17,24,39,0.05) 1px,transparent 1px)";

export default function CaseStudyDetailView({ study }: { study: CaseStudyContent }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null);
  const heroSubRef = useRef<HTMLParagraphElement | null>(null);
  const heroMetaRef = useRef<HTMLParagraphElement | null>(null);
  const heroVisualRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const chars = heroTitleRef.current?.querySelectorAll<HTMLElement>("[data-hchar]");
      if (prefersReducedMotion()) {
        if (chars?.length) gsap.set(chars, { opacity: 1, y: 0 });
        return;
      }
      if (chars?.length && hero) {
        gsap.fromTo(
          chars,
          { opacity: 0.08, y: 34 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top 72%",
              end: "top 36%",
              scrub: 1.2,
            },
          }
        );
      }
      const sub = heroSubRef.current;
      if (sub && hero) {
        gsap.fromTo(
          sub,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top 78%",
              end: "top 44%",
              scrub: 1.15,
            },
          }
        );
      }
      const meta = heroMetaRef.current;
      if (meta && hero) {
        gsap.fromTo(
          meta,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top 74%",
              end: "top 40%",
              scrub: 1.15,
            },
          }
        );
      }
    },
    { scope: heroRef, dependencies: [study.slug], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      const wrap = heroVisualRef.current;
      if (!wrap || prefersReducedMotion()) return;
      gsap.to(wrap, {
        yPercent: -14,
        ease: "none",
        willChange: "transform",
        scrollTrigger: {
          trigger: heroRef.current ?? wrap,
          scrub: 1.25,
          start: "top bottom",
          end: "bottom top",
        },
      });
    },
    { scope: heroRef, dependencies: [study.slug], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (prefersReducedMotion()) {
        return;
      }

      const rules = root.querySelectorAll<HTMLElement>("[data-motion-rule]");
      rules.forEach((rule) => {
        gsap.fromTo(
          rule,
          { scaleX: 0.06, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: {
              trigger: rule,
              start: "top 92%",
              end: "top 70%",
              scrub: 1.05,
            },
          }
        );
      });

      const headings = root.querySelectorAll<HTMLElement>("[data-block-heading]");
      headings.forEach((h) => initHeadingLetterScrub(h));

      const blocks = root.querySelectorAll<HTMLElement>("[data-detail-block]");
      blocks.forEach((sec) => {
        const body = sec.querySelector<HTMLElement>("[data-block-body]");
        if (!body) return;
        const kids = body.querySelectorAll<HTMLElement>(":scope > *");
        kids.forEach((kid) => {
          scrollScrub(kid, {
            trigger: sec,
            start: "top 86%",
            end: "top 42%",
            scrub: 1.1,
          });
        });
      });

      const execVisuals = root.querySelectorAll<HTMLElement>("[data-exec-visual]");
      execVisuals.forEach((el) => parallaxScroll(el, -14));

      const stats = root.querySelectorAll<HTMLElement>("[data-stat-card]");
      const resultsBand = root.querySelector<HTMLElement>("[data-results-band]");
      if (stats.length && resultsBand) {
        gsap.fromTo(
          stats,
          { y: 52, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.09,
            ease: "none",
            scrollTrigger: {
              trigger: resultsBand,
              start: "top 84%",
              end: "top 46%",
              scrub: 1.15,
            },
          }
        );
      }

      const resultsCopy = root.querySelector<HTMLElement>("[data-results-outro]");
      if (resultsCopy && resultsBand) {
        scrollScrub(resultsCopy, {
          trigger: resultsBand,
          start: "top 72%",
          end: "top 40%",
          scrub: 1.05,
        });
      }

      const closing = root.querySelector<HTMLElement>("[data-closing-pull]");
      if (closing) {
        scrollScrub(closing, {
          trigger: closing,
          start: "top 88%",
          end: "top 48%",
          scrub: 1.1,
        });
      }

      const ctaBlock = root.querySelector<HTMLElement>("[data-cta-band]");
      const ctaTitle = root.querySelector<HTMLElement>("[data-cta-title]");
      const ctaBody = root.querySelector<HTMLElement>("[data-cta-body]");
      if (ctaBlock && ctaTitle) {
        scrollScrub(ctaTitle, { trigger: ctaBlock, start: "top 88%", end: "top 52%", scrub: 1.05 });
      }
      if (ctaBlock && ctaBody) {
        scrollScrub(ctaBody, { trigger: ctaBlock, start: "top 86%", end: "top 46%", scrub: 1.08 });
      }

      const cleaners: (() => void)[] = [];
      root.querySelectorAll<HTMLElement>("[data-exec-figure]").forEach((figure) => {
        const layer = figure.querySelector<HTMLElement>("[data-exec-visual]");
        if (!layer) return;
        const xTo = gsap.quickTo(layer, "x", { duration: 0.34, ease: "power2.out" });
        const yTo = gsap.quickTo(layer, "y", { duration: 0.34, ease: "power2.out" });
        const onMove = (e: PointerEvent) => {
          const r = figure.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          xTo(px * 18);
          yTo(py * 15);
        };
        const reset = () => {
          xTo(0);
          yTo(0);
        };
        figure.addEventListener("pointermove", onMove);
        figure.addEventListener("pointerleave", reset);
        figure.addEventListener("pointercancel", reset);
        cleaners.push(() => {
          figure.removeEventListener("pointermove", onMove);
          figure.removeEventListener("pointerleave", reset);
          figure.removeEventListener("pointercancel", reset);
        });
      });

      return () => cleaners.forEach((fn) => fn());
    },
    { scope: rootRef, dependencies: [study.slug], revertOnUpdate: true }
  );

  const band = `mx-auto max-w-content-max ${sectionPageX}`;

  return (
    <div ref={rootRef} className="bg-surface text-on-background">
      <header ref={heroRef} className="relative min-h-[85vh] w-full overflow-hidden bg-surface-dim md:min-h-[88vh]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[18] opacity-[0.35] mix-blend-soft-light"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(255,255,255,0.12), transparent 42%), radial-gradient(circle at 88% 8%, rgba(255,146,62,0.18), transparent 38%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[19] opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(115deg, rgba(255,255,255,0.05) 1px, transparent 1px),linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-surface-dim/95 via-surface-dim/55 to-surface-dim/10 md:bg-gradient-to-r md:from-surface-dim/90 md:via-surface-dim/48 md:to-transparent" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-primary/28 via-transparent to-tertiary-container/22 mix-blend-screen" />

        <div ref={heroVisualRef} className="absolute inset-0 will-change-transform md:left-[36%]">
          <div className="relative h-full w-full scale-[1.06] md:scale-[1.08]">
            <Image
              src={study.heroImage}
              alt={study.heroImageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 65vw"
            />
          </div>
        </div>

        <div className={`relative z-30 flex min-h-[85vh] flex-col justify-end gap-6 pb-14 pt-32 md:min-h-[88vh] md:pb-20 md:pt-40 ${band}`}>
          <div className="max-w-3xl">
            <h1
              ref={heroTitleRef}
              className="font-headline text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tighter text-surface-bright drop-shadow-[0_2px_28px_rgba(0,0,0,0.35)]"
            >
              {splitHeadingChars(study.heroTitle)}
            </h1>
            <p
              ref={heroSubRef}
              className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-neutral-200 md:text-xl"
            >
              {study.heroSubtitle}
            </p>
            <p
              ref={heroMetaRef}
              className="mt-4 font-label text-label-sm uppercase tracking-[0.22em] text-primary-fixed drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)]"
            >
              {study.heroMeta}
            </p>
          </div>
        </div>
      </header>

      <section data-detail-block className={`${band} py-section-y-sm md:py-section-y-md`}>
        <div
          data-motion-rule
          className="mb-10 h-px w-full max-w-2xl origin-left bg-inverse-surface/20 will-change-transform md:mb-12"
        />
        <h2 data-block-heading className="max-w-xl font-headline text-3xl font-black uppercase tracking-tight text-on-background md:text-4xl">
          {study.overview.heading}
        </h2>
        <div data-block-body className="mt-8 max-w-3xl space-y-4">
          <p className="font-body text-body-lg leading-relaxed text-on-surface-variant">{study.overview.body}</p>
        </div>
      </section>

      <section
        data-detail-block
        className="border-y border-inverse-surface/10 bg-surface-container-low py-section-y-sm md:py-section-y-md"
      >
        <div className={band}>
          <div
            data-motion-rule
            className="mb-10 h-px w-full max-w-2xl origin-left bg-inverse-surface/20 will-change-transform md:mb-12"
          />
          <h2 data-block-heading className="max-w-xl font-headline text-3xl font-black uppercase tracking-tight md:text-4xl">
            {study.challenge.heading}
          </h2>
          <div data-block-body className="mt-8 max-w-3xl space-y-5">
            <p className="font-body text-body-lg leading-relaxed text-on-surface-variant">{study.challenge.intro}</p>
            {study.challenge.bullets?.length ? (
              <ul className="space-y-3 border-l-2 border-primary/80 pl-6 font-body text-body-lg leading-relaxed text-on-surface-variant">
                {study.challenge.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section data-detail-block className={`${band} py-section-y-sm md:py-section-y-md`}>
        <div
          data-motion-rule
          className="mb-10 h-px w-full max-w-2xl origin-left bg-inverse-surface/20 will-change-transform md:mb-12"
        />
        <h2 data-block-heading className="max-w-xl font-headline text-3xl font-black uppercase tracking-tight md:text-4xl">
          {study.strategy.heading}
        </h2>
        <div data-block-body className="mt-8 max-w-3xl space-y-5">
          <p className="font-body text-body-lg leading-relaxed text-on-surface-variant">{study.strategy.intro}</p>
          {study.strategy.bullets?.length ? (
            <ul className="grid gap-4 md:grid-cols-3">
              {study.strategy.bullets.map((b) => (
                <li
                  key={b}
                  className="group relative overflow-hidden rounded-xl border border-inverse-surface/10 bg-surface-container-lowest p-5 font-body text-sm leading-relaxed text-on-surface-variant shadow-[0_18px_50px_-38px_rgba(17,24,39,0.35)] transition-transform duration-300 will-change-transform hover:-translate-y-1 md:text-base"
                  style={{ backgroundImage: strategyCardPattern, backgroundSize: "22px 22px" }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-5 top-3 h-px origin-left scale-x-0 bg-inverse-surface/25 transition-transform duration-500 group-hover:scale-x-100"
                  />
                  <span className="relative">{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section data-detail-block className="bg-surface-container-low py-section-y-sm md:py-section-y-md">
        <div className={`${band} mb-12 md:mb-16`}>
          <div
            data-motion-rule
            className="mb-8 h-px w-full max-w-3xl origin-left bg-inverse-surface/20 will-change-transform md:mb-10"
          />
          <p className="mb-3 font-label text-label-sm uppercase tracking-[0.2em] text-primary">Execution</p>
          <h2 data-block-heading className="max-w-3xl font-headline text-3xl font-black uppercase tracking-tight md:text-5xl">
            How it came together
          </h2>
        </div>
        <div className="flex flex-col gap-20 md:gap-28">
          {study.execution.map((block) => {
            const reverse = block.align === "right";
            return (
              <div
                key={block.heading}
                data-detail-block
                className={`${band} grid items-center gap-10 md:grid-cols-2 md:gap-16`}
              >
                <div className={reverse ? "md:order-2" : ""}>
                  <h3
                    data-block-heading
                    className="font-headline text-2xl font-bold uppercase tracking-tight text-on-background md:text-3xl"
                  >
                    {block.heading}
                  </h3>
                  <div data-block-body className="mt-5">
                    <p className="font-body text-body-lg leading-relaxed text-on-surface-variant">{block.body}</p>
                  </div>
                </div>
                <figure
                  data-exec-figure
                  className={`relative aspect-[4/3] cursor-default overflow-hidden rounded-[1.5rem] border border-inverse-surface/10 bg-inverse-surface shadow-lg transition-transform duration-300 will-change-transform hover:-translate-y-1 ${
                    reverse ? "md:order-1" : ""
                  }`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10 opacity-[0.16] mix-blend-soft-light"
                    style={{
                      backgroundImage:
                        "linear-gradient(120deg, rgba(255,255,255,0.12) 1px, transparent 1px),linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                      backgroundSize: "26px 26px",
                    }}
                  />
                  <div data-exec-visual className="absolute inset-0 scale-110 will-change-transform">
                    <Image
                      src={block.image}
                      alt={block.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 45vw"
                    />
                  </div>
                </figure>
              </div>
            );
          })}
        </div>
      </section>

      <section
        data-detail-block
        data-results-band
        className="bg-inverse-surface py-section-y-sm text-inverse-on-surface md:py-section-y"
      >
        <div className={band}>
          <div
            data-motion-rule
            className="mb-10 h-px w-full max-w-2xl origin-left bg-white/25 will-change-transform md:mb-12"
          />
          <h2 data-block-heading className="max-w-2xl font-headline text-3xl font-black uppercase tracking-tight text-surface-bright md:text-4xl">
            {study.results.heading}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {study.results.stats.map((s) => (
              <div
                key={s.label}
                data-stat-card
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-transform duration-300 will-change-transform hover:-translate-y-1"
              >
                <p className="font-headline text-4xl font-bold tabular-nums text-primary-fixed md:text-5xl">{s.value}</p>
                <p className="mt-3 font-body text-sm leading-relaxed text-white/75 md:text-base">{s.label}</p>
              </div>
            ))}
          </div>
          <p
            data-results-outro
            className="mt-12 max-w-3xl font-body text-body-lg leading-relaxed text-neutral-200"
          >
            {study.results.closing}
          </p>
        </div>
      </section>

      <section data-detail-block className={`${band} py-section-y-sm md:py-section-y-md`}>
        <blockquote
          data-closing-pull
          className="max-w-4xl font-headline text-2xl font-bold uppercase leading-snug tracking-tight text-on-background md:text-3xl"
        >
          {study.closingStatement}
        </blockquote>
      </section>

      <section
        data-detail-block
        data-cta-band
        className="border-t border-inverse-surface/10 bg-surface-container-low py-section-y-sm md:py-section-y-md"
      >
        <div className={`${band} flex flex-col items-start justify-between gap-10 md:flex-row md:items-center`}>
          <div>
            <h2 data-cta-title className="font-headline text-3xl font-black uppercase tracking-tight md:text-4xl">
              {study.cta.title}
            </h2>
            <p data-cta-body className="mt-4 max-w-xl font-body text-body-lg text-on-surface-variant">
              {study.cta.subtext}
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-8 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary transition-transform hover:scale-[1.02]"
          >
            Let&apos;s talk
          </Link>
        </div>
      </section>
    </div>
  );
}
