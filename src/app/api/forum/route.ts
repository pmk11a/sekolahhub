import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { forumPostSchema } from "@/lib/validators";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const classTag = searchParams.get("classTag");

  try {
    const posts = await prisma.forumPost.findMany({
      where: classTag ? { classTag } : {},
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        author: { select: { name: true, role: true } },
        classTag: true,
        createdAt: true,
        likes: { select: { id: true } },
        replies: { select: { id: true } },
      },
    });

    const formatted = posts.map((p: { likes: unknown[]; replies: unknown[] }) => ({
      ...p,
      likeCount: p.likes.length,
      replyCount: p.replies.length,
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json(
      { error: "Gagal memuat forum" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = forumPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const post = await prisma.forumPost.create({
      data: {
        title: parsed.data.title,
        content: parsed.data.content,
        classTag: parsed.data.classTag || undefined,
        authorId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        classTag: true,
        createdAt: true,
        author: { select: { name: true, role: true } },
      },
    });

    // Notifikasi ke semua ortu
    const ortuUsers = await prisma.user.findMany({
      where: { role: "ORTU" },
      select: { id: true },
    });

    if (ortuUsers.length > 0) {
      await prisma.notification.createMany({
        data: ortuUsers.map((u: { id: string }) => ({
          userId: u.id,
          type: "FORUM_REPLY",
          title: "Thread Forum Baru",
          content: `Thread baru: ${post.title}`,
          link: `/forum/${post.id}`,
        })),
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat thread" },
      { status: 500 }
    );
  }
}
