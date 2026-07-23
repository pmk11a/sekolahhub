"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Plus, Heart, Reply, Loader2, Calendar, User } from "lucide-react";
import Link from "next/link";
interface ForumPost { id: string; title: string; content: string; author: { name: string; role: string }; classTag?: string; createdAt: string; likeCount: number; replyCount: number; }

export default function ForumPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [classTag, setClassTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => { fetch("/api/forum").then((res) => res.json()).then(setPosts).catch(console.error); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    try {
      await fetch("/api/forum", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, content, classTag: classTag || undefined }) });
      setShowCreate(false); setTitle(""); setContent(""); setClassTag("");
      const res = await fetch("/api/forum"); setPosts(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch("/api/forum/" + postId + "/like", { method: "POST" });
      setLikedPosts((prev) => { const next = new Set(prev); if (next.has(postId)) next.delete(postId); else next.add(postId); return next; });
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likeCount: likedPosts.has(postId) ? p.likeCount - 1 : p.likeCount + 1 } : p));
    } catch (err) { console.error(err); }
  };

  const activePost = posts.find((p) => p.id === selectedPost);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Forum Diskusi</h1>
          <p className="text-muted-foreground mt-1">Diskusi antar guru dan orang tua</p></div>
        {(session?.user?.role === "ADMIN" || session?.user?.role === "GURU") && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2"><Plus className="w-5 h-5" /> Thread Baru</button>
        )}
      </div>
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-5">Buat Thread Baru</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul thread" required className="input-field" />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Isi thread..." required rows={4} className="input-field resize-none" />
              <input type="text" value={classTag} onChange={(e) => setClassTag(e.target.value)} placeholder="Tag kelas (opsional)" className="input-field" />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Menyimpan..." : "Terbitkan"}
              </button>
            </form>
          </div>
        </div>
      )}
      {activePost ? (
        <div className="space-y-4">
          <Link href="/forum" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">Kembali ke daftar forum</Link>
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
              <div><p className="font-semibold">{activePost.author.name}</p>
                <p className="text-xs text-muted-foreground">{activePost.author.role === "GURU" ? "Guru" : "Admin"}</p></div>
              <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(activePost.createdAt).toLocaleDateString("id-ID")}</span>
                {activePost.classTag && <span className="px-2 py-0.5 bg-secondary rounded-full text-xs shrink-0">{activePost.classTag}</span>}
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">{activePost.title}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{activePost.content}</p>
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Balasan ({activePost.replyCount})</h3>
            <p className="text-sm text-muted-foreground text-center py-4">Fitur balasan akan segera hadir</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.length === 0 ? (
            <div className="text-center py-16 card">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada thread diskusi</p>
            </div>
          ) : (
            posts.map((post) => (
              <button key={post.id} onClick={() => setSelectedPost(post.id)} className="card w-full p-5 text-left hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{post.title}</h3>
                      {post.classTag && <span className="px-2 py-0.5 bg-secondary rounded-full text-xs shrink-0">{post.classTag}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author.name}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(post.createdAt).toLocaleDateString("id-ID")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      className={"flex items-center gap-1 text-sm transition-colors " + (likedPosts.has(post.id) ? "text-red-500" : "text-muted-foreground hover:text-red-400")}>
                      <Heart className={"w-4 h-4 " + (likedPosts.has(post.id) ? "fill-current" : "")} />
                      {post.likeCount + (likedPosts.has(post.id) ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Reply className="w-4 h-4" /> {post.replyCount}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
