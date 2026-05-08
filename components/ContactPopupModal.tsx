"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import ContactLeadForm from "@/components/site/ContactLeadForm";

type Props = {
  open: boolean;
  onClose: () => void;
  sourcePage?: string;
  title?: string;
  subtitle?: string;
};

export default function ContactPopupModal({
  open,
  onClose,
  sourcePage = "/",
  title = "Let's talk",
  subtitle = "Tell us about your brand goals - we'll respond within one business day.",
}: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const dialog = dialogRef.current;
    if (!overlay || !dialog) return;

    if (open) {
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.fromTo(
        dialog,
        { opacity: 0, y: 32, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
      );
    } else {
      gsap.to(overlay, { opacity: 0, duration: 0.18, ease: "power2.in" });
      gsap.to(dialog, {
        opacity: 0,
        y: 16,
        scale: 0.98,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [open]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ opacity: 0 }}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
        style={{ opacity: 0 }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="border-b border-outline-variant/40 px-6 py-5 md:px-8 md:py-6">
          <h2 className="font-headline text-2xl font-black uppercase tracking-tight text-neutral-900 md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-md text-sm text-on-surface-variant md:text-base">
            {subtitle}
          </p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 md:px-8 md:py-7">
          <ContactLeadForm sourcePage={sourcePage} />
        </div>
      </div>
    </div>
  );
}
