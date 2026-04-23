import { NextResponse } from "next/server";

export function apiError(status: number, message: string, details?: unknown) {
  return NextResponse.json(
    {
      error: { message, details },
    },
    { status }
  );
}
