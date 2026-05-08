"use client";

import "@/lib/motion/config";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ContactPopupModal from "@/components/ContactPopupModal";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP);

function lineToLetters(line: string, prefix: string) {
  return line.split("").map((char, i) => (
    <span key={`${prefix}-${i}`} data-cta-letter className="inline-block">
      {char === " " ? "\u00a0" : char}
    </span>
  ));
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        return;
      }

      const wrap = titleRef.current;
      if (!wrap) {
        return;
      }

      const letters = wrap.querySelectorAll<HTMLElement>("[data-cta-letter]");
      if (!letters.length) {
        return;
      }

      const onMove = (e: PointerEvent) => {
        const rect = wrap.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (e.clientY - cy) / (rect.height / 2);

        letters.forEach((letter, i) => {
          const phase = (i / letters.length - 0.5) * 0.45;
          gsap.to(letter, {
            x: nx * 7 + phase * 4,
            y: ny * 6,
            rotation: nx * 3.5,
            duration: 0.38,
            ease: "elastic.out(1, 0.55)",
            overwrite: "auto",
          });
        });
      };

      const onLeave = () => {
        gsap.to(letters, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.42,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", onLeave);
      wrap.addEventListener("pointercancel", onLeave);

      return () => {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
        wrap.removeEventListener("pointercancel", onLeave);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-motion-exclude
      className="bg-primary-container px-8 py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl text-center">
        <h3
          ref={titleRef}
          className="mb-12 inline-block cursor-default font-headline text-[clamp(2.5rem,8vw,8rem)] font-black uppercase leading-[0.95] tracking-tighter text-on-primary-container"
        >
          <span className="block">{lineToLetters("READY TO BE-", "l1")}</span>
          <span className="block">{lineToLetters("HEARD?", "l2")}</span>
        </h3>
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg bg-surface px-12 py-6 font-headline text-xl font-black uppercase tracking-widest text-on-surface shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-surface-container-highest hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] active:translate-y-0"
          >
            Let&apos;s Talk
          </button>
          <p className="max-w-sm text-left font-body text-base font-semibold leading-relaxed text-on-primary-container md:text-lg">
            We work with a limited number of clients to ensure focused strategy
            and high-quality execution. Book a call to explore how we can build
            your brand and digital presence.
          </p>
        </div>
      </div>
      <ContactPopupModal
        open={open}
        onClose={() => setOpen(false)}
        sourcePage="/#cta"
        title="Let's talk"
        subtitle="We work with a focused number of clients each quarter. Share your brief - we'll respond within one business day."
      />
    </section>
  );
}
