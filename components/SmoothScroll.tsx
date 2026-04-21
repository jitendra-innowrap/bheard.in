"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type SmoothScrollProps = {
  children: React.ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isSmallScreen = window.matchMedia("(max-width: 1024px)").matches;

    // Keep mobile/reduced-motion fast and stable; avoid adding extra scroll work.
    if (shouldReduceMotion || isSmallScreen) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      duration: 0.8,
      lerp: 0.12,
      syncTouch: false,
    });

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
