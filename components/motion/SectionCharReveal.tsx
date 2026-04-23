"use client";

import "@/lib/motion/config";
import { createElement, Fragment, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionEyebrow } from "@/components/system/SectionTitle";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TITLE_VARIANT_CLASS = {
  belief:
    "font-headline text-2xl font-black uppercase leading-tight tracking-tight text-neutral-900 md:text-4xl",
  compact:
    "font-headline text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-5xl",
  display:
    "font-headline text-5xl font-black uppercase leading-[0.9] tracking-tighter text-neutral-900 md:text-8xl",
} as const;

export type SectionCharRevealTitleVariant = keyof typeof TITLE_VARIANT_CLASS;

export type SectionCharRevealLayout = "viewportPin" | "flow";

type TitleTag = "h1" | "h2" | "h3" | "p";

export type SectionCharRevealProps = {
  /** Root element — use `section` for full-band blocks, `div` when nested inside a section */
  as?: "section" | "div";
  eyebrow?: string;
  /** Plain text; use `\n` for line breaks */
  title: string;
  /** Optional supporting copy — character reveal runs in parallel with the title */
  description?: string;
  layout: SectionCharRevealLayout;
  titleVariant?: SectionCharRevealTitleVariant;
  /** Semantic tag for the title line (belief block historically used `p`) */
  titleAs?: TitleTag;
  className?: string;
  innerClassName?: string;
  /** Flow layout only: scroll distance for scrub (no pin). */
  scrubEnd?: string;
  /** Optional column (e.g. Work “View archive”) — not character-animated */
  trailing?: ReactNode;
  /** Override default description typography */
  descriptionClassName?: string;
};

type CharRevealGroup = "title" | "desc";

function renderCharLines(text: string, reactKeyPrefix: string, group: CharRevealGroup) {
  const lines = text.split("\n");
  return lines.map((line, lineIdx) => (
    <Fragment key={`${reactKeyPrefix}-line-${lineIdx}`}>
      {lineIdx > 0 ? <br /> : null}
      {line.split("").map((char, idx) => (
        <span
          key={`${reactKeyPrefix}-${lineIdx}-${idx}`}
          data-char-reveal={group}
          className="inline-block"
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </Fragment>
  ));
}

export default function SectionCharReveal({
  as: RootTag = "section",
  eyebrow,
  title,
  description,
  layout,
  titleVariant = "compact",
  titleAs = "h2",
  className = "",
  innerClassName = "",
  scrubEnd = "+=130%",
  trailing,
  descriptionClassName,
}: SectionCharRevealProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const titleClass = TITLE_VARIANT_CLASS[titleVariant];
  const descClass =
    descriptionClassName?.trim() ||
    "mt-4 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg";

  const motionKey = `${title}\n${description ?? ""}\n${layout}\n${scrubEnd}`;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const titleChars = root.querySelectorAll<HTMLElement>('[data-char-reveal="title"]');
      const descChars = root.querySelectorAll<HTMLElement>('[data-char-reveal="desc"]');
      const hasTitle = titleChars.length > 0;
      const hasDesc = descChars.length > 0;
      if (!hasTitle && !hasDesc) {
        return;
      }

      const allChars = [...titleChars, ...descChars];

      if (prefersReducedMotion()) {
        gsap.set(allChars, { opacity: 1, y: 0, rotateX: 0, clearProps: "all" });
        return;
      }

      gsap.set(allChars, {
        opacity: 0,
        y: 32,
        rotateX: 12,
        transformOrigin: "50% 100%",
        willChange: "transform, opacity",
      });

      const scrollTrigger =
        layout === "viewportPin"
          ? {
              trigger: root,
              start: "top top" as const,
              end: "+=160%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
            }
          : {
              trigger: root,
              start: "top 82%" as const,
              end: scrubEnd,
              scrub: 0.65,
            };

      const charTween: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        rotateX: 0,
        ease: "power3.out",
        duration: 1,
        stagger: {
          each: 0.02,
          from: "start" as const,
          ease: "power2.out",
        },
      };

      const tl = gsap.timeline({ scrollTrigger });
      /** Position `0` = both groups start together; each line staggers only within itself */
      if (hasTitle) tl.to(titleChars, charTween, 0);
      if (hasDesc) tl.to(descChars, charTween, 0);
    },
    { scope: rootRef, dependencies: [motionKey], revertOnUpdate: true }
  );

  const body = (
    <div className={innerClassName}>
      {eyebrow ? <SectionEyebrow>{eyebrow}</SectionEyebrow> : null}
      <div
        className={
          trailing
            ? "flex w-full flex-col gap-8 md:flex-row md:items-end md:justify-between"
            : undefined
        }
      >
        <div className="min-w-0 flex-1">
          {(() => {
            const Tag = titleAs;
            return (
              <Tag className={titleClass}>{renderCharLines(title, "title", "title")}</Tag>
            );
          })()}
          {description ? (
            <p className={descClass}>{renderCharLines(description, "desc", "desc")}</p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </div>
  );

  return createElement(
    RootTag,
    {
      ref: rootRef,
      className: className.trim(),
      ...(layout === "viewportPin" ? { "data-motion-pinned": true } : {}),
    },
    body
  );
}
