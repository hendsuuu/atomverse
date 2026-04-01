# Atomverse - Dokumentasi Sistem Menyeluruh

Dokumen ini merangkum keseluruhan sistem Atomverse berdasarkan implementasi kode saat ini (snapshot: 1 April 2026).

## 1. Ringkasan Sistem

Atomverse adalah Learning Management System (LMS) berbasis web untuk pembelajaran materi kimia, dengan dua peran utama:

- `superadmin`: mengelola user, course, material, section, quiz, exam, dan media.
- `user` (student): mengakses materi, mengerjakan quiz/exam, dan melihat riwayat belajar.

Sistem dibangun sebagai monolith Laravel + Inertia + React, tanpa API publik terpisah.

## 2. Tujuan dan Cakupan Fitur

Fitur utama yang sudah tersedia:

- Autentikasi login/register/logout.
- Role based access (`superadmin` vs `user`) via middleware.
- Manajemen course dan material (termasuk urutan tampilan).
- Editor section materi berbasis blok konten (rich text, callout, quote, image URL, divider, embed YouTube).
- Quiz per material (multiple choice + drag and drop).
- Final test/exam per course (multiple choice + drag and drop).
- Riwayat hasil belajar student (quiz + exam).
- Upload media ke storage publik.
- CI/CD deploy ke shared hosting via GitHub Actions.

## 3. Arsitektur Teknis

## 3.1 Stack Utama

- Backend: Laravel `^13.0` (PHP `^8.3`).
- Frontend: React `^19`, TypeScript, Inertia.js React adapter.
- Styling: Tailwind CSS v4 + custom utility/theme classes.
- Build tool: Vite.
- Database: default SQLite (lokal), production diarahkan ke MySQL/MariaDB.
- Session: driver `database` (default `.env.example`).
- Queue: driver `database`.

## 3.2 Arsitektur Aplikasi

Request flow:

1. Browser hit route `web.php`.
2. Laravel controller memproses business logic + akses model Eloquent.
3. Response dikirim lewat Inertia (`Inertia::render(...)`) ke halaman React.
4. React page menerima props server side dan merender UI.

Tidak ada REST API JSON publik; komunikasi frontend-backend internal menggunakan Inertia form submissions (`post`, `put`, `delete`, `router.get`).

## 3.3 Struktur Folder Penting

- `app/Models`: model domain (User, Course, Material, Quiz, Exam, Attempt, dll).
- `app/Http/Controllers`: controller admin/student/auth.
- `app/Http/Middleware/RoleMiddleware.php`: pembatas role.
- `database/migrations`: skema database.
- `database/seeders/DatabaseSeeder.php`: data awal/sample.
- `resources/js/Pages`: halaman frontend per modul.
- `resources/js/Components`: komponen reusable.
- `routes/web.php`: semua route aplikasi.
- `.github/workflows/deploy.yml`: pipeline CI/CD deploy.
- `DEPLOYMENT.md`: panduan deployment rinci.
- `deploy.sh`: helper script post-deploy.

## 4. Domain Model dan Relasi Data

## 4.1 Entitas Inti

1. `users`
- Informasi user, role (`superadmin|user`), status aktif, avatar, soft delete.

2. `courses`
- Kelas pembelajaran.
- Kolom penting: `title`, `slug`, `description`, `thumbnail`, `status`, `created_by`.

3. `course_user` (pivot)
- Relasi many-to-many course-student + `enrolled_at`.

4. `materials`
- Materi dalam course.
- Kolom penting: `class_id` (FK ke `courses`), `title`, `slug`, `excerpt`, `cover_image`, `status`, `estimated_read_time`, `sort_order`, `published_at`, `created_by`.

5. `material_sections`
- Section di dalam material.
- Kolom penting: `title`, `slug`, `blocks` (JSON), `image`, `image_caption`, `layout_variant`, `sort_order`.

6. `media`
- Metadata file upload.
- Kolom penting: `filename`, `path`, `mime_type`, `size`, `uploaded_by`.

7. `quizzes` dan `quiz_questions`
- Quiz per material + daftar soal.
- `quiz_questions.type`: `multiple_choice` atau `drag_drop`.
- `options` dan `correct_answer` disimpan sebagai JSON.

8. `quiz_attempts`
- Hasil pengerjaan quiz per user.
- Menyimpan `score`, `total_points`, `answers`, `completed_at`.

9. `exams` dan `exam_questions`
- Ujian/final test per course.

