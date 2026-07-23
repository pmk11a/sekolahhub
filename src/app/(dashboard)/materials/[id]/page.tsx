"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { BookOpen, ArrowLeft, Download, Calendar, User, FileText, FolderOpen } from "lucide-react";
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

export default function MaterialDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  void session; // Auth check in future
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetch("/api/materials/" + params.id)
        .then((res) => res.json())
        .then(setMaterial)
        .finally(() => setLoading(false));
    }
  }, [params]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
    </div>
  );

  if (!material) return (
    <div className="text-center py-16 card">
      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground">Materi tidak ditemukan</p>
      <Link href="/materials" className="text-primary hover:underline mt-2 inline-block text-sm">Kembali ke daftar materi</Link>
    </div>
  );

  const getFileIcon = () => {
    switch(material.type) {
      case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
      case "video": return <FolderOpen className="w-5 h-5 text-purple-500" />;
      case "link": return <Download className="w-5 h-5 text-blue-500" />;
      default: return <BookOpen className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/materials" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Kembali ke daftar materi
      </Link>
      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
            {getFileIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">{material.title}</h1>
            <p className="text-muted-foreground mt-1">{material.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-border">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="w-4 h-4" /> {material.author.name}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" /> {new Date(material.createdAt).toLocaleDateString("id-ID")}
          </span>
          {material.subject && <span className="px-3 py-1 bg-secondary rounded-full text-sm">{material.subject}</span>}
          {material.classTag && <span className="px-3 py-1 bg-secondary rounded-full text-sm">{material.classTag}</span>}
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize">{material.type}</span>
        </div>
        <div className="mt-6">
          <a href={material.url} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
            <Download className="w-5 h-5" /> {material.type === "link" ? "Buka Link" : material.type === "video" ? "Putar Video" : "Unduh File"}
          </a>
          {material.fileSize && <p className="text-sm text-muted-foreground mt-2">Ukuran file: {material.fileSize}</p>}
        </div>
      </div>
    </div>
  );
}
