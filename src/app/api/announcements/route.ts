import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      title: "Jadwal UTS Semester Ganjil 2025/2026",
      content: "Jadwal Ujian Tengah Semester (UTS) akan dilaksanakan pada tanggal 1-15 September 2025. Harap setiap siswa mempersiapkan diri dengan baik dan mengikuti jadwal yang telah ditentukan.",
      author: { name: "Admin", role: "ADMIN" },
      category: "Akademik",
      isPinned: true,
      createdAt: "2025-08-20T08:00:00Z"
    },
    {
      id: "2",
      title: "Libur Akhir Tahun 2025",
      content: "Sekolah akan melaksanakan libur akhir tahun mulai tanggal 20 Desember 2025 hingga 5 Januari 2026. Kegiatan pembelajaran akan dimulai kembali pada tanggal 6 Januari 2026.",
      author: { name: "Admin", role: "ADMIN" },
      category: "Event",
      createdAt: "2025-08-18T10:00:00Z"
    },
    {
      id: "3",
      title: "Pembayaran SPP Bulan Ini",
      content: "Pengingat bagi seluruh orang tua/wali murid untuk melakukan pembayaran SPP bulan ini sebelum tanggal 15. Pembayaran dapat dilakukan melalui bank BCA atau transfer ke rekening sekolah.",
      author: { name: "Admin", role: "ADMIN" },
      category: "Umum",
      createdAt: "2025-08-15T09:00:00Z"
    }
  ]);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newAnnouncement = {
      id: Date.now().toString(),
      ...body,
      author: { name: "Guru", role: "GURU" },
      createdAt: new Date().toISOString()
    };
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err instanceof Error ? err.message : "Terjadi kesalahan") }, { status: 400 });
  }
}