10. `exam_attempts`
- Hasil ujian per user.

## 4.2 Relasi Utama (Konseptual)

- User `1..n` Course (creator)
- User `n..n` Course (student enrollment via `course_user`)
- Course `1..n` Material
- Course `1..n` Exam
- Material `1..n` MaterialSection
- Material `1..n` Quiz
- Quiz `1..n` QuizQuestion
- Quiz `1..n` QuizAttempt
- Exam `1..n` ExamQuestion
- Exam `1..n` ExamAttempt

## 4.3 Catatan Penamaan Data

- Di tabel `materials`, foreign key ke course bernama `class_id` (historical naming), tetapi secara domain artinya tetap `course_id`.

## 5. Role, Auth, dan Akses

## 5.1 Auth

- Guest route: `/login`, `/register`.
- Login memakai `Auth::attempt(...)`.
- Redirect setelah login:
  - `superadmin` -> `/admin/dashboard`
  - `user` -> `/dashboard`

## 5.2 Middleware Role

Middleware `role` menerima parameter role, contoh:

- `role:superadmin` untuk route admin.
- `role:user` untuk route student.

Jika role tidak sesuai, user diarahkan kembali ke dashboard sesuai role.

## 5.3 Shared Props Inertia

`HandleInertiaRequests` membagikan:

- `auth.user`
- `flash.success|error|warning|info`

## 6. Alur Bisnis Utama

## 6.1 Alur Admin

1. Admin membuat/ubah course.
2. Admin menambah material dalam course.
3. Admin mengisi section materi via editor blok.
4. Admin menambah quiz untuk material.
5. Admin menambah final test untuk course.
6. Admin memonitor jumlah attempt dan konten.

## 6.2 Alur Student

1. Student membuka daftar course published.
2. Student membaca material + section konten.
3. Student mengerjakan quiz per material.
4. Student melihat hasil quiz dan pembahasan.
5. Student mengerjakan final test per course.
6. Student memantau progres di dashboard dan history.

## 6.3 Perhitungan Skor

### Multiple Choice
- Jawaban benar penuh: `+points`.
- Salah/tidak dijawab: `0`.

### Drag and Drop
- Dibandingkan per pasangan item-target.
- Skor parsial:
  - `correctCount / totalItems * points`, lalu dibulatkan.

### Lulus/Gagal
- Persentase `score / total_points * 100`.
- Lulus jika persentase >= `passing_score`.

## 7. Spesifikasi Konten dan Soal

## 7.1 Blok Konten Material (`material_sections.blocks`)

Jenis blok yang didukung frontend:

- `rich_text`: HTML hasil TipTap.
- `image`: `{ type, url, caption? }`
- `callout`: `{ type, variant: info|warning|tip|note, content }`
- `quote`: `{ type, content, author? }`
- `divider`
- `embed_youtube`: `{ type, videoId }`

## 7.2 Format Soal Quiz/Exam

Tipe soal:

- `multiple_choice`
- `drag_drop`

Properti umum:

- `question`
- `options` (JSON)
- `correct_answer` (JSON)
- `points`
- `explanation`

## 8. Route Map Sistem

Total route aktif: `54` (hasil `php artisan route:list --except-vendor`).

## 8.1 Auth dan Umum

- `GET /` landing/redirect role.
- `GET/POST /login`
- `GET/POST /register`
- `POST /logout`

## 8.2 Admin (`/admin`, middleware `auth + role:superadmin`)

- Dashboard: `/admin/dashboard`
- User CRUD: `/admin/users/*`
- Course CRUD: `/admin/courses/*`
- Material management:
  - `/admin/courses/{course}/materials*`
  - `/admin/materials/{material}*`
  - `/admin/materials/reorder`
- Section management:
  - `/admin/materials/{material}/sections`
  - `/admin/sections/{section}`
  - `/admin/sections/reorder`
- Media upload: `/admin/media/upload`
- Quiz management:
  - `/admin/materials/{material}/quizzes*`
  - `/admin/quizzes/{quiz}*`
- Exam management:
  - `/admin/courses/{course}/exams*`
  - `/admin/exams/{exam}*`

## 8.3 Student (middleware `auth + role:user`)

- Dashboard: `/dashboard`
- Course list/detail: `/courses`, `/courses/{course:slug}`
- Material detail: `/materials/{material:slug}`
- Quiz:
  - `/quizzes/{quiz}`
  - `/quizzes/{quiz}/submit`
  - `/quizzes/result/{attempt}`
