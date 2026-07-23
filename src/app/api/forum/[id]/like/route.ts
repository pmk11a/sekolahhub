import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const p = await params;
  void p; // Will be used for like logic
  return NextResponse.json({ success: true });
}
