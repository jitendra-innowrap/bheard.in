"use client";

import "@/lib/motion/config";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { CaseStudyContent } from "@/lib/case-studies";
import { fadeUpScrollOnce, prefersReducedMotion } from "@/lib/motion/animations";
import { usePinnedStack } from "@/lib/motion/pinnedStack";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STACK_LIFT_PX = 20;
const CARD_TOP_REM = 5.75;
const CARD_BOTTOM_REM = 6.25;
const SCROLL_PER_CARD_PCT = 55;

/* ─── Individual card ─── */

function StoryStackCard({ study, index }: { study: CaseStudyContent; index: number }) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const imgLayerRef = useRef<HTMLDivElement | null>(null);

  const lift = index * STACK_LIFT_PX;

  useGSAP(
    () => {
      const root = rootRef.current;
      const layer = imgLayerRef.current;
      if (!root || !layer || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(layer, "x", { duration: 0.32, ease: "power2.out" });
      const yTo = gsap.quickTo(layer, "y", { duration: 0.32, ease: "power2.out" });

      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        xTo(px * 22);
        yTo(py * 18);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", reset);
      root.addEventListener("pointercancel", reset);
      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", reset);
        root.removeEventListener("pointercancel", reset);
      };
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  return (
    <Link
      href={`/success-stories/${study.slug}`}
      ref={rootRef}
      data-stack-card
      className="group absolute left-0 flex w-full flex-col overflow-hidden rounded-[2rem] border border-inverse-surface/10 bg-inverse-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.45)] will-change-transform md:shadow-[0_50px_140px_-42px_rgba(0,0,0,0.5)]"
      style={{
        top: `calc(${CARD_TOP_REM}rem + ${lift}px)`,
        minHeight: "min(80dvh, 520px)",
        height: `calc(100dvh - ${CARD_BOTTOM_REM}rem - ${lift}px)`,
        zIndex: 10 + index * 10,
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/32 to-black/10" />
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-primary/22 via-transparent to-tertiary-container/14 opacity-85 mix-blend-screen" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15] opacity-[0.14] mix-blend-soft-light"
        style={{
          backgroundImage:
            "linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div ref={imgLayerRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0 scale-[1.14]">
          <Image
            src={study.listImage}
            alt={study.listImageAlt}
            fill
            sizes="(max-width: 768px) 100vw, min(1280px, 96vw)"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      </div>

      <div className="relative z-30 mt-auto flex flex-col justify-end gap-5 p-8 md:flex-row md:items-end md:justify-between md:gap-10 md:p-12 lg:p-14">
        <div className="max-w-2xl">
          <p
            data-stack-reveal
            className="mb-3 font-label text-label-sm uppercase tracking-[0.22em] text-tertiary-fixed"
          >
            {study.listMeta}
          </p>
          <h2
            data-stack-reveal
            className="font-headline text-[clamp(2rem,5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tighter text-surface-bright"
          >
            {study.listTitle}
          </h2>
          <p
            data-stack-reveal
            className="mt-4 max-w-xl font-body text-base leading-relaxed text-white/85 md:text-lg"
          >
            {study.listDescription}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-4 md:items-end">
          {study.listStats?.length ? (
            <div className="flex flex-wrap gap-3 md:justify-end" data-stack-reveal>
              {study.listStats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md"
                >
                  <p className="font-headline text-2xl font-bold tabular-nums text-surface-bright md:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 max-w-[12rem] font-body text-xs leading-snug text-white/75">{s.label}</p>
                </div>
              ))}
            </div>
          ) : null}
          <span
            data-stack-reveal
            className="inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-[0.18em] text-primary-fixed transition-transform group-hover:translate-x-1"
          >
            Open story <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Parent: pins the container and drives the stacking + exit timeline ─── */

export default function StoryStickyStack({ cases }: { cases: CaseStudyContent[] }) {
  const introRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = introRef.current;
      if (!el || prefersReducedMotion()) return;
      const eyebrow = el.querySelector<HTMLElement>("[data-list-intro-eyebrow]");
      const body = el.querySelector<HTMLElement>("[data-list-intro-body]");
      fadeUpScrollOnce(eyebrow, { start: "top 90%" });
      fadeUpScrollOnce(body, { start: "top 88%" });
    },
    { scope: introRef }
  );

  usePinnedStack({
    scopeRef: sectionRef,
    pinRef,
    cardsWrapRef,
    cardSelector: "[data-stack-card]",
    revealSelector: "[data-stack-reveal]",
    scrollPerCardPct: SCROLL_PER_CARD_PCT,
    exitDuration: 2,
  });

  return (
    <section id="stories-stack" ref={sectionRef} className="relative bg-surface-container-lowest pt-8 md:pt-10">
      <div ref={introRef} className="mx-auto mb-12 max-w-content-max px-gutter-sm md:mb-16 md:px-gutter">
        <p
          className="mb-3 font-label text-label-sm uppercase tracking-[0.2em] text-primary"
          data-list-intro-eyebrow
        >
          Case Studies
        </p>
        <h2 className="font-headline text-[clamp(1.8rem,3.8vw,3.2rem)] font-black leading-[1.02] tracking-tight text-on-surface">
          Built for Ambitious Brands
        </h2>
        <p
          className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant md:text-xl"
          data-list-intro-body
        >
          Scroll the stack — each panel is a full case world: big visuals, sharp positioning, and proof you can feel
          before you read a single metric.
        </p>
      </div>

      <div ref={pinRef} className="relative h-dvh overflow-hidden">
        <div
          ref={cardsWrapRef}
          className="relative mx-auto h-full max-w-content-max px-gutter-sm will-change-transform md:px-gutter"
        >
          {cases.map((study, index) => (
            <StoryStackCard key={study.slug} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
