"use client";

import "@/lib/motion/config";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import logo from "@/app/logo.png";
import { prefersReducedMotion } from "@/lib/motion/animations";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bheard.in",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/bheard",
  },
] as const;

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !footerRef.current) {
        return;
      }

      const blocks = footerRef.current.querySelectorAll<HTMLElement>(
        "[data-footer-reveal]"
      );
      if (!blocks.length) {
        return;
      }

      gsap.fromTo(
        blocks,
        { opacity: 0, y: 32, willChange: "transform" },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power3.out",
          clearProps: "willChange",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 91%",
            once: true,
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      data-motion-exclude
      className="mx-auto flex min-h-[614px] w-full max-w-screen-2xl flex-col justify-end bg-white px-8 py-16"
    >
      <div className="mb-24 grid grid-cols-1 items-start gap-16 md:grid-cols-12">
        <div data-footer-reveal className="md:col-span-6">
          <div className="mb-8">
            <Image
              src={logo}
              alt="BHEARD"
              height={56}
              width={56}
              className="h-14 w-auto"
            />
          </div>
          <p className="max-w-md font-body text-lg text-neutral-600">
            BHEARD is an integrated branding and tech agency in Mumbai. We
            build brand identities, run campaigns, and engineer digital
            products - for businesses that refuse to be background noise.
          </p>
        </div>
        <div data-footer-reveal className="md:col-span-3">
          <h6 className="mb-6 text-sm font-bold uppercase text-orange-500">
            Network
          </h6>
          <ul className="flex flex-col gap-4">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <Link
                  className="font-headline text-xl uppercase text-neutral-600 transition-colors duration-400 ease-out hover:text-neutral-900"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-footer-reveal className="md:col-span-3">
          <h6 className="mb-6 text-sm font-bold uppercase text-orange-500">
            Contact
          </h6>
          <p className="mb-2 font-headline text-2xl lowercase text-neutral-900">
            hello@bheard.in
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Mumbai, India
          </p>
        </div>
      </div>
      <div className="relative overflow-visible border-t border-outline-variant/10 pt-16">
        <div className="relative z-10 flex flex-col items-end justify-between gap-8 md:flex-row">
          <div className="text-sm font-bold uppercase tracking-widest text-neutral-600">
            &copy; {new Date().getFullYear()} BHEARD. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8">
            <Link
              className="text-sm font-bold uppercase tracking-widest text-neutral-600 transition-colors duration-400 ease-out hover:text-neutral-900"
              href="/privacy-policy"
            >
              Privacy
            </Link>
            <Link
              className="text-sm font-bold uppercase tracking-widest text-neutral-600 transition-colors duration-400 ease-out hover:text-neutral-900"
              href="/terms-and-conditions"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
