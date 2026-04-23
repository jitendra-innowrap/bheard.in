"use client";

import "@/lib/motion/config";

type MotionRootProps = {
  children: React.ReactNode;
};

/**
 * Mount once at the app root so GSAP defaults + ScrollTrigger defaults apply
 * before any section runs `useGSAP`.
 */
export default function MotionRoot({ children }: MotionRootProps) {
  return <>{children}</>;
}
