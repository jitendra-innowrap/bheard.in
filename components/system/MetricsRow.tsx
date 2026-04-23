"use client";

import { useRef } from "react";
import { useCountUp } from "./motion";

type Metric = { value: number; label: string; suffix?: string };

function MetricItem({ metric }: { metric: Metric }) {
  const valueRef = useRef<HTMLSpanElement | null>(null);
  useCountUp(valueRef, metric.value);
  return (
    <div className="border border-on-background/20 p-5">
      <p className="font-headline text-display-lg font-extrabold leading-none">
        <span ref={valueRef}>0</span>
        {metric.suffix ?? ""}
      </p>
      <p className="mt-2 font-body text-on-surface-variant">{metric.label}</p>
    </div>
  );
}

export default function MetricsRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <MetricItem key={metric.label} metric={metric} />
      ))}
    </div>
  );
}
