"use client";

import "@/lib/motion/config";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type InnerPageHeroProps = {
  watermark: string;
  heading: string;
  subtext?: string;
  theme?: "light" | "dark";
};

export default function InnerPageHero({ watermark, heading, subtext, theme = "light" }: InnerPageHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const watermarkRef = useRef<HTMLSpanElement | null>(null);
  const words = heading.trim().split(/\s+/);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        return;
      }
      const wm = watermarkRef.current;
      const h = headingRef.current;
      if (wm) {
        gsap.to(wm, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: wm,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
      if (h?.children?.length) {
        gsap.fromTo(
          h.children,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: h, start: "top 88%", once: true },
          }
        );
      }
    },
    { scope: sectionRef, dependencies: [heading], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      className={`${theme === "dark" ? "bg-surface-dim text-inverse-on-surface" : "bg-surface text-on-background"} relative overflow-hidden py-section-y-sm md:py-section-y`}
    >
      <div className="relative mx-auto w-full max-w-content-max px-gutter-sm md:px-gutter">
        <span
          ref={watermarkRef}
          className="pointer-events-none absolute left-4 top-0 font-headline text-display-xl font-extrabold uppercase text-on-background/5 md:left-8"
        >
          {watermark}
        </span>
        <h1
          ref={headingRef}
          className="relative z-10 max-w-4xl font-headline text-display-lg font-extrabold uppercase leading-[1]"
        >
          {words.map((word, i) => (
            <span key={`${i}-${word}`} className="mr-[0.25em] inline-block">
              {word}
            </span>
          ))}
        </h1>
        {subtext ? (
          <p className="relative z-10 mt-4 max-w-2xl font-body text-body-lg text-on-surface-variant">{subtext}</p>
        ) : null}
      </div>
    </section>
  );
}
