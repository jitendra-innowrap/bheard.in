"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

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

function ServiceList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item}>
          <button className="group flex w-full items-center justify-between border border-outline-variant/60 bg-surface-container px-4 py-4 text-left transition-all duration-300 hover:border-primary/40 hover:bg-surface-container-high">
            <span className="font-body text-base font-medium text-neutral-900 md:text-lg">
              {item}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
              arrow_forward
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function ServicesVariantThree() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          '[data-variant3="reveal"]',
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
            },
          }
        );
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-surface px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <header data-variant3="reveal" className="mb-10 md:mb-12">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Variant Three
          </p>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-5xl">
            Editorial Vertical Split
          </h2>
        </header>

        <div className="space-y-8">
          <section
            data-variant3="reveal"
            className="grid grid-cols-1 gap-6 border border-outline-variant/60 bg-surface-container-low p-6 md:grid-cols-12 md:p-8"
          >
            <article className="bg-surface p-7 md:col-span-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Brand Solutions
              </p>
              <h3 className="font-headline text-3xl font-black uppercase text-neutral-900">
                Narrative-first growth design.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                We shape a clear voice and visual identity so your marketing stays
                consistent, recognisable, and performance-oriented.
              </p>
            </article>
            <div className="md:col-span-7">
              <ServiceList items={brandServices} />
            </div>
          </section>

          <section
            data-variant3="reveal"
            className="grid grid-cols-1 gap-6 border border-outline-variant/60 bg-surface-container-low p-6 md:grid-cols-12 md:p-8"
          >
            <div className="order-2 md:order-1 md:col-span-7">
              <ServiceList items={techServices} />
            </div>
            <article className="order-1 bg-surface p-7 md:order-2 md:col-span-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Tech Solutions
              </p>
              <h3 className="font-headline text-3xl font-black uppercase text-neutral-900">
                Product engineering with business clarity.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant">
                We design and ship robust web, mobile, commerce, and AI products
                that help teams move from idea to launch faster.
              </p>
            </article>
          </section>
        </div>
      </div>
    </section>
  );
}
