import { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type UsePinnedStackOptions = {
  scopeRef: RefObject<HTMLElement | null>;
  pinRef: RefObject<HTMLElement | null>;
  cardsWrapRef: RefObject<HTMLElement | null>;
  cardSelector: string;
  revealSelector: string;
  scrollPerCardPct?: number;
  exitDuration?: number;
};

export function usePinnedStack({
  scopeRef,
  pinRef,
  cardsWrapRef,
  cardSelector,
  revealSelector,
  scrollPerCardPct = 55,
  exitDuration = 2,
}: UsePinnedStackOptions) {
  useGSAP(
    () => {
      const pin = pinRef.current;
      const wrap = cardsWrapRef.current;
      if (!pin || !wrap || prefersReducedMotion()) return;

      const cards = gsap.utils.toArray<HTMLElement>(cardSelector, wrap);
      if (!cards.length) return;

      const n = cards.length;
      const entryUnits = Math.max(1, n - 1);
      const totalEnd = (entryUnits + exitDuration) * scrollPerCardPct;

      gsap.set(cards, {
        yPercent: (_i: number) => (_i === 0 ? 0 : 110),
        filter: (_i: number) => (_i === 0 ? "brightness(1) contrast(1)" : "brightness(0.85) contrast(1.04)"),
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        const reveals = card.querySelectorAll<HTMLElement>(revealSelector);
        if (reveals.length) gsap.set(reveals, { y: 46, opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: `+=${totalEnd}%`,
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });

      let t = 0;
      cards.forEach((card, i) => {
        if (i === 0) return;
        const reveals = card.querySelectorAll<HTMLElement>(revealSelector);

        tl.to(card, { yPercent: 0, duration: 1, ease: "none" }, t);
        tl.to(card, { filter: "brightness(1) contrast(1)", duration: 0.4, ease: "none" }, t + 0.6);
        tl.to(cards[i - 1], { opacity: 0.8, scale: 0.95, duration: 0.6, ease: "none" }, t);

        if (reveals.length) {
          tl.to(reveals, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: "none" }, t + 0.6);
        }

        t += 1;
      });

      tl.to(wrap, { yPercent: -100, duration: exitDuration, ease: "power2.in" }, ">");
    },
    { scope: scopeRef, revertOnUpdate: true }
  );
}

