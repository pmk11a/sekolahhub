"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Megaphone, Plus, Loader2, Calendar, User, Tag } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: { name: string; role: string };
  category: string;
  isPinned?: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then(setAnnouncements)
      .catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category: category || "Umum" }),
      });
      setShowCreate(false);
      setTitle(""); setContent(""); setCategory("");
      const res = await fetch("/api/announcements");
      setAnnouncements(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pengumuman</h1>
          <p className="text-muted-foreground mt-1">Informasi dan pengumuman penting</p>
        </div>
        {(session?.user?.role === "ADMIN" || session?.user?.role === "GURU") && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Pengumuman Baru
          </button>
        )}
      </div>
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-5">Buat Pengumuman</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul pengumuman" required className="input-field" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Isi pengumuman..." required rows={5} className="input-field resize-none" />
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Kategori (misal: Akademik, Event, Umum)" className="input-field" />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Menyimpan..." : "Terbitkan Pengumuman"}
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-16 card">
            <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada pengumuman</p>
          </div>
        ) : (
          announcements.map((a) => (
            <div key={a.id} className={"card p-5 " + (a.isPinned ? "border-l-4 border-l-primary" : "")}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {a.isPinned && <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">Pin</span>}
                    <h3 className="font-semibold">{a.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{a.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{a.author.name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(a.createdAt).toLocaleDateString("id-ID")}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{a.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
