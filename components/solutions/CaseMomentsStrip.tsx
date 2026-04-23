"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CASE_MOMENT_THUMBS } from "@/lib/solutions/visualAssets";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type CaseMoment = {
  id: string;
  metric: string;
  label: string;
  target?: number;
  suffix?: string;
  thumb?: { imageSrc: string; imageAlt: string };
};

const DEFAULTS: CaseMoment[] = [
  {
    id: "eng",
    metric: "+220%",
    label: "Eng lift on flagship launch",
    target: 220,
    suffix: "%",
    thumb: CASE_MOMENT_THUMBS.eng,
  },
  {
    id: "ret",
    metric: "3×",
    label: "Content retention vs prior quarter",
    thumb: CASE_MOMENT_THUMBS.ret,
  },
  {
    id: "reach",
    metric: "5M+",
    label: "Reach across paid + organic",
    thumb: CASE_MOMENT_THUMBS.reach,
  },
];

function CountMetric({
  target,
  suffix,
  prefix = "+",
}: {
  target: number;
  suffix: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
      }
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target,
        ease: "power2.out",
        duration: 1.35,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.n)}${suffix}`;
        },
      });
    },
    { scope: ref, revertOnUpdate: true }
  );

  return <span ref={ref} className="font-headline text-4xl font-black tabular-nums text-primary md:text-5xl" />;
}

export default function CaseMomentsStrip({
  heading = "Proof over promises.",
  intro = "Short snapshots from campaigns where memorability turned into measurable lift.",
  moments = DEFAULTS,
}: {
  heading?: string;
  intro?: string;
  moments?: CaseMoment[];
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;
      const cards = root.querySelectorAll<HTMLElement>("[data-moment-card]");
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          ease: "power3.out",
          duration: 0.55,
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        }
      );
    },
    { scope: rootRef, revertOnUpdate: true }
  );

  return (
    <section className="relative overflow-hidden bg-surface py-section-y-sm md:py-section-y">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,146,62,0.14), transparent 42%), radial-gradient(circle at 80% 0%, rgba(248,194,41,0.12), transparent 40%)",
        }}
      />
      <div ref={rootRef} className="relative z-10 mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <h2 className="max-w-3xl font-headline text-[clamp(2rem,4vw,3.1rem)] font-black uppercase leading-tight tracking-tight text-on-background">
          {heading}
        </h2>
        <p className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant">{intro}</p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {moments.map((m) => (
            <article
              key={m.id}
              data-moment-card
              className="group overflow-hidden rounded-2xl border border-inverse-surface/10 bg-surface-container-lowest shadow-[0_22px_70px_-48px_rgba(17,24,39,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_-50px_rgba(17,24,39,0.4)]"
            >
              {m.thumb ? (
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-inverse-surface/10">
                  <Image
                    src={m.thumb.imageSrc}
                    alt={m.thumb.imageAlt}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                </div>
              ) : null}
              <div className="p-7">
                <div className="min-h-[3.25rem] font-headline text-4xl font-black tabular-nums text-on-background md:text-5xl">
                  {m.target != null ? (
                    <CountMetric target={m.target} suffix={m.suffix ?? ""} />
                  ) : (
                    <span className="text-primary">{m.metric}</span>
                  )}
                </div>
                <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant md:text-base">{m.label}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
