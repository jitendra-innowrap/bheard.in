import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryById } from "@/lib/services/stories.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";
import { detailGridStyles } from "@/components/admin/ui/styles";
import { Button } from "@/components/admin/ui/button";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";

type Params = { id: string };

export default async function AdminStoryDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getStoryById(id);
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Success Stories" title="Story Details" />
      <Card>
        <CardContent className="space-y-5 pt-5">
          <div className={detailGridStyles}>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Title</p>
              <p className="mt-1 font-medium">{row.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Industry</p>
              <p className="mt-1 font-medium">{row.industry}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Summary</p>
            <p className="mt-1 text-sm text-muted-foreground">{row.summary}</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href={`/admin/success-stories/${row.id}/edit`}>Edit</Link>
            </Button>
            <DeleteEntityButton endpoint={`/api/stories/${row.slug}`} redirectTo="/admin/success-stories" label="Delete Story" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
