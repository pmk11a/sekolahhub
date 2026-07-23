import { auth } from "@/lib/auth";
import type { Session } from "next-auth";
import prisma from "@/lib/db";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SekolahHub - CMS Komunikasi Sekolah",
  description: "Platform komunikasi sekolah antara guru, orang tua, dan admin",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <AuthProvider>
          <div className="flex h-screen">
            {session?.user ? (
              <>
                <DashboardLayout session={session}>{children}</DashboardLayout>
              </>
            ) : (
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            )}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

async function DashboardLayout({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const announcements = await prisma.announcement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  return (
    <>
      {announcements.map((a: { id: string; title: string; content: string }) => (
        <AnnouncementBanner key={a.id} title={a.title} content={a.content} />
      ))}
      <Sidebar role={session?.user?.role || ""} userName={session?.user?.name || "User"} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-16 lg:pt-8">
        {children}
      </main>
    </>
  );
}
