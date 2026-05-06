"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const res = await fetch("/api/admin/session", { cache: "no-store" });
      const json = await res.json().catch(() => ({ authenticated: false }));
      if (cancelled) return;
      if (!json?.authenticated) {
        router.replace("/admin/login");
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <>{children}</>;
}

