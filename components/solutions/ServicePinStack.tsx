"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion/animations";
import { usePinnedStack } from "@/lib/motion/pinnedStack";

gsap.registerPlugin(useGSAP);

export type ServicePinItem = {
  id: string;
  title: string;
  body: string;
  /** Optional right-column custom visual (takes precedence over image) */
  visual?: React.ReactNode;
  /** Editorial photography when no custom visual */
  imageSrc?: string;
  imageAlt?: string;
};

const LIFT_PX = 18;
const CARD_TOP_REM = 5.75;
const CARD_BOTTOM_REM = 6.25;
const SCROLL_PER_CARD_PCT = 55;

function ServiceCardVisual({ item }: { item: ServicePinItem }) {
  if (item.visual) {
    return <div className="group/visual relative h-full min-h-[240px] md:min-h-0">{item.visual}</div>;
  }
  if (item.imageSrc) {
    return (
      <div className="group/visual relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-inverse-surface/10 bg-inverse-surface/5 shadow-inner md:min-h-0">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 42vw"
          className="object-cover transition-[transform,filter] duration-700 ease-out group-hover/visual:scale-[1.04] group-hover/visual:brightness-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/10 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-tertiary-container/10 mix-blend-multiply" />
      </div>
    );
  }
  return null;
}

function ServicePinCard({ item, index }: { item: ServicePinItem; index: number }) {
  const cardRef = useRef<HTMLElement | null>(null);

  const lift = index * LIFT_PX;
  const topOffset = `calc(${CARD_TOP_REM}rem + ${lift}px)`;
  const cardHeight = `calc(100dvh - ${CARD_BOTTOM_REM}rem - ${lift}px)`;
  const hasVisualColumn = Boolean(item.visual ?? item.imageSrc);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card || prefersReducedMotion()) return;

      const inner = card.querySelector<HTMLElement>("[data-pin-scale]");

      if (inner) {
        gsap.fromTo(
          inner,
          { scale: 1 },
          {
            scale: 0.985,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 28%",
              end: "bottom top",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    },
    { scope: cardRef, revertOnUpdate: true }
  );

  return (
    <article
      ref={cardRef}
      data-stack-card
      className="group absolute left-0 flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-inverse-surface/10 bg-surface-container-lowest shadow-[0_28px_90px_-48px_rgba(17,24,39,0.35)] transition-[box-shadow,border-color] duration-300 will-change-transform hover:border-primary/25 hover:shadow-[0_34px_110px_-44px_rgba(17,24,39,0.42)] md:rounded-[2rem]"
      style={{
        top: topOffset,
        minHeight: "min(80dvh, 480px)",
        height: cardHeight,
        zIndex: 10 + index * 10,
      }}
    >
      <div data-pin-scale className="flex h-full min-h-0 origin-top flex-col overflow-y-auto will-change-transform md:overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(17,24,39,0.04) 1px, transparent 1px),linear-gradient(rgba(17,24,39,0.035) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div
          className={`relative z-10 grid flex-1 gap-8 p-8 md:gap-12 md:p-12 lg:p-14 ${
            hasVisualColumn ? "md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]" : "md:grid-cols-1"
          }`}
        >
          <div className="flex min-h-0 flex-col justify-center">
            <h3
              data-stack-reveal
              className="font-headline text-[clamp(1.65rem,3.6vw,2.75rem)] font-black uppercase leading-tight tracking-tight text-on-background"
            >
              {item.title}
            </h3>
            <p
              data-stack-reveal
              className="mt-5 max-w-xl font-body text-body-lg leading-relaxed text-on-surface-variant md:text-lg"
            >
              {item.body}
            </p>
          </div>
          {hasVisualColumn ? (
            <div data-stack-reveal className="relative min-h-[220px] md:min-h-0">
              <ServiceCardVisual item={item} />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type ServicePinStackProps = {
  eyebrow: string;
  heading: string;
  intro?: string;
  items: ServicePinItem[];
};

export default function ServicePinStack({ eyebrow, heading, intro, items }: ServicePinStackProps) {
  const headRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = headRef.current;
      if (!root || prefersReducedMotion()) return;
      const bits = root.querySelectorAll<HTMLElement>("[data-stack-head]");
      gsap.fromTo(
        bits,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 88%",
            end: "top 58%",
            scrub: 1.05,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: headRef, revertOnUpdate: true }
  );

  usePinnedStack({
    scopeRef: sectionRef,
    pinRef,
    cardsWrapRef,
    cardSelector: "[data-stack-card]",
    revealSelector: "[data-stack-reveal]",
    scrollPerCardPct: SCROLL_PER_CARD_PCT,
    exitDuration: 2,
  });

  return (
    <section ref={sectionRef} className="relative bg-surface pb-section-y-sm pt-4 md:pb-section-y md:pt-10">
      <div ref={headRef} className="mx-auto max-w-content-max px-gutter-sm md:px-gutter">
        <p
          data-stack-head
          className="mb-3 font-label text-label-sm uppercase tracking-[0.2em] text-primary"
        >
          {eyebrow}
        </p>
        <h2
          data-stack-head
          className="max-w-3xl font-headline text-[clamp(2rem,4.5vw,3.25rem)] font-black uppercase leading-[1.02] tracking-tight text-on-background"
        >
          {heading}
        </h2>
        {intro ? (
          <p
            data-stack-head
            className="mt-5 max-w-2xl font-body text-body-lg leading-relaxed text-on-surface-variant md:text-lg"
          >
            {intro}
          </p>
        ) : null}
      </div>

      <div ref={pinRef} className="relative mt-14 h-dvh overflow-hidden md:mt-20">
        <div ref={cardsWrapRef} className="relative mx-auto h-full max-w-content-max px-gutter-sm will-change-transform md:px-gutter">
          {items.map((item, index) => (
            <ServicePinCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
