"use client";

import "@/lib/motion/config";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { CaseStudyContent } from "@/lib/case-studies";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import { sectionPageX } from "@/components/system/sectionTheme";
import { parallaxScroll, prefersReducedMotion, scrollScrub } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function splitHeadingChars(text: string) {
  return text.split("").map((ch, i) => (
    <span key={`${i}-${ch}`} data-hchar className="inline-block will-change-transform">
      {ch === " " ? "\u00a0" : ch}
    </span>
  ));
}

export default function CaseStudyDetailView({ study }: { study: CaseStudyContent }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const storyFlowRef = useRef<HTMLDivElement | null>(null);
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
      const storyFlow = storyFlowRef.current;
      if (!root || !storyFlow || prefersReducedMotion()) return;

      gsap.to(storyFlow, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: storyFlow,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      const pinnedPanels = root.querySelectorAll<HTMLElement>("[data-story-panel]");
      pinnedPanels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          end: "+=145%",
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
        });
      });

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

      root.querySelectorAll<HTMLElement>("[data-panel-copy]").forEach((el) => {
        scrollScrub(el, {
          trigger: el.closest("[data-story-panel]") ?? el,
          start: "top 78%",
          end: "top 32%",
          scrub: 1,
        });
      });

      root.querySelectorAll<HTMLElement>("[data-exec-visual]").forEach((el) => parallaxScroll(el, -14));

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

      const ctaBlock = root.querySelector<HTMLElement>("[data-cta-band]");
      const ctaTitle = root.querySelector<HTMLElement>("[data-cta-title]");
      const ctaBody = root.querySelector<HTMLElement>("[data-cta-body]");
      if (ctaBlock && ctaTitle) {
        scrollScrub(ctaTitle, { trigger: ctaBlock, start: "top 88%", end: "top 52%", scrub: 1.05 });
      }
      if (ctaBlock && ctaBody) {
        scrollScrub(ctaBody, { trigger: ctaBlock, start: "top 86%", end: "top 46%", scrub: 1.08 });
      }
    },
    { scope: rootRef, dependencies: [study.slug], revertOnUpdate: true }
  );

  const band = `mx-auto max-w-content-max ${sectionPageX}`;
  const challengeDescription = `${study.challenge.intro}${
    study.challenge.bullets?.length ? `\n${study.challenge.bullets.join(" • ")}` : ""
  }`;
  const strategyDescription = `${study.strategy.intro}${
    study.strategy.bullets?.length ? `\n${study.strategy.bullets.join(" • ")}` : ""
  }`;

  return (
    <div ref={rootRef} className="bg-surface text-on-background">
      <div
        ref={storyFlowRef}
        className="relative"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 12%, rgba(255,255,255,0.36), transparent 40%), radial-gradient(circle at 92% 20%, rgba(255,146,62,0.12), transparent 38%), linear-gradient(180deg, #0f172a 0%, #1f2937 22%, #22303f 44%, #1e293b 62%, #15202e 78%, #111827 90%, #f8fafc 100%)",
          backgroundSize: "100% 240%",
          backgroundPosition: "50% 0%",
        }}
      >
        <header ref={heroRef} className="relative overflow-hidden py-28 md:py-32">
          <div className={`relative z-20 grid items-center gap-10 ${band} md:grid-cols-[1.05fr_0.95fr] md:gap-14`}>
            <div>
              <p ref={heroMetaRef} className="font-label text-label-sm uppercase tracking-[0.22em] text-primary-fixed">
                {study.heroMeta}
              </p>
              <h1
                ref={heroTitleRef}
                className="mt-4 font-headline text-[clamp(2.4rem,6.3vw,5rem)] font-black uppercase leading-[0.92] tracking-tighter text-surface-bright"
              >
                {splitHeadingChars(study.heroTitle)}
              </h1>
              <p ref={heroSubRef} className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-neutral-200 md:text-xl">
                {study.heroSubtitle}
              </p>
            </div>
            <figure className="relative overflow-hidden rounded-[1.6rem] border border-white/10 shadow-[0_28px_90px_-45px_rgba(0,0,0,0.55)]">
              <div ref={heroVisualRef} className="relative aspect-[4/3] will-change-transform">
                <Image
                  src={study.heroImage}
                  alt={study.heroImageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 44vw"
                />
              </div>
            </figure>
          </div>
        </header>

        <SectionCharReveal
          as="section"
          layout="viewportPin"
          titleVariant="compact"
          eyebrow="The Belief"
          title={study.overview.heading}
          description={study.overview.body}
          className={`${sectionPageX} flex min-h-[100dvh] flex-col justify-center py-14 md:py-20`}
          innerClassName="mx-auto max-w-content-max"
          descriptionClassName="mt-5 max-w-3xl font-body text-lg leading-relaxed text-neutral-100 md:text-xl"
        />

        <SectionCharReveal
          as="section"
          layout="viewportPin"
          titleVariant="compact"
          eyebrow="The Challenge"
          title={study.challenge.heading}
          description={challengeDescription}
          className={`${sectionPageX} flex min-h-[100dvh] flex-col justify-center py-14 md:py-20 [&_h2]:text-right [&_p]:ml-auto [&_p]:text-right`}
          innerClassName="mx-auto max-w-content-max"
          descriptionClassName="mt-5 max-w-3xl font-body text-lg leading-relaxed text-neutral-100 md:text-xl"
        />

        <SectionCharReveal
          as="section"
          layout="viewportPin"
          titleVariant="compact"
          eyebrow="Our Approach"
          title={study.strategy.heading}
          description={strategyDescription}
          className={`${sectionPageX} flex min-h-[100dvh] flex-col justify-center py-14 md:py-20`}
          innerClassName="mx-auto max-w-content-max"
          descriptionClassName="mt-5 max-w-3xl font-body text-lg leading-relaxed text-neutral-100 md:text-xl"
        />

        <section data-story-panel className={`${sectionPageX} min-h-[100dvh] py-12 md:py-16`}>
          <div className="mx-auto grid max-w-content-max items-center gap-10 rounded-3xl border border-white/15 bg-black/25 p-7 backdrop-blur-sm md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:p-10">
            <div data-panel-copy className="min-w-0">
              <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary-fixed">Execution</p>
              <h2 data-block-heading className="mt-4 font-headline text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                How it came together
              </h2>
              <h3 className="mt-6 font-headline text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
                {study.execution[0]?.heading ?? "Execution"}
              </h3>
              <div data-block-body className="mt-4 space-y-3">
                <p className="font-body text-body-lg leading-relaxed text-neutral-100">
                  {study.execution[0]?.body ?? study.strategy.intro}
                </p>
                {study.execution.length > 1 ? (
                  <ul className="grid gap-2 pt-2 text-sm text-neutral-200 md:grid-cols-2">
                    {study.execution.slice(1).map((item) => (
                      <li key={item.heading} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                        {item.heading}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
            <figure data-exec-figure className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 shadow-[0_25px_90px_-40px_rgba(0,0,0,0.65)]">
              <div data-exec-visual className="absolute inset-0 scale-110 will-change-transform">
                <Image
                  src={study.execution[0]?.image ?? study.heroImage}
                  alt={study.execution[0]?.imageAlt ?? study.heroImageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 44vw"
                />
              </div>
            </figure>
          </div>
        </section>

        <section data-story-panel data-results-band className={`${sectionPageX} min-h-[100dvh] py-12 md:py-16`}>
          <div className="mx-auto grid max-w-content-max gap-8 rounded-3xl border border-white/15 bg-black/35 p-7 text-white backdrop-blur-sm md:grid-cols-[1.1fr_0.9fr] md:gap-10 md:p-10">
            <div data-panel-copy>
              <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary-fixed">Impact</p>
              <h2 data-block-heading className="mt-4 font-headline text-4xl font-black uppercase tracking-tight md:text-5xl">
                {study.results.heading || "Impact"}
              </h2>
              <p data-results-outro className="mt-5 max-w-2xl font-body text-body-lg leading-relaxed text-neutral-100">
                {study.results.closing}
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {study.results.stats.slice(0, 2).map((s) => (
                  <div key={`highlight-${s.label}`} className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <p className="font-headline text-3xl font-bold text-primary-fixed">{s.value}</p>
                    <p className="mt-1 text-sm text-neutral-100">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:auto-rows-fr">
              {study.results.stats.map((s) => (
                <div
                  key={s.label}
                  data-stat-card
                  className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-5 py-4"
                >
                  <p className="font-body text-sm text-neutral-100 md:text-base">{s.label}</p>
                  <p className="font-headline text-2xl font-black text-primary-fixed md:text-3xl">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section data-detail-block data-cta-band className="bg-surface py-10 md:py-12">
        <div className={`${band} flex flex-col items-start justify-between gap-8 md:flex-row md:items-center`}>
          <div>
            <h2 data-cta-title className="font-headline text-3xl font-black uppercase tracking-tight md:text-4xl">
              {study.cta.title}
            </h2>
            <p data-cta-body className="mt-3 max-w-xl font-body text-body-lg text-on-surface-variant">
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
