import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { getCareerApplicationById } from "@/lib/services/careerApplications.service";
import { absoluteResumePath } from "@/lib/uploads/careerResumePaths";

type Params = { id: string };

export async function GET(_req: Request, context: { params: Promise<Params> }) {
  const ok = await assertAdminApiAuth();
  if (!ok) return apiError(401, "Unauthorized");

  const { id } = await context.params;

  try {
    const row = await getCareerApplicationById(id);
    if (!row) return apiError(404, "Application not found");

    const stored = row.resumeStoredPath;
    if (/^https?:\/\//i.test(stored)) {
      return NextResponse.redirect(stored, {
        status: 302,
        headers: {
          "Cache-Control": "private, no-store",
        },
      });
    }

    if (stored.includes("/") || stored.includes("\\") || stored.includes("..")) {
      return apiError(400, "Invalid file reference");
    }

    const abs = absoluteResumePath(stored);
    const buf = await fs.readFile(abs);

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": row.resumeMime,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(row.resumeFileName)}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return apiError(404, "Resume file not found");
  }
}
