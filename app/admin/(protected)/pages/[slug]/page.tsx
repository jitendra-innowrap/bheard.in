/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import PageContentForm from "@/components/admin/PageContentForm";
export default function AdminPageEditPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";
  const [page, setPage] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const res = await fetch(`/api/pages/${slug}`);
      if (!res.ok) {
        if (!cancelled) setPage(null);
        if (!cancelled) setLoading(false);
        return;
      }
      const json = await res.json().catch(() => null);
      if (cancelled) return;
      setPage(json?.data ? { title: json.data.title, content: json.data.content } : null);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const label = useMemo(() => slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), [slug]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pages"
        title={`Edit — ${label}`}
        action={{ href: "/admin/pages", label: "← Back to Pages" }}
      />
      <PageContentForm
        slug={slug}
        loading={loading}
        initial={page ? { title: page.title, content: page.content } : undefined}
      />
    </div>
  );
}
