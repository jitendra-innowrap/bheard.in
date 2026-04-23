"use client";

import "@/lib/motion/config";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/app/logo.png";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Work", href: "/" },
  { label: "Brand", href: "/brand-solutions" },
  { label: "Tech", href: "/tech-solutions" },
  { label: "Stories", href: "/success-stories" },
  { label: "About", href: "/#about" },
];

function isSuccessStoryDetail(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "success-stories" && parts.length >= 2;
}

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement | null>(null);
  const onStoryHero = isSuccessStoryDetail(pathname);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.fromTo(
        '[data-anim="logo"]',
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, ease: "expo.out", duration: 1 }
      )
        .fromTo(
          '[data-anim="nav-menu"]',
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, ease: "power3.out", duration: 0.55 },
          "+=0.12"
        )
        .fromTo(
          '[data-anim="cta"]',
          { x: 100, opacity: 0 },
          { x: 0, opacity: 1, ease: "power3.out", duration: 0.55 },
          "+=0.12"
        );
    },
    { scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 z-50 mx-auto flex w-full max-w-screen-2xl -translate-x-1/2 items-center justify-between px-8 py-6 left-1/2 backdrop-blur-xl transition-colors duration-300 ${
        onStoryHero
          ? "border-b border-white/15 bg-gradient-to-b from-black/55 via-black/25 to-transparent text-white"
          : "border-b border-transparent bg-white/80 text-neutral-800"
      }`}
    >
      <Link href="/" data-anim="logo">
        <Image
          src={logo}
          alt="BHEARD"
          height={40}
          width={40}
          style={{ scale: 1.5 }}
          className={`h-10 w-auto pl-3 ${onStoryHero ? "drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]" : ""}`}
          priority
        />
      </Link>
      <div className="hidden md:flex gap-12" data-anim="nav-menu">
        {navLinks.map((link) => {
          const active = link.href.includes("#")
            ? false
            : link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const base = onStoryHero ? "text-white/85 hover:text-primary-fixed" : "text-neutral-700 hover:text-orange-400";
          const activeCls = onStoryHero ? "text-primary-fixed hover:text-primary-fixed" : "text-orange-500 hover:text-orange-400";
          return (
            <Link
              key={link.label}
              className={`font-headline font-bold uppercase tracking-tight transition-colors duration-300 ${active ? activeCls : base}`}
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <button
        data-anim="cta"
        className={`rounded-lg px-6 py-2 font-bold uppercase text-sm tracking-widest transition-transform duration-300 hover:scale-[1.02] ${
          onStoryHero ? "bg-primary text-on-primary ring-1 ring-white/15" : "bg-primary text-on-primary"
        }`}
      >
        Let&apos;s Talk
      </button>
    </nav>
  );
}
