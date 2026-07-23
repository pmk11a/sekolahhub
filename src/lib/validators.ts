import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password harus mengandung huruf besar, huruf kecil, dan angka"),
  confirmPassword: z.string(),
  role: z.enum(["ADMIN", "GURU", "ORTU"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password harus mengandung huruf besar, huruf kecil, dan angka"),
});

export const galleryUploadSchema = z.object({
  caption: z.string().optional(),
  category: z.enum(["Kegiatan", "Prestasi", "Kelas"]).optional(),
});

export const forumPostSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  classTag: z.string().optional(),
});

export const forumReplySchema = z.object({
  content: z.string().min(2, "Balasan minimal 2 karakter"),
});

export const materialSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  type: z.enum(["PDF", "VIDEO"]),
  subject: z.string().min(1, "Mata pelajaran wajib diisi"),
  classTag: z.string().optional(),
});

export const announcementSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  targetAudience: z.enum(["ALL", "GURU", "ORTU", "SISWA"]).optional(),
});
