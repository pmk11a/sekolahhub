import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const caption = formData.get("caption") as string;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File gambar diperlukan" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Hanya format JPG, PNG, dan WebP yang diperbolehkan" },
        { status: 400 }
      );
    }

    // Dalam produksi: upload ke Vercel Blob / S3 dan dapatkan URL
    const imageUrl = `/gallery/${Date.now()}-${file.name}`;

    const item = await prisma.galleryItem.create({
      data: {
        imageUrl,
        caption: caption || undefined,
        category: category || undefined,
        uploadedById: session.user.id,
      },
    });

    // Buat notifikasi ke semua orang tua
    const ortuUsers = await prisma.user.findMany({
      where: { role: "ORTU" },
      select: { id: true },
    });

    if (ortuUsers.length > 0) {
      await prisma.notification.createMany({
        data: ortuUsers.map((u: { id: string }) => ({
          userId: u.id,
          type: "GALLERY_NEW",
          title: "Foto Baru di Galeri",
          content: caption || "Ada foto baru di galeri sekolah",
          link: "/gallery",
        })),
      });
    }

    return NextResponse.json(
      { success: true, itemId: item.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal mengunggah foto" },
      { status: 500 }
    );
  }
}
