import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailView from "@/components/blog/BlogDetailView";
import {
  getPublishedBlogPostBySlug,
  listPublishedBlogPosts,
} from "@/lib/services/blog.service";
import { seedBlogPosts } from "@/lib/content/blogSeed";
import type { BlogDetail } from "@/components/blog/BlogDetailView";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  let post = null;
  try {
    post = await getPublishedBlogPostBySlug(slug);
  } catch {
    post = seedBlogPosts.find((item) => item.slug === slug) ?? null;
  }

  if (!post) {
    return {
      title: "Post Not Found | BHEARD",
    };
  }

  return {
    title: `${post.title} | BHEARD`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  let post: BlogDetail | null = null;
  let related: BlogDetail[] = [];

  try {
    post = await getPublishedBlogPostBySlug(slug);
    related = (await listPublishedBlogPosts()).filter((item) => item.slug !== slug).slice(0, 2);
  } catch {
    post = seedBlogPosts.find((item) => item.slug === slug) ?? null;
    related = seedBlogPosts.filter((item) => item.slug !== slug).slice(0, 2);
  }

  if (!post) {
    notFound();
  }

  return <BlogDetailView post={post} related={related} />;
}
