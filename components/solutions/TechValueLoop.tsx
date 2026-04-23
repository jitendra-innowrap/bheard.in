"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function TechValueLoop() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const nodes = root.querySelectorAll<HTMLElement>("[data-loop-node]");
      gsap.fromTo(
        nodes,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 84%",
            end: "top 52%",
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
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[min(520px,70vh)] w-[min(520px,45vw)] -translate-y-1/2 opacity-30 md:block"
      >
        <Image
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80"
          alt=""
          fill
          className="object-cover blur-3xl"
          sizes="520px"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Beyond just development</p>
        <h2 className="mt-3 max-w-3xl font-headline text-[clamp(2rem,4.2vw,3.2rem)] font-black uppercase leading-tight tracking-tight text-on-background">
          We don&apos;t just build. We engineer growth.
        </h2>
        <p className="mt-5 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant md:text-lg">
          Every product is designed with scalability, performance, and user behavior at its core — so the system keeps
          compounding after launch.
        </p>

        <div className="relative mt-14">
          <svg
            className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-24 -translate-y-1/2 text-primary/35 md:block"
            viewBox="0 0 900 40"
            fill="none"
            aria-hidden
          >
            <path
              d="M40 20 H860"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeDasharray="6 10"
            />
            <path d="M300 20 L320 8 L340 20 L320 32 Z" fill="currentColor" opacity="0.35" />
            <path d="M560 20 L580 8 L600 20 L580 32 Z" fill="currentColor" opacity="0.35" />
          </svg>

          <div className="relative flex flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-center md:gap-6">
            <div
              data-loop-node
              className="rounded-2xl border border-inverse-surface/10 bg-surface-container-lowest px-7 py-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 md:min-w-[200px]"
            >
              <p className="font-headline text-sm font-bold uppercase tracking-wide text-on-background">User</p>
              <p className="mt-2 font-body text-xs text-on-surface-variant">Intent & behavior</p>
            </div>
            <span
              data-loop-node
              className="hidden text-center font-headline text-xs font-black uppercase tracking-[0.35em] text-primary md:block"
              aria-hidden
            >
              →
            </span>
            <div
              data-loop-node
              className="rounded-2xl border border-inverse-surface/10 bg-surface-container-lowest px-7 py-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 md:min-w-[220px]"
            >
              <p className="font-headline text-sm font-bold uppercase tracking-wide text-on-background">Product</p>
              <p className="mt-2 font-body text-xs text-on-surface-variant">Experience + platform</p>
            </div>
            <span
              data-loop-node
              className="hidden text-center font-headline text-xs font-black uppercase tracking-[0.35em] text-primary md:block"
              aria-hidden
            >
              →
            </span>
            <div
              data-loop-node
              className="rounded-2xl border border-inverse-surface/10 bg-surface-bright px-7 py-6 text-center shadow-[0_22px_70px_-48px_rgba(17,24,39,0.28)] transition-transform duration-300 hover:-translate-y-1 md:min-w-[200px]"
            >
              <p className="font-headline text-sm font-bold uppercase tracking-wide text-on-background">Growth</p>
              <p className="mt-2 font-body text-xs text-on-surface-variant">Measurable outcomes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
