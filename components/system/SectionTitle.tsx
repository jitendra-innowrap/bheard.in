import { createElement, type ReactNode } from "react";

const variantClass: Record<"display" | "compact", string> = {
  /** Large kinetic titles — Selected Works, About Bheard */
  display:
    "font-headline text-5xl font-black uppercase leading-[0.9] tracking-tighter text-neutral-900 md:text-8xl",
  /** Section band titles — Our Services, Our Clients, Split Bento header */
  compact:
    "font-headline text-3xl font-black uppercase tracking-tight text-neutral-900 md:text-5xl",
};

export type SectionTitleVariant = keyof typeof variantClass;

type HeadingTag = "h1" | "h2" | "h3";

type SectionTitleProps = {
  as?: HeadingTag;
  variant?: SectionTitleVariant;
  children: ReactNode;
  className?: string;
  /** Adds `data-g-step` for homepage scroll reveal */
  reveal?: boolean;
};

export default function SectionTitle({
  as: Tag = "h2",
  variant = "display",
  children,
  className = "",
  reveal,
}: SectionTitleProps) {
  const classes = `${variantClass[variant]} ${className}`.trim();

  return createElement(
    Tag,
    { className: classes, ...(reveal ? { "data-g-step": "true" } : {}) },
    children
  );
}

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
  reveal?: boolean;
};

/** Small uppercase label above a compact section title */
export function SectionEyebrow({
  children,
  className = "",
  reveal,
}: SectionEyebrowProps) {
  return (
    <p
      className={`mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary ${className}`.trim()}
      {...(reveal ? { "data-g-step": "true" } : {})}
    >
      {children}
    </p>
  );
}
