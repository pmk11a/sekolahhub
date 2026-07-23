# 🗄️ Database Remote — Coding Local

Strategi: **Database di hosting/cloud**, **Aplikasi development di laptop**.

---

## ✅ Opsi Database Remote (Pilih Salah Satu)

### Opsi 1: Railway.app (RECOMMENDED — Gratis)
- ✅ Free tier: $5 credit/bulan (cukup untuk dev)
- ✅ PostgreSQL langsung jadi
- ✅ SSL otomatis
- ✅ URL connection langsung dapat

**Setup:**
1. Daftar di https://railway.app
2. New Project → PostgreSQL
3. Tunggu database ready
4. Copy `DATABASE_URL` dari Variables tab
5. Paste ke `.env.local`

### Opsi 2: Neon.tech (Gratis Selamanya)
- ✅ Free tier: 500MB database
- ✅ Serverless PostgreSQL
- ✅ Connection string otomatis

**Setup:**
1. Daftar di https://neon.tech
2. New Project → Create Database
3. Copy Connection String (beri centang "Save Password")
4. Paste ke `.env.local`

### Opsi 3: Supabase (Gratis)
- ✅ Free: 500MB database
- ✅ PostgreSQL + Auth + Realtime
- ✅ Bagus untuk production nanti

**Setup:**
1. Daftar di https://supabase.com
2. New Project
3. Project Settings → Database → Connection String
4. Pilih "Transaction mode" (Pooled)
5. Copy URI → paste ke `.env.local`

### Opsi 4: Shared Hosting cPanel (Jika Punya)
Banyak shared hosting sekarang offer MySQL/PostgreSQL:

**Di cPanel:**
1. Go to **MySQL® Databases**
2. Create database baru
3. Create user + password
4. Assign user ke database (all privileges)
5. Connection info:
   - Host: `localhost` atau `dbXXX.domain.com`
   - Database: `user_dbname`
   - User: `user_dbuser`
   - Password: `yourpassword`

---

## 🔧 Setup di Laptop (Local)

### 1. Buat `.env.local` (JIANGAN DI-COMMIT!)

```env
# Database Remote (Railway/Neon/Supabase/cPanel)
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"

# NextAuth
NEXTAUTH_SECRET="rahasia-kamu-yang-random"
NEXTAUTH_URL="http://localhost:3000"

# Development
NODE_ENV="development"
```

### 2. Contoh Connection String per Provider

**Railway:**
```
postgresql://postgres:ABC123XYZ@ep-cool-darkness-123456.ap-southeast-1.postgres.vercel-storage.com:5432/nezha?sslmode=require
```

**Neon:**
```
postgresql://neondb_owner:npg_xxxxx!xyz@ep-jade-heart-123456.us-east-1.postgres.neon.tech/neondb?sslmode=require
```

**Supabase:**
```
postgresql://postgres.XXXXX:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**cPanel Shared Hosting:**
```
postgresql://cpuser_dbname:password@localhost:5432/cpuser_dbname
```
atau
```
mysql://cpuser_dbname:password@localhost/cpuser_dbname
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Push Schema ke Database Remote
```bash
npx prisma db push
```

### 6. Seed Database (Opsional)
Jika ada seed script:
```bash
npx prisma db seed
```

### 7. Run Development
```bash
npm run dev
```

---

## 🔄 Workflow Harian

```
LAPTOP (Coding)          →          DATABASE (Remote)
┌─────────────┐                          ┌──────────────┐
│  VS Code    │   npx prisma db push     │              │
│  npm run dev│ ────────────────────────→ │  Railway/    │
│  .env.local │                          │  Neon/       │
└─────────────┘                          │  Supabase/   │
                                         │  cPanel      │
                                         └──────────────┘
```

1. **Koding** di laptop (Next.js dev server)
2. **npx prisma db push** → sync schema ke remote DB
3. **npm run dev** → jalankan app, connect ke remote DB
4. Testing semua fitur online

---

## ⚠️ Penting!

### File yang HARUS di-.gitignore:
```
.env.local
.env.production
.env.*.local
```

### File yang BOLEH di-commit:
```
.env.example        ← template, tanpa nilai real
```

### Jangan pernah commit:
- ❌ `.env.local` (ada password database!)
- ❌ `.env.production`
- ❌ File apapun yang berisi credentials

---

## 🧪 Test Koneksi

```bash
# Test Prisma connection
npx prisma db pull

# Jika berhasil, artinya koneksi ke remote DB OK
```

Atau test via code:
```bash
# Buat file test-db.ts sementara
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('✅ Connected to database!'))
  .catch(e => console.error('❌ Error:', e.message))
  .finally(() => prisma.\$disconnect());
"
```

---

## 🚀 Nanti Kalau Mau Production

Ketika mau deploy ke production:

1. **Database**: Tetap pakai yang sama (Railway/Neon/Supabase)
2. **Aplikasi**: Deploy ke Vercel/Railway/VPS
3. **Environment Variables**: Set di platform deployment
4. **DATABASE_URL**: Copy dari provider database ke production env

Tidak perlu pindah database! Tinggal pindahkan connection string ke production env.

---

## 💡 REKOMENDASI SAYA

Untuk SekolahHub:

| Tahap | Database | Biaya |
|-------|----------|-------|
| **Development** | Railway Free / Neon Free | Rp 0 |
| **Production** | Railway Pro / Supabase Pro | $5-10/bln |

**Mulai dari Railway atau Neon** — gratis, mudah, dan bisa upgrade ke production tanpa migrasi database (connection string tinggal ganti).
