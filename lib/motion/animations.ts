import "@/lib/motion/config";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Default UI: one-shot fade + lift */
export function fadeUp(
  el: Element | null,
  vars?: Partial<gsap.TweenVars>
): gsap.core.Tween | null {
  if (!el) {
    return null;
  }
  return gsap.fromTo(
    el,
    { opacity: 0, y: 40, willChange: "transform" },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
      clearProps: "willChange",
      ...vars,
    }
  );
}

/** Lists / cards: staggered fade-up */
export function staggerReveal(
  els: gsap.TweenTarget,
  vars?: Partial<gsap.TweenVars>
): gsap.core.Tween | null {
  if (els == null || els === "") {
    return null;
  }
  return gsap.fromTo(
    els,
    { opacity: 0, y: 36, willChange: "transform" },
    {
      opacity: 1,
      y: 0,
      duration: 0.48,
      stagger: 0.055,
      ease: "power3.out",
      clearProps: "willChange",
      ...vars,
    }
  );
}

/** Scroll-scrubbed reveal */
export function scrollScrub(
  el: Element | null,
  overrides?: Record<string, unknown>
): gsap.core.Tween | null {
  if (!el) {
    return null;
  }
  return gsap.fromTo(
    el,
    { opacity: 0, y: 48, willChange: "transform" },
    {
      opacity: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 30%",
        scrub: 0.65,
        ...overrides,
      },
    }
  );
}

/** Vertical parallax while scrolling — clearly visible but still refined */
export function parallaxScroll(
  el: Element | null,
  yPercent: number = -22
): gsap.core.Tween | null {
  if (!el) {
    return null;
  }
  const trigger =
    el.closest("figure") ?? el.closest("article") ?? el.parentElement ?? el;

  return gsap.to(el, {
    yPercent,
    ease: "none",
    willChange: "transform",
    scrollTrigger: {
      trigger,
      scrub: true,
      start: "top bottom",
      end: "bottom top",
    },
  });
}

/** Headings: character stagger (timeline / one-shot) */
export function splitTextReveal(
  chars: Element[],
  vars?: Partial<gsap.TweenVars>
): gsap.core.Tween | null {
  if (!chars.length) {
    return null;
  }
  return gsap.fromTo(
    chars,
    { opacity: 0.08, y: 26, willChange: "transform" },
    {
      opacity: 1,
      y: 0,
      stagger: 0.028,
      duration: 0.55,
      ease: "power3.out",
      clearProps: "willChange",
      ...vars,
    }
  );
}

/** One-time scroll reveal — snappy, readable in viewport */
export function fadeUpScrollOnce(
  el: Element | null,
  options?: { start?: string; once?: boolean }
): gsap.core.Tween | null {
  if (!el) {
    return null;
  }
  return gsap.fromTo(
    el,
    { opacity: 0, y: 36, willChange: "transform" },
    {
      opacity: 1,
      y: 0,
      duration: 0.48,
      ease: "power3.out",
      clearProps: "willChange",
      scrollTrigger: {
        trigger: el,
        start: options?.start ?? "top 90%",
        once: options?.once ?? true,
      },
    }
  );
}

/**
 * Replace heading text with per-character spans and drive a reversible scrub.
 * Call once per heading (guarded by data-motion-scrub-init).
 */
export function initHeadingLetterScrub(heading: HTMLElement): void {
  if (prefersReducedMotion() || heading.dataset.motionScrubInit) {
    return;
  }

  heading.dataset.motionScrubInit = "true";

  const parts: Node[] = [];
  heading.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent ?? "";
      for (const ch of t) {
        const s = document.createElement("span");
        s.dataset.titleChar = "true";
        s.className = "inline-block will-change-transform";
        s.textContent = ch === " " ? "\u00a0" : ch;
        parts.push(s);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      parts.push(node.cloneNode(true));
    }
  });

  heading.replaceChildren(...parts);

  const chars = heading.querySelectorAll<HTMLElement>("[data-title-char]");
  if (!chars.length) {
    delete heading.dataset.motionScrubInit;
    return;
  }

  gsap.set(chars, { opacity: 0.06, y: 32 });

  gsap.to(chars, {
    opacity: 1,
    y: 0,
    stagger: 0.02,
    ease: "none",
    scrollTrigger: {
      trigger: heading,
      start: "top 76%",
      end: "top 38%",
      scrub: 0.55,
    },
  });
}
