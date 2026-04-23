"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { RefObject, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionTitle, { SectionEyebrow } from "@/components/system/SectionTitle";
import { sectionBandY, sectionPageX, sectionTitleMarginCompact } from "@/components/system/sectionTheme";

gsap.registerPlugin(useGSAP);

type ClientLogo = {
  src: string;
  alt: string;
};

const rowOneLogos: ClientLogo[] = [
  { src: "/assets/client-logos/bnp-paribas.webp", alt: "BNP Paribas" },
  { src: "/assets/client-logos/broward-college.webp", alt: "Broward College" },
  { src: "/assets/client-logos/chef-deepa.webp", alt: "Chef Deepa" },
  { src: "/assets/client-logos/dakshin-culture-curry.webp", alt: "Dakshin Culture Curry" },
  { src: "/assets/client-logos/devaaya.webp", alt: "Devaaya" },
  { src: "/assets/client-logos/diva-maharashtracha.webp", alt: "Diva Maharashtracha" },
  { src: "/assets/client-logos/dr-suhas.webp", alt: "Dr. Suhas" },
  { src: "/assets/client-logos/goa-portuguesa.webp", alt: "Goa Portuguesa" },
  { src: "/assets/client-logos/gsbr.webp", alt: "GSBR" },
  { src: "/assets/client-logos/hindustan-unilever.webp", alt: "Hindustan Unilever" },
  { src: "/assets/client-logos/indian-princess.webp", alt: "Indian Princess" },
  { src: "/assets/client-logos/kadkani.webp", alt: "Kadkani" },
];

const rowTwoLogos: ClientLogo[] = [
  { src: "/assets/client-logos/mickey-mehta.webp", alt: "Mickey Mehta" },
  { src: "/assets/client-logos/modakam.webp", alt: "Modakam" },
  { src: "/assets/client-logos/novotel.webp", alt: "Novotel" },
  { src: "/assets/client-logos/radisson-blu.webp", alt: "Radisson Blu" },
  { src: "/assets/client-logos/radisson-candolim.webp", alt: "Radisson Candolim" },
  { src: "/assets/client-logos/sarangaa.webp", alt: "Sarangaa" },
  { src: "/assets/client-logos/shammis-yogalaya.webp", alt: "Shammis Yogalaya" },
  { src: "/assets/client-logos/treat-resort.webp", alt: "Treat Resort" },
  { src: "/assets/client-logos/resort.webp", alt: "Resort" },
  { src: "/assets/client-logos/raddisson.webp", alt: "Raddisson" },
  { src: "/assets/client-logos/era.webp", alt: "ERA" },
  { src: "/assets/client-logos/dr-sameera.webp", alt: "Dr. Sameera" },
];

function LogoStrip({
  logos,
  stripRef,
  label,
}: {
  logos: ClientLogo[];
  stripRef: RefObject<HTMLDivElement | null>;
  label: string;
}) {
  const duplicated = [...logos, ...logos];

  return (
    <div className="overflow-hidden">
      <div ref={stripRef} className="logo-track flex w-max items-center">
        {duplicated.map((logo, idx) => (
          <div
            key={`${logo.src}-${idx}`}
            className="mx-4 flex h-[92px] w-[178px] shrink-0 items-center justify-center md:mx-6"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={178}
              height={92}
              sizes="178px"
              aria-label={label}
              className="h-auto w-full object-contain grayscale opacity-65 transition duration-500 will-change-transform hover:scale-[1.02] hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientLogos() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowOneRef = useRef<HTMLDivElement | null>(null);
  const rowTwoRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const timelines: gsap.core.Timeline[] = [];
      const strips = [
        { el: rowOneRef.current, from: 0, to: -50, duration: 70 },
        { el: rowTwoRef.current, from: -50, to: 0, duration: 48 },
      ];

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        strips.forEach((strip) => {
          if (!strip.el) {
            return;
          }

          gsap.set(strip.el, { xPercent: strip.from });

          const tl = gsap.timeline({
            repeat: -1,
            defaults: { ease: "none" },
          });

          tl.to(strip.el, {
            xPercent: strip.to,
            duration: strip.duration,
          });

          timelines.push(tl);
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden bg-surface-container-lowest ${sectionPageX} ${sectionBandY}`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-end ${sectionTitleMarginCompact}`}
      >
        <div>
          <SectionEyebrow reveal>In good company</SectionEyebrow>
          <SectionTitle as="h2" variant="compact" reveal>
            Our clients
          </SectionTitle>
          <p className="mt-4 max-w-2xl font-body text-sm leading-relaxed text-on-surface-variant md:text-base">
            A snapshot of teams we ship with—hospitality, wellness, finance, and founder-led
            brands across markets.
          </p>
        </div>
      </div>

      <div className="relative space-y-5 md:space-y-6">
        <LogoStrip logos={rowOneLogos} stripRef={rowOneRef} label="Client logos strip one" />
        <LogoStrip logos={rowTwoLogos} stripRef={rowTwoRef} label="Client logos strip two" />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface-container-lowest to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-container-lowest to-transparent md:w-28" />
    </section>
  );
}
