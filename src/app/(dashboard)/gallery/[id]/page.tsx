import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params;
  void id; // Suppress unused warning - used in future API integration
  // In production, fetch from API or DB
  // For now, show a placeholder since we use client-side data fetching
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/gallery" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Galeri
      </Link>
      
      <div className="card p-6 text-center py-16">
        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold mb-2">Detail Foto</h1>
        <p className="text-muted-foreground">
          Klik foto dari galeri untuk melihat detail dalam lightbox.
        </p>
      </div>
    </div>
  );
}
