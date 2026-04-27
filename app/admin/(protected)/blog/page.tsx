import { listAllBlogPosts } from "@/lib/services/blog.service";
import { seedBlogPosts } from "@/lib/content/blogSeed";
import { PageHeader } from "@/components/admin/PageHeader";
import BlogsTable from "@/components/admin/lists/BlogsTable";

export default async function AdminBlogListPage() {
  let posts = [];
  try {
    posts = await listAllBlogPosts();
  } catch {
    posts = seedBlogPosts.map((item, index) => ({ ...item, id: index + 1 }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin · Blogs"
        title="Manage Blog Posts"
        description="Create, edit, and curate blog content with reusable filters, sorting, and pagination."
        action={{ href: "/admin/blog/new", label: "New Post" }}
      />
      <BlogsTable rows={posts as any} />
    </div>
  );
}
