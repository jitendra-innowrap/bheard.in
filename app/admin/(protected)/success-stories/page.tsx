import { PageHeader } from "@/components/admin/PageHeader";
import StoriesTable from "@/components/admin/lists/StoriesTable";
import { listAllStories } from "@/lib/services/stories.service";
import { seedStories } from "@/lib/content/storiesSeed";

export default async function AdminStoriesListPage() {
  let stories = [];
  try {
    stories = await listAllStories();
  } catch {
    stories = seedStories.map((item, index) => ({ ...item, id: index + 1 }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin · Success Stories"
        title="Manage Stories"
        description="CRUD support for your current success stories narrative structure."
        action={{ href: "/admin/success-stories/new", label: "New Story" }}
      />
      <StoriesTable rows={stories as any} />
    </div>
  );
}
