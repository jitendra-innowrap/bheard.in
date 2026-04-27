import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { deleteStoryBySlug, getStoryBySlug, updateStoryBySlug } from "@/lib/services/stories.service";
import { storyUpdateSchema } from "@/lib/validators/stories.validator";

type Params = { slug: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const story = await getStoryBySlug(slug);
    if (!story || !story.published) return apiError(404, "Story not found");
    return NextResponse.json({ data: story });
  } catch {
    return apiError(500, "Failed to fetch story");
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const story = await getStoryBySlug(slug);
    if (!story) return apiError(404, "Story not found");
    const payload = await req.json();
    const input = storyUpdateSchema.parse(payload);
    const updated = await updateStoryBySlug(slug, input);
    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof ZodError) return apiError(400, "Invalid story payload", error.flatten());
    return apiError(500, "Failed to update story");
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const story = await getStoryBySlug(slug);
    if (!story) return apiError(404, "Story not found");
    await deleteStoryBySlug(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return apiError(500, "Failed to delete story");
  }
}
