import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import {
  deleteCareerBySlug,
  getActiveCareerBySlug,
  getCareerBySlug,
  updateCareerBySlug,
} from "@/lib/services/careers.service";
import { careerUpdateSchema } from "@/lib/validators/careers.validator";

type Params = { slug: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const row = await getActiveCareerBySlug(slug);
    if (!row) return apiError(404, "Career not found");
    return NextResponse.json({ data: row });
  } catch {
    return apiError(500, "Failed to fetch career");
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const existing = await getCareerBySlug(slug);
    if (!existing) return apiError(404, "Career not found");
    const payload = await req.json();
    const input = careerUpdateSchema.parse(payload);
    const updated = await updateCareerBySlug(slug, input);
    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Invalid career payload", error.flatten());
    }
    return apiError(500, "Failed to update career");
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const existing = await getCareerBySlug(slug);
    if (!existing) return apiError(404, "Career not found");
    await deleteCareerBySlug(slug);
    return NextResponse.json({ ok: true });
  } catch {
    return apiError(500, "Failed to delete career");
  }
}
