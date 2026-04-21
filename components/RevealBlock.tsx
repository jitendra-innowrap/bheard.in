"use client";

import { ReactNode, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function RevealBlock({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        wrapRef.current,
        { y: 24, opacity: 0.0001 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 82%",
            once: true,
          },
        }
      );
    },
    { scope: wrapRef }
  );

  return <div ref={wrapRef}>{children}</div>;
}
