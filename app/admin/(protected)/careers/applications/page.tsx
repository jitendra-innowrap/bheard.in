import Link from "next/link";
import { listCareerApplications } from "@/lib/services/careerApplications.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/admin/ui/button";
import { tableStyles } from "@/components/admin/ui/styles";
import { Eye, Trash2 } from "lucide-react";

type SearchParams = { careerId?: string };
type CareerApplicationRow = Awaited<ReturnType<typeof listCareerApplications>>[number];

export default async function AdminCareerApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { careerId: rawCareerId } = await searchParams;
  const careerId =
    rawCareerId && /^[a-f\d]{24}$/i.test(rawCareerId) ? rawCareerId : undefined;

  let rows: CareerApplicationRow[] = [];
  try {
    rows = await listCareerApplications(careerId);
  } catch {
    rows = [];
  }

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
              rows.map((row: CareerApplicationRow, idx: number) => (
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
                  <td className={tableStyles.cell}>{row.careerTitle}</td>
                  <td className={tableStyles.cell}>{row.yearsExperience}</td>
                  <td className={tableStyles.cell}>{row.city}</td>
                  <td className={tableStyles.cell}>
                    <Button asChild variant="ghost" size="icon" aria-label="View applicant">
                      <Link href={`/admin/careers/applications/${row.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
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
