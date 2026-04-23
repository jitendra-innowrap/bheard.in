"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useHoverLift } from "./motion";

type ContentCardProps = {
  type: "project" | "story" | "blog" | "job";
  image?: string;
  eyebrow: string;
  title: string;
  meta?: string;
  href: string;
};

export default function ContentCard({ type, image, eyebrow, title, meta, href }: ContentCardProps) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  useHoverLift(cardRef);

  return (
    <Link ref={cardRef} href={href} className="block border border-outline-variant bg-surface-container-low p-5">
      {image && (type === "project" || type === "story") ? (
        <div className="mockup-frame mb-4 overflow-hidden">
          <Image src={image} alt={title} width={1200} height={800} className="h-auto w-full object-cover" />
        </div>
      ) : null}
      <p className="font-label text-label-sm uppercase tracking-[0.15em] text-primary">{eyebrow}</p>
      <h3 className="mt-2 font-headline text-title font-semibold text-on-background">{title}</h3>
      {meta ? <p className="mt-2 font-body text-body text-on-surface-variant">{meta}</p> : null}
    </Link>
  );
}
