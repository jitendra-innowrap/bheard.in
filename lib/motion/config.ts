import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    duration: 0.55,
    ease: "power2.out",
  });
  ScrollTrigger.defaults({
    start: "top 82%",
    end: "top 36%",
  });
}

export const MOTION_EASE = {
  ui: "power2.out",
  heading: "power3.out",
  hero: "expo.out",
  scrub: "none" as const,
} as const;

export const MOTION_DURATION = {
  ui: 0.5,
  uiShort: 0.45,
  heading: 0.65,
  heroMin: 0.85,
  heroMax: 1.05,
  hover: 0.32,
  hoverExit: 0.42,
  large: 0.9,
} as const;
