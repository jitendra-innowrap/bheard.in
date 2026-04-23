"use client";

import "@/lib/motion/config";
import { useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const HERO_TEXT = "CAPTURING\nVOICE IN THE\nNOISE.";

export default function HeroSection() {
  const heroRef = useRef<HTMLElement | null>(null);

  const heroLetters = useMemo(() => {
    return HERO_TEXT.split("").map((char, idx) => {
      if (char === "\n") {
        return <br key={`br-${idx}`} />;
      }

      if (char === " ") {
        return (
          <span
            key={`space-${idx}`}
            className="hero-letter inline-block translate-y-[60px] opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          >
            &nbsp;
          </span>
        );
      }

      const isVoice =
        idx >= HERO_TEXT.indexOf("VOICE") &&
        idx < HERO_TEXT.indexOf("VOICE") + "VOICE".length;

      return (
        <span
          key={`char-${idx}`}
          className={`hero-letter inline-block translate-y-[60px] opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 ${isVoice ? "text-primary-fixed" : ""}`}
        >
          {char}
        </span>
      );
    });
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.set('[data-anim="hero-eyebrow"]', { opacity: 0, y: 28 });
      gsap.set('[data-anim="hero-bheard"]', { opacity: 0, y: 80 });
      gsap.set(".hero-letter", { opacity: 0, y: 60 });
      gsap.set('[data-anim="hero-subtext"]', { opacity: 0, y: 40 });
      gsap.set('[data-anim="hero-cta"]', { opacity: 0, y: 60 });

      const tl = gsap.timeline({ defaults: { force3D: true } });

      tl.fromTo(
        '[data-anim="hero-eyebrow"]',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, ease: "power3.out", duration: 0.45 }
      )
        .fromTo(
          '[data-anim="hero-bheard"]',
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, ease: "expo.out", duration: 0.9 },
          "<0.08"
        )
        .fromTo(
          ".hero-letter",
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            stagger: 0.032,
            duration: 0.72,
          },
          "<0.12"
        )
        .fromTo(
          '[data-anim="hero-subtext"]',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.55 },
          "+=0.18"
        )
        .fromTo(
          '[data-anim="hero-cta"]',
          { y: 56, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.55 },
          "+=0.12"
        );

      gsap.to('[data-anim="hero-shape"]', {
        y: 18,
        scale: 1.02,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "power2.out",
      });

      gsap.to('[data-anim="hero-orb"]', {
        x: 120,
        y: -80,
        scale: 1.03,
        duration: 7.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.out",
      });

      gsap.to('[data-anim="hero-orb-inner"]', {
        x: -60,
        y: 50,
        scale: 1.04,
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: "power2.out",
      });
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-screen items-end overflow-hidden px-8 pb-24 pt-32 md:pb-40"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-container-low to-surface-container-lowest" />
      <div
        data-anim="hero-shape"
        className="pointer-events-none absolute top-1/4 right-0 z-0 h-2/3 w-2/3 rounded-full bg-primary/10 blur-[160px]"
      />
      <div className="flex w-screen h-screen top-0 left-0  absolute">
        <h2
          data-anim="hero-bheard"
          style={{ zIndex: 3 }}
          className="pointer-events-none absolute -bottom-10 left-0 translate-y-20 font-headline text-[clamp(4rem,18vw,20rem)] font-black uppercase leading-[0.9] text-neutral-200 opacity-0 select-none motion-reduce:translate-y-0 motion-reduce:opacity-100"
        >
          BHEARD
        </h2>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[2] min-h-full w-full overflow-hidden">
        <div
          data-anim="hero-orb"
          className="absolute right-[12%] top-[22%] h-[min(38vw,460px)] w-[min(38vw,460px)] rounded-full bg-primary/20 blur-[80px] will-change-transform"
        />
        <div
          data-anim="hero-orb-inner"
          className="absolute right-[18%] top-[28%] h-[min(22vw,280px)] w-[min(22vw,280px)] rounded-full bg-primary-fixed/25 blur-[50px] will-change-transform"
        />
      </div>
      {/* In-flow grid + original section padding = same vertical position as before; pointer-events-none passes input to Spline */}
      <div className="relative z-[4] mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-12 pointer-events-none md:grid-cols-12">
        <div className="md:col-span-10">
          <span
            data-anim="hero-eyebrow"
            className="mb-8 inline-block translate-y-7 bg-surface-container-high px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
          >
            The Future of Attention
          </span>
          <h1 className="font-headline kinetic-text mb-12 text-[clamp(3.5rem,12vw,10rem)] font-black text-neutral-900">
            {heroLetters}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p
            data-anim="hero-subtext"
            className="mb-8 translate-y-10 font-body text-lg leading-relaxed text-on-surface-variant opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 md:text-xl"
          >
            We help businesses get more customers through smart marketing,
            better branding, and high-performing ads.
          </p>
          <div
            data-anim="hero-cta"
            className="pointer-events-auto flex translate-y-[60px] cursor-pointer items-center gap-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant transition-all group-hover:border-primary group-hover:bg-primary">
              <span className="material-symbols-outlined text-neutral-900">
                arrow_downward
              </span>
            </div>
            <span className="font-headline font-bold uppercase tracking-tighter text-neutral-900">
              Discover our kinetic engine
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
