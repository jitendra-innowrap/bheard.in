"use client";

import { useRef } from "react";
import { useTextSplitReveal } from "./motion";

type SectionHeadingProps = {
  eyebrow?: string;
  heading: string;
  subtext?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, heading, subtext, align = "left" }: SectionHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useTextSplitReveal(headingRef);

  return (
    <header className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="mb-4 font-label text-label-sm uppercase tracking-[0.15em] text-primary">{eyebrow}</p> : null}
      <h2 ref={headingRef} className="font-headline text-headline font-bold uppercase leading-tight">
        {heading}
      </h2>
      {subtext ? <p className="mt-4 max-w-2xl font-body text-body text-on-surface-variant">{subtext}</p> : null}
    </header>
  );
}
