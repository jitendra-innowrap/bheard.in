import Link from "next/link";
import { notFound } from "next/navigation";
import { getCareerById } from "@/lib/services/careers.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";
import { detailGridStyles } from "@/components/admin/ui/styles";
import { Button } from "@/components/admin/ui/button";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";

type Params = { id: string };

export default async function AdminCareerDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getCareerById(id);
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Careers" title="Role Details" />
      <Card>
        <CardContent className="space-y-5 pt-5">
          <div className={detailGridStyles}>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Title</p>
              <p className="mt-1 font-medium">{row.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Department</p>
              <p className="mt-1 font-medium">{row.department}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Type</p>
              <p className="mt-1 font-medium">{row.type}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Location</p>
              <p className="mt-1 font-medium">{row.location}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href={`/admin/careers/applications?careerId=${encodeURIComponent(row.id)}`}>View applicants</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/admin/careers/${row.id}/edit`}>Edit</Link>
            </Button>
            <DeleteEntityButton endpoint={`/api/careers/${row.slug}`} redirectTo="/admin/careers" label="Delete Role" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
