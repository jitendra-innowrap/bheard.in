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
      if (!root || prefersReducedMotion()) return;

      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        scrollScrub(el, {
          trigger: el,
          start: "top 86%",
          end: "top 44%",
          scrub: 1.05,
        });
      });

      root.querySelectorAll<HTMLElement>("[data-media-parallax]").forEach((el) => parallaxScroll(el, -10));

      const stats = root.querySelectorAll<HTMLElement>("[data-stat-card]");
      const resultsBand = root.querySelector<HTMLElement>("[data-results-band]");
      if (stats.length && resultsBand) {
        gsap.fromTo(
          stats,
          { y: 28, opacity: 0 },
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
          start: "top 80%",
          end: "top 46%",
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
    <div ref={rootRef} className="bg-surface-container-lowest text-on-background">
      <header ref={heroRef} className="relative overflow-hidden py-24 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[12%] h-40 w-[60%] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl"
        />
        <div className={`relative z-10 grid items-center gap-10 ${band} md:grid-cols-[1.05fr_0.95fr] md:gap-14`}>
          <div data-reveal>
            <p ref={heroMetaRef} className="font-label text-label-sm uppercase tracking-[0.22em] text-primary">
              {study.heroMeta}
            </p>
            <h1
              ref={heroTitleRef}
              className="mt-4 font-headline text-[clamp(2.3rem,6vw,4.9rem)] font-black uppercase leading-[0.92] tracking-tighter text-on-surface"
            >
              {splitHeadingChars(study.heroTitle)}
            </h1>
            <p ref={heroSubRef} className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant md:text-xl">
              {study.heroSubtitle}
            </p>
          </div>
          <figure className="relative overflow-hidden rounded-[1.6rem] border border-black/10 shadow-[0_28px_90px_-45px_rgba(0,0,0,0.28)]">
            <div ref={heroVisualRef} className="relative aspect-[4/3] will-change-transform">
              <Image src={study.heroImage} alt={study.heroImageAlt} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 44vw" />
            </div>
          </figure>
        </div>
      </header>

      <section className="py-5 md:py-8">
        <div className={`${band} grid gap-4 md:grid-cols-3`}>
          <div data-reveal className="rounded-2xl border border-black/10 bg-surface p-5">
            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">Story</p>
            <p className="mt-2 font-body text-sm text-on-surface-variant">{study.listTagline}</p>
          </div>
          <div data-reveal className="rounded-2xl border border-black/10 bg-surface p-5">
            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">Sector</p>
            <p className="mt-2 font-body text-sm text-on-surface-variant">{study.listMeta}</p>
          </div>
          <div data-reveal className="rounded-2xl border border-black/10 bg-surface p-5">
            <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">Focus</p>
            <p className="mt-2 font-body text-sm text-on-surface-variant">{study.overview.heading}</p>
          </div>
        </div>
      </section>

      <SectionCharReveal
        as="section"
        layout="flow"
        scrubEnd="+=44%"
        titleVariant="compact"
        eyebrow="Brand Overview"
        title={study.overview.heading}
        description={study.overview.body}
        className={`${sectionPageX} py-12 md:py-16`}
        innerClassName="mx-auto max-w-content-max"
      />

      <section className="py-10 md:py-14">
        <div className={`${band} grid items-center gap-8 md:grid-cols-[0.95fr_1.05fr] md:gap-12`}>
          <div data-reveal>
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">The Challenge</p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tight text-on-surface md:text-5xl">
              {study.challenge.heading}
            </h2>
            <p className="mt-5 font-body text-base leading-relaxed text-on-surface-variant md:text-lg">{study.challenge.intro}</p>
            {study.challenge.bullets?.length ? (
              <ul className="mt-5 space-y-2">
                {study.challenge.bullets.map((bullet) => (
                  <li key={bullet} className="font-body text-sm leading-relaxed text-on-surface-variant md:text-base">
                    • {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <figure className="relative overflow-hidden rounded-2xl border border-black/10 shadow-[0_26px_70px_-44px_rgba(0,0,0,0.35)]">
            <div data-media-parallax className="relative aspect-[4/3] will-change-transform">
              <Image
                src={study.execution[0]?.image ?? study.listImage}
                alt={study.execution[0]?.imageAlt ?? study.listImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className="bg-surface py-10 md:py-14">
        <div className={`${band} grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12`}>
          <figure className="order-2 relative overflow-hidden rounded-2xl border border-black/10 shadow-[0_26px_70px_-44px_rgba(0,0,0,0.35)] md:order-1">
            <div data-media-parallax className="relative aspect-[4/3] will-change-transform">
              <Image
                src={study.execution[1]?.image ?? study.heroImage}
                alt={study.execution[1]?.imageAlt ?? study.heroImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </figure>
          <div data-reveal className="order-1 md:order-2">
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Our Approach</p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tight text-on-surface md:text-5xl">
              {study.strategy.heading}
            </h2>
            <p className="mt-5 font-body text-base leading-relaxed text-on-surface-variant md:text-lg">{study.strategy.intro}</p>
            {study.strategy.bullets?.length ? (
              <ul className="mt-5 space-y-2">
                {study.strategy.bullets.map((bullet) => (
                  <li key={bullet} className="font-body text-sm leading-relaxed text-on-surface-variant md:text-base">
                    • {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className={`${band}`}>
          <div data-reveal className="mb-8">
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Execution Showcase</p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tight text-on-surface md:text-5xl">
              How it came together
            </h2>
            <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
              Strategy moved into execution through tightly coordinated creative systems, campaign assets, and platform-native delivery.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {study.execution.map((item, index) => (
              <article key={item.heading} className="overflow-hidden rounded-2xl border border-black/10 bg-surface shadow-[0_22px_60px_-45px_rgba(0,0,0,0.34)]">
                <figure className="relative aspect-[16/10] overflow-hidden">
                  <div data-media-parallax className="absolute inset-0 will-change-transform">
                    <Image src={item.image} alt={item.imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                </figure>
                <div className="p-6" data-reveal>
                  <p className="font-label text-[11px] uppercase tracking-[0.18em] text-primary">Step {index + 1}</p>
                  <h3 className="mt-2 font-headline text-2xl font-bold tracking-tight text-on-surface">{item.heading}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant md:text-base">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-results-band className="bg-surface py-12 md:py-16">
        <div className={`${band} grid gap-8 md:grid-cols-[1.05fr_0.95fr]`}>
          <div data-reveal>
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Impact</p>
            <h2 className="mt-4 font-headline text-3xl font-black uppercase tracking-tight text-on-surface md:text-5xl">
              Outcomes that moved the business
            </h2>
            <p data-results-outro className="mt-5 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
              {study.results.closing}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {study.results.stats.slice(0, 2).map((s) => (
                <div key={`impact-${s.label}`} className="rounded-xl border border-black/10 bg-white px-4 py-4">
                  <p className="font-headline text-3xl font-black text-primary">{s.value}</p>
                  <p className="mt-1 font-body text-sm text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:auto-rows-fr">
            {study.results.stats.map((s) => (
              <div key={s.label} data-stat-card className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-5 py-4">
                <p className="font-body text-sm text-on-surface-variant md:text-base">{s.label}</p>
                <p className="font-headline text-2xl font-black text-primary md:text-3xl">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-cta-band className="py-12 md:py-16">
        <div className={`${band} rounded-[2rem] border border-black/10 bg-[linear-gradient(145deg,#fffaf4_0%,#ffffff_46%,#fff8ef_100%)] p-7 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.28)] md:p-10`}>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 data-cta-title className="font-headline text-3xl font-black uppercase tracking-tight text-on-surface md:text-4xl">
                {study.cta.title}
              </h2>
              <p data-cta-body className="mt-3 max-w-xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
                {study.cta.subtext}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-8 py-3.5 font-label text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition-transform hover:scale-[1.02]"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
