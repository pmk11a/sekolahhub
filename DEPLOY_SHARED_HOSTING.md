# 🚀 Deploy SekolahHub ke Shared Hosting

## ⚠️ Penting: Shared Hosting Biasanya Tidak Support Next.js Native

Next.js App Router **membutuhkan Node.js server**. Kebanyakan shared hosting (cPanel, Hostinger, Niagahoster, dll) hanya support PHP/Static files.

---

## ✅ Opsi 1: VPS / Cloud Server (RECOMMENDED)

### Provider Murah:
- **Hetzner** — mulai €4.51/bulan
- **DigitalOcean** — mulai $6/bulan  
- **Linode/Akamai** — mulai $5/bulan
- **Vultr** — mulai $2.50/bulan
- **IdCloudHost** (Indonesia) — mulai Rp 50rb/bulan

### Langkah Deploy:

```bash
# 1. SSH ke server
ssh user@your-server-ip

# 2. Install Node.js (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. Clone repository
git clone https://github.com/pmk11a/sekolahhub.git
cd sekolahhub

# 5. Install dependencies
npm install --production

# 6. Setup database
npx prisma generate
npx prisma db push

# 7. Build aplikasi
npm run build

# 8. Setup PM2 untuk process management
npm install -g pm2
pm2 start .next/standalone/server.js --name sekolahhub
pm2 save
pm2 startup

# 9. Setup Nginx reverse proxy
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/sekolahhub
```

### Nginx Config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sekolahhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL dengan Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## ✅ Opsi 2: Shared Hosting dengan Node.js Support

Beberapa shared hosting sudah support Node.js:

### Yang Support Node.js:
- **Hostinger** (plan Business ke atas)
- **Niagahoster** (VPS plan)
- **IDCloudHost** (Cloud VPS)
- **Amitiz** (Node.js hosting)

### Langkah Deploy:

#### 1. Upload File ke Hosting
Upload folder `.next/standalone` via FTP/cPanel File Manager:

```
/public_html/
├── .next/
│   ├── standalone/
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── .env
│   │   └── node_modules/
│   └── ...
├── node_modules/
├── package.json
└── server.js
```

#### 2. Setup Process Manager
Di cPanel → "Setup Node.js App" atau gunakan PM2:

```bash
# Install PM2 di hosting
npm install -g pm2

# Start aplikasi
pm2 start server.js --name sekolahhub

# Save dan auto-start
pm2 save
pm2 startup
```

#### 3. Setup Environment Variables
Buat file `.next/standalone/.env`:
```env
DATABASE_URL="postgresql://user:pass@host:port/dbname"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

#### 4. Setup Reverse Proxy
Di cPanel → "Reverse Proxy" atau edit `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{HTTP:X-Forwarded-Proto} !https
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

ProxyPreserveHost On
ProxyPass / http://localhost:3000/
ProxyPassReverse / http://localhost:3000/
```

---

## ✅ Opsi 3: Static Export (KALAU TIDAK PUNYA NODE.JS)

⚠️ **HANYA UNTUK HALAMAN STATIS** — API routes dan auth tidak akan jalan!

```bash
# Edit next.config.ts
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

```bash
npm run build
# Hasilnya di folder ./out/
# Upload folder ./out/ ke hosting static (Netlify, Vercel, GitHub Pages)
```

---

## 🔑 Checklist Sebelum Deploy

- [ ] `.env` sudah diset dengan production values
- [ ] `DATABASE_URL` pointing ke production database
- [ ] `NEXTAUTH_SECRET` sudah diganti yang random
- [ ] `NEXTAUTH_URL` sudah diganti domain production
- [ ] Prisma schema sudah di-push ke production DB
- [ ] SSL certificate sudah setup
- [ ] Firewall sudah dibuka port 3000 (jika VPS)
- [ ] Database backup sudah ada

---

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
cd .next/standalone
npm install @prisma/client
cd ../..
cp -r node_modules/@prisma .next/standalone/node_modules/
```

### Error: "Database connection failed"
- Pastikan `DATABASE_URL` benar di `.env`
- Cek apakah database bisa diakses dari hosting
- Buka firewall port PostgreSQL jika perlu

### Error: "Port 3000 already in use"
```bash
# Change port
NODE_PORT=3001 pm2 start server.js --name sekolahhub

# Atau kill process
lsof -ti:3000 | xargs kill -9
```

### Error: "Prisma binary not found"
```bash
# Re-generate Prisma
npx prisma generate
```

---

## 💡 REKOMENDASI SAYA

Untuk SekolahHub, **gunakan VPS** karena:
1. ✅ Next.js App Router butuh Node.js server
2. ✅ NextAuth butuh session management
3. ✅ API routes butuh backend processing
4. ✅ Real-time notifications butuh long-running process

**Hosting termurah yang recommended:**
- **Vultr** — $2.50/bulan (USD)
- **Hetzner** — €4.51/bulan
- **IdCloudHost** — Rp 50rb/bulan (local Indonesia, lebih cepat)

Jangan pakai shared hosting PHP biasa — Next.js tidak akan jalan dengan baik.
