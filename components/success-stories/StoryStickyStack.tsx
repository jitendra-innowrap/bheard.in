"use client";

import "@/lib/motion/config";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { CaseStudyContent } from "@/lib/case-studies";
import { fadeUpScrollOnce, parallaxScroll, prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Extra scroll runway so each sticky card holds long enough for the next to glide over it */
const STACK_SCROLL_RUNWAY_VH = 138;
const STACK_OVERLAP_VH = 72;
const STACK_LIFT_PX = 20;

function useCardImageParallax(rootRef: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const img = root.querySelector<HTMLElement>("[data-card-parallax-wrap]");
      if (img) parallaxScroll(img, -18);
    },
    { scope: rootRef, revertOnUpdate: true }
  );
}

function StoryStackCard({ study, index }: { study: CaseStudyContent; index: number }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const imgLayerRef = useRef<HTMLDivElement | null>(null);

  const lift = index * STACK_LIFT_PX;
  const topOffset = `calc(5.75rem + ${lift}px)`;
  const cardHeight = `calc(100dvh - 6.25rem - ${lift}px)`;

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const root = rootRef.current;
      if (!wrap || !root || prefersReducedMotion()) return;

      const reveals = root.querySelectorAll<HTMLElement>("[data-stack-reveal]");
      if (reveals.length) {
        gsap.fromTo(
          reveals,
          { y: 46, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top 80%",
              end: "top 36%",
              scrub: 1.25,
            },
          }
        );
      }

      gsap.fromTo(
        root,
        { filter: "brightness(0.88) contrast(1.02)" },
        {
          filter: "brightness(1) contrast(1)",
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 88%",
            end: "top 34%",
            scrub: 1.2,
          },
        }
      );
    },
    { scope: wrapRef, revertOnUpdate: true }
  );

  useCardImageParallax(rootRef);

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
    <div
      ref={wrapRef}
      className={`relative w-full min-h-[calc(100dvh+${STACK_SCROLL_RUNWAY_VH}vh)] ${
        index > 0 ? `-mt-[min(${STACK_OVERLAP_VH}vh,780px)]` : ""
      }`}
      style={{ zIndex: 10 + index * 10 }}
    >
      <Link
        href={`/success-stories/${study.slug}`}
        ref={rootRef}
        className="group sticky flex w-full max-w-content-max flex-col overflow-hidden rounded-[2rem] border border-inverse-surface/10 bg-inverse-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.45)] md:shadow-[0_50px_140px_-42px_rgba(0,0,0,0.5)]"
        style={{
          top: topOffset,
          height: cardHeight,
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
          <div data-card-parallax-wrap className="absolute inset-0 scale-[1.14]">
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
    </div>
  );
}

export default function StoryStickyStack({ cases }: { cases: CaseStudyContent[] }) {
  const introRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <section className="relative bg-surface pb-section-y-sm pt-4 md:pb-section-y md:pt-8">
      <div ref={introRef} className="mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <p
          className="mb-3 font-label text-label-sm uppercase tracking-[0.2em] text-primary"
          data-list-intro-eyebrow
        >
          Proof in the work
        </p>
        <p
          className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant md:text-xl"
          data-list-intro-body
        >
          Scroll the stack — each panel is a full case world: big visuals, sharp positioning, and proof you can feel
          before you read a single metric.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-content-max px-gutter-sm md:mt-24 md:px-gutter">
        <div className="flex flex-col">
          {cases.map((study, index) => (
            <StoryStackCard key={study.slug} study={study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
