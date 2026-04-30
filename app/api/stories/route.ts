import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { createStory, listAllStories, listPublishedStories } from "@/lib/services/stories.service";
import { storySchema } from "@/lib/validators/stories.validator";

export async function GET(req: NextRequest) {
  try {
    const includeDraft = req.nextUrl.searchParams.get("includeDraft") === "true";
    if (includeDraft) {
      const isAuthed = await assertAdminApiAuth();
      if (!isAuthed) return apiError(401, "Unauthorized");
      return NextResponse.json({ data: await listAllStories() });
    }
    return NextResponse.json({ data: await listPublishedStories() });
  } catch {
    return apiError(500, "Failed to fetch success stories");
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");
    const payload = await req.json();
    const input = storySchema.parse(payload);
    let parsedCaseData: unknown = null;
    if (typeof input.caseData === "string" && input.caseData.trim().length) {
      try {
        parsedCaseData = JSON.parse(input.caseData);
      } catch {
        return apiError(400, "Invalid caseData JSON");
      }
    }
    const created = await createStory({
      ...input,
      listImage: input.listImage || null,
      heroImage: input.heroImage || null,
      caseData: parsedCaseData,
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return apiError(400, "Invalid story payload", error.flatten());
    return apiError(500, "Failed to create success story");
  }
}
