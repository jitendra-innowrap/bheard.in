import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import {
  deleteBlogPostBySlug,
  getBlogPostBySlug,
  getPublishedBlogPostBySlug,
  updateBlogPostBySlug,
} from "@/lib/services/blog.service";
import { blogPostUpdateSchema } from "@/lib/validators/blog.validator";

type Params = { slug: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const post = await getPublishedBlogPostBySlug(slug);
    if (!post) return apiError(404, "Blog post not found");
    return NextResponse.json({ data: post });
  } catch {
    return apiError(500, "Failed to fetch blog post");
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const existing = await getBlogPostBySlug(slug);
    if (!existing) return apiError(404, "Blog post not found");
    const payload = await req.json();
    const input = blogPostUpdateSchema.parse(payload);
    const updated = await updateBlogPostBySlug(slug, input);
    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Invalid blog payload", error.flatten());
    }
    return apiError(500, "Failed to update blog post");
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const existing = await getBlogPostBySlug(slug);
    if (!existing) return apiError(404, "Blog post not found");
    await deleteBlogPostBySlug(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return apiError(500, "Failed to delete blog post");
  }
}
