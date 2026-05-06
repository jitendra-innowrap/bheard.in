"use client";

import "@/lib/motion/config";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { CaseStudyContent } from "@/lib/case-studies";

gsap.registerPlugin(useGSAP);

const TRAIL_STEP_PX = 42;
const TRAIL_MAX_NODES = 7;

export default function StoriesClosingCta({ cases }: { cases: CaseStudyContent[] }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trailLayerRef = useRef<HTMLDivElement | null>(null);
  const imgIndexRef = useRef(0);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const trailImages = cases.slice(0, 10).map((story) => ({
    src: story.heroImage || story.listImage,
    alt: story.listTitle,
    key: story.slug,
  }));

  useGSAP(
    () => {
      const section = sectionRef.current;
      const layer = trailLayerRef.current;
      if (!section || !layer || trailImages.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (window.matchMedia("(pointer: coarse)").matches) return undefined;

        const spawnTrail = (clientX: number, clientY: number) => {
          const rect = section.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          const imgData = trailImages[imgIndexRef.current % trailImages.length];
          imgIndexRef.current += 1;

          const node = document.createElement("div");
          node.className =
            "pointer-events-none absolute h-[96px] w-[144px] overflow-hidden rounded-xl border border-white/55 bg-white/35 shadow-[0_20px_45px_-20px_rgba(0,0,0,0.35)] backdrop-blur-[1px]";
          node.style.left = `${x - 72}px`;
          node.style.top = `${y - 48}px`;
          node.style.opacity = "0";
          node.innerHTML = `<img src="${imgData.src}" alt="${imgData.alt}" class="h-full w-full object-cover" />`;
          layer.appendChild(node);

          gsap.fromTo(
            node,
            { opacity: 0, scale: 0.8, y: 10 },
            { opacity: 0.55, scale: 1, y: 0, duration: 0.24, ease: "power2.out" },
          );
          gsap.to(node, {
            opacity: 0,
            y: -14,
            duration: 0.9,
            delay: 0.2,
            ease: "power1.out",
            onComplete: () => node.remove(),
          });

          const nodes = Array.from(layer.children);
          if (nodes.length > TRAIL_MAX_NODES) {
            const stale = nodes[0] as HTMLElement | undefined;
            stale?.remove();
          }
        };

        const onMove = (event: PointerEvent) => {
          const last = lastPointRef.current;
          if (!last) {
            lastPointRef.current = { x: event.clientX, y: event.clientY };
            spawnTrail(event.clientX, event.clientY);
            return;
          }
          const dx = event.clientX - last.x;
          const dy = event.clientY - last.y;
          const distance = Math.hypot(dx, dy);
          if (distance < TRAIL_STEP_PX) return;
          lastPointRef.current = { x: event.clientX, y: event.clientY };
          spawnTrail(event.clientX, event.clientY);
        };

        const onLeave = () => {
          lastPointRef.current = null;
        };

        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerleave", onLeave);
        return () => {
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerleave", onLeave);
          layer.innerHTML = "";
          lastPointRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative bg-surface-container-lowest px-gutter-sm pb-20 pt-16 md:px-gutter md:pb-28 md:pt-24">
      <div className="mx-auto max-w-content-max">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(155deg,#fffaf4_0%,#ffffff_36%,#fff8ef_100%)] px-6 py-14 shadow-[0_26px_70px_-42px_rgba(0,0,0,0.28)] md:px-12 md:py-20">
          <div
            ref={trailLayerRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden lg:block"
          />
          <div className="pointer-events-none absolute -top-14 left-1/2 z-0 h-36 w-3/4 -translate-x-1/2 rounded-full bg-primary/12 blur-3xl" />

          <div className="relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Ready to Begin</p>
            <h2 className="mt-4 font-headline text-[clamp(1.9rem,4.2vw,3.6rem)] font-black leading-[1.03] tracking-tight text-on-surface">
              Let&apos;s Build The Next Success Story Together
            </h2>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
              Partner with BHEARD across brand narrative, digital product experiences, and growth systems that move
              from visibility to real momentum.
            </p>

            <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary px-7 py-3.5 font-label text-xs font-bold uppercase tracking-[0.16em] text-on-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Start a Conversation
              </Link>
              <Link
                href="/tech-solutions"
                className="font-label text-xs font-bold uppercase tracking-[0.16em] text-on-surface transition-colors duration-200 hover:text-primary"
              >
                Explore Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

