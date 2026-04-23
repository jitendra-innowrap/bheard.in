"use client";

import { useRef } from "react";
import { useLineDraw, useStaggerReveal } from "./motion";

type Step = { number: string; title: string; description: string };

export default function ProcessTimeline({ steps }: { steps: Step[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  useStaggerReveal(containerRef, "[data-step='true']");
  useLineDraw(lineRef);

  return (
    <div ref={containerRef} className="space-y-6">
      <svg className="hidden h-8 w-full md:block" viewBox="0 0 1000 40" fill="none">
        <path ref={lineRef} d="M10 20 H990" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div className="grid gap-6 md:grid-cols-4">
        {steps.map((step) => (
          <div key={step.number} data-step="true" className="border border-outline-variant p-5">
            <p className="font-label text-label-sm text-primary">{step.number}</p>
            <h3 className="mt-2 font-headline text-title uppercase">{step.title}</h3>
            <p className="mt-2 font-body text-on-surface-variant">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
