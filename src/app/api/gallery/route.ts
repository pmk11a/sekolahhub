import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        imageUrl: true,
        caption: true,
        category: true,
        uploadedBy: { select: { name: true } },
        createdAt: true,
      },
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat galeri" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
  }

  try {
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus foto" },
      { status: 500 }
    );
  }
}
