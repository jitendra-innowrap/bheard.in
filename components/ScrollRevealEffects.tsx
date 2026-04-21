"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ScrollRevealEffects() {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        return;
      }

      const targets = gsap.utils.toArray<HTMLElement>(
        '[data-g-step="true"], section h1, section h2, section h3, section h4, section p'
      );

      targets.forEach((target) => {
        gsap.fromTo(
          target,
          { y: 22, opacity: 0.01 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: target,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    },
    { scope: scopeRef }
  );

  return <div ref={scopeRef} aria-hidden className="hidden" />;
}
