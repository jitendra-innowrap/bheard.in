import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogPostById } from "@/lib/services/blog.service";

type Params = { id: string };

export default async function AdminBlogEditPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const row = await getBlogPostById(Number(id));
  if (!row) notFound();

  return (
    <div>
      <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Admin · Blog</p>
      <h1 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight">Edit post</h1>
      <div className="mt-8 border border-outline-variant/40 bg-inverse-surface/30 p-6">
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
      </div>
    </div>
  );
}
