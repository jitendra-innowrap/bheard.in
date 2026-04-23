"use client";

const POSTS = [
  { user: "Goa Portuguesa", line: "Celebrating 30 years of flavor — one story at a time." },
  { user: "Studio North", line: "New drop: behind-the-scenes from this week’s shoot." },
  { user: "Wellness Lab", line: "3 habits that actually stick (no gimmicks)." },
  { user: "BHEARD", line: "Consistency beats intensity — here’s the cadence we use." },
];

const AVATAR_SWATCH = ["from-primary/80 to-primary-container", "from-tertiary-fixed to-tertiary-container", "from-surface-variant to-outline", "from-primary/60 to-tertiary-fixed"];

export default function MockSocialScroller() {
  const doubled = [...POSTS, ...POSTS];
  return (
    <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl border border-inverse-surface/10 bg-surface-container-high/60 p-4 shadow-inner backdrop-blur-sm">
      <div className="mb-3 flex items-center justify-between border-b border-inverse-surface/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {AVATAR_SWATCH.map((g, i) => (
              <span
                key={i}
                className={`h-7 w-7 rounded-full border border-white/70 bg-gradient-to-br ${g} shadow-sm ring-2 ring-surface-bright`}
                aria-hidden
              />
            ))}
          </div>
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Live feed</span>
        </div>
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden />
      </div>
      <div className="relative h-[calc(100%-2.75rem)] overflow-hidden">
        <div className="animate-social-marquee space-y-3">
          {doubled.map((p, idx) => (
            <div
              key={`${p.user}-${idx}`}
              className="rounded-xl border border-inverse-surface/10 bg-surface-bright/90 p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="font-headline text-[11px] font-bold uppercase tracking-wide text-on-background">
                {p.user}
              </p>
              <p className="mt-1 font-body text-xs leading-relaxed text-on-surface-variant">{p.line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
