/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/admin/ui/button";
import { tableStyles } from "@/components/admin/ui/styles";
import { Eye, Mail, Trash2 } from "lucide-react";

export default function AdminCareerApplicationsPage() {
  const [rawCareerId, setRawCareerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const url = new URL(window.location.href);
    setRawCareerId(url.searchParams.get("careerId") ?? undefined);
  }, []);

  const careerId =
    rawCareerId && /^[a-f\d]{24}$/i.test(rawCareerId) ? rawCareerId : undefined;
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const qs = careerId ? `?careerId=${encodeURIComponent(careerId)}` : "";
      const res = await fetch(`/api/admin/career-applications${qs}`);
      const json = await res.json().catch(() => ({ data: [] }));
      if (cancelled) return;
      setRows(Array.isArray(json.data) ? json.data : []);
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [careerId]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin · Careers"
        title="Applicants"
        description="Review submissions, download resumes, and follow up with candidates."
        action={
          careerId
            ? { href: "/admin/careers/applications", label: "Clear filter" }
            : undefined
        }
      />
      {rawCareerId && !careerId ? (
        <p className="text-sm text-amber-700 dark:text-amber-500">
          Invalid role filter — showing all applicants.
        </p>
      ) : null}
      {careerId ? (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted-foreground">Filtered by role ID: {careerId}</p>
          <Button asChild variant="outline" size="icon" aria-label="Clear filter">
            <Link href="/admin/careers/applications">
              <Trash2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : null}

      {loading ? <div className="h-40 animate-pulse rounded-lg border border-border bg-card" /> : null}
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr className={tableStyles.headRow}>
              <th className={tableStyles.headCell}>Serial</th>
              <th className={tableStyles.headCell}>Submitted</th>
              <th className={tableStyles.headCell}>Name</th>
              <th className={tableStyles.headCell}>Email</th>
              <th className={tableStyles.headCell}>Role</th>
              <th className={tableStyles.headCell}>Experience</th>
              <th className={tableStyles.headCell}>Location</th>
              <th className={tableStyles.headCell} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  No applications yet.
                </td>
              </tr>
            ) : (
              rows.map((row, idx: number) => (
                <tr key={row.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>{idx + 1}</td>
                  <td className={tableStyles.cell}>
                    {new Date(row.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className={tableStyles.cell}>{row.fullName}</td>
                  <td className={tableStyles.cell}>{row.email}</td>
                  <td className={tableStyles.cell}>
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {row.careerTitle}
                    </span>
                  </td>
                  <td className={tableStyles.cell}>
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                      {row.yearsExperience}
                    </span>
                  </td>
                  <td className={tableStyles.cell}>{row.city}</td>
                  <td className={tableStyles.cell}>
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label="Email applicant">
                        <Link href={`mailto:${row.email}`}>
                          <Mail className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" aria-label="View applicant">
                        <Link href={`/admin/careers/applications/${row.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
