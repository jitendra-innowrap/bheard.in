"use client";

import "@/lib/motion/config";
import { useGSAP } from "@gsap/react";
import {
  fadeUpScrollOnce,
  initHeadingLetterScrub,
  prefersReducedMotion,
} from "@/lib/motion/animations";

export default function ScrollRevealEffects() {
  useGSAP(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const main = document.querySelector("main");
    if (!main) {
      return;
    }

    main.querySelectorAll<HTMLElement>("h2[data-g-step], h3[data-g-step]").forEach((heading) => {
      if (heading.closest("[data-motion-pinned]")) {
        return;
      }
      if (heading.closest("[data-motion-exclude]")) {
        return;
      }
      initHeadingLetterScrub(heading);
    });

    main.querySelectorAll<HTMLElement>('[data-g-step="true"]').forEach((el) => {
      if (el.closest("[data-motion-pinned]")) {
        return;
      }
      if (el.closest("[data-motion-exclude]")) {
        return;
      }
      if (el.dataset.motionScrubInit) {
        return;
      }
      fadeUpScrollOnce(el);
    });
  });

  return null;
}
