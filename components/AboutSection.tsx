"use client";

import Image from "next/image";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import { sectionPageX, sectionStackTop } from "@/components/system/sectionTheme";

export default function AboutSection() {
  return (
    <section
      id="about"
      className={`bg-surface-container-lowest ${sectionPageX} ${sectionStackTop} pb-32 md:pb-52`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="asymmetric-grid gap-24">
          <div className="relative">
            <div className="sticky top-40">
              <div className="mb-12">
                <SectionCharReveal
                  as="div"
                  layout="flow"
                  scrubEnd="+=30%"
                  titleVariant="display"
                  title={"About\nBheard."}
                />
              </div>
              <div className="w-24 h-1 bg-primary mb-8" />
            </div>
          </div>
          <div className="flex flex-col gap-10 md:pt-32 md:gap-12">
            <p className="font-body text-2xl md:text-4xl font-light text-neutral-700 leading-tight">
              <span className="text-neutral-900 font-bold italic">BHeard</span>{" "}
              is a brand and technology studio helping businesses build{" "}
              <span className="text-primary-fixed">stronger digital presence</span>{" "}
              and customer experiences.
            </p>
            <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed">
              We work across branding, content, campaigns, websites, and mobile
              applications - bringing strategy, creative, and technology
              together under one team.
            </p>
            <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed">
              Our work is grounded in years of experience with hospitality,
              luxury, consumer, and lifestyle brands - categories where trust,
              emotion, and experience are often as important as the product
              itself.
            </p>
            <p className="font-body text-lg md:text-xl text-on-surface-variant leading-relaxed">
              We think about brands as experiences, not just identities. That&apos;s
              why our focus goes beyond visibility - creating communication and
              digital experiences people remember and return to.
            </p>
            <div className="mt-6 overflow-hidden rounded-lg">
              <div className="relative w-full aspect-[16/10]">
                <Image
                  alt="BHEARD team collaborating on brand strategy - BHEARD Mumbai"
                  className="w-full grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105 object-cover"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
