"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/careers", label: "Careers" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <aside className="border-r border-outline-variant/30 bg-inverse-surface p-6">
      <p className="font-headline text-2xl font-black uppercase tracking-tight text-inverse-on-surface">BHEARD Admin</p>
      <nav className="mt-8 grid gap-2">
        {links.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 font-label text-sm uppercase tracking-[0.15em] ${
                active ? "bg-primary text-on-primary" : "text-inverse-on-surface/80 hover:bg-inverse-surface/60"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="mt-10 w-full border border-outline-variant/50 px-3 py-2 font-label text-sm uppercase tracking-[0.15em] text-inverse-on-surface"
      >
        Logout
      </button>
    </aside>
  );
}
