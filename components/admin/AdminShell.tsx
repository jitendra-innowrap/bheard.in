"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blog", label: "Blogs" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/success-stories", label: "Success Stories" },
  { href: "/admin/media", label: "Media" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card p-4 lg:block">
        <div className="flex items-center gap-3 rounded-md bg-primary/10 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-headline text-sm font-black uppercase tracking-tight">BH</span>
          </div>
          <div>
            <p className="font-headline text-base font-black uppercase tracking-tight text-foreground">BHEARD</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Admin Panel</p>
          </div>
        </div>
        <nav className="mt-6 grid gap-1">
          {links.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200",
                  active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <p className="font-headline text-lg font-bold uppercase tracking-tight">Admin Console</p>
            <div className="flex items-center gap-2">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserCircle2 className="h-4 w-4" /> Profile
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    className="z-50 min-w-[170px] rounded-md border border-border bg-popover p-1 shadow-md"
                  >
                    <DropdownMenu.Item
                      className="rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      onSelect={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
