"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import Lightbox from "@/components/Lightbox";

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  category?: string;
  createdAt: string;
}

export default function GalleryPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<string>("semua");

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    formData.append("category", category);

    try {
      await fetch("/api/gallery/upload", { method: "POST", body: formData });
      setShowUpload(false);
      setCaption("");
      setFile(null);
      // Refresh list
      const res = await fetch("/api/gallery");
      setItems(await res.json());
    } catch (err) {
      console.error("Upload gagal:", err);
    } finally {
      setUploading(false);
    }
  };

  const filteredItems = filter === "semua" ? items : items.filter((i) => i.category === filter);
  const categories = ["semua", ...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Galeri Foto</h1>
          <p className="text-muted-foreground mt-1">Dokumentasi kegiatan dan prestasi sekolah</p>
        </div>
        {(session?.user?.role === "ADMIN" || session?.user?.role === "GURU") && (
          <button onClick={() => setShowUpload(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Upload Foto
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat || "")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }`}
          >
            {cat === "semua" ? "Semua" : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 card">
          <div className="w-12 h-12 mx-auto text-muted-foreground mb-4 flex items-center justify-center">
            <span className="text-2xl">📷</span>
          </div>
          <p className="text-muted-foreground">Belum ada foto di galeri</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="aspect-square rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow group"
            >
              <img
                src={item.imageUrl}
                alt={item.caption || "Gallery photo"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Upload Foto</h2>
              <button onClick={() => setShowUpload(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Pilih File</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {file ? file.name : "Klik atau seret file ke sini"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (maks 10MB)</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Kategori</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Prestasi">Prestasi</option>
                  <option value="Kelas">Kelas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Caption (opsional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Deskripsi foto..."
                />
              </div>

              <button type="submit" disabled={!file || uploading} className="btn-primary w-full flex items-center justify-center gap-2">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {uploading ? "Mengunggah..." : "Unggah"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedItem && (
        <Lightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
