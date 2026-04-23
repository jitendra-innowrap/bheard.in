"use client";

import SectionCharReveal from "@/components/motion/SectionCharReveal";
import { sectionPageX, sectionStackBottom } from "@/components/system/sectionTheme";

const beliefText =
  "Every brand has a voice worth hearing. Most never get the chance to use it. We exist to change that - one brand at a time.";

export default function OurBeliefSection() {
  return (
    <SectionCharReveal
      as="section"
      layout="viewportPin"
      titleVariant="belief"
      titleAs="p"
      eyebrow="Our belief"
      title={beliefText}
      className={`flex min-h-[100dvh] flex-col justify-center bg-surface ${sectionPageX} py-16 md:py-20 ${sectionStackBottom}`}
      innerClassName="mx-auto max-w-5xl py-4 md:py-6"
    />
  );
}
