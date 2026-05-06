/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/admin/ui/button";
import { tableStyles } from "@/components/admin/ui/styles";
import { Mail } from "lucide-react";

function formatDate(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminCrmLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const res = await fetch("/api/contact-leads?admin=true");
      const json = await res.json().catch(() => ({ data: [] }));
      if (cancelled) return;
      setLeads(Array.isArray(json.data) ? json.data : []);
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
        eyebrow="CRM"
        title="Contact Leads"
        description="Inbound leads captured from contact forms and routed to the admin CRM queue."
      />

      {loading ? <div className="h-40 animate-pulse rounded-lg border border-border bg-card" /> : null}
      <div className={tableStyles.wrapper}>
        <table className={tableStyles.table}>
          <thead>
            <tr className={tableStyles.headRow}>
              <th className={tableStyles.headCell}>Serial</th>
              <th className={tableStyles.headCell}>Submitted</th>
              <th className={tableStyles.headCell}>Name</th>
              <th className={tableStyles.headCell}>Email</th>
              <th className={tableStyles.headCell}>Phone</th>
              <th className={tableStyles.headCell}>Company</th>
              <th className={tableStyles.headCell}>Source</th>
              <th className={tableStyles.headCell}>Message</th>
              <th className={tableStyles.headCell}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length ? (
              leads.map((lead, idx) => (
                <tr key={lead.id} className={tableStyles.row}>
                  <td className={tableStyles.cell}>{idx + 1}</td>
                  <td className={tableStyles.cell}>{formatDate(lead.createdAt)}</td>
                  <td className={tableStyles.cell}>{lead.fullName}</td>
                  <td className={tableStyles.cell}>{lead.email}</td>
                  <td className={tableStyles.cell}>{lead.phone || "—"}</td>
                  <td className={tableStyles.cell}>{lead.company || "—"}</td>
                  <td className={tableStyles.cell}>
                    {lead.sourcePage ? (
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {lead.sourcePage}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className={`${tableStyles.cell} max-w-[460px]`}>{lead.message}</td>
                  <td className={tableStyles.cell}>
                    <Button asChild variant="ghost" size="icon" aria-label="Email lead">
                      <Link href={`mailto:${lead.email}`}>
                        <Mail className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                  No leads captured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

