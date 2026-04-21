"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const beliefText =
  "Every brand has a voice worth hearing. Most never get the chance to use it. We exist to change that - one brand at a time.";

export default function OurBeliefSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        '[data-belief-word="true"]',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.03,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-surface px-8 py-20 md:py-24">
      <div className="mx-auto max-w-5xl border-y border-outline-variant/50 py-8 md:py-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Our Belief
        </p>
        <p className="font-headline text-2xl font-black uppercase leading-tight tracking-tight text-neutral-900 md:text-4xl">
          {beliefText.split(" ").map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              data-belief-word="true"
              className="mr-[0.35em] inline-block"
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
