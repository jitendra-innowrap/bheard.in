/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CareerForm from "@/components/admin/CareerForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";

export default function AdminCareerEditPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [row, setRow] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/careers?includeInactive=true");
      const json = await res.json().catch(() => ({ data: [] }));
      if (cancelled) return;
      const found = (json.data ?? []).find((item: any) => item.id === id) ?? null;
      setRow(found);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="h-48 animate-pulse rounded-lg border border-border bg-card" />;
  if (!row) return <p className="text-sm text-muted-foreground">Role not found.</p>;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Careers" title="Edit Role" />
      <Card>
        <CardContent className="pt-5">
          <CareerForm
            mode="edit"
            initial={{
              slug: row.slug,
              title: row.title,
              department: row.department,
              type: row.type,
              location: row.location,
              description: row.description,
              active: row.active,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
