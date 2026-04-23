"use client";

import { ReactNode, useRef } from "react";
import { useFadeUpScrub, useMaskReveal, useStaggerReveal } from "./motion";

type MotionWrapperProps = {
  children: ReactNode;
  animation: "fadeUp" | "maskReveal" | "stagger";
};

export default function MotionWrapper({ children, animation }: MotionWrapperProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  if (animation === "fadeUp") useFadeUpScrub(ref);
  if (animation === "maskReveal") useMaskReveal(ref);
  if (animation === "stagger") useStaggerReveal(ref, "[data-stagger='true']");

  return <div ref={ref}>{children}</div>;
}
