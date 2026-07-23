"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, Plus, Loader2, Calendar, User, Download, FileText, FolderOpen } from "lucide-react";
import Link from "next/link";

interface Material {
  id: string;
  title: string;
  description: string;
  author: { name: string; role: string };
  classTag?: string;
  subject?: string;
  type: "pdf" | "doc" | "video" | "link" | "other";
  url: string;
  fileSize?: string;
  createdAt: string;
}

export default function MaterialsPage() {
  const { data: session } = useSession();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [classTag, setClassTag] = useState("");
  const [materialType, setMaterialType] = useState("pdf");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/materials")
      .then((res) => res.json())
      .then(setMaterials)
      .catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, url, subject: subject || undefined, classTag: classTag || undefined, type: materialType }),
      });
      setShowCreate(false);
      setTitle(""); setDescription(""); setUrl(""); setSubject(""); setClassTag("");
      const res = await fetch("/api/materials");
      setMaterials(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
      case "video": return <FolderOpen className="w-5 h-5 text-purple-500" />;
      case "link": return <Download className="w-5 h-5 text-blue-500" />;
      default: return <BookOpen className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Materi Pembelajaran</h1>
          <p className="text-muted-foreground mt-1">Dokumen dan sumber belajar</p>
        </div>
        {(session?.user?.role === "ADMIN" || session?.user?.role === "GURU") && (
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Tambah Materi
          </button>
        )}
      </div>
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-5">Tambah Materi Baru</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Judul materi" required className="input-field" />
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi singkat" required rows={3} className="input-field resize-none" />
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL file atau link" required className="input-field" />
              <select value={materialType} onChange={(e) => setMaterialType(e.target.value)} className="input-field">
                <option value="pdf">PDF</option>
                <option value="doc">Word (DOC)</option>
                <option value="video">Video</option>
                <option value="link">Link URL</option>
                <option value="other">Lainnya</option>
              </select>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Mata pelajaran (opsional)" className="input-field" />
              <input type="text" value={classTag} onChange={(e) => setClassTag(e.target.value)} placeholder="Tag kelas (opsional)" className="input-field" />
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Menyimpan..." : "Tambah Materi"}
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.length === 0 ? (
          <div className="col-span-full text-center py-16 card">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada materi pembelajaran</p>
          </div>
        ) : (
          materials.map((mat) => (
            <Link href={"/materials/" + mat.id} key={mat.id} className="card block hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1">
                  {getFileIcon(mat.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{mat.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{mat.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{mat.author.name}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(mat.createdAt).toLocaleDateString("id-ID")}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {mat.subject && <span className="px-2 py-0.5 bg-secondary rounded-full text-xs">{mat.subject}</span>}
                    {mat.classTag && <span className="px-2 py-0.5 bg-secondary rounded-full text-xs">{mat.classTag}</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
