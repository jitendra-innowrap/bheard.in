"use client";

import { RefObject, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const brandServices = [
  "Social Media Management",
  "Content and Copywriting",
  "Video Editing and Animations",
  "Graphic Design and Illustrations",
  "Campaign Planning",
];

const techServices = [
  "Custom Web Development",
  "Custom Mobile App Development",
  "UI/UX Design",
  "E-Commerce",
  "Chatbots and AI Agents",
];

function Strip({
  title,
  services,
  trackRef,
}: {
  title: string;
  services: string[];
  trackRef: RefObject<HTMLDivElement | null>;
}) {
  const items = [...services, ...services];

  return (
    <div className="relative overflow-hidden border border-outline-variant/60 bg-surface-container-low py-6">
      <div className="mb-5 flex items-center justify-between px-6">
        <h3 className="font-headline text-2xl font-black uppercase tracking-tight text-neutral-900">
          {title}
        </h3>
      </div>
      <div ref={trackRef} className="flex w-max items-center">
        {items.map((service, idx) => (
          <article
            key={`${service}-${idx}`}
            className="mx-2 w-[260px] shrink-0 border border-outline-variant/50 bg-surface p-5 transition-colors duration-300 hover:bg-surface-container"
          >
            <p className="text-base font-semibold text-neutral-900">{service}</p>
          </article>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-surface-container-low to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-surface-container-low to-transparent" />
    </div>
  );
}

export default function ServicesVariantTwo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const brandTrackRef = useRef<HTMLDivElement | null>(null);
  const techTrackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const tracks = [
        { el: brandTrackRef.current, from: 0, to: -50, duration: 26 },
        { el: techTrackRef.current, from: -50, to: 0, duration: 28 },
      ];
      const timelines: gsap.core.Timeline[] = [];
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        tracks.forEach((track) => {
          if (!track.el) {
            return;
          }
          gsap.set(track.el, { xPercent: track.from, willChange: "transform" });
          const tl = gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" },
          });
          tl.to(track.el, { xPercent: track.to, duration: track.duration });
          timelines.push(tl);
        });
      });

      const pauseAll = () => timelines.forEach((tl) => tl.pause());
      const playAll = () => timelines.forEach((tl) => tl.play());
      const section = sectionRef.current;
      if (section) {
        section.addEventListener("mouseenter", pauseAll);
        section.addEventListener("mouseleave", playAll);
      }

      return () => {
        if (section) {
          section.removeEventListener("mouseenter", pauseAll);
          section.removeEventListener("mouseleave", playAll);
        }
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-surface px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 md:mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Variant Two
          </p>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-5xl">
            Horizontal Scroll Strips
          </h2>
        </header>

        <div className="space-y-5">
          <Strip title="Brand Solutions" services={brandServices} trackRef={brandTrackRef} />
          <Strip title="Tech Solutions" services={techServices} trackRef={techTrackRef} />
        </div>
      </div>
    </section>
  );
}
