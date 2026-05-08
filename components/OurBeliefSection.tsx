"use client";

import SectionCharReveal from "@/components/motion/SectionCharReveal";
import { sectionPageX, sectionStackBottom } from "@/components/system/sectionTheme";

const beliefText =
  "We build brands that earn attention and digital products that sustain growth without splitting the brief across three different vendors.";

export default function OurBeliefSection() {
  return (
    <SectionCharReveal
      as="section"
      layout="viewportPin"
      titleVariant="belief"
      titleAs="p"
      eyebrow=""
      title={beliefText}
      className={`flex min-h-[100dvh] flex-col justify-center bg-surface ${sectionPageX} py-16 md:py-20 ${sectionStackBottom}`}
      innerClassName="mx-auto max-w-5xl py-4 md:py-6"
    />
  );
}
