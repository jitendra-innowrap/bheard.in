"use client";

import "@/lib/motion/config";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP);

export default function SitePageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || prefersReducedMotion()) {
        return;
      }

      // Long pages (markdown + tall apply form): vertical clip wipes can hide content incorrectly.
      if (pathname === "/careers" || pathname.startsWith("/careers/")) {
        gsap.set(el, { clipPath: "none", clearProps: "clipPath" });
        return;
      }

      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.72,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(el, { clipPath: "none" });
          },
        }
      );
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <div key={pathname} ref={rootRef} className="motion-reduce:clip-path-none">
      {children}
    </div>
  );
}
