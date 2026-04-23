import type { Metadata } from "next";
import BlogListingView from "@/components/blog/BlogListingView";
import { listPublishedBlogPosts } from "@/lib/services/blog.service";
import { seedBlogPosts } from "@/lib/content/blogSeed";

export const metadata: Metadata = {
  title: "Blog | BHEARD",
  description: "Perspectives on brand strategy, product engineering, growth systems, and practical execution.",
};

export const dynamic = "force-dynamic";

export default async function BlogListingPage() {
  let posts = [];
  try {
    posts = await listPublishedBlogPosts();
  } catch {
    posts = seedBlogPosts;
  }

  return <BlogListingView posts={posts} />;
}
