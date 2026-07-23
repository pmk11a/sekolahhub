# 🚀 Deploy SekolahHub ke Shared Hosting cPanel

Panduan lengkap deploy Next.js + Prisma + MySQL ke shared hosting cPanel (Hostinger, Niagahoster, Idcloudhost, dll).

---

## 📋 Requirements

- ✅ Shared hosting yang support **Node.js** (cek di cPanel → ada "Setup Node.js App" atau "Software")
- ✅ Domain sudah point ke hosting
- ✅ Database MySQL sudah dibuat

### Hosting yang Support Node.js:
| Hosting | Plan Minimum | Harga/bulan |
|---------|-------------|-------------|
| **Hostinger** | Business | Rp 30rb+ |
| **Niagahoster** | Cloud | Rp 50rb+ |
| **IdCloudHost** | Cloud VPS | Rp 75rb+ |
| **Amitiz** | Node.js Hosting | Rp 40rb+ |

❌ **Tidak bisa** di plan Single/Personal (hanya PHP)

---

## 🗄️ Langkah 1: Setup Database (Sudah Selesai)

Database kamu: `pmkmyid_cpuser_sekolahhub`

Yang perlu kamu catat:
- **Host**: `localhost`
- **Database**: `pmkmyid_cpuser_sekolahhub`
- **User**: (buat di cPanel → MySQL Databases)
- **Password**: (yang kamu buat)

---

## 🔧 Langkah 2: Build di Laptop

```bash
# 1. Edit .env.local - GANTI PASSWORD!
# File: .env.local
DATABASE_URL="mysql://pmkmyid_cpuser_sekolahhub:PASSWORD_AKAMU@localhost/pmkmyid_cpuser_sekolahhub"
NEXTAUTH_SECRET="random-string-yang-panjang-dan-acak"
NEXTAUTH_URL="http://localhost:3000"

# 2. Install dependencies
npm install

# 3. Generate Prisma Client
npx prisma generate

# 4. Test koneksi database (INI YANG PENTING!)
npx prisma db pull

# Jika berhasil = koneksi OK!
# Jika error = cek password/host/database name

# 5. Push schema ke database
npx prisma db push

# 6. Build production
npm run build
```

Hasil build ada di folder `.next/standalone/`

---

## 📤 Langkah 3: Upload ke Hosting

### Cara A: Via FTP (FileZilla)

1. Download FileZilla: https://filezilla-project.org
2. Login ke hosting:
   - Host: `sftp://domainkamu.com` (atau IP hosting)
   - Username: `cpuser` (dari email welcome hosting)
   - Password: (password cPanel)
3. Upload isi folder `.next/standalone/` ke root domain:
   ```
   /public_html/  atau  /www/
   ├── server.js
   ├── package.json
   ├── .env
   ├── .next/
   └── node_modules/ (akan diinstall nanti)
   ```

### Cara B: Via cPanel File Manager

1. Login cPanel
2. Buka **File Manager**
3. Masuk ke folder `public_html` atau `www`
4. Upload file-file dari `.next/standalone/`:
   - `server.js`
   - `package.json`
   - `.env` (buat manual, lihat Langkah 4)
   - Folder `.next/`

---

## ⚙️ Langkah 4: Setup di Hosting

### A. Buat File `.env` di Hosting

Via **cPanel File Manager**:
1. Masuk `public_html`
2. Klik **Settings** (pojok kanan atas)
3. Centang **Show Hidden Files** (.env adalah hidden file)
4. Klik **+ File** → nama: `.env`
5. Isi konten:

```env
DATABASE_URL="mysql://pmkmyid_cpuser_sekolahhub:PASSWORD_AKAMU@localhost/pmkmyid_cpuser_sekolahhub"
NEXTAUTH_SECRET="random-string-yang-sama-dengan-di-laptop"
NEXTAUTH_URL="https://domainkamu.com"
NODE_ENV="production"
PORT=3000
```

⚠️ **PENTING:** Ganti `PASSWORD_AKAMU` dengan password database真实!

### B. Install Dependencies

Via **SSH** (jika ada):
```bash
cd ~/public_html
npm install --production
```

