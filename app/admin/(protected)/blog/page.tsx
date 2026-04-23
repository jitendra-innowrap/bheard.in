import Link from "next/link";
import { listAllBlogPosts } from "@/lib/services/blog.service";
import { seedBlogPosts } from "@/lib/content/blogSeed";

export default async function AdminBlogListPage() {
  let posts = [];
  try {
    posts = await listAllBlogPosts();
  } catch {
    posts = seedBlogPosts.map((item, index) => ({ ...item, id: index + 1 }));
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Admin · Blog</p>
          <h1 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight">All posts</h1>
        </div>
        <Link href="/admin/blog/new" className="bg-primary px-5 py-3 font-label text-sm font-bold uppercase tracking-[0.15em] text-on-primary">
          New post
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-outline-variant/40">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-inverse-surface/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: any) => (
              <tr key={post.id ?? post.slug} className="border-t border-outline-variant/30">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">{post.category}</td>
                <td className="px-4 py-3">{post.published ? "Published" : "Draft"}</td>
                <td className="px-4 py-3">
                  <Link className="underline underline-offset-4" href={`/admin/blog/${post.id ?? 1}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
