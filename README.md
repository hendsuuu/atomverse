# Atomverse

Atomverse adalah platform pembelajaran (LMS) berbasis Laravel + Inertia + React dengan dua role utama:

- `superadmin`: kelola user, course, material, quiz, dan final test.
- `user` (student): akses materi, kerjakan quiz/exam, pantau progres.

## Dokumentasi

- Dokumentasi sistem lengkap: [`SYSTEM_DOCUMENTATION.md`](SYSTEM_DOCUMENTATION.md)
- Panduan deployment production: [`DEPLOYMENT.md`](DEPLOYMENT.md)

## Quick Start

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
npm install
composer dev
```

Seed data contoh:

```bash
php artisan db:seed
```

## Akun Sample Seeder

- Admin: `admin@atomverse.com` / `password`
- Student: `student@atomverse.com` / `password`

## Testing

```bash
php artisan test
```
