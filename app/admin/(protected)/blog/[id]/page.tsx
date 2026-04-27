import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/services/blog.service";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/admin/ui/card";
import { detailGridStyles } from "@/components/admin/ui/styles";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";
import { Button } from "@/components/admin/ui/button";

type Params = { id: string };

export default async function AdminBlogDetailPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getBlogPostById(id);
  if (!row) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Admin · Blogs" title="Post Details" />
      <Card>
        <CardContent className="space-y-5 pt-5">
          <div className={detailGridStyles}>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Title</p>
              <p className="mt-1 font-medium">{row.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Slug</p>
              <p className="mt-1 font-medium">{row.slug}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Category</p>
              <p className="mt-1 font-medium">{row.category}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Status</p>
              <p className="mt-1 font-medium">{row.published ? "Published" : "Draft"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Excerpt</p>
            <p className="mt-1 text-sm text-muted-foreground">{row.excerpt}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href={`/admin/blog/${row.id}/edit`}>Edit</Link>
            </Button>
            <DeleteEntityButton endpoint={`/api/blog/${row.slug}`} redirectTo="/admin/blog" label="Delete Post" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
