# Waduh Database ke Hosting - Step by Step

Panduan lengkap setup database MySQL di shared hosting cPanel untuk SekolahHub.

---

## Persiapan

Yang kamu butuhkan:
1. Akun shared hosting (Hostinger/Niagahoster/Idcloudhost)
2. Login cPanel
3. Database name: pmkmyid_cpuser_sekolahhub (sudah dibuat)
4. Password database (yang kamu buat)

---

## STEP 1: Cek Database di cPanel

1. Login ke cPanel
   - Buka: https://domainkamu.com/cpanel atau https://cpanel.hostingkamu.com
   - Username: dari email welcome hosting
   - Password: dari email welcome hosting

2. Cek Database Sudah Ada
   - Scroll ke bagian Databases
   - Klik MySQL Databases
   - Di section Current Databases, cari: pmkmyid_cpuser_sekolahhub
   - Jika ada = database sudah dibuat

3. Cek User Database
   - Scroll ke bawah ke section Current Users
   - Cari user yang terkait dengan database tersebut
   - Jika tidak ada, buat user baru:
     - Username: cpuser_sekolahhub_admin
     - Password: buat password kuat (minimal 8 karakter, huruf besar+kecil+angka)
     - Klik Create User

4. Assign User ke Database
   - Scroll ke section Add User to Database
   - Pilih user yang sudah dibuat
   - Pilih database pmkmyid_cpuser_sekolahhub
   - Klik Add
   - Centang ALL PRIVILEGES
   - Klik Submit

5. Catat Info Database
   Host: localhost
   Database: pmkmyid_cpuser_sekolahhub
   User: (username yang tadi dibuat)
   Password: (password yang kamu buat)
   Port: 3306 (default)

---

## STEP 2: Setup di Laptop

### 2.1 Edit .env.local

Buka file .env.local di folder proyek:

DATABASE_URL="mysql://pmkmyid_cpuser_sekolahhub:PASSWORD_AKAMU@localhost/pmkmyid_cpuser_sekolahhub"
NEXTAUTH_SECRET="sekolahhub-super-secret-key-production-2024-random-string"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"

GANTI:
- PASSWORD_AKAMU dengan password database真实 dari cPanel
- NEXTAUTH_SECRET bisa pakai yang sudah ada atau generate yang baru

### 2.2 Install Dependencies

npm install

### 2.3 Test Koneksi Database

Ini akan test koneksi ke database hosting:
npx prisma db pull

Jika berhasil = Koneksi OK! Lanjut ke step berikutnya.

Jika error:
- Access denied = Password salah
- Cant connect to MySQL server = Host/port salah atau database tidak aktif
- Unknown database = Database name salah

Perbaiki error di atas, lalu coba lagi.

### 2.4 Push Schema ke Database

Ini akan create semua tabel di database hosting:
npx prisma db push

Output yang diharapkan:
Your database has been synced successfully!

### 2.5 Generate Prisma Client

npx prisma generate

### 2.6 Build Production

npm run build

Jika berhasil, build output ada di folder .next/standalone/

---

## STEP 3: Upload ke Hosting

### 3.1 Via FileZilla (FTP)

1. Download & Install FileZilla: https://filezilla-project.org

2. Login ke Hosting:
   Host: sftp://domainkamu.com (atau IP hosting)
   Username: cpuser (dari email welcome)
   Password: (password cPanel)
   Port: 21 (atau 22 untuk SFTP)

3. Navigasi ke Root Domain:
   Di kanan (remote site), buka folder public_html atau www

4. Upload File:
   Di kiri (local site), buka folder .next/standalone/
   Select ALL file dan folder di dalam .next/standalone/
   Drag & drop ke folder public_html di kanan

File yang ter-upload:
public_html/
- server.js
- package.json
- .env
- .next/
- node_modules/ (akan diinstall nanti)

### 3.2 Via cPanel File Manager (Alternatif)

1. Login cPanel
2. Buka File Manager
3. Masuk ke public_html
4. Upload file-file dari .next/standalone/

---

## STEP 4: Setup di Hosting

### 4.1 Buat File .env di Hosting

Via cPanel File Manager:

1. Masuk public_html
2. Klik Settings (pojok kanan atas)
3. Centang Show Hidden Files (.env adalah hidden file)
4. Klik + File nama: .env
5. Klik Create
6. Klik Edit pada file .env yang baru dibuat
7. Isi konten:

