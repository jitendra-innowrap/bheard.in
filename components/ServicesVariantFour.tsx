"use client";

import { CSSProperties, useRef } from "react";
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

function PaneContent({
  title,
  description,
  services,
}: {
  title: string;
  description: string;
  services: string[];
}) {
  return (
    <>
      <h3 className="font-headline text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-4xl">
        {title}
      </h3>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-on-surface-variant md:text-base">
        {description}
      </p>
      <ul className="mt-8 space-y-3">
        {services.map((service) => (
          <li
            key={service}
            className="border border-outline-variant/50 bg-surface px-4 py-3 text-sm font-medium text-neutral-900 md:text-base"
          >
            {service}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ServicesVariantFour() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const brandPaneRef = useRef<HTMLDivElement | null>(null);
  const techPaneRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const brandPane = brandPaneRef.current;
      const techPane = techPaneRef.current;
      const card = cardRef.current;
      if (!brandPane || !techPane || !card) {
        return;
      }

      gsap.set(card, {
        "--split-point": "50%",
        "--diag-offset": "6%",
      });
      gsap.set([brandPane, techPane], { willChange: "clip-path" });

      const toSplit = (value: string) => {
        gsap.to(card, {
          "--split-point": value,
          duration: 0.72,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const focusBrand = () => toSplit("85%");
      const focusTech = () => toSplit("15%");
      const resetPanes = () => toSplit("50%");

      brandPane.addEventListener("mouseenter", focusBrand);
      techPane.addEventListener("mouseenter", focusTech);

      card.addEventListener("mouseleave", resetPanes);

      return () => {
        brandPane.removeEventListener("mouseenter", focusBrand);
        techPane.removeEventListener("mouseenter", focusTech);
        card.removeEventListener("mouseleave", resetPanes);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-surface px-8 py-24">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <header className="mb-10 md:mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Variant Four
          </p>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-5xl">
            Interactive Split Cards
          </h2>
        </header>

        <div
          ref={cardRef}
          style={
            {
              "--split-point": "50%",
              "--diag-offset": "6%",
            } as CSSProperties
          }
          className="relative overflow-hidden border border-outline-variant/60 bg-surface-container shadow-[0_24px_80px_-48px_rgba(0,0,0,0.6)]"
        >

          <div className="relative grid grid-cols-1 md:hidden">
            <div className="border-b border-outline-variant/60 p-7">
              <PaneContent
                title="Brand Solutions"
                description="Positioning, storytelling, and campaign execution designed to make your brand instantly recognisable and deeply trusted."
                services={brandServices}
              />
            </div>
            <div className="p-7">
              <PaneContent
                title="Tech Solutions"
                description="Custom digital systems and intelligent automation that improve speed to market and customer experience quality."
                services={techServices}
              />
            </div>
          </div>

          <div className="relative hidden h-[620px] md:block">
            <div
              ref={brandPaneRef}
              style={{
                clipPath:
                  "polygon(0 0, calc(var(--split-point, 50%) + var(--diag-offset, 6%)) 0, calc(var(--split-point, 50%) - var(--diag-offset, 6%)) 100%, 0 100%)",
              }}
              className="absolute inset-y-0 left-0 z-10 w-full overflow-hidden bg-surface-container-low"
            >
              <div className="w-[clamp(420px,48vw,760px)] p-10">
                <PaneContent
                  title="Brand Solutions"
                  description="Positioning, storytelling, and campaign execution designed to make your brand instantly recognisable and deeply trusted."
                  services={brandServices}
                />
              </div>
            </div>

            <div
              ref={techPaneRef}
              style={{
                clipPath:
                  "polygon(calc(var(--split-point, 50%) + var(--diag-offset, 6%)) 0, 100% 0, 100% 100%, calc(var(--split-point, 50%) - var(--diag-offset, 6%)) 100%)",
              }}
              className="absolute inset-y-0 left-0 z-10 w-full overflow-hidden bg-surface-container-high"
            >
              <div className="ml-auto w-[clamp(420px,48vw,760px)] p-10">
                <PaneContent
                  title="Tech Solutions"
                  description="Custom digital systems and intelligent automation that improve speed to market and customer experience quality."
                  services={techServices}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
