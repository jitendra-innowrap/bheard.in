import { PageHeader } from "@/components/admin/PageHeader";
import { listContactLeads } from "@/lib/services/contactLeads.service";
import type { ContactLead } from "@prisma/client";

function formatDate(date: Date) {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminCrmLeadsPage() {
  let leads: ContactLead[] = [];
  try {
    leads = await listContactLeads();
  } catch {
    leads = [];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Contact Leads"
        description="Inbound leads captured from contact forms and routed to the admin CRM queue."
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Serial</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Submitted</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Company</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Source</th>
              <th className="px-4 py-3 text-left font-semibold text-foreground">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.length ? (
              leads.map((lead, idx) => (
                <tr key={lead.id} className="align-top">
                  <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(lead.createdAt)}</td>
                  <td className="px-4 py-3 text-foreground">{lead.fullName}</td>
                  <td className="px-4 py-3 text-foreground">{lead.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.company || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.sourcePage || "—"}</td>
                  <td className="max-w-[460px] px-4 py-3 text-muted-foreground">{lead.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
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

