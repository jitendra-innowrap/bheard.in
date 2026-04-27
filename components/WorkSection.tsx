"use client";

import "@/lib/motion/config";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import SectionCharReveal from "@/components/motion/SectionCharReveal";
import {
  sectionPageX,
  sectionTitleMarginDisplay,
  sectionStackBottom,
} from "@/components/system/sectionTheme";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    id: "01",
    title: "Luxury Hospitality Growth",
    metric: "+182% qualified inquiries",
    category: "Performance + Creative",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1800&q=80",
    gridClass:
      "md:col-span-8 md:row-span-2 md:min-h-[min(52vw,420px)] lg:min-h-[440px]",
  },
  {
    id: "02",
    title: "Wellness Brand Repositioning",
    metric: "3.4x engagement lift",
    category: "Brand + Content",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    gridClass: "md:col-span-4 md:min-h-[200px] lg:min-h-[212px]",
  },
  {
    id: "03",
    title: "Restaurant Visual Story System",
    metric: "+126% organic reach",
    category: "Social + Video",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80",
    gridClass: "md:col-span-4 md:min-h-[200px] lg:min-h-[212px]",
  },
  {
    id: "04",
    title: "D2C Commerce Acceleration",
    metric: "41% lower acquisition cost",
    category: "Ads + Funnel Design",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80",
    gridClass: "md:col-span-4 md:min-h-[220px]",
  },
  {
    id: "05",
    title: "Education Lead Engine",
    metric: "4.1x lead velocity",
    category: "Growth + Automation",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
    gridClass: "md:col-span-4 md:min-h-[220px]",
  },
  {
    id: "06",
    title: "Retail Omnichannel Launch",
    metric: "+89% store-to-site conversions",
    category: "Experience + Commerce",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
    gridClass: "md:col-span-4 md:min-h-[220px]",
  },
];

function WorkBentoCard({
  id,
  title,
  metric,
  category,
  image,
  gridClass,
}: (typeof projects)[number]) {
  const rootRef = useRef<HTMLElement | null>(null);
  const imgWrapRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const wrap = imgWrapRef.current;
      if (!root || !wrap) {
        return;
      }

      const xTo = gsap.quickTo(wrap, "x", { duration: 0.26, ease: "power2.out" });
      const yTo = gsap.quickTo(wrap, "y", { duration: 0.26, ease: "power2.out" });

      const onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        xTo(px * 28);
        yTo(py * 22);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      root.addEventListener("pointercancel", onLeave);

      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
        root.removeEventListener("pointercancel", onLeave);
      };
    },
    { scope: rootRef }
  );

  return (
    <article
      ref={rootRef}
      data-motion-exclude
      className={`group min-h-0 cursor-pointer ${gridClass}`}
    >
      <div className="relative h-full min-h-[220px] w-full overflow-hidden md:min-h-0">
        <div
          ref={imgWrapRef}
          className="absolute inset-[-8%] will-change-transform"
        >
          <Image
            alt={title}
            className="h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
            src={image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15 opacity-65 transition-opacity duration-300 ease-out group-hover:opacity-95" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {id} / {category}
          </p>
          <h4 className="mt-2 font-headline text-xl font-black uppercase leading-tight text-surface md:text-2xl">
            {title}
          </h4>
          <p className="mt-1 translate-y-3 text-xs font-semibold uppercase tracking-wider text-surface/95 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:text-sm">
            {metric}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function WorkSection() {
  return (
    <section
      className={`bg-surface-container-lowest ${sectionPageX} pt-20 md:pt-24 ${sectionStackBottom}`}
    >
      <SectionCharReveal
        as="div"
        layout="flow"
        scrubEnd="+=32%"
        titleVariant="display"
        className={`mx-auto flex max-w-7xl flex-col items-end justify-between gap-8 md:flex-row ${sectionTitleMarginDisplay}`}
        title={"Selected\nworks"}
        trailing={
          <p className="max-w-sm border-b border-primary pb-2 font-body text-xs font-bold uppercase tracking-widest text-neutral-700">
            View Archive (24)
          </p>
        }
      />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:gap-4 md:grid-cols-12 md:gap-4">
        {projects.map((project) => (
          <WorkBentoCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  );
}
