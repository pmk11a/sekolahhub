import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { announcementSchema } from "@/lib/validators";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat pengumuman" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Hanya admin yang bisa membuat pengumuman" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const parsed = announcementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
      },
    });

    // Notifikasi ke semua user
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    if (allUsers.length > 0) {
      await prisma.notification.createMany({
        data: allUsers.map((u: { id: string }) => ({
          userId: u.id,
          type: "ANNOUNCEMENT",
          title: "Pengumuman Baru",
          content: `${announcement.title}: ${announcement.content}`,
          link: "/#announcement",
        })),
      });
    }

    return NextResponse.json(announcement, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat pengumuman" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Hanya admin yang bisa mengubah pengumuman" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: { isActive: isActive ?? false },
    });

    return NextResponse.json(announcement);
  } catch {
    return NextResponse.json(
      { error: "Gagal memperbarui pengumuman" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Hanya admin yang bisa menghapus pengumuman" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    }

    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus pengumuman" },
      { status: 500 }
    );
  }
}
