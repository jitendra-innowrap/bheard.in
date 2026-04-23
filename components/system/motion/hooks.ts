"use client";

import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type ElementRef<T extends Element> = RefObject<T | null>;

export function useFadeUpScrub(ref: ElementRef<HTMLElement>, distance = 40) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.fromTo(
      ref.current,
      { y: distance, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", end: "top 45%", scrub: 1 },
      }
    );
  }, [ref, distance]);
}

export function useStaggerReveal(containerRef: ElementRef<HTMLElement>, childSelector: string) {
  useGSAP(() => {
    if (!containerRef.current || prefersReducedMotion()) return;
    const items = gsap.utils.toArray<HTMLElement>(childSelector, containerRef.current);
    gsap.fromTo(
      items,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: containerRef.current, start: "top 80%", once: true },
      }
    );
  }, [containerRef, childSelector]);
}

export function useParallaxScroll(ref: ElementRef<HTMLElement>, speed = 60) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.to(ref.current, {
      y: -speed,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
    });
  }, [ref, speed]);
}

export function useTextSplitReveal(ref: ElementRef<HTMLElement>) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const words = ref.current.textContent?.trim().split(/\s+/) ?? [];
    ref.current.innerHTML = words.map((word) => `<span class="inline-block mr-[0.25em]">${word}</span>`).join("");
    gsap.fromTo(
      ref.current.children,
      { y: 44, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.05,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      }
    );
  }, [ref]);
}

export function useMaskReveal(ref: ElementRef<HTMLElement>) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.fromTo(
      ref.current,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      }
    );
  }, [ref]);
}

export function useLineDraw(ref: ElementRef<SVGPathElement>) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const length = ref.current.getTotalLength();
    gsap.set(ref.current, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(ref.current, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 35%", scrub: 1 },
    });
  }, [ref]);
}

export function useHoverParallax(ref: ElementRef<HTMLElement>) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const onMove = (event: MouseEvent) => {
      const target = ref.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
      gsap.to(target, { x, y, duration: 0.3, overwrite: "auto" });
    };
    const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, overwrite: "auto" });
    ref.current.addEventListener("mousemove", onMove);
    ref.current.addEventListener("mouseleave", onLeave);
    return () => {
      ref.current?.removeEventListener("mousemove", onMove);
      ref.current?.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

export function useHoverLift(ref: ElementRef<HTMLElement>) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const target = ref.current;
    const onEnter = () => gsap.to(target, { y: -8, duration: 0.3, ease: "power2.out" });
    const onLeave = () => gsap.to(target, { y: 0, duration: 0.3, ease: "power2.out" });
    target.addEventListener("mouseenter", onEnter);
    target.addEventListener("mouseleave", onLeave);
    return () => {
      target.removeEventListener("mouseenter", onEnter);
      target.removeEventListener("mouseleave", onLeave);
    };
  }, [ref]);
}

export function usePinnedSection(ref: ElementRef<HTMLElement>, panels = 4) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top top",
      end: `+=${panels * 400}`,
      pin: true,
      scrub: 1,
    });
  }, [ref, panels]);
}

export function useCountUp(ref: ElementRef<HTMLElement>, target: number) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) {
      if (ref.current) ref.current.textContent = String(target);
      return;
    }
    const value = { n: 0 };
    gsap.to(value, {
      n: target,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: () => {
        if (!ref.current) return;
        ref.current.textContent = Math.round(value.n).toLocaleString();
      },
      scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
    });
  }, [ref, target]);
}

export function useHorizontalScroll(ref: ElementRef<HTMLElement>) {
  useGSAP(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const track = ref.current;
    gsap.to(track, {
      x: () => -(track.scrollWidth - track.clientWidth),
      ease: "none",
      scrollTrigger: { trigger: track, start: "top 75%", end: "bottom top", scrub: 1 },
    });
  }, [ref]);
}
