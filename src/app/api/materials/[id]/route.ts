import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({
    id: id,
    title: "Matematika Kelas X - Persamaan Kuadrat",
    description: "Materi persamaan kuadrat, metode pemfaktoran, dan rumus ABC",
    author: { name: "Budi Santoso", role: "GURU" },
    classTag: "X-A",
    subject: "Matematika",
    type: "pdf",
    url: "/files/maths-kuadrat.pdf",
    fileSize: "2.5 MB",
    createdAt: "2025-08-20T08:00:00Z"
  });
}
