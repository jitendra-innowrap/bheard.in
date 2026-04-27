import BlogForm from "@/components/admin/BlogForm";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";

export default function AdminBlogNewPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Blogs" title="Create Post" />
      <Card>
        <CardContent className="pt-5">
          <BlogForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
