import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      title: "Matematika Kelas X - Persamaan Kuadrat",
      description: "Materi persamaan kuadrat, metode pemfaktoran, dan rumus ABC",
      author: { name: "Budi Santoso", role: "GURU" },
      classTag: "X-A",
      subject: "Matematika",
      type: "pdf",
      url: "/files/maths-kuadrat.pdf",
      fileSize: "2.5 MB",
      createdAt: "2025-08-20T08:00:00Z"
    },
    {
      id: "2",
      title: "Fisika - Hukum Newton",
      description: "Video pembelajaran tentang tiga hukum Newton dan penerapannya dalam kehidupan sehari-hari",
      author: { name: "Siti Rahayu", role: "GURU" },
      classTag: "XI-IPA",
      subject: "Fisika",
      type: "video",
      url: "https://example.com/newton",
      createdAt: "2025-08-19T10:00:00Z"
    },
    {
      id: "3",
      title: "Bahasa Indonesia - Teks Prosedur",
      description: "Contoh dan latihan soal teks prosedur untuk kelas VII",
      author: { name: "Dewi Lestari", role: "GURU" },
      classTag: "VII-B",
      subject: "Bahasa Indonesia",
      type: "doc",
      url: "/files/prosedur.docx",
      fileSize: "1.2 MB",
      createdAt: "2025-08-18T09:00:00Z"
    }
  ]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMaterial = {
      id: Date.now().toString(),
      ...body,
      author: { name: "Guru", role: "GURU" },
      createdAt: new Date().toISOString()
    };
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Terjadi kesalahan") }, { status: 400 });
  }
}
