"use client";

import "@/lib/motion/config";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "GSAP",
  "Vercel",
  "AWS",
  "Figma",
];

export default function TechCapabilitiesGrid() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const chips = root.querySelectorAll<HTMLElement>("[data-tech-chip]");
      gsap.fromTo(
        chips,
        { y: 18, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.035,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 86%",
            end: "top 52%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  return (
    <section className="relative overflow-hidden border-y border-inverse-surface/10 bg-surface-container-low py-section-y-sm md:py-section-y">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(17,24,39,0.05) 1px, transparent 1px),linear-gradient(rgba(17,24,39,0.04) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div ref={rootRef} className="relative z-10 mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Capabilities</p>
        <h2 className="mt-3 max-w-3xl font-headline text-[clamp(2rem,4vw,3.1rem)] font-black uppercase leading-tight tracking-tight text-on-background">
          Built with modern technology.
        </h2>
        <p className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant">
          We leverage proven frameworks and tooling so performance, DX, and reliability stay first-class as you scale.
        </p>

        <div className="mt-12 flex flex-wrap gap-3 md:gap-4">
          {STACK.map((label) => (
            <span
              key={label}
              data-tech-chip
              className="inline-flex items-center rounded-full border border-inverse-surface/10 bg-surface-bright px-5 py-2.5 font-headline text-xs font-bold uppercase tracking-wide text-on-background shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-md"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
