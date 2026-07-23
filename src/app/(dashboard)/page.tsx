import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { Image, MessageSquare, BookOpen, Bell } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const role = session.user.role as string;

  let stats: Record<string, number> = {};
  try {
    const where: { uploadedById?: string } = {};
    if (role === "ADMIN" || role === "GURU") {
      where.uploadedById = session.user.id;
    }
    const [galleryCount, forumCount, materialCount] = await Promise.all([
      prisma.galleryItem.count({ where }),
      prisma.forumPost.count({ where: role === "GURU" ? { authorId: session.user.id } : undefined }),
      prisma.learningMaterial.count({ where: { teacherId: session.user.id } }),
    ]);
    stats = { galleryCount, forumCount, materialCount };
  } catch {
    stats = { galleryCount: 0, forumCount: 0, materialCount: 0 };
  }

  const roleLabel = role === "ADMIN" ? "Admin Sekolah" : role === "GURU" ? "Guru" : "Orang Tua";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Selamat datang, {session.user.name || "User"} ({roleLabel})</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Image className="w-5 h-5 text-blue-600" />} label="Foto Galeri" value={stats.galleryCount} color="blue" />
        <StatCard icon={<MessageSquare className="w-5 h-5 text-green-600" />} label="Thread Forum" value={stats.forumCount} color="green" />
        <StatCard icon={<BookOpen className="w-5 h-5 text-purple-600" />} label="Materi Ajar" value={stats.materialCount} color="purple" />
        <StatCard icon={<Bell className="w-5 h-5 text-amber-600" />} label="Notifikasi" value="-" color="amber" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(role === "ADMIN" || role === "GURU") && (
            <QuickActionCard href="/gallery" title="Upload Foto" description="Tambahkan foto ke galeri sekolah" icon={<Image className="w-6 h-6" />} />
          )}
          {(role === "ADMIN" || role === "GURU") && (
            <QuickActionCard href="/forum" title="Buat Thread Baru" description="Mulai diskusi di forum kelas" icon={<MessageSquare className="w-6 h-6" />} />
          )}
          {(role === "ADMIN" || role === "GURU") && (
            <QuickActionCard href="/materials" title="Upload Materi" description="Bagikan materi ajar PDF atau video" icon={<BookOpen className="w-6 h-6" />} />
          )}
          {role === "ADMIN" && (
            <QuickActionCard href="/announcements" title="Buat Pengumuman" description="Tampilkan pengumuman penting" icon={<Bell className="w-6 h-6" />} />
          )}
          <QuickActionCard href="/gallery" title="Lihat Galeri" description="Jelajahi foto kegiatan sekolah" icon={<Image className="w-6 h-6" />} />
          <QuickActionCard href="/forum" title="Forum Diskusi" description="Baca dan balas thread forum" icon={<MessageSquare className="w-6 h-6" />} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-950/30",
    green: "bg-green-50 dark:bg-green-950/30",
    purple: "bg-purple-50 dark:bg-purple-950/30",
    amber: "bg-amber-50 dark:bg-amber-950/30",
  };
  return (
    <div className={`p-5 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
      <div className="flex items-center gap-3 mb-2">{icon}{label}</div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickActionCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="card p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-secondary shrink-0 group-hover:bg-primary/10 transition-colors">{icon}</div>
        <div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </a>
  );
}
