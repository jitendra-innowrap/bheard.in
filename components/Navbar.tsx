"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/logo.png";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Work", href: "#", active: true },
  { label: "Services", href: "#" },
  { label: "Process", href: "#" },
  { label: "About", href: "#" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        '[data-anim="logo"]',
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, ease: "elastic.out(1, 0.6)", duration: 0.8 }
      )
        .fromTo(
          '[data-anim="nav-menu"]',
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.7 },
          "+=0.2"
        )
        .fromTo(
          '[data-anim="cta"]',
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, ease: "power3.out", duration: 0.7 },
          "+=0.25"
        );
    },
    { scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 py-6 max-w-screen-2xl mx-auto left-1/2 -translate-x-1/2"
    >
      <Link href="/" data-anim="logo">
        <Image
          src={logo}
          alt="BHEARD"
          height={40}
          width={40}
          style={{ scale: 1.5 }}
          className="w-auto h-10 pl-3"
          priority
        />
      </Link>
      <div className="hidden md:flex gap-12" data-anim="nav-menu">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            className={`font-headline tracking-tight font-bold uppercase transition-colors duration-300 ${
              link.active
                ? "text-orange-500 hover:text-orange-400"
                : "text-neutral-700 hover:text-orange-400"
            }`}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        data-anim="cta"
        className="bg-primary text-on-primary px-6 py-2 font-bold uppercase text-sm tracking-widest hover:scale-[1.02] transition-transform duration-300 rounded-lg"
      >
        Let&apos;s Talk
      </button>
    </nav>
  );
}
