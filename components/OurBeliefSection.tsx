"use client";

import { useMemo, useRef } from "react";
import "@/lib/motion/config";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionEyebrow } from "@/components/system/SectionTitle";
import { sectionPageX, sectionStackBottom } from "@/components/system/sectionTheme";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const beliefText =
  "Every brand has a voice worth hearing. Most never get the chance to use it. We exist to change that - one brand at a time.";

export default function OurBeliefSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const beliefChars = useMemo(() => {
    return beliefText.split("").map((char, idx) => {
      if (char === " ") {
        return (
          <span key={`sp-${idx}`} data-belief-char className="inline-block">
            &nbsp;
          </span>
        );
      }
      return (
        <span key={`c-${idx}`} data-belief-char className="inline-block">
          {char}
        </span>
      );
    });
  }, []);

  useGSAP(
    () => {
      const root = sectionRef.current;
      const chars = root?.querySelectorAll<HTMLElement>("[data-belief-char]");
      if (!root || !chars?.length) {
        return;
      }

      if (prefersReducedMotion()) {
        gsap.set(chars, { opacity: 1, y: 0, clearProps: "all" });
        return;
      }

      gsap.set(chars, { opacity: 0.05, y: 32, willChange: "transform" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
        },
      });

      tl.to(chars, {
        opacity: 1,
        y: 0,
        stagger: 0.008,
        ease: "none",
        duration: 0.78,
      });

    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-motion-pinned
      className={`flex min-h-[100dvh] flex-col justify-center bg-surface ${sectionPageX} py-16 md:py-20 ${sectionStackBottom}`}
    >
      <div className="mx-auto max-w-5xl py-4 md:py-6">
        <SectionEyebrow reveal>Our belief</SectionEyebrow>
        <p className="font-headline text-2xl font-black uppercase leading-tight tracking-tight text-neutral-900 md:text-4xl">
          {beliefChars}
        </p>
      </div>
    </section>
  );
}
