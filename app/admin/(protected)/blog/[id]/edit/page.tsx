import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogPostById } from "@/lib/services/blog.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";

type Params = { id: string };

export default async function AdminBlogEditPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getBlogPostById(id);
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Blogs" title="Edit Post" />
      <Card>
        <CardContent className="pt-5">
          <BlogForm
            mode="edit"
            initial={{
              slug: row.slug,
              title: row.title,
              excerpt: row.excerpt,
              category: row.category,
              readTime: row.readTime,
              content: row.content,
              published: row.published,
              publishedAt: row.publishedAt?.toISOString() ?? null,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
