# 🗄️ Deploy SekolahHub ke Shared Hosting (MySQL)

Panduan lengkap deploy Next.js + Prisma + MySQL ke shared hosting (Hostinger, Niagahoster, Idcloudhost, dll).

---

## 📋 Requirements

| Item | Keterangan |
|------|------------|
| **Shared Hosting** | Yang support Node.js (Hostinger Business+, Niagahoster Cloud, dll) |
| **MySQL Database** | Sudah termasuk di semua shared hosting |
| **Node.js** | Minimal v18 (cek di cPanel → Software → Node.js) |

⚠️ **PENTING:** Tidak semua shared hosting support Node.js! Cek dulu sebelum beli.

### Hosting yang Support Node.js:
- ✅ **Hostinger** — Plan Business ke atas
- ✅ **Niagahoster** — Plan Cloud ke atas  
- ✅ **IdCloudHost** — Plan VPS/Cloud
- ✅ **Amitiz** — Node.js Hosting
- ❌ **Hostinger** — Plan Single/Personal (HANYA PHP)

---

## 🚀 Langkah 1: Setup Database di cPanel

1. **Login cPanel**
2. Buka **MySQL® Databases**
3. **Create Database baru:**
   - Database name: `cpuser_sekolahhub`
   - Klik Create
4. **Create User:**
   - Username: `cpuser_sekolahhub_admin`
   - Password: (buat password kuat, simpan!)
   - Klik Create
5. **Assign User ke Database:**
   - Pilih user dan database yang baru dibuat
   - Privileges: **ALL PRIVILEGES**
   - Klik Submit
6. **Catat info database:**
   ```
   Host:     localhost
   Database: cpuser_sekolahhub
   User:     cpuser_sekolahhub_admin
   Password: (yang tadi dibuat)
   ```

---

## 🚀 Langkah 2: Upload File ke Hosting

### A. Build di Local (Laptop)

```bash
# 1. Edit .env.local dengan info database hosting
DATABASE_URL="mysql://cpuser_sekolahhub:PASSWORD@localhost/cpuser_sekolahhub"
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="https://domainkamu.com"

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Build production
npm run build
```

Hasil build ada di folder `.next/standalone/`

### B. Upload ke Hosting

Via **FTP** atau **cPanel File Manager**:

Upload SEMUA isi folder `.next/standalone/` ke root domain hosting:

```
/public_html/  atau  /www/
├── server.js
├── package.json
├── .env              ← file environment
├── .next/
│   └── standalone/
└── node_modules/     ← (akan diinstall via npm)
```

---

## 🚀 Langkah 3: Setup di Hosting

### A. Install Dependencies

Via **SSH** ke hosting:

```bash
cd ~/public_html
npm install --production
```

Atau via **cPanel → Setup Node.js App**:
1. Klik "Setup Node.js App"
2. Application Root: `/home/cpuser/public_html`
3. Application URL: pilih domain
4. Application Startup File: `server.js`
5. Node.js Version: pilih yang terbaru (v20+)
6. Klik "Set Up"
7. Klik "Run NPM Install"

### B. Buat File `.env` di Hosting

Buat file `.env` di folder yang sama dengan `server.js`:

```env
DATABASE_URL="mysql://cpuser_sekolahhub:PASSWORD@localhost/cpuser_sekolahhub"
NEXTAUTH_SECRET="random-secret-string-yang-sama"
NEXTAUTH_URL="https://domainkamu.com"
NODE_ENV="production"
PORT=3000
```

### C. Jalankan Aplikasi

Via **cPanel → Setup Node.js App**:
1. Klik "Go to Application"
2. Klik "Start Application"

Atau via **SSH**:
```bash
pm2 start server.js --name sekolahhub
pm2 save
pm2 startup
```

---

## 🚀 Langkah 4: Setup Database

### Push Schema ke Database Hosting

```bash
# Di local, setelah edit .env.local
npx prisma db push
```

Atau via SSH di hosting:
```bash
cd ~/public_html
npx prisma db push
```

### Verifikasi Database

```bash
npx prisma db pull
npx prisma validate
```

Jika berhasil, semua tabel sudah ter-create!

---

## 🚀 Langkah 5: Setup Domain & SSL

### A. Point Domain ke Hosting

Di panel domain (DNS Management):
```
Type: A
Name: @
Value: IP_ADDRESS_HOSTING (cari di email welcome hosting)

Type: CNAME
Name: www
Value: domainkamu.com
```

### B. Setup SSL (HTTPS)

Di cPanel:
1. Buka **SSL/TLS** → **Let's Encrypt**
2. Pilih domain
3. Klik Issue
4. Tunggu, SSL aktif otomatis!

Atau via **cPanel → Let's Encrypt**:
1. Klik "Manage" pada domain
2. Centang "Force HTTPS Redirect"
3. Klik Issue/Install

---

## 🔧 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
# Re-install dependencies
cd ~/public_html
rm -rf node_modules
npm install --production
```

### Error: "Database connection failed"
- Cek apakah `DATABASE_URL` benar di file `.env`
- Pastikan user MySQL punya akses dari localhost
- Cek firewall hosting (beberapa hosting block port 3306)

### Error: "Port already in use"
- Setiap app Node.js butuh port berbeda
- Ubah PORT di `.env`: `PORT=3001`

### Error: "Module not found" untuk gambar/static
- Pastikan folder `public/` ter-upload dengan benar
- Cek permission files (755 untuk folder, 644 untuk files)

### Error: "Prisma schema validation failed"
```bash
# Regenerate Prisma Client
npx prisma generate

# Cek schema
npx prisma validate
```

---

## 💰 Biaya

| Item | Biaya |
|------|-------|
| Shared Hosting | Rp 15rb-50rb/bulan |
| Domain (.id) | Rp 150rb/tahun |
| SSL | GRATIS (Let's Encrypt) |
| **Total** | **~Rp 30rb/bulan** |

---

## 📊 Checklist Final

- [ ] Database MySQL sudah dibuat di cPanel
- [ ] File `.next/standalone/` sudah ter-upload
- [ ] `node_modules` sudah ter-install
- [ ] File `.env` sudah diset di hosting
- [ ] `npx prisma db push` sudah dijalankan
- [ ] Aplikasi Node.js sudah start
- [ ] Domain sudah point ke hosting
- [ ] SSL sudah aktif (HTTPS)
- [ ] Login test berhasil
- [ ] Semua fitur berjalan normal

---

## 🎯 Alternatif Lebih Mudah

Kalau setup shared hosting terlalu ribet, pakai **Vercel** (gratis):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy langsung
vercel
```

Vercel:
- ✅ Gratis untuk personal
- ✅ Auto HTTPS/SSL
- ✅ Auto deploy dari Git
- ✅ Support Next.js native
- ✅ Database: tinggal pakai Railway/Neon (lihat DATABASE_REMOTE_SETUP.md)
