# 🏫 SekolahHub

Sistem Informasi Manajemen Sekolah (School Management System) modern berbasis Next.js dengan autentikasi multi-role.

## ✨ Fitur Utama

- 🔐 **Autentikasi Multi-Role** — Admin, Guru, Orang Tua
- 📢 **Pengumuman Real-time** — Broadcast ke semua role
- 💬 **Forum Diskusi** — Thread-based discussion board
- 📸 **Galeri Sekolah** — Upload dan kelola foto kegiatan
- 📚 **Materi Pembelajaran** — Share PDF/Video materials
- 🔔 **Notifikasi** — Real-time notification system
- 📊 **Dashboard Analytics** — Overview untuk setiap role

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 |
| Validation | Zod |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |

## 📋 Prerequisites

- Node.js >= 20
- PostgreSQL >= 14
- npm atau yarn

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/sekolahhub.git
cd sekolahhub
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` dan sesuaikan:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sekolahhub"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with sample data
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Dashboard pages
│   │   ├── announcements/
│   │   ├── forum/
│   │   ├── gallery/
│   │   ├── materials/
│   │   └── page.tsx       # Dashboard home
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
├── lib/                   # Utilities & config
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   └── validators.ts     # Zod schemas
├── middleware.ts          # Auth middleware
└── types/                 # TypeScript types
prisma/
└── schema.prisma          # Database schema
```

## 👥 User Roles

| Role | Deskripsi | Akses |
|------|-----------|-------|
| **Admin** | Administrator sekolah | Semua fitur + manage users |
| **Guru** | Teacher | Create content, manage classes |
| **Ortu** | Parent | View only, forum, notifications |

## 🔑 Default Login

Setelah seeding, gunakan kredensial berikut:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@sekolahhub.id` | `Admin123!` |
| Guru | `guru@sekolahhub.id` | `Guru123!` |
| Ortu | `ortu@sekolahhub.id` | `Ortu123!` |

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel deploy
```

### Docker
```bash
docker-compose up --build
```

## 📄 License

MIT © [SekolahHub Team]

## 🤝 Contributing

Pull requests welcome! Untuk perubahan besar, buka issue terlebih dahulu.

---

Dibuat dengan ❤️ oleh SekolahHub Team
