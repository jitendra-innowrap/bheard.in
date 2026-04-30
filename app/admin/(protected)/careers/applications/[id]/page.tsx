import Link from "next/link";
import { notFound } from "next/navigation";
import { getCareerApplicationById } from "@/lib/services/careerApplications.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { detailGridStyles } from "@/components/admin/ui/styles";

type Params = { id: string };

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">{value}</p>
    </div>
  );
}

export default async function AdminCareerApplicationDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  let row = null;
  try {
    row = await getCareerApplicationById(id);
  } catch {
    row = null;
  }

  if (!row) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin · Applicants"
        title={row.fullName}
        description={`Applied ${new Date(row.createdAt).toLocaleString()} · ${row.careerTitle}`}
        action={{ href: "/admin/careers/applications", label: "All applicants" }}
      />

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={`/api/admin/career-applications/${row.id}/resume`} download={row.resumeFileName}>
            Download resume
          </a>
        </Button>
        {row.career?.slug ? (
          <Button asChild variant="outline">
            <Link href={`/careers/${row.career.slug}`} target="_blank" rel="noreferrer">
              View live role
            </Link>
          </Button>
        ) : null}
      </div>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <h2 className="font-headline text-lg font-bold uppercase tracking-tight">Candidate</h2>
          <div className={detailGridStyles}>
            <Field label="Full name" value={row.fullName} />
            <Field label="Email" value={row.email} />
            <Field label="Phone" value={row.phone} />
            <Field label="City / location" value={row.city} />
            <Field label="Years of experience" value={row.yearsExperience} />
            <Field label="Role applied" value={row.roleTitleApplied} />
            <Field label="Current company" value={row.currentCompany} />
            <Field label="Notice period" value={row.noticePeriod} />
            <Field label="Expected salary" value={row.expectedSalary} />
            <Field label="Referral source" value={row.referralSource} />
            <Field label="Work authorization" value={row.workAuthorization} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-6 pt-6">
          <h2 className="font-headline text-lg font-bold uppercase tracking-tight">Links & files</h2>
          <div className={detailGridStyles}>
            {row.portfolioUrl ? (
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Portfolio</p>
                <a
                  href={row.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-sm font-medium text-primary underline underline-offset-4"
                >
                  {row.portfolioUrl}
                </a>
              </div>
            ) : null}
            {row.linkedInUrl ? (
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">LinkedIn</p>
                <a
                  href={row.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all text-sm font-medium text-primary underline underline-offset-4"
                >
                  {row.linkedInUrl}
                </a>
              </div>
            ) : null}
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Resume on file</p>
              <p className="mt-1 text-sm font-medium">
                {row.resumeFileName} ({Math.round(row.resumeSize / 1024)} KB · {row.resumeMime})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <h2 className="font-headline text-lg font-bold uppercase tracking-tight">Cover letter / message</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{row.coverLetter}</p>
        </CardContent>
      </Card>
    </div>
  );
}
