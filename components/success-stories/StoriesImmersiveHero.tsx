"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { CaseStudyContent } from "@/lib/case-studies";

gsap.registerPlugin(useGSAP);

const BELT_SPEED_MOBILE = 88;
const BELT_SPEED_TABLET = 64;
const BELT_SPEED_DESKTOP = 54;
const TRACK_GAP_DESKTOP = -18;
const TRACK_GAP_TABLET = -12;
const TRACK_GAP_MOBILE = 12;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function StoriesImmersiveHero({ cases }: { cases: CaseStudyContent[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const beltRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const sourceImages = cases.slice(0, 12).map((story) => ({
    src: story.listImage,
    alt: story.listImageAlt || story.listTitle,
    key: story.slug,
  }));

  const loopImages = [...sourceImages, ...sourceImages];
  const firstStoryHref = cases.length ? `/success-stories/${cases[0].slug}` : "#stories-stack";

  useGSAP(
    () => {
      const section = sectionRef.current;
      const rail = railRef.current;
      const belt = beltRef.current;
      if (!section || !rail || !belt || sourceImages.length === 0) return;

      const mm = gsap.matchMedia();
      const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-hero-card]"));
      const setBeltX = gsap.quickTo(belt, "x", { duration: 0.7, ease: "power2.out" });

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, tablet, reduceMotion } = context.conditions as Record<string, boolean>;
          const useBowed3D = !!(desktop || tablet);

          gsap.set(cards, { clearProps: "all" });

          let loopTween: gsap.core.Tween | null = null;
          const gap = desktop ? TRACK_GAP_DESKTOP : tablet ? TRACK_GAP_TABLET : TRACK_GAP_MOBILE;
          rail.style.gap = `${gap}px`;
          rail.style.width = "max-content";
          rail.style.display = "flex";
          rail.style.alignItems = "center";

          const applyCardSizing = () => {
            const beltWidth = belt.clientWidth || 1200;
            if (desktop || tablet) {
              // Keep 5 cards in frame, but larger and more dominant.
              const desired = (beltWidth - Math.max(0, gap) * 4) / 5;
              const w = clamp(desired, tablet ? 280 : 330, tablet ? 360 : 460);
              const h = Math.round(w * 0.62);
              cards.forEach((card) => {
                card.style.width = `${w}px`;
                card.style.height = `${h}px`;
              });
            } else {
              cards.forEach((card) => {
                card.style.width = "228px";
                card.style.height = "146px";
              });
            }
          };

          const applyBowByViewportZones = () => {
            const beltRect = belt.getBoundingClientRect();
            const centerX = beltRect.left + beltRect.width / 2;
            const half = beltRect.width / 2;

            cards.forEach((card) => {
              const rect = card.getBoundingClientRect();
              const cardCenter = rect.left + rect.width / 2;
              const raw = (cardCenter - centerX) / half;
              const t = clamp(raw, -1.18, 1.18);
              const abs = Math.abs(t);
              // Smoothstep keeps interpolation fluid and avoids center "popping"
              const eased = abs * abs * (3 - 2 * abs);

              // Center sits slightly deeper (negative Z), not protruding.
              const rotateY = -t * 32;
              const scale = 0.93 - eased * 0.21; // center ~0.93, outer ~0.72
              const y = eased * 20;
              const z = -20 - eased * 100; // center -20, outer -120
              const opacity = 0.94 - eased * 0.82;

              gsap.set(card, {
                rotationY: rotateY,
                scale,
                y,
                z,
                opacity: clamp(opacity, 0.08, 1),
                filter: `blur(${(eased * 0.9).toFixed(2)}px)`,
                transformOrigin: "center center",
              });
            });
          };

          applyCardSizing();

          if (!reduceMotion) {
            const duration = desktop ? BELT_SPEED_DESKTOP : tablet ? BELT_SPEED_TABLET : BELT_SPEED_MOBILE;
            const halfWidth = rail.scrollWidth / 2;
            loopTween = gsap.fromTo(
              rail,
              { x: 0 },
              {
                x: -halfWidth,
                duration,
                repeat: -1,
                ease: "none",
                modifiers: {
                  x: (value) => {
                    const x = parseFloat(value);
                    const wrapped = ((x % -halfWidth) + -halfWidth) % -halfWidth;
                    return `${wrapped}px`;
                  },
                },
              },
            );
          } else {
            gsap.set(rail, { x: 0 });
          }

          if (useBowed3D) {
            gsap.set(rail, { transformStyle: "preserve-3d" });
            gsap.ticker.add(applyBowByViewportZones);
            applyBowByViewportZones();
          } else {
            gsap.set(cards, { rotationY: 0, scale: 1, y: 0, z: 0, opacity: 1, filter: "none" });
          }

          const onEnter = () => {
            loopTween?.timeScale(0.58);
          };
          const onLeave = () => {
            loopTween?.timeScale(1);
            setBeltX(0);
          };
          const onMove = (event: PointerEvent) => {
            if (!desktop) return;
            const rect = section.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            setBeltX(px * 12);
          };

          belt.addEventListener("pointerenter", onEnter);
          belt.addEventListener("pointerleave", onLeave);
          belt.addEventListener("pointermove", onMove);
          window.addEventListener("resize", applyCardSizing);

          return () => {
            gsap.ticker.remove(applyBowByViewportZones);
            belt.removeEventListener("pointerenter", onEnter);
            belt.removeEventListener("pointerleave", onLeave);
            belt.removeEventListener("pointermove", onMove);
            window.removeEventListener("resize", applyCardSizing);
            loopTween?.kill();
            loopTween = null;
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-surface-container-lowest pb-10 pt-24 md:min-h-[95vh] md:pb-12 md:pt-28 lg:min-h-[102vh] lg:pb-14 lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[8%] z-0 mx-auto h-[420px] max-w-[1200px] rounded-full bg-[radial-gradient(circle_at_center,rgba(252,180,118,0.18)_0%,rgba(255,255,255,0.92)_58%,rgba(255,255,255,0)_100%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.11]"
        style={{
          backgroundImage:
            "linear-gradient(90deg,rgba(23,23,23,0.04)_1px,transparent_1px),linear-gradient(rgba(23,23,23,0.03)_1px,transparent_1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-content-max flex-col items-center px-gutter-sm text-center md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.24em] text-primary">Our Success Stories</p>
        <h1 className="mt-4 max-w-4xl font-headline text-[clamp(2.1rem,6vw,5rem)] font-black leading-[0.95] tracking-tight text-on-surface">
          Stories That Built
          <span className="block">Real Brand Momentum</span>
        </h1>
        <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
          Strategic executions across branding, technology, and growth systems designed to create long-term market
          advantage.
        </p>
        <a
          href={firstStoryHref}
          className="mt-8 inline-flex items-center justify-center rounded-full border border-primary/25 bg-primary px-6 py-3 font-label text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/92"
        >
          Explore Latest Story
        </a>
      </div>

      <div
        ref={beltRef}
        className="relative z-10 mx-auto mt-8 w-full max-w-[1750px] overflow-hidden px-2 pb-8 pt-5 [perspective:2200px] md:mt-9 md:px-4 lg:mt-10"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[8%] bottom-3 h-20 rounded-full bg-black/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[44%] h-28 w-[58%] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl"
        />

        {/* Soft edge fades so the belt feels like it disappears into space */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[clamp(28px,10%,150px)] bg-[linear-gradient(to_right,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[clamp(28px,10%,150px)] bg-[linear-gradient(to_left,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]"
        />

        <div ref={railRef} className="relative z-10 will-change-transform [transform-style:preserve-3d] py-5 md:py-7">
          {loopImages.map((image, index) => (
            <article
              key={`${image.key}-${index}`}
              data-hero-card
              className="group relative shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_16px_42px_-26px_rgba(0,0,0,0.33)] will-change-transform"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 210px, (max-width: 1023px) 280px, 420px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-black/0 to-transparent" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

