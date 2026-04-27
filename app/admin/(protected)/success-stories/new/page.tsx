import StoryForm from "@/components/admin/StoryForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";

export default function AdminStoryNewPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Success Stories" title="Create Story" />
      <Card>
        <CardContent className="pt-5">
          <StoryForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
