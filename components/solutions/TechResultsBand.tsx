"use client";

import "@/lib/motion/config";
import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const POINTS = [
  "Faster load times with disciplined performance budgets",
  "Higher conversions through clarity, speed, and trust",
  "Scalable architecture that won’t fight your roadmap",
  "Seamless user experiences across devices and channels",
];

export default function TechResultsBand() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const rows = root.querySelectorAll<HTMLElement>("[data-result-row]");
      gsap.fromTo(
        rows,
        { x: -18, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 84%",
            end: "top 48%",
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-surface py-section-y-sm md:py-section-y">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 top-0 hidden w-[min(42%,420px)] opacity-40 md:block"
      >
        <Image
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          alt=""
          fill
          className="object-cover blur-2xl"
          sizes="420px"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <h2 className="max-w-3xl font-headline text-[clamp(2rem,4vw,3.1rem)] font-black uppercase leading-tight tracking-tight text-on-background">
          Built to deliver impact.
        </h2>
        <ul className="mt-10 max-w-3xl space-y-4">
          {POINTS.map((p) => (
            <li
              key={p}
              data-result-row
              className="flex gap-4 rounded-r-xl border-l-2 border-primary/70 bg-surface-bright/40 py-2 pl-6 pr-4 font-body text-body-lg leading-relaxed text-on-surface-variant shadow-sm backdrop-blur-[2px] transition-colors hover:bg-surface-bright/70"
            >
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
