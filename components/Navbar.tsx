"use client";

import "@/lib/motion/config";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/app/logo.png";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Menu, X } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Work", href: "/" },
  { label: "Brand", href: "/brand-solutions" },
  { label: "Tech", href: "/tech-solutions" },
  { label: "Blogs", href: "/blog" },
  { label: "Stories", href: "/success-stories" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

function isSuccessStoryDetail(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] === "success-stories" && parts.length >= 2;
}

export default function Navbar() {
  const pathname = usePathname() ?? "";
  const navRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const onStoryHero = isSuccessStoryDetail(pathname);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

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

  useGSAP(
    () => {
      const drawer = drawerRef.current;
      const overlay = overlayRef.current;
      if (!drawer || !overlay) return;

      if (drawerOpen) {
        gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(drawer, { x: 0, duration: 0.4, ease: "power3.out" });
        const links = drawer.querySelectorAll<HTMLElement>("[data-drawer-link]");
        if (links.length) {
          gsap.fromTo(
            links,
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.05, duration: 0.35, ease: "power2.out", delay: 0.15 }
          );
        }
      } else {
        gsap.to(drawer, { x: "100%", duration: 0.3, ease: "power2.in" });
        gsap.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.in" });
      }
    },
    { dependencies: [drawerOpen] }
  );

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 z-50 mx-auto flex w-full max-w-screen-2xl -translate-x-1/2 items-center justify-between px-6 py-5 left-1/2 backdrop-blur-xl transition-colors duration-300 md:px-8 md:py-6 ${
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
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            data-anim="cta"
            className={`hidden rounded-lg px-6 py-2 font-bold uppercase text-sm tracking-widest transition-transform duration-300 hover:scale-[1.02] md:inline-flex ${
              onStoryHero ? "bg-primary text-on-primary ring-1 ring-white/15" : "bg-primary text-on-primary"
            }`}
          >
            Let&apos;s Talk
          </Link>
          <button
            onClick={() => setDrawerOpen(true)}
            className={`inline-flex items-center justify-center rounded-md p-2 transition-colors duration-200 md:hidden ${
              onStoryHero ? "text-white hover:bg-white/10" : "text-neutral-800 hover:bg-neutral-100"
            }`}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        ref={overlayRef}
        onClick={closeDrawer}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ opacity: 0 }}
        aria-hidden={!drawerOpen}
      />

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 z-[70] flex h-dvh w-[min(85vw,360px)] flex-col bg-surface shadow-[-8px_0_40px_-12px_rgba(0,0,0,0.2)]"
        style={{ transform: "translateX(100%)" }}
        role="dialog"
        aria-modal={drawerOpen}
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-5">
          <Link href="/" onClick={closeDrawer}>
            <Image src={logo} alt="BHEARD" height={36} width={36} className="h-9 w-auto" />
          </Link>
          <button
            onClick={closeDrawer}
            className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 transition-colors hover:bg-neutral-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          {navLinks.map((link) => {
            const active = link.href.includes("#")
              ? false
              : link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeDrawer}
                data-drawer-link
                className={`rounded-lg px-4 py-3.5 font-headline text-lg font-bold uppercase tracking-tight transition-colors duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-outline-variant/30 px-6 py-6" data-drawer-link>
          <Link
            href="/contact"
            onClick={closeDrawer}
            className="block w-full rounded-lg bg-primary px-6 py-3.5 text-center font-headline text-sm font-bold uppercase tracking-widest text-on-primary transition-all duration-300 hover:shadow-lg"
          >
            Let&apos;s Talk
          </Link>
        </div>
      </div>
    </>
  );
}
