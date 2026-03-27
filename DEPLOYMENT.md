# 🚀 Deployment Guide — Atomverse LMS

Tutorial lengkap deploy **Atomverse** (Laravel 13 + Inertia + React) ke **Shared Hosting** menggunakan **GitHub Actions CI/CD**, beserta setup domain **atomversechemistry.site**.

---

## 📋 Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Persiapan Repository GitHub](#2-persiapan-repository-github)
3. [Setup Shared Hosting](#3-setup-shared-hosting)
4. [Setup Database MySQL](#4-setup-database-mysql)
5. [Konfigurasi .env Production](#5-konfigurasi-env-production)
6. [Setup Domain atomversechemistry.site](#6-setup-domain-atomversechemistrysite)
7. [Setup SSL (HTTPS)](#7-setup-ssl-https)
8. [Setup GitHub Actions Secrets](#8-setup-github-actions-secrets)
9. [Deploy Pertama Kali (Manual)](#9-deploy-pertama-kali-manual)
10. [CI/CD Otomatis via GitHub Actions](#10-cicd-otomatis-via-github-actions)
11. [Post-Deploy: Migrasi & Optimasi](#11-post-deploy-migrasi--optimasi)
12. [Troubleshooting](#12-troubleshooting)
13. [Maintenance & Update](#13-maintenance--update)

---

## 1. Prasyarat

### Shared Hosting harus mendukung:
- **PHP >= 8.3** (cek di cPanel → PHP Version)
- **MySQL 8.0+** atau MariaDB 10.6+
- **Composer** (biasanya sudah terinstall)
- **SSH Access** (untuk menjalankan artisan commands)
- **FTP/SFTP Access** (untuk upload file)
- **Node.js** (opsional di server, karena kita build di CI)

### Tools yang dibutuhkan:
- Akun GitHub (dengan repository `hendsuuu/atomverse`)
- Domain: `atomversechemistry.site` (sudah dibeli)
- Akun shared hosting (contoh: Niagahoster, Hostinger, Dewaweb, Namecheap, dll)

### Rekomendasi Hosting Indonesia yang support Laravel:
| Hosting | SSH | PHP 8.3 | MySQL | Harga |
|---------|-----|---------|-------|-------|
| Niagahoster | ✅ | ✅ | ✅ | ~50rb/bln |
| Hostinger | ✅ | ✅ | ✅ | ~30rb/bln |
| Dewaweb | ✅ | ✅ | ✅ | ~50rb/bln |
| Domainesia | ✅ | ✅ | ✅ | ~40rb/bln |

---

## 2. Persiapan Repository GitHub

### 2.1 Pastikan repo sudah diinisialisasi

```bash
cd c:\laragon\www\atomverse
git init
git remote add origin https://github.com/hendsuuu/atomverse.git
```

### 2.2 Pastikan `.gitignore` sudah benar

File `.gitignore` sudah mengecualikan:
- `.env` (jangan pernah push file ini!)
- `node_modules/`
- `vendor/`
- `public/build/` (akan di-build oleh CI)

### 2.3 Push ke GitHub

```bash
git add .
git commit -m "Initial commit: Atomverse LMS"
git branch -M main
git push -u origin main
```

---

## 3. Setup Shared Hosting

### 3.1 Login ke cPanel

Buka cPanel hosting kamu, biasanya di:
```
https://atomversechemistry.site:2083
atau
https://cpanel.atomversechemistry.site
```

### 3.2 Cek & Set PHP Version

1. Di cPanel → **Select PHP Version** (atau **MultiPHP Manager**)
2. Pilih PHP **8.3** untuk domain kamu
3. Aktifkan extensions berikut:
   - `bcmath`
   - `ctype`
   - `curl`
   - `dom`
   - `fileinfo`
   - `gd`
   - `json`
   - `mbstring`
   - `openssl`
   - `pdo`
   - `pdo_mysql`
   - `tokenizer`
   - `xml`
   - `zip`

### 3.3 Struktur Folder di Hosting

Shared hosting biasanya punya struktur:

```
/home/username/
├── public_html/          ← Document Root (web-accessible)
│   └── (domain files)
├── atomverse/            ← Laravel app (DILUAR public_html!)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── .env
│   ├── artisan
│   └── composer.json
```

**PENTING:** Seluruh file Laravel harus berada **di luar** `public_html/`. Hanya isi folder `public/` yang masuk ke `public_html/`.

### 3.4 Buat folder project

Via SSH:
```bash
cd ~
mkdir atomverse
```

Atau via **cPanel → File Manager**, buat folder `atomverse` di `/home/username/`.

---

## 4. Setup Database MySQL

### 4.1 Buat Database

1. cPanel → **MySQL Databases**
2. Buat database baru: `atomverse_db` (nama lengkap biasanya `username_atomverse_db`)
3. Buat user baru: `atomverse_user` (nama lengkap biasanya `username_atomverse_user`)
4. Password: **buat password yang kuat** (simpan baik-baik!)
5. **Add User to Database** → pilih user dan database → beri **All Privileges**

### 4.2 Catat Kredensial

```
DB_HOST=localhost
DB_DATABASE=username_atomverse_db
DB_USERNAME=username_atomverse_user
DB_PASSWORD=password_yang_kuat
```

---

## 5. Konfigurasi .env Production

### 5.1 Buat file `.env` di server

Via SSH atau File Manager, buat file `/home/username/atomverse/.env`:

```env
APP_NAME=Atomverse
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://atomversechemistry.site

APP_LOCALE=id
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=id_ID

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=username_atomverse_db
DB_USERNAME=username_atomverse_user
DB_PASSWORD=password_yang_kuat

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_PATH=/
SESSION_DOMAIN=atomversechemistry.site

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=file

MAIL_MAILER=smtp
MAIL_HOST=mail.atomversechemistry.site
MAIL_PORT=465
MAIL_USERNAME=noreply@atomversechemistry.site
MAIL_PASSWORD=email_password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="noreply@atomversechemistry.site"
MAIL_FROM_NAME="Atomverse"

VITE_APP_NAME="Atomverse"
```

### 5.2 Generate App Key

Via SSH:
```bash
cd ~/atomverse
php artisan key:generate
```

Atau generate manual di lokal lalu copy-paste value `APP_KEY` ke `.env` server:
```bash
# Di lokal
php artisan key:generate --show
# Output: base64:xxxxxxxxxxxxxxxxxxx=
```

---

## 6. Setup Domain atomversechemistry.site

### 6.1 Pointing Nameserver

Arahkan nameserver domain ke hosting kamu.

**Di tempat beli domain (registrar):**

1. Login ke panel domain (Niagahoster/Namecheap/GoDaddy/dll)
2. Cari pengaturan **Nameserver**
3. Ganti ke nameserver hosting kamu, contoh:
   ```
   ns1.hostingprovider.com
   ns2.hostingprovider.com
   ```
   (Cek email dari hosting untuk nameserver yang benar)

**Atau gunakan DNS Records (jika pakai Cloudflare/DNS pihak ke-3):**

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `IP_SERVER_HOSTING` | 3600 |
| A | www | `IP_SERVER_HOSTING` | 3600 |
| CNAME | www | atomversechemistry.site | 3600 |

> IP server bisa dilihat di cPanel → sidebar kanan → **Shared IP Address**

### 6.2 Add Domain di Hosting

1. cPanel → **Domains** atau **Addon Domains**
2. Tambahkan domain: `atomversechemistry.site`
3. Set Document Root ke: `/home/username/public_html`

### 6.3 Setup Document Root → Point ke Laravel public/

**Metode 1: Symlink (Recommended)**

Via SSH:
```bash
# Backup public_html asli
mv ~/public_html ~/public_html_backup

# Buat symlink dari public_html ke Laravel public folder
ln -s ~/atomverse/public ~/public_html
```

**Metode 2: Modifikasi .htaccess (jika tidak bisa symlink)**

Jika hosting tidak support symlink, copy isi `public/` ke `public_html/` dan edit `index.php`:

1. Copy semua isi `atomverse/public/*` ke `public_html/`
2. Edit `public_html/index.php`:

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Ubah path ke lokasi autoload & app
require __DIR__.'/../atomverse/vendor/autoload.php';

$app = require_once __DIR__.'/../atomverse/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
```

3. Edit `atomverse/bootstrap/app.php` — tambahkan public path override. Atau buat file `atomverse/app/Providers/AppServiceProvider.php` boot method:

```php
// Di AppServiceProvider.php boot()
$this->app->bind('path.public', fn() => base_path('../public_html'));
```

### 6.4 Tunggu Propagasi DNS

DNS propagation memakan waktu **1-48 jam** (biasanya 1-4 jam). Cek status:
- https://dnschecker.org/#A/atomversechemistry.site
- https://www.whatsmydns.net/#A/atomversechemistry.site

---

## 7. Setup SSL (HTTPS)

### 7.1 Let's Encrypt (Gratis)

1. cPanel → **SSL/TLS Status** atau **Let's Encrypt SSL**
2. Pilih domain `atomversechemistry.site`
3. Klik **Issue** / **Install**
4. Centang juga `www.atomversechemistry.site`

### 7.2 Force HTTPS

Tambahkan di `/home/username/public_html/.htaccess` (atau `atomverse/public/.htaccess`):

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Force HTTPS
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # Force non-www ke www (opsional, pilih salah satu)
    # RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
    # RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

    # Laravel routing
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### 7.3 Trusted Proxies (untuk hosting di belakang reverse proxy)

Edit `bootstrap/app.php` atau buat middleware trusted proxies jika diperlukan. Laravel 13 biasanya handle ini otomatis.

---

## 8. Setup GitHub Actions Secrets

### 8.1 Buka Repository Settings

1. Buka https://github.com/hendsuuu/atomverse
2. Klik **Settings** → **Secrets and variables** → **Actions**
3. Tambahkan secrets berikut:

### 8.2 FTP Secrets (Wajib)

| Secret Name | Contoh Value | Keterangan |
|-------------|-------------|------------|
| `FTP_HOST` | `atomversechemistry.site` | Hostname FTP server |
| `FTP_USERNAME` | `username@atomversechemistry.site` | Username FTP |
| `FTP_PASSWORD` | `ftp_password_kamu` | Password FTP |
| `FTP_PORT` | `21` | Port FTP (21=FTP, 22=SFTP) |
| `FTP_SERVER_DIR` | `/home/username/atomverse/` | Path tujuan di server |

### 8.3 SSH Secrets (Opsional, untuk migrasi otomatis)

| Secret Name | Contoh Value | Keterangan |
|-------------|-------------|------------|
| `SSH_HOST` | `atomversechemistry.site` | Hostname SSH |
| `SSH_USERNAME` | `username` | Username SSH (dari cPanel) |
| `SSH_PASSWORD` | `cpanel_password` | Password SSH |
| `SSH_PORT` | `22` | Port SSH |
| `SSH_PROJECT_DIR` | `/home/username/atomverse` | Path project di server |

**Cara mendapatkan kredensial FTP:**
1. cPanel → **FTP Accounts**
2. Buat akun FTP baru atau gunakan main account

**Cara mendapatkan kredensial SSH:**
1. cPanel → **SSH Access** atau **Terminal**
2. Pastikan SSH sudah diaktifkan (mungkin perlu minta ke support hosting)

---

## 9. Deploy Pertama Kali (Manual)

Deploy pertama lebih baik dilakukan manual untuk memastikan semua berjalan.

### 9.1 Build Assets di Lokal

```bash
cd c:\laragon\www\atomverse
npm run build
```

### 9.2 Upload Files via FTP

Gunakan **FileZilla** atau FTP client lainnya:

1. Connect ke server:
   - Host: `atomversechemistry.site`
   - Username: FTP username
   - Password: FTP password
   - Port: 21

2. Upload **semua file** ke `/home/username/atomverse/` **KECUALI:**
   - `.env` (sudah dibuat manual di server)
   - `node_modules/` (tidak perlu)
   - `.git/` (tidak perlu)
   - `tests/` (tidak perlu)
   - `storage/logs/` (biarkan kosong)

3. Upload isi `public/` ke document root (`public_html/` atau sesuai setup)

### 9.3 Setup via SSH

```bash
# Login SSH
ssh username@atomversechemistry.site

# Masuk ke folder project
cd ~/atomverse

# Install composer dependencies (jika belum)
composer install --no-dev --optimize-autoloader

# Generate key (jika belum)
php artisan key:generate

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Buat symlink storage
php artisan storage:link

# Jalankan migrasi database
php artisan migrate --force

# (Opsional) Jalankan seeder untuk data awal
php artisan db:seed --force

# Cache config & routes untuk performa
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 9.4 Verifikasi

Buka browser → `https://atomversechemistry.site`

Jika muncul halaman Atomverse → **Berhasil!** 🎉

---

## 10. CI/CD Otomatis via GitHub Actions

Setelah deploy pertama berhasil, setiap `git push` ke branch `main` akan otomatis deploy.

### 10.1 Workflow File

File sudah dibuat di `.github/workflows/deploy.yml`. Workflow ini:
1. ✅ Checkout kode
2. ✅ Install PHP dependencies (tanpa dev)
3. ✅ Install NPM & build frontend assets
4. ✅ Deploy via FTP ke server
5. ✅ Jalankan migrasi & cache via SSH

### 10.2 Cara Kerja

```
Developer push ke main
        ↓
GitHub Actions triggered
        ↓
Install PHP + Composer (--no-dev)
        ↓
Install Node.js + NPM + Build Vite
        ↓
Upload via FTP ke server
        ↓
SSH → php artisan migrate --force
SSH → php artisan config:cache
SSH → php artisan route:cache
SSH → php artisan view:cache
        ↓
Website updated! ✅
```

### 10.3 Test CI/CD

```bash
# Buat perubahan kecil
git add .
git commit -m "test: CI/CD deployment"
git push origin main
```

Lalu buka https://github.com/hendsuuu/atomverse/actions untuk melihat progress deployment.

### 10.4 Jika Hosting Tidak Support SSH

Jika shared hosting tidak support SSH, hapus step SSH di workflow dan jalankan migrasi manual setelah deploy:

**Alternatif 1: Web-based migration route (HANYA untuk production setup, hapus setelah selesai)**

Buat route sementara di `routes/web.php`:

```php
// HAPUS SETELAH MIGRASI SELESAI!
Route::get('/deploy-migrate/{token}', function (string $token) {
    if ($token !== 'TOKEN_RAHASIA_KAMU_YANG_PANJANG') {
        abort(404);
    }
    Artisan::call('migrate', ['--force' => true]);
    Artisan::call('config:cache');
    Artisan::call('route:cache');
    Artisan::call('view:cache');
    return 'Migration & cache completed! Delete this route now.';
});
```

Akses: `https://atomversechemistry.site/deploy-migrate/TOKEN_RAHASIA_KAMU_YANG_PANJANG`

**⚠️ WAJIB** hapus route ini setelah migrasi selesai!

**Alternatif 2: cPanel Terminal**

Banyak hosting menyediakan terminal di cPanel (cPanel → Terminal). Gunakan itu untuk menjalankan command artisan.

---

## 11. Post-Deploy: Migrasi & Optimasi

### 11.1 Migrasi Database

```bash
cd ~/atomverse
php artisan migrate --force
```

### 11.2 Seeder (data awal, hanya sekali)

```bash
php artisan db:seed --force
```

### 11.3 Cache untuk Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 11.4 File Permissions

```bash
# Pastikan storage & cache writable
chmod -R 775 storage
chmod -R 775 bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache  
# atau chown sesuai user hosting
```

### 11.5 Cron Job (Queue & Scheduler)

Jika menggunakan queue atau task scheduling, setup cron job:

1. cPanel → **Cron Jobs**
2. Tambahkan (setiap menit):

```
* * * * * cd /home/username/atomverse && php artisan schedule:run >> /dev/null 2>&1
```

---

## 12. Troubleshooting

### Error 500 Internal Server Error

```bash
# Cek log error
cat ~/atomverse/storage/logs/laravel.log | tail -50

# Pastikan permissions benar
chmod -R 775 storage bootstrap/cache

# Clear semua cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
```

### Halaman Blank / Tidak Muncul

1. Cek apakah `public/build/` sudah ada (berisi compiled assets)
2. Cek apakah `.env` sudah benar
3. Cek PHP version: `php -v` (harus 8.3+)

### Database Connection Error

```bash
# Test koneksi database
php artisan tinker
>>> DB::connection()->getPdo();
```

Pastikan:
- DB_HOST biasanya `localhost` di shared hosting
- Nama database lengkap (termasuk prefix username)
- User sudah punya privileges

### CSS/JS Tidak Muncul (404 on assets)

1. Pastikan `npm run build` sudah dijalankan
2. Cek folder `public/build/manifest.json` ada
3. Pastikan `APP_URL` di `.env` benar
4. Cek `.htaccess` tidak blocking static files

### Permission Denied

```bash
# Fix ownership
find ~/atomverse/storage -type d -exec chmod 775 {} \;
find ~/atomverse/storage -type f -exec chmod 664 {} \;
find ~/atomverse/bootstrap/cache -type d -exec chmod 775 {} \;
```

### GitHub Actions Gagal Deploy

1. Cek tab **Actions** di GitHub repo
2. Klik workflow yang gagal → lihat log error
3. Pastikan semua Secrets sudah diisi dengan benar
4. Test FTP credentials manual pakai FileZilla

### Mixed Content Warning (HTTP/HTTPS)

Tambahkan di `AppServiceProvider.php` boot():
```php
if (config('app.env') === 'production') {
    \Illuminate\Support\Facades\URL::forceScheme('https');
}
```

---

## 13. Maintenance & Update

### Update Website

```bash
# Di lokal, buat perubahan
git add .
git commit -m "feat: fitur baru"
git push origin main
# GitHub Actions akan auto deploy!
```

### Rollback Migrasi (jika ada masalah)

```bash
cd ~/atomverse
php artisan migrate:rollback --step=1
```

### Maintenance Mode

```bash
# Aktifkan maintenance mode
php artisan down --secret="rahasia-bypass"

# Akses website selama maintenance:
# https://atomversechemistry.site/rahasia-bypass

# Matikan maintenance mode
php artisan up
```

### Backup Database

```bash
# Via SSH
mysqldump -u username_atomverse_user -p username_atomverse_db > backup_$(date +%Y%m%d).sql

# Atau via cPanel → Backup → Download MySQL Database Backup
```

---

## 📝 Checklist Deployment

- [ ] Domain `atomversechemistry.site` pointing ke hosting
- [ ] PHP 8.3 aktif dengan extensions yang dibutuhkan
- [ ] Database MySQL sudah dibuat
- [ ] File `.env` sudah dikonfigurasi di server
- [ ] `APP_KEY` sudah di-generate
- [ ] `APP_DEBUG=false` di production
- [ ] Folder `storage/` dan `bootstrap/cache/` writable (775)
- [ ] `php artisan migrate --force` berhasil
- [ ] `php artisan storage:link` berhasil
- [ ] `npm run build` → `public/build/` ada
- [ ] SSL (HTTPS) aktif
- [ ] Force HTTPS via `.htaccess`
- [ ] GitHub Secrets sudah diisi (FTP + SSH)
- [ ] GitHub Actions deploy berhasil pertama kali
- [ ] Website bisa diakses di `https://atomversechemistry.site`
- [ ] Login dan fitur utama berfungsi

---

## 🔗 Link Penting

- **Repository:** https://github.com/hendsuuu/atomverse
- **GitHub Actions:** https://github.com/hendsuuu/atomverse/actions
- **DNS Check:** https://dnschecker.org/#A/atomversechemistry.site
- **SSL Check:** https://www.ssllabs.com/ssltest/analyze.html?d=atomversechemistry.site
- **Website:** https://atomversechemistry.site
