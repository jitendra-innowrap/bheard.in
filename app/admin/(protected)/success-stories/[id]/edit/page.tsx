import { notFound } from "next/navigation";
import StoryForm from "@/components/admin/StoryForm";
import { getStoryById } from "@/lib/services/stories.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";

type Params = { id: string };

export default async function AdminStoryEditPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getStoryById(id);
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Success Stories" title="Edit Story" />
      <Card>
        <CardContent className="pt-5">
          <StoryForm
            mode="edit"
            initial={{
              slug: row.slug,
              title: row.title,
              industry: row.industry,
              listImage: row.listImage ?? "",
              heroImage: row.heroImage ?? "",
              caseData: row.caseData ? JSON.stringify(row.caseData, null, 2) : "",
              summary: row.summary,
              about: row.about,
              challenge: row.challenge,
              solution: row.solution,
              results: row.results,
              contactCta: row.contactCta,
              published: row.published,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
