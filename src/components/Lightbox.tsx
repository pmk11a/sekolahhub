"use client";

import { X } from "lucide-react";

interface GalleryItemData {
  id: string;
  imageUrl: string;
  caption?: string;
  category?: string;
  createdAt: string;
}

export default function Lightbox({ item, onClose }: { item: GalleryItemData | null; onClose: () => void }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={item.imageUrl}
          alt={item.caption || "Gallery image"}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
        <div className="mt-4 text-white">
          {item.caption && <p className="text-lg font-medium">{item.caption}</p>}
          {item.category && <p className="text-sm text-gray-300 mt-1">Kategori: {item.category}</p>}
        </div>
      </div>
    </div>
  );
}
