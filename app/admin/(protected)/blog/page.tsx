/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import BlogsTable from "@/components/admin/lists/BlogsTable";

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/blog?includeDraft=true");
      const json = await res.json().catch(() => ({ data: [] }));
      if (cancelled) return;
      setPosts(Array.isArray(json.data) ? json.data : []);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin · Blogs"
        title="Manage Blog Posts"
        description="Create, edit, and curate blog content with reusable filters, sorting, and pagination."
        action={{ href: "/admin/blog/new", label: "New Post" }}
      />
      {loading ? <div className="h-40 animate-pulse rounded-lg border border-border bg-card" /> : <BlogsTable rows={posts as any} />}
    </div>
  );
}
