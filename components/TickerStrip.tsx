"use client";

import { useMemo } from "react";

const TICKER_ITEMS = [
  "capturing voice in the noise",
  "brand strategy · social media · campaigns · video",
  "web development · mobile apps · ui/ux · e-commerce",
  "mumbai, india",
];

const SPARKLE = "\u2726";

export default function TickerStrip() {
  const segments = useMemo(() => {
    const base = TICKER_ITEMS.map((item, idx) => ({
      key: `t-${idx}`,
      text: item,
    }));
    return [...base, ...base];
  }, []);

  return (
    <div
      aria-label="capturing voice in the noise"
      role="marquee"
      className="relative isolate mt-[72px] overflow-hidden border-y border-outline-variant/40 bg-surface-container-low text-on-surface md:mt-[88px]"
    >
      <div className="ticker-track flex shrink-0 items-center whitespace-nowrap py-3 md:py-3.5">
        {segments.map((segment, i) => (
          <span
            key={`${segment.key}-${i}`}
            className="flex items-center gap-4 px-6 font-headline text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant md:text-sm"
          >
            <span aria-hidden className="text-primary">
              {SPARKLE}
            </span>
            <span className="lowercase tracking-[0.14em]">{segment.text}</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 38s linear infinite;
          will-change: transform;
        }
        @keyframes ticker-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
