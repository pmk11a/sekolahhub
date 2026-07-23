"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AnnouncementBannerProps {
  title: string;
  content: string;
}

export default function AnnouncementBanner({ title, content }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dismissed-announcement") !== title;
    }
    return true;
  });

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <span className="text-sm font-semibold text-amber-800 dark:text-amber-200 shrink-0">Pengumuman</span>
        <p className="text-sm text-amber-700 dark:text-amber-300 flex-1 truncate">{content}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            localStorage.setItem("dismissed-announcement", title);
          }}
          className="p-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors shrink-0"
        >
          <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </button>
      </div>
    </div>
  );
}
