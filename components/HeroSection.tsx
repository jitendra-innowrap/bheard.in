"use client";

import "@/lib/motion/config";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

const HERO_STATS = [
  { value: "10+", label: "Years of Experience" },
  { value: "50+", label: "Brands Partnered With" },
  { value: "200+", label: "Campaigns & Digital Launches" },
] as const;

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
      gsap.set('[data-anim="hero-stat"]', { opacity: 0, y: 32 });

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
        )
        .fromTo(
          '[data-anim="hero-stat"]',
          { y: 32, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.5, stagger: 0.08 },
          "+=0.08"
        );

      gsap.to('[data-anim="hero-shape"]', {
        y: 18,
        scale: 1.02,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "power2.out",
      });

      const section = heroRef.current;
      if (!section) return;

      const orb = section.querySelector<HTMLElement>('[data-anim="hero-orb"]');
      const orbInner = section.querySelector<HTMLElement>('[data-anim="hero-orb-inner"]');
      if (!orb || !orbInner) return;

      // Fixed slow speed: always smooth and calm, regardless of target element layering.
      const orbXTo = gsap.quickTo(orb, "x", { duration: 0.7, ease: "power2.out" });
      const orbYTo = gsap.quickTo(orb, "y", { duration: 0.7, ease: "power2.out" });
      const innerXTo = gsap.quickTo(orbInner, "x", { duration: 0.75, ease: "power2.out" });
      const innerYTo = gsap.quickTo(orbInner, "y", { duration: 0.75, ease: "power2.out" });

      const onPointerMove = (e: PointerEvent) => {
        const rect = section.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        orbXTo(nx * 120);
        orbYTo(ny * 86);
        innerXTo(nx * 64);
        innerYTo(ny * 46);
      };

      const onLeave = () => {
        orbXTo(0);
        orbYTo(0);
        innerXTo(0);
        innerYTo(0);
      };

      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointercancel", onLeave);

      return () => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointercancel", onLeave);
      };
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-screen items-end overflow-hidden px-8 pb-24 pt-12 md:pb-40"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-surface-container-low to-surface-container-lowest" />
      <div
        data-anim="hero-shape"
        className="pointer-events-none absolute top-1/4 right-0 z-0 h-2/3 w-2/3 rounded-full bg-primary/10 blur-[160px]"
      />
      <div className="flex w-screen h-[calc(100vh-100px)] top-0 left-0  absolute">
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
            Integrated Branding &amp; Tech Agency &nbsp;·&nbsp; Mumbai, India
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
            One agency. Brand strategy and technology under one roof. 
          </p>
          <div
            data-anim="hero-cta"
            className="pointer-events-auto flex translate-y-[60px] flex-col items-start gap-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:flex-row sm:items-center"
          >
            <Link
              href="#work"
              className="group inline-flex items-center gap-3 rounded-full bg-neutral-900 px-6 py-3.5 font-headline text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-primary hover:text-on-primary"
            >
              <span>See Our Work</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#services"
              className="group inline-flex items-center gap-2 font-headline text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors duration-300 hover:text-primary"
            >
              <span className="border-b border-neutral-900/40 pb-0.5 transition-colors duration-300 group-hover:border-primary">
                Explore What We Do
              </span>
            </Link>
          </div>
        </div>
        <div className="md:col-span-12">
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-outline-variant/60 bg-outline-variant/40 sm:grid-cols-3">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                data-anim="hero-stat"
                className="flex flex-col gap-1 bg-surface px-6 py-5 opacity-0 motion-reduce:opacity-100"
              >
                <p className="font-headline text-3xl font-black text-neutral-900 md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
