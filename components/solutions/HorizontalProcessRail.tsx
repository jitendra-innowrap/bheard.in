"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type ProcessRailStep = {
  title: string;
  subtitle: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
};

type HorizontalProcessRailProps = {
  eyebrow: string;
  heading: string;
  subheading?: string;
  steps: ProcessRailStep[];
};

export default function HorizontalProcessRail({
  eyebrow,
  heading,
  subheading,
  steps,
}: HorizontalProcessRailProps) {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(0);

  const bumpRefresh = useCallback(() => {
    setLoaded((n) => n + 1);
  }, []);

  useEffect(() => {
    if (loaded > 0) {
      ScrollTrigger.refresh();
    }
  }, [loaded]);

  useGSAP(
    () => {
      const pin = pinRef.current;
      const track = trackRef.current;
      const bar = barRef.current;
      if (!pin || !track || !bar) return;

      if (prefersReducedMotion()) {
        gsap.set(track, { x: 0 });
        gsap.set(bar, { scaleX: 1, transformOrigin: "left center" });
        return;
      }

      const compute = () => Math.max(0, track.scrollWidth - pin.getBoundingClientRect().width);

      gsap.set(bar, { scaleX: 0.06, transformOrigin: "left center" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top 14%",
            end: () => `+=${compute() + 360}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        })
        .to(track, { x: () => -compute(), ease: "none" }, 0)
        .to(bar, { scaleX: 1, ease: "none", transformOrigin: "left center" }, 0);
    },
    { scope: pinRef, dependencies: [steps.length, loaded], revertOnUpdate: true }
  );

  return (
    <section className="border-y border-inverse-surface/10 bg-surface-container-low py-section-y-sm md:py-section-y">
      <div className="mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl font-headline text-[clamp(2rem,4vw,3.25rem)] font-black uppercase leading-tight tracking-tight text-on-background">
          {heading}
        </h2>
        {subheading ? (
          <p className="mt-4 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant">{subheading}</p>
        ) : null}

        <div ref={pinRef} className="relative mt-12 min-h-[320px] md:mt-16 md:min-h-[360px]">
          <div className="mb-6 h-px w-full overflow-hidden rounded-full bg-inverse-surface/10">
            <div
              ref={barRef}
              className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-primary-container to-tertiary-container"
            />
          </div>

          <div className="no-scrollbar overflow-hidden pb-4">
            <div ref={trackRef} className="flex w-max gap-5 pr-10 md:gap-7 md:pr-14">
              {steps.map((s) => (
                <article
                  key={s.title}
                  className="group w-[min(88vw,320px)] shrink-0 overflow-hidden rounded-2xl border border-inverse-surface/10 bg-surface-bright shadow-[0_18px_60px_-40px_rgba(17,24,39,0.35)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_-44px_rgba(17,24,39,0.38)] md:w-[340px]"
                >
                  {s.imageSrc ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-inverse-surface/10">
                      <Image
                        src={s.imageSrc}
                        alt={s.imageAlt ?? ""}
                        fill
                        sizes="340px"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                        onLoadingComplete={bumpRefresh}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/50 to-transparent" />
                    </div>
                  ) : null}
                  <div className="p-6 md:p-7">
                    <p className="font-label text-label-sm uppercase tracking-[0.18em] text-primary">{s.subtitle}</p>
                    <h3 className="mt-3 font-headline text-xl font-bold uppercase tracking-tight text-on-background">
                      {s.title}
                    </h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant md:text-base">{s.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
