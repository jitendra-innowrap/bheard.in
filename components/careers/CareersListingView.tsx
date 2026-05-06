"use client";

import "@/lib/motion/config";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import { sectionPageX } from "@/components/system/sectionTheme";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export type CareerListItem = {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  active: boolean;
};

export default function CareersListingView({ roles }: { roles: CareerListItem[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '[data-careers-banner="eyebrow"], [data-careers-banner="title"], [data-careers-banner="copy"]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.08, ease: "power3.out" }
      );

      gsap.fromTo(
        '[data-career-row]',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: '[data-careers-list]', start: "top 88%", once: true },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef}>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 px-8 pb-20 pt-36 md:pb-24 md:pt-40">
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -left-14 bottom-0 h-52 w-52 rounded-full bg-primary-fixed/20 blur-[100px]" />
        <div className="mx-auto max-w-content-max">
          <p data-careers-banner="eyebrow" className="font-label text-label-sm uppercase tracking-[0.2em] text-primary-fixed">
            Join BHEARD
          </p>
          <h1
            data-careers-banner="title"
            className="mt-4 max-w-4xl font-headline text-[clamp(2.4rem,7vw,4.8rem)] font-black uppercase leading-[0.94] tracking-tight text-white"
          >
            We Hire People,
            <br />
            Not Resumes
          </h1>
          <p
            data-careers-banner="copy"
            className="mt-6 max-w-2xl font-body text-base leading-relaxed text-neutral-300 md:text-lg"
          >
            We work with builders who care about ownership, creative quality, and measurable outcomes.
          </p>
        </div>
      </section>

      <section className={`bg-surface ${sectionPageX} py-section-y-sm md:py-section-y`}>
        <div className="mx-auto max-w-content-max">
          <SectionCharReveal
            as="div"
            layout="flow"
            titleVariant="belief"
            titleAs="p"
            title="We work async when needed, move with ownership, and optimize for taste plus measurable impact-not process theater."
            className="max-w-4xl border-l-2 border-primary pl-5"
            innerClassName=""
            scrubEnd="+=28%"
          />

          <div className="mt-14" data-careers-list>
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Open roles</p>
            <div className="mt-4 border-t border-outline-variant/60">
              {roles.length ? (
                roles.map((role) => (
                  <Link
                    key={role.slug}
                    href={`/careers/${role.slug}`}
                    data-career-row
                    className="group grid gap-4 border-b border-outline-variant/60 bg-surface py-6 transition-colors hover:bg-surface-tint/10 md:grid-cols-[1.2fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <h2 className="font-headline text-2xl font-black uppercase leading-tight text-on-background">
                        {role.title}
                      </h2>
                      <p className="mt-2 font-label text-label-sm uppercase tracking-[0.18em] text-primary">{role.department}</p>
                    </div>
                    <p className="font-body text-sm uppercase tracking-[0.14em] text-on-surface-variant">
                      {role.location} · {role.type}
                    </p>
                    <span className="inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-[0.16em] text-on-background transition-transform group-hover:translate-x-0.5">
                      Apply <span aria-hidden>→</span>
                    </span>
                  </Link>
                ))
              ) : (
                <div className="border-b border-outline-variant/60 py-8">
                  <p className="font-body text-on-surface-variant">
                    Nothing right now, but we are always open to great people.{" "}
                    <a className="font-semibold text-on-background underline decoration-primary underline-offset-4" href="mailto:careers@bheard.in">
                      careers@bheard.in
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-14 border-t border-outline-variant/60 pt-8">
            <h3 className="font-headline text-3xl font-black uppercase tracking-tight text-on-background">Do not see your role?</h3>
            <p className="mt-3 font-body text-on-surface-variant">
              Send us your work anyway at{" "}
              <a className="font-semibold text-on-background underline decoration-primary underline-offset-4" href="mailto:careers@bheard.in">
                careers@bheard.in
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