Atau via **cPanel → Setup Node.js App**:
1. Klik **Setup Node.js App**
2. Klik **Create Application**
3. Isi:
   - Node.js version: `v20.x` (pilih yang terbaru)
   - Application root: `/home/cpuser/public_html`
   - Application URL: pilih domain kamu
   - Application startup file: `server.js`
4. Klik **Create**
5. Klik **Go to application**
6. Klik **Run NPM Install**

---

## 🏃 Langkah 5: Jalankan Aplikasi

### Via cPanel Setup Node.js App:
1. Klik **Start Application**
2. Tunggu status jadi **Running**
3. Akses `https://domainkamu.com`

### Via SSH:
```bash
pm2 start server.js --name sekolahhub
pm2 save
pm2 startup
```

---

## 🔐 Langkah 6: Setup SSL & Domain

### A. Point Domain ke Hosting

Di panel domain/DNS Management:
```
Type: A
Name: @
Value: IP_ADDRESS_HOSTING (cari di email welcome hosting)

Type: CNAME  
Name: www
Value: domainkamu.com
```

### B. Setup SSL (HTTPS)

Via cPanel:
1. Buka **Let's Encrypt** atau **SSL/TLS**
2. Pilih domain kamu
3. Klik **Issue** atau **Install**
4. Centang **Force HTTPS Redirect**
5. Done!

---

## 🧪 Langkah 7: Test

Akses: `https://domainkamu.com`

Seharusnya muncul halaman login. Test:
1. Register akun baru
2. Login
3. Cek dashboard
4. Test semua fitur

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
# Re-install dependencies
cd ~/public_html
rm -rf node_modules
npm install --production
```

### Error: "Database connection failed"
- Cek password di file `.env` (harus sama dengan password database cPanel)
- Cek user database punya akses ke database
- Pastikan host = `localhost`

### Error: "Port already in use"
- Ubah PORT di `.env`: `PORT=3001`
- Atau kill process yang pakai port tersebut

### Error: "Module not found" untuk gambar/static
- Pastikan folder `.next/` ter-upload lengkap
- Cek permission files (755 folder, 644 files)

### Aplikasi tidak start
Cek log error:
```bash
# Via SSH
pm2 logs sekolahhub

# Atau via cPanel
# Setup Node.js App → klik "Logs"
```

### Prisma Schema Error
```bash
# Regenerate Prisma Client
npx prisma generate

# Validate schema
npx prisma validate

# Pull schema dari database
npx prisma db pull
```

---

## 💰 Estimasi Biaya

| Item | Biaya |
|------|-------|
| Shared Hosting (1 tahun) | Rp 300rb-600rb |
| Domain (.com/.id) | Rp 150rb-200rb/tahun |
| SSL | GRATIS |
| **Total Tahun Pertama** | **Rp 450rb-800rb** |

---

## 📊 Checklist Final

- [ ] Database MySQL sudah dibuat di cPanel
- [ ] User database sudah dibuat dan di-assign ke database
- [ ] Password database sudah dicatat
- [ ] `.env.local` sudah di-edit dengan password benar
- [ ] `npx prisma db push` berhasil (tabel ter-create)
- [ ] `npm run build` berhasil
- [ ] File `.next/standalone/` sudah ter-upload ke hosting
- [ ] File `.env` sudah dibuat di hosting dengan password benar
- [ ] Dependencies sudah ter-install (`npm install`)
- [ ] Aplikasi Node.js sudah start (running)
- [ ] Domain sudah point ke hosting
- [ ] SSL sudah aktif (HTTPS)
- [ ] Login/Register test berhasil
- [ ] Semua fitur berjalan normal

---

## 🎯 Tips

1. **Selalu backup database** sebelum deploy
2. **Gunakan strong password** untuk database
3. **Jangan commit `.env.local`** ke Git (sudah di-gitignore)
4. **Test di localhost dulu** sebelum upload ke hosting
5. **Simpan log error** jika ada masalah untuk troubleshooting

---

## 📞 Butuh Bantuan?

Jika ada error, kirimkan:
1. Log error dari `pm2 logs` atau cPanel Node.js App logs
2. Isi `.env` (tanpa password!)
3. Versi Node.js di hosting

Semoga berhasil! 🚀
