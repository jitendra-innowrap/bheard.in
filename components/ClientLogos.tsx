"use client";

import Image from "next/image";
import { useMemo } from "react";
import LogoLoop, { type LogoItem } from "@/components/LogoLoop";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import {
  sectionBandY,
  sectionPageX,
  sectionTitleMarginCompact,
} from "@/components/system/sectionTheme";

/** Slower base marquee + gentler hover crawl (px/s in LogoLoop RAF loop) */
const STRIP_SPEED = 68;
const HOVER_SPEED = 22;

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

function toLogoLoopItems(logos: ClientLogo[]): LogoItem[] {
  return logos.map((logo) => ({
    node: (
      <span className="flex h-[92px] w-[178px] shrink-0 items-center justify-center px-2 md:px-4">
        <Image
          src={logo.src}
          alt={logo.alt}
          width={178}
          height={92}
          sizes="178px"
          className="h-auto max-h-[88px] w-full object-contain opacity-65 grayscale transition-[filter,opacity,transform] duration-[500ms] ease-out group-hover/item:scale-[1.02] group-hover/item:opacity-100 group-hover/item:grayscale-0"
        />
      </span>
    ),
    ariaLabel: logo.alt,
    title: logo.alt,
  }));
}

export default function ClientLogos() {
  const logosRowOne = useMemo(() => toLogoLoopItems(rowOneLogos), []);
  const logosRowTwo = useMemo(() => toLogoLoopItems(rowTwoLogos), []);

  const fadeTint = "#ffffff";

  return (
    <section
      className={`relative overflow-hidden bg-surface-container-lowest ${sectionPageX} ${sectionBandY}`}
    >
      <SectionCharReveal
        as="div"
        layout="flow"
        scrubEnd="+=34%"
        className={`mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-end ${sectionTitleMarginCompact}`}
        eyebrow="In good company"
        title="Our clients"
        description="A snapshot of teams we ship with—hospitality, wellness, finance, and founder-led brands across markets."
        descriptionClassName="mt-4 max-w-2xl font-body text-sm leading-relaxed text-on-surface-variant md:text-base"
      />

      <div className="relative space-y-5 md:space-y-6">
        <LogoLoop
          logos={logosRowOne}
          ariaLabel="Client logos, first row"
          speed={STRIP_SPEED}
          direction="left"
          logoHeight={92}
          gap={44}
          hoverSpeed={HOVER_SPEED}
          fadeOut
          fadeOutColor={fadeTint}
          className="py-2"
        />
        <LogoLoop
          logos={logosRowTwo}
          ariaLabel="Client logos, second row"
          speed={STRIP_SPEED}
          direction="right"
          logoHeight={92}
          gap={44}
          hoverSpeed={HOVER_SPEED}
          fadeOut
          fadeOutColor={fadeTint}
          className="py-2"
        />
      </div>
    </section>
  );
}
