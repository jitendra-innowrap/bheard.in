/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";

const MANAGED_PAGES = [
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "terms-and-conditions", label: "Terms & Conditions" },
];

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<Array<{ slug: string; title: string; updatedAt: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/pages");
      const json = await res.json().catch(() => ({ data: [] }));
      if (cancelled) return;
      setPages(Array.isArray(json.data) ? json.data : []);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const pageMap = useMemo(() => new Map(pages.map((p) => [p.slug, p])), [pages]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Legal Pages"
        description="Manage Privacy Policy, Terms & Conditions, and other legal content."
      />

      {loading ? <div className="h-40 animate-pulse rounded-lg border border-border bg-card" /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {MANAGED_PAGES.map((mp) => {
          const existing = pageMap.get(mp.slug);
          return (
            <div
              key={mp.slug}
              className="flex items-center justify-between rounded-md border border-border bg-card p-5"
            >
              <div>
                <p className="font-headline text-base font-bold uppercase tracking-tight text-foreground">
                  {mp.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  /{mp.slug} ·{" "}
                  {existing
                    ? `Last updated ${new Date(existing.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : "Not yet created"}
                </p>
              </div>
              <Link
                href={`/admin/pages/${mp.slug}`}
                className="rounded-md bg-primary px-4 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {existing ? "Edit" : "Create"}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
