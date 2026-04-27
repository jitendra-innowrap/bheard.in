import { unlink } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api/responses";
import { assertAdminApiAuth } from "@/lib/auth/adminSession";
import { prisma } from "@/lib/db/prisma";

type Params = { id: string };

export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  try {
    const isAuthed = await assertAdminApiAuth();
    if (!isAuthed) return apiError(401, "Unauthorized");

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return apiError(404, "Media not found");

    const filePath = path.join(process.cwd(), "public", asset.path.replace(/^\//, ""));
    await unlink(filePath).catch(() => null);
    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return apiError(500, "Failed to delete media");
  }
}
