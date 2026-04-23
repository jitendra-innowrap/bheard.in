"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { usePinnedSection } from "./motion";

type Panel = {
  heading: string;
  body: string;
  visual: string;
  visualType: "editorial" | "lottie" | "mockup";
};

export default function PinnedStorySection({ panels }: { panels: Panel[] }) {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  usePinnedSection(ref, panels.length);

  return (
    <section ref={ref} className="grid min-h-[70vh] gap-8 md:grid-cols-2">
      <div className="space-y-4">
        {panels.map((panel, idx) => (
          <button key={panel.heading} onClick={() => setActive(idx)} className={`block text-left ${idx === active ? "opacity-100" : "opacity-40"}`}>
            <h3 className="font-headline text-title uppercase">{panel.heading}</h3>
            <p className="mt-2 font-body text-on-surface-variant">{panel.body}</p>
          </button>
        ))}
      </div>
      <div className="mockup-frame h-full min-h-[320px] overflow-hidden">
        <Image
          src={panels[active]?.visual ?? "/assets/client-logos/bnp-paribas.webp"}
          alt={panels[active]?.heading ?? "Panel visual"}
          width={1200}
          height={900}
          className={`h-full w-full object-cover ${panels[active]?.visualType === "editorial" ? "img-editorial" : ""}`}
        />
      </div>
    </section>
  );
}
