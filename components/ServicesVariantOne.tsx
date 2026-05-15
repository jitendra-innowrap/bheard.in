"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import { sectionBandY, sectionPageX, sectionTitleMarginCompact } from "@/components/system/sectionTheme";
import { parallaxScroll, prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP);

function SignalCard({ stat, label }: { stat: string; label: string }) {
  return (
    <article
      data-g-step="true"
      className="flex h-full min-h-[160px] flex-col justify-between border border-outline-variant/60 bg-surface-container p-6 transition-colors duration-[400ms] ease-out hover:bg-surface-container-high md:min-h-0 md:p-7"
    >
      <p className="font-headline text-4xl font-black leading-none text-primary md:text-5xl">
        {stat}
      </p>
      <p className="mt-4 text-sm font-medium leading-snug text-on-surface-variant md:text-base">
        {label}
      </p>
    </article>
  );
}

export default function ServicesVariantOne() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) {
        return;
      }
      const layers = sectionRef.current.querySelectorAll<HTMLElement>(
        "[data-proof-parallax]"
      );
      layers.forEach((el) => {
        parallaxScroll(el, -26);
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className={`bg-surface ${sectionPageX} ${sectionBandY}`}>
      <div className="mx-auto max-w-7xl">
        <SectionCharReveal
          as="div"
          layout="flow"
          scrubEnd="+=34%"
          className={sectionTitleMarginCompact}
          eyebrow="Proof of craft"
          title="Outcomes in the wild"
          description="Real briefs. Real constraints. Real numbers. This is what integrated thinking actually delivers."
        />

        <div className="space-y-4 md:space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <figure
              data-g-step="true"
              className="group relative min-h-[280px] overflow-hidden border border-outline-variant/60 md:col-span-7 md:min-h-[400px]"
            >
              <div
                data-proof-parallax
                className="absolute inset-[-6%] will-change-transform"
              >
                <Image
                  src="/assets/home/proof-of-craft/hospitality-lifestyle.webp"
                  alt="Radisson Blu hotel facade"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Hospitality &amp; lifestyle
                </p>
                <p className="mt-2 font-headline text-2xl font-black uppercase leading-tight text-surface md:text-3xl">
                  Luxury storytelling + performance media, moving as one system.
                </p>
              </figcaption>
            </figure>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:grid-rows-2">
              <SignalCard
                stat="4×"
                label="Stronger digital visibility during the campaign cycle."
              />
              <SignalCard
                stat="9.4%"
                label="Lower acquisition costs while generating 3× more leads."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:grid-rows-2">
              <SignalCard
                stat="275K+"
                label="Reach generated through event-led digital storytelling."
              />
              <SignalCard
                stat="Weekly"
                label="Release cadence we hold with multi-market teams to keep momentum visible."
              />
            </div>

            <figure
              data-g-step="true"
              className="group relative min-h-[280px] overflow-hidden border border-outline-variant/60 md:col-span-7 md:min-h-[400px]"
            >
              <div
                data-proof-parallax
                className="absolute inset-[-6%] will-change-transform"
              >
                <Image
                  src="/assets/home/proof-of-craft/events-digital-campaigns.webp"
                  alt="Team collaborating on events and digital campaigns"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Events &amp; digital campaigns
                </p>
                <p className="mt-2 font-headline text-2xl font-black uppercase leading-tight text-surface md:text-3xl">
                  Events, media &amp; digital momentum — built in sync.
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
