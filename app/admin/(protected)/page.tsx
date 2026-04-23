import Link from "next/link";
import { listAllBlogPosts } from "@/lib/services/blog.service";
import { listAllCareers } from "@/lib/services/careers.service";

export default async function AdminDashboardPage() {
  const [blogs, careers] = await Promise.allSettled([listAllBlogPosts(), listAllCareers()]);
  const blogCount = blogs.status === "fulfilled" ? blogs.value.length : 0;
  const careerCount = careers.status === "fulfilled" ? careers.value.length : 0;

  return (
    <div>
      <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Overview</p>
      <h1 className="mt-3 font-headline text-4xl font-black uppercase tracking-tight">Dashboard</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border border-outline-variant/30 bg-inverse-surface p-6">
          <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Blog posts</p>
          <p className="mt-3 font-headline text-5xl font-black">{blogCount}</p>
          <Link href="/admin/blog" className="mt-4 inline-block text-sm underline underline-offset-4">
            Manage posts
          </Link>
        </div>
        <div className="border border-outline-variant/30 bg-inverse-surface p-6">
          <p className="font-label text-label-sm uppercase tracking-[0.2em] text-primary">Career roles</p>
          <p className="mt-3 font-headline text-5xl font-black">{careerCount}</p>
          <Link href="/admin/careers" className="mt-4 inline-block text-sm underline underline-offset-4">
            Manage roles
          </Link>
        </div>
      </div>
    </div>
  );
}
