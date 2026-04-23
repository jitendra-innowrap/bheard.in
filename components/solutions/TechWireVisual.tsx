"use client";

import Image from "next/image";

export default function TechWireVisual() {
  return (
    <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-inverse-surface/10 bg-inverse-surface shadow-inner">
      <Image
        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80"
        alt="Developer workspace with code on screen"
        fill
        sizes="(max-width:768px) 100vw, 42vw"
        className="object-cover opacity-35"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/25 to-transparent" />
      <div className="relative z-10 flex h-full flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">preview.tsx</span>
          <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[9px] font-bold text-primary">live</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md border border-dashed border-inverse-surface/20 bg-surface-bright/75 backdrop-blur-sm"
            />
          ))}
        </div>
        <div className="pointer-events-none mt-3 h-16 rounded-xl border border-primary/30 bg-gradient-to-t from-primary/15 to-transparent" />
      </div>
    </div>
  );
}
