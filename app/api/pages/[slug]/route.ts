import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { getPageBySlug, upsertPage } from "@/lib/services/page.service";
import { pageUpdateSchema } from "@/lib/validators/page.validator";

type Params = { slug: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const page = await getPageBySlug(slug);
    if (!page) return apiError(404, "Page not found");
    return NextResponse.json({ data: page });
  } catch {
    return apiError(500, "Failed to fetch page");
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { slug } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const payload = await req.json();
    const input = pageUpdateSchema.parse(payload);
    const page = await upsertPage(slug, input);
    return NextResponse.json({ data: page });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(400, "Invalid page payload", error.flatten());
    }
    return apiError(500, "Failed to update page");
  }
}
