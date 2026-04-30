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
  const rowWithOptionalAuthorFields = row as typeof row & {
    subtitle?: string | null;
    showAuthorDetails?: boolean | null;
    author?: string | null;
    authorImage?: string | null;
    thumbnailUrl?: string | null;
    thumbnailAlt?: string | null;
  };

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
              subtitle: rowWithOptionalAuthorFields.subtitle ?? "",
              showAuthorDetails: rowWithOptionalAuthorFields.showAuthorDetails ?? true,
              author: rowWithOptionalAuthorFields.author ?? "BHeard Editorial",
              authorImage: rowWithOptionalAuthorFields.authorImage ?? "",
              excerpt: row.excerpt,
              thumbnailUrl: rowWithOptionalAuthorFields.thumbnailUrl ?? "",
              thumbnailAlt: rowWithOptionalAuthorFields.thumbnailAlt ?? "",
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