- Exam:
  - `/exams/{exam}`
  - `/exams/{exam}/submit`
  - `/exams/result/{attempt}`
- History: `/history`

## 9. Frontend (React + Inertia) by Modul

## 9.1 Layout

- `AuthLayout`: login/register.
- `AdminLayout`: sidebar admin.
- `AppLayout`: top navigation student.

## 9.2 Komponen Kunci

- `RichTextEditor`: editor TipTap untuk blok `rich_text`.
- `ContentBlockRenderer`: render blok konten materi.
- `DragDropGame`: interaksi quiz/exam drag and drop.
- `YouTubePlayer`: lazy-load embed YouTube.
- `FlashMessage`, `Pagination`, `ConfirmDialog`, `ImageUploader`.

## 9.3 Halaman Utama

- Admin:
  - Dashboard
  - User/Course CRUD
  - Material CRUD + section block editor
  - Quiz/Exam form builder (MC + drag/drop)
- Student:
  - Dashboard progres
  - Daftar kelas
  - Reader materi (progress bar, TOC, scrollspy)
  - Quiz/Exam take & result
  - History belajar

## 10. Setup Lokal (Developer Guide)

## 10.1 Prasyarat

- PHP >= 8.3
- Composer
- Node.js + npm
- DB SQLite atau MySQL/MariaDB

## 10.2 Instalasi

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
npm install
```

Jika memakai PowerShell dengan policy terbatas, gunakan `npm.cmd` sebagai pengganti `npm`.

## 10.3 Seed Data Awal

```bash
php artisan db:seed
```

Akun sample dari seeder:

- Admin: `admin@atomverse.com` / `password`
- Student: `student@atomverse.com` / `password`

## 10.4 Menjalankan Aplikasi

```bash
composer dev
```

Atau jalankan terpisah:

```bash
php artisan serve
php artisan queue:listen --tries=1 --timeout=0
npm run dev
```

## 10.5 Build Production Asset

```bash
npm run build
```

## 11. Testing

Perintah test:

```bash
php artisan test
```

Status saat dokumentasi ini dibuat:

- Unit test: 1
- Feature test: 1
- Total: 2 test (basic smoke test)

## 12. Deployment dan Operasional

## 12.1 Referensi Utama

- Lihat detail lengkap: `DEPLOYMENT.md`
- Helper pasca-deploy: `deploy.sh`

## 12.2 Ringkasan CI/CD

Workflow `.github/workflows/deploy.yml`:

1. Checkout code.
2. Install dependency PHP (tanpa dev).
3. Build asset frontend.
4. Deploy via FTP.
5. Opsional SSH command:
   - `php artisan migrate --force`
   - cache config/route/view
   - `php artisan storage:link`

## 12.3 Command `deploy.sh`

Mode:

- `migrate`
- `cache`
- `clear`
- `setup`
- `full` (default)

## 13. Konfigurasi Environment Penting

Variabel utama:

- App:
  - `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_URL`, `APP_DEBUG`
- Database:
  - `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- Session/Cache/Queue:
  - `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION`
- Storage:
  - `FILESYSTEM_DISK`
- Mail:
  - `MAIL_*`

Catatan:

- Default `.env.example` menggunakan:
  - `DB_CONNECTION=sqlite`
  - `SESSION_DRIVER=database`
  - `QUEUE_CONNECTION=database`
  - `CACHE_STORE=database`

## 14. Catatan Keamanan dan Teknis

1. Kontrol akses berbasis role sudah aktif di level route.
2. Konten `rich_text` dirender via `dangerouslySetInnerHTML`; konten admin harus dianggap trusted.
3. Field `is_active` ada di user, tetapi belum dipakai untuk memblok login di `LoginController`.
4. Tabel pivot `course_user` tersedia, tetapi halaman student saat ini menampilkan semua course published (belum filtering enrollment).
5. Test otomatis masih minimal, disarankan tambah test untuk flow kritikal (auth, scoring, role guard, CRUD).

## 15. Roadmap Teknis yang Disarankan

1. Tambah test integration untuk quiz/exam scoring (MC + drag/drop).
2. Tambah validasi/sanitasi HTML server-side untuk blok `rich_text`.
3. Implementasi enforcement `is_active` pada login.
4. Sinkronisasi konsisten format `drag_drop options` antara form admin dan halaman student.
5. Tambah observability (logging terstruktur + error reporting production).

