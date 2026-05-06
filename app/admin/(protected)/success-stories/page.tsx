/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import StoriesTable from "@/components/admin/lists/StoriesTable";

export default function AdminStoriesListPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/stories?includeDraft=true");
      const json = await res.json().catch(() => ({ data: [] }));
      if (cancelled) return;
      setStories(Array.isArray(json.data) ? json.data : []);
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
        eyebrow="Admin · Success Stories"
        title="Manage Stories"
        description="CRUD support for your current success stories narrative structure."
        action={{ href: "/admin/success-stories/new", label: "New Story" }}
      />
      {loading ? <div className="h-40 animate-pulse rounded-lg border border-border bg-card" /> : <StoriesTable rows={stories as any} />}
    </div>
  );
}
