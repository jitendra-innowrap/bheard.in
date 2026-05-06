"use client";

import "@/lib/motion/config";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type KineticHeroCta = { href: string; label: string };

export type KineticHeroMedia = { src: string; alt: string };

export type KineticSolutionsHeroProps = {
  eyebrow: string;
  line1: string;
  /** Optional second line (accent). Omit for a single-line headline. */
  line2?: string;
  subtext: string;
  primaryCta: KineticHeroCta;
  secondaryCta: KineticHeroCta;
  /** Rotating keyword chips (subtle crossfade) */
  morphWords?: string[];
  variant?: "brand" | "tech";
  /** Optional editorial / product photography behind content */
  media?: KineticHeroMedia;
};

function splitWords(text: string, prefix: string) {
  return text.trim().split(/\s+/).map((word, i) => (
    <span key={`${prefix}-${i}`} data-hero-word className="mr-[0.22em] inline-block will-change-transform">
      {word}
    </span>
  ));
}

export default function KineticSolutionsHero({
  eyebrow,
  line1,
  line2,
  subtext,
  primaryCta,
  secondaryCta,
  morphWords = ["Story", "Recall", "Trust"],
  variant = "brand",
  media,
}: KineticSolutionsHeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const morphRef = useRef<HTMLDivElement | null>(null);
  const morphParallaxRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const words = root.querySelectorAll<HTMLElement>("[data-hero-word]");
      const sub = root.querySelector<HTMLElement>("[data-hero-sub]");
      const ctas = root.querySelectorAll<HTMLElement>("[data-hero-cta]");
      const floaters = root.querySelectorAll<HTMLElement>("[data-hero-float]");

      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1, y: 0 });
        if (sub) gsap.set(sub, { opacity: 1, y: 0 });
        gsap.set(ctas, { opacity: 1, y: 0 });
        gsap.set(floaters, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(words, { y: 56, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.045, duration: 0.72 }, 0);
      if (sub) tl.fromTo(sub, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.18);
      tl.fromTo(ctas, { y: 22, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5 }, 0.28);
      tl.fromTo(floaters, { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.55 }, 0.22);

      gsap.fromTo(
        root,
        { minHeight: "min(92vh, 920px)" },
        {
          minHeight: "min(72vh, 720px)",
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 1.15,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  useGSAP(
    () => {
      const layer = mediaRef.current;
      const root = rootRef.current;
      if (!layer || !root || prefersReducedMotion()) return;
      gsap.fromTo(
        layer,
        { yPercent: 6 },
        {
          yPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: rootRef, dependencies: [media?.src], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      const host = morphRef.current;
      if (!host) return;
      const layers = gsap.utils.toArray<HTMLElement>("[data-morph-layer]", host);
      if (layers.length < 2) return;

      if (prefersReducedMotion()) {
        layers.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: 0 }));
        return;
      }

      gsap.set(layers, { autoAlpha: 0, y: 10 });
      gsap.set(layers[0], { autoAlpha: 1, y: 0 });

      let i = 0;
      const id = window.setInterval(() => {
        const next = (i + 1) % layers.length;
        const tl = gsap.timeline({ defaults: { duration: 0.55, ease: "power2.inOut" } });
        tl.to(layers[i], { autoAlpha: 0, y: -6 }, 0).to(layers[next], { autoAlpha: 1, y: 0 }, 0);
        i = next;
      }, 2800);

      return () => window.clearInterval(id);
    },
    { scope: morphRef, revertOnUpdate: true }
  );

  useGSAP(
    () => {
      const host = morphParallaxRef.current;
      if (!host || prefersReducedMotion()) return;

      const xTo = gsap.quickTo(host, "x", { duration: 0.35, ease: "power2.out" });
      const yTo = gsap.quickTo(host, "y", { duration: 0.35, ease: "power2.out" });

      const move = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        xTo(px * 14);
        yTo(py * 10);
      };
      const reset = () => {
        xTo(0);
        yTo(0);
      };
      host.addEventListener("pointermove", move);
      host.addEventListener("pointerleave", reset);
      return () => {
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerleave", reset);
      };
    },
    { scope: morphParallaxRef, revertOnUpdate: true }
  );

  const isTech = variant === "tech";

  return (
    <header
      ref={rootRef}
      className={`relative overflow-hidden bg-grain px-gutter-sm pb-16 pt-28 md:px-gutter md:pb-20 md:pt-32 ${
        isTech
          ? "bg-gradient-to-b from-surface-container-high via-surface to-surface"
          : "bg-gradient-to-b from-surface-container via-surface to-surface-container-low"
      }`}
    >
      {media ? (
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(46%,640px)] md:block"
          aria-hidden
        >
          <div ref={mediaRef} className="absolute -top-[8%] left-0 h-[118%] w-full will-change-transform">
            <Image
              src={media.src}
              alt={media.alt}
              fill
              priority
              sizes="(max-width: 768px) 0vw, 45vw"
              className="object-cover opacity-95"
            />
            <div
              className={`absolute inset-0 ${
                isTech
                  ? "bg-gradient-to-l from-surface via-surface/75 to-transparent"
                  : "bg-gradient-to-l from-surface via-surface/65 to-transparent"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/50 via-transparent to-surface/30" />
          </div>
        </div>
      ) : null}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: isTech
            ? "linear-gradient(90deg, rgba(17,24,39,0.05) 1px, transparent 1px),linear-gradient(rgba(17,24,39,0.04) 1px, transparent 1px)"
            : "radial-gradient(circle at 12% 18%, rgba(255,146,62,0.12), transparent 40%), radial-gradient(circle at 88% 8%, rgba(248,194,41,0.12), transparent 38%)",
          backgroundSize: isTech ? "32px 32px" : "auto",
        }}
      />

      {!isTech ? (
        <>
          <div
            data-hero-float
            aria-hidden
            className="pointer-events-none absolute right-[8%] top-[22%] h-24 w-24 rotate-12 rounded-3xl border border-inverse-surface/10 bg-surface-bright/70 shadow-lg backdrop-blur-md md:h-28 md:w-28"
          />
          <div
            data-hero-float
            aria-hidden
            className="pointer-events-none absolute bottom-[18%] left-[6%] h-20 w-32 -rotate-6 rounded-2xl border border-primary/25 bg-primary/10 backdrop-blur-sm md:h-24 md:w-40"
          />
        </>
      ) : (
        <>
          <div
            data-hero-float
            aria-hidden
            className="pointer-events-none absolute right-[10%] top-[26%] hidden rounded-xl border border-inverse-surface/10 bg-surface-bright/80 px-4 py-3 font-mono text-[11px] leading-relaxed text-on-surface-variant shadow-md backdrop-blur-md md:block"
          >
            <span className="text-primary">const</span> scale = true;
          </div>
          <div
            data-hero-float
            aria-hidden
            className="pointer-events-none absolute bottom-[20%] left-[8%] h-16 w-44 rounded-lg border border-inverse-surface/10 bg-surface-container-high/90 shadow-sm backdrop-blur md:h-[4.5rem] md:w-52"
          />
        </>
      )}

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-content-max flex-col gap-10">
        <p className="font-label text-label-sm uppercase tracking-[0.22em] text-primary">{eyebrow}</p>

        <div className="max-w-5xl md:max-w-[min(52rem,58%)]">
          <h1 className="font-headline text-[clamp(2.35rem,6.4vw,4.75rem)] font-black uppercase leading-[0.95] tracking-tighter text-on-background">
            <span className="block">{splitWords(line1, "l1")}</span>
            {line2 ? (
              <span className="mt-2 block text-primary">{splitWords(line2, "l2")}</span>
            ) : null}
          </h1>
          <p
            data-hero-sub
            className="mt-8 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant md:text-xl"
          >
            {subtext}
          </p>

          <div ref={morphRef} className="mt-8 inline-flex min-h-[2.75rem] items-center gap-3">
            <span className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant">Focus</span>
            <div ref={morphParallaxRef} className="relative h-11 min-w-[11.5rem] will-change-transform">
              {morphWords.map((w, idx) => (
                <span
                  key={w}
                  data-morph-layer
                  className="absolute inset-0 inline-flex items-center font-headline text-lg font-bold uppercase tracking-tight text-on-background md:text-xl"
                  style={{ zIndex: morphWords.length - idx }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            data-hero-cta
            href={primaryCta.href}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-headline text-sm font-bold uppercase tracking-widest text-on-primary shadow-[0_12px_40px_-18px_rgba(255,146,62,0.75)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            {primaryCta.label} <span aria-hidden>→</span>
          </Link>
          <Link
            data-hero-cta
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 border border-inverse-surface/15 bg-surface-bright/70 px-7 py-3.5 font-headline text-sm font-bold uppercase tracking-widest text-on-background backdrop-blur-md transition-[transform,box-shadow,border-color] hover:scale-[1.02] hover:border-primary/35 hover:shadow-md active:scale-[0.99]"
          >
            {secondaryCta.label} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
