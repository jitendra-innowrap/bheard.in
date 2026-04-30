"use client";

import "@/lib/motion/config";
import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function NotFound() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        '[data-anim="nf-num"]',
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 }
      )
        .fromTo(
          '[data-anim="nf-title"]',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          '[data-anim="nf-body"]',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          '[data-anim="nf-cta"]',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        );

      gsap.to('[data-anim="nf-shape"]', {
        y: 14,
        scale: 1.03,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-surface px-8 py-20"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-container-low to-surface-container-lowest" />

      <div
        data-anim="nf-shape"
        className="pointer-events-none absolute right-[10%] top-[18%] h-[min(40vw,400px)] w-[min(40vw,400px)] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        data-anim="nf-shape"
        className="pointer-events-none absolute left-[8%] bottom-[14%] h-[min(32vw,320px)] w-[min(32vw,320px)] rounded-full bg-tertiary/10 blur-[100px]"
      />

      <div className="relative z-10 text-center">
        <p
          data-anim="nf-num"
          className="font-headline text-[clamp(6rem,20vw,16rem)] font-black leading-none tracking-tighter text-primary/15"
        >
          404
        </p>
        <h1
          data-anim="nf-title"
          className="-mt-6 font-headline text-[clamp(1.75rem,5vw,3.5rem)] font-black uppercase tracking-tight text-on-surface md:-mt-10"
        >
          Page not found
        </h1>
        <p
          data-anim="nf-body"
          className="mx-auto mt-5 max-w-md font-body text-base leading-relaxed text-on-surface-variant md:text-lg"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          data-anim="nf-cta"
          className="mt-10 inline-flex items-center gap-3 rounded-lg bg-primary px-8 py-4 font-headline text-sm font-bold uppercase tracking-widest text-on-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}
