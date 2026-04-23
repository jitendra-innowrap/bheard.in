import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { listPublishedBlogPosts, createBlogPost, listAllBlogPosts } from "@/lib/services/blog.service";
import { blogPostSchema } from "@/lib/validators/blog.validator";

export async function GET(req: NextRequest) {
  try {
    const includeDraft = req.nextUrl.searchParams.get("includeDraft") === "true";
    if (includeDraft) {
      const isAuthed = await assertAdminApiAuth();
      if (!isAuthed) return apiError(401, "Unauthorized");
      const posts = await listAllBlogPosts();
      return NextResponse.json({ data: posts });
    }
    const posts = await listPublishedBlogPosts();
    return NextResponse.json({ data: posts });
  } catch {
    return apiError(500, "Failed to fetch blog posts");
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const payload = await req.json();
    const input = blogPostSchema.parse(payload);
    const created = await createBlogPost(input);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Invalid blog payload", error.flatten());
    }
    return apiError(500, "Failed to create blog post");
  }
}
