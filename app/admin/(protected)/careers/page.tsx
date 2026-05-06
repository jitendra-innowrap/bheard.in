/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import CareersTable from "@/components/admin/lists/CareersTable";

export default function AdminCareersListPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/careers?includeInactive=true");
      const json = await res.json().catch(() => ({ data: [] }));
      if (cancelled) return;
      setRoles(Array.isArray(json.data) ? json.data : []);
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
        eyebrow="Admin · Careers"
        title="Manage Roles"
        description="Control active openings with reusable sorting, search and pagination."
        action={{ href: "/admin/careers/new", label: "New Role" }}
      />
      {loading ? <div className="h-40 animate-pulse rounded-lg border border-border bg-card" /> : <CareersTable rows={roles as any} />}
    </div>
  );
}
