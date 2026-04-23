"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BRAND_CHAOS_MEDIA, BRAND_STRUCTURE_MEDIA } from "@/lib/solutions/visualAssets";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function BrandPhilosophySection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const chaos = root.querySelector<HTMLElement>("[data-chaos-layer]");
      const grid = root.querySelector<HTMLElement>("[data-grid-layer]");
      if (!chaos || !grid) return;

      gsap.fromTo(
        chaos,
        { opacity: 1, filter: "blur(0px)", scale: 1 },
        {
          opacity: 0.1,
          filter: "blur(9px)",
          scale: 1.04,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 70%", end: "top 26%", scrub: 1.15, invalidateOnRefresh: true },
        }
      );

      gsap.fromTo(
        grid,
        { opacity: 0.2, y: 28 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 66%", end: "top 22%", scrub: 1.1, invalidateOnRefresh: true },
        }
      );
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const layer = mediaRef.current;
      if (!root || !layer || prefersReducedMotion()) return;
      gsap.fromTo(
        layer,
        { yPercent: 4 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-y border-inverse-surface/10 bg-surface-container-low py-section-y-sm md:py-section-y"
    >
      <div className="relative z-10 mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Brand philosophy</p>
        <h2 className="mt-3 max-w-4xl font-headline text-[clamp(2rem,4.6vw,3.5rem)] font-black uppercase leading-[1.02] tracking-tight text-on-background">
          Most brands shout. Few are heard.
        </h2>
        <div className="mt-8 max-w-3xl space-y-4 font-body text-body-lg leading-relaxed text-on-surface-variant md:text-xl">
          <p>The problem isn&apos;t visibility. It&apos;s memorability.</p>
          <p>
            We build structured brand ecosystems where every message, visual, and interaction reinforces who you are —
            so recall compounds instead of decaying.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-14 aspect-[16/11] w-full max-w-content-max px-gutter-sm md:mt-20 md:px-gutter">
        <div
          ref={mediaRef}
          className="pointer-events-none absolute -inset-x-4 -inset-y-6 hidden opacity-40 will-change-transform md:block"
          aria-hidden
        >
          <Image
            src={BRAND_STRUCTURE_MEDIA.src}
            alt=""
            fill
            className="object-cover blur-2xl"
            sizes="(max-width:768px) 0px, 1200px"
          />
        </div>

        <div
          data-chaos-layer
          className="absolute inset-0 overflow-hidden rounded-[2rem] border border-inverse-surface/10 bg-surface-bright/70 shadow-inner backdrop-blur-sm"
        >
          <Image
            src={BRAND_CHAOS_MEDIA.src}
            alt={BRAND_CHAOS_MEDIA.alt}
            fill
            sizes="(max-width:768px) 100vw, 1200px"
            className="object-cover opacity-35 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-surface/55" />
          <div className="absolute left-[8%] top-[14%] h-16 w-24 rotate-[-8deg] rounded-xl border border-inverse-surface/15 bg-primary/10" />
          <div className="absolute left-[32%] top-[22%] h-12 w-40 rotate-[6deg] rounded-lg border border-inverse-surface/15 bg-tertiary-container/15" />
          <div className="absolute bottom-[18%] left-[18%] h-20 w-28 rotate-[10deg] rounded-2xl border border-inverse-surface/15 bg-surface-container-high/90" />
          <div className="absolute right-[12%] top-[30%] h-14 w-36 rotate-[-14deg] rounded-xl border border-inverse-surface/15 bg-surface-variant/90" />
          <div className="absolute bottom-[16%] right-[22%] h-24 w-20 rotate-[18deg] rounded-2xl border border-inverse-surface/15 bg-primary/12" />
          <p className="absolute left-1/2 top-1/2 w-[min(92%,520px)] -translate-x-1/2 -translate-y-1/2 text-center font-headline text-sm font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            Chaotic touchpoints
          </p>
        </div>

        <div
          data-grid-layer
          className="absolute inset-0 overflow-hidden rounded-[2rem] border border-inverse-surface/10 bg-surface-container-highest/85 shadow-[0_30px_90px_-50px_rgba(17,24,39,0.35)] backdrop-blur-md"
        >
          <Image
            src={BRAND_STRUCTURE_MEDIA.src}
            alt={BRAND_STRUCTURE_MEDIA.alt}
            fill
            sizes="(max-width:768px) 100vw, 1200px"
            className="object-cover opacity-25"
          />
          <div
            aria-hidden
            className="absolute inset-6 rounded-2xl opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(17,24,39,0.08) 1px, transparent 1px),linear-gradient(rgba(17,24,39,0.07) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="max-w-xl rounded-2xl border border-inverse-surface/10 bg-surface-bright/90 p-6 text-center shadow-sm backdrop-blur-sm">
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-primary">Structured system</p>
              <p className="mt-3 font-headline text-lg font-bold uppercase tracking-tight text-on-background md:text-xl">
                One narrative spine. Many surfaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
