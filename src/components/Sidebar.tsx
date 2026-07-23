"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Image,
  MessageSquare,
  BookOpen,
  Megaphone,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <Home className="w-5 h-5" />, roles: ["ADMIN", "GURU", "ORTU"] },
  { label: "Galeri", href: "/gallery", icon: <Image className="w-5 h-5" />, roles: ["ADMIN", "GURU", "ORTU"] },
  { label: "Forum", href: "/forum", icon: <MessageSquare className="w-5 h-5" />, roles: ["ADMIN", "GURU", "ORTU"] },
  { label: "E-Learning", href: "/materials", icon: <BookOpen className="w-5 h-5" />, roles: ["ADMIN", "GURU", "ORTU"] },
  { label: "Pengumuman", href: "/announcements", icon: <Megaphone className="w-5 h-5" />, roles: ["ADMIN"] },
];

export default function Sidebar({
  role,
  userName,
}: {
  role: string;
  userName: string;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-border shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-border transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-primary">SekolahHub</h1>
            <p className="text-sm text-muted-foreground mt-1">{userName}</p>
            <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
              {role === "ADMIN" ? "Admin Sekolah" : role === "GURU" ? "Guru" : "Orang Tua"}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
