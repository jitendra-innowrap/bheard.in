"use client";

import "@/lib/motion/config";
import { CSSProperties, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import {
  sectionPageX,
  sectionStackTop,
  sectionTitleMarginCompact,
} from "@/components/system/sectionTheme";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

function PaneBlock({
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
      <h4
        data-pane-reveal
        className="font-headline text-4xl font-black uppercase text-neutral-900"
      >
        {title}
      </h4>
      <p data-pane-reveal className="mt-4 max-w-lg text-on-surface-variant">
        {description}
      </p>
      <ul className="mt-8 space-y-3">
        {services.map((service) => (
          <li
            key={service}
            data-pane-reveal
            className="border border-outline-variant/60 bg-surface px-4 py-3 text-sm font-semibold text-neutral-900 md:text-base"
          >
            {service}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const brandPaneRef = useRef<HTMLDivElement | null>(null);
  const techPaneRef = useRef<HTMLDivElement | null>(null);
  const brandContentRef = useRef<HTMLDivElement | null>(null);
  const techContentRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const brandPane = brandPaneRef.current;
      const techPane = techPaneRef.current;
      const brandContent = brandContentRef.current;
      const techContent = techContentRef.current;
      if (!card || !brandPane || !techPane || !brandContent || !techContent) {
        return;
      }

      gsap.set(card, {
        "--split": "50%",
      });

      const animateTo = (split: string) => {
        gsap.to(card, {
          "--split": split,
          duration: 0.65,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const focusBrand = () => {
        animateTo("85%");
        gsap.to(brandContent, { x: 20, duration: 0.65, ease: "power3.out", overwrite: "auto" });
        gsap.to(techContent, { x: 60, duration: 0.65, ease: "power3.out", overwrite: "auto" });
      };

      const focusTech = () => {
        animateTo("15%");
        gsap.to(brandContent, { x: -60, duration: 0.65, ease: "power3.out", overwrite: "auto" });
        gsap.to(techContent, { x: -20, duration: 0.65, ease: "power3.out", overwrite: "auto" });
      };

      const reset = () => {
        animateTo("50%");
        gsap.to([brandContent, techContent], {
          x: 0,
          duration: 0.62,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      brandPane.addEventListener("mouseenter", focusBrand);
      techPane.addEventListener("mouseenter", focusTech);
      card.addEventListener("mouseleave", reset);

      return () => {
        brandPane.removeEventListener("mouseenter", focusBrand);
        techPane.removeEventListener("mouseenter", focusTech);
        card.removeEventListener("mouseleave", reset);
      };
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || !sectionRef.current) {
        return;
      }

      const panes = sectionRef.current.querySelectorAll<HTMLElement>("[data-pane-reveal]");
      if (!panes.length) {
        return;
      }

      gsap.fromTo(
        panes,
        { opacity: 0, y: 36, willChange: "transform" },
        {
          opacity: 1,
          y: 0,
          stagger: 0.045,
          duration: 0.52,
          ease: "power3.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`bg-surface ${sectionPageX} ${sectionStackTop} pb-20 md:pb-24`}
    >
      <SectionCharReveal
        as="div"
        layout="flow"
        scrubEnd="+=150%"
        className={`mx-auto max-w-7xl ${sectionTitleMarginCompact} lg:mb-14`}
        eyebrow="How we work"
        title="Our services"
        description="Strategy, creative, and engineering in one loop—so positioning, campaigns, and product experiences stay aligned from brief to launch."
      />

      <div className="mx-auto max-w-7xl">
        <div
          ref={cardRef}
          style={{ "--split": "50%" } as CSSProperties}
          className="relative overflow-hidden border border-outline-variant/60 bg-surface-container"
        >
          <div className="grid grid-cols-1 md:hidden">
            <div className="border-b border-outline-variant/60 p-8">
              <PaneBlock
                title="Brand Solutions"
                description="Story, content, and campaign systems that build trust and long-term recall."
                services={brandServices}
              />
            </div>
            <div className="p-8">
              <PaneBlock
                title="Tech Solutions"
                description="Scalable digital products and automations engineered for measurable growth."
                services={techServices}
              />
            </div>
          </div>

          <div className="relative hidden h-[640px] md:block">
            <div
              ref={brandPaneRef}
              style={{
                clipPath:
                  "polygon(0 0, var(--split, 50%) 0, calc(var(--split, 50%) - 10%) 100%, 0 100%)",
              }}
              className="absolute inset-y-0 left-0 z-10 w-full overflow-hidden bg-surface-container-low"
            >
              <div ref={brandContentRef} className="min-w-[500px] max-w-[760px] p-10">
                <PaneBlock
                  title="Brand Solutions"
                  description="Story, content, and campaign systems that build trust and long-term recall."
                  services={brandServices}
                />
              </div>
            </div>

            <div
              ref={techPaneRef}
              style={{
                clipPath:
                  "polygon(var(--split, 50%) 0, 100% 0, 100% 100%, calc(var(--split, 50%) - 10%) 100%)",
              }}
              className="absolute inset-y-0 left-0 z-10 w-full overflow-hidden bg-surface-container-high"
            >
              <div ref={techContentRef} className="ml-auto min-w-[500px] max-w-[760px] p-10">
                <PaneBlock
                  title="Tech Solutions"
                  description="Scalable digital products and automations engineered for measurable growth."
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
