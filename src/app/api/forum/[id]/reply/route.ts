import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { forumReplySchema } from "@/lib/validators";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = forumReplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.issues },
        { status: 400 }
      );
    }

    // Cek apakah post ada
    const post = await prisma.forumPost.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ error: "Thread tidak ditemukan" }, { status: 404 });
    }

    const reply = await prisma.forumReply.create({
      data: {
        content: parsed.data.content,
        postId: id,
        userId: session.user.id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: { select: { name: true, role: true } },
      },
    });

    // Notifikasi ke author post
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: "FORUM_REPLY",
        title: "Balasan Baru di Forum",
        content: `Balasan pada thread: ${post.title}`,
        link: `/forum/${id}`,
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Gagal mengirim balasan" },
      { status: 500 }
    );
  }
}
