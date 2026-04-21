"use client";

import { useMemo, useRef } from "react";
import SplineScene from "./SplineScene";
import { getSplineHeroSceneUrl } from "@/lib/spline-scene";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const HERO_TEXT = "CAPTURING\nVOICE IN THE\nNOISE.";

export default function HeroSection() {
  const sceneUrl = getSplineHeroSceneUrl();
  const heroRef = useRef<HTMLElement | null>(null);

  const heroLetters = useMemo(() => {
    return HERO_TEXT.split("").map((char, idx) => {
      if (char === "\n") {
        return <br key={`br-${idx}`} />;
      }

      if (char === " ") {
        return (
          <span key={`space-${idx}`} className="hero-letter inline-block">
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
          className={`hero-letter inline-block ${isVoice ? "text-primary-fixed" : ""}`}
        >
          {char}
        </span>
      );
    });
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        '[data-anim="hero-bheard"]',
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, ease: "power3.out", duration: 0.9 }
      ).fromTo(
        ".hero-letter",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.04,
          duration: 0.9,
        }
      )
        .fromTo(
          '[data-anim="hero-subtext"]',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.7 },
          "+=0.3"
        )
        .fromTo(
          '[data-anim="hero-cta"]',
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.7 },
          "+=0.2"
        );

      gsap.to('[data-anim="hero-shape"]', {
        y: 20,
        scale: 1.05,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
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
          style={{ zIndex: 3 }}
          className="font-headline text-[clamp(4rem,18vw,20rem)] uppercase leading-[0.9] font-black text-neutral-200 absolute left-0 -bottom-10 pointer-events-none select-none"
        >
          BHEARD
        </h2>
      </div>
      <div className="pointer-events-auto absolute inset-0 z-[2] min-h-full w-full">
        <SplineScene sceneUrl={sceneUrl} />
      </div>
      {/* In-flow grid + original section padding = same vertical position as before; pointer-events-none passes input to Spline */}
      <div className="relative z-[4] mx-auto grid w-full max-w-7xl grid-cols-1 items-end gap-12 pointer-events-none md:grid-cols-12">
        <div className="md:col-span-10">
          <span className="mb-8 inline-block bg-surface-container-high px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            The Future of Attention
          </span>
          <h1 className="font-headline kinetic-text mb-12 text-[clamp(3.5rem,12vw,10rem)] font-black text-neutral-900">
            {heroLetters}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p
            data-anim="hero-subtext"
            className="mb-8 font-body text-lg leading-relaxed text-on-surface-variant md:text-xl"
          >
            We help businesses get more customers through smart marketing,
            better branding, and high-performing ads.
          </p>
          <div
            data-anim="hero-cta"
            className="pointer-events-auto flex cursor-pointer items-center gap-4 group"
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