DATABASE_URL="mysql://pmkmyid_cpuser_sekolahhub:PASSWORD_AKAMU@localhost/pmkmyid_cpuser_sekolahhub"
NEXTAUTH_SECRET="sekolahhub-super-secret-key-production-2024-random-string"
NEXTAUTH_URL="https://domainkamu.com"
NODE_ENV="production"
PORT=3000

PENTING:
- Ganti PASSWORD_AKAMU dengan password database真实
- Ganti domainkamu.com dengan domain真实
- NEXTAUTH_SECRET HARUS SAMA dengan yang di laptop

8. Klik Save

### 4.2 Install Dependencies

Via SSH:
cd ~/public_html
npm install --production

Atau via cPanel Setup Node.js App:
1. Klik Setup Node.js App
2. Klik Create Application
3. Isi:
   - Node.js version: v20.x
   - Application root: /home/cpuser/public_html
   - Application URL: pilih domain kamu
   - Application startup file: server.js
4. Klik Create
5. Klik Go to application
6. Klik Run NPM Install

Tunggu sampai selesai.

---

## STEP 5: Jalankan Aplikasi

Via cPanel Setup Node.js App:
1. Di halaman application yang sama
2. Klik Start Application
3. Status harus berubah jadi Running

Via SSH:
pm2 start server.js --name sekolahhub
pm2 save
pm2 startup

---

## STEP 6: Setup SSL & Domain

### 6.1 Point Domain ke Hosting

Di panel domain/DNS Management:

Type: A
Name: @
Value: IP_ADDRESS_HOSTING (cari di email welcome hosting)

Type: CNAME
Name: www
Value: domainkamu.com

Tunggu propagasi DNS (bisa 1-24 jam).

### 6.2 Setup SSL (HTTPS)

Via cPanel:
1. Buka Let's Encrypt atau SSL/TLS
2. Pilih domain kamu
3. Klik Issue atau Install
4. Centang Force HTTPS Redirect
5. Klik Submit

Tunggu SSL aktif (beberapa menit).

---

## STEP 7: Test Aplikasi

1. Buka browser: https://domainkamu.com

2. Seharusnya muncul halaman login

3. Test fitur:
   - Register akun baru
   - Login dengan akun yang dibuat
   - Dashboard muncul
   - Forum bisa diakses
   - Materials bisa dilihat

4. Cek database di cPanel:
   - MySQL Databases -> phpMyAdmin
   - Buka pmkmyid_cpuser_sekolahhub
   - Cek tabel users -> harus ada data user yang baru dibuat

---

## Troubleshooting

Error: Cannot find module '@prisma/client'
- Re-install dependencies: cd ~/public_html && rm -rf node_modules && npm install --production

Error: Database connection failed
- Cek password di .env (harus sama dengan password database cPanel)
- Cek user database punya akses ke database (ALL PRIVILEGES)
- Pastikan host = localhost

Error: Port already in use
- Ubah PORT di .env: PORT=3001
- Atau kill process yang pakai port tersebut

Aplikasi tidak start
- Cek log: pm2 logs atau cPanel Node.js App logs
- Cek permission files: chmod 755 untuk folder, chmod 644 untuk files
- Pastikan semua file ter-upload dengan benar

Prisma Error
- Regenerate Prisma Client: npx prisma generate
- Validate schema: npx prisma validate
- Pull schema dari database: npx prisma db pull

---

## Checklist Final

[ ] Database pmkmyid_cpuser_sekolahhub sudah dibuat di cPanel
[ ] User database sudah dibuat dan di-assign ke database
[ ] Password database sudah dicatat
[ ] .env.local sudah di-edit dengan password benar
[ ] npx prisma db pull berhasil (koneksi OK)
[ ] npx prisma db push berhasil (tabel ter-create)
[ ] npm run build berhasil
[ ] File .next/standalone/ sudah ter-upload ke hosting
[ ] File .env sudah dibuat di hosting dengan password benar
[ ] Dependencies sudah ter-install (npm install)
[ ] Aplikasi Node.js sudah start (running)
[ ] Domain sudah point ke hosting
[ ] SSL sudah aktif (HTTPS)
[ ] Login/Register test berhasil
[ ] Semua fitur berjalan normal

---

## Tips Penting

1. Selalu backup database sebelum deploy
2. Gunakan strong password untuk database
3. Jangan commit .env.local ke Git (sudah di-gitignore)
4. Test di localhost dulu sebelum upload ke hosting
5. Simpan log error jika ada masalah untuk troubleshooting
6. Monitor resource usage di cPanel (CPU/RAM)
7. Update SSL sebelum expire (Let's Encrypt auto-renew)

---

Semoga berhasil!
