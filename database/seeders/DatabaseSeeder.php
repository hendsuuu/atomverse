<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Material;
use App\Models\MaterialSection;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ──
        $admin = User::factory()->create([
            'name' => 'Admin Atomverse',
            'email' => 'admin@atomverse.com',
            'role' => 'superadmin',
            'is_active' => true,
        ]);

        $student = User::factory()->create([
            'name' => 'Budi Santoso',
            'email' => 'student@atomverse.com',
            'role' => 'user',
            'is_active' => true,
        ]);

        $students = User::factory(5)->create(['role' => 'user', 'is_active' => true]);

        // ── Course: Struktur Atom ──
        $course = Course::create([
            'title' => 'Struktur Atom',
            'slug' => 'struktur-atom',
            'description' => 'Pelajari konsep dasar struktur atom mulai dari perkembangan model atom, partikel penyusun atom, konfigurasi elektron, hingga bilangan kuantum. Dilengkapi dengan video pembelajaran, latihan soal interaktif, dan game drag & drop.',
            'status' => 'published',
            'created_by' => $admin->id,
        ]);

        // Enroll all students
        $course->students()->attach($student->id, ['enrolled_at' => now()]);
        foreach ($students as $s) {
            $course->students()->attach($s->id, ['enrolled_at' => now()->subDays(rand(1, 30))]);
        }

        // ═══════════════════════════════════════════════════
        // MATERIAL 1: Perkembangan Model Atom
        // ═══════════════════════════════════════════════════
        $m1 = Material::create([
            'class_id' => $course->id,
            'title' => 'Perkembangan Model Atom',
            'slug' => 'perkembangan-model-atom',
            'excerpt' => 'Perjalanan panjang penemuan model atom dari Democritus hingga mekanika kuantum modern.',
            'status' => 'published',
            'estimated_read_time' => 15,
            'sort_order' => 1,
            'created_by' => $admin->id,
            'published_at' => now(),
        ]);

        // Section 1.1: Democritus
        MaterialSection::create([
            'material_id' => $m1->id,
            'title' => 'Democritus — Konsep Atomos',
            'slug' => 'democritus-konsep-atomos',
            'sort_order' => 1,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Pada abad ke-5 SM, filsuf Yunani kuno <strong>Democritus</strong> pertama kali memperkenalkan gagasan tentang atom. Ia menyebutnya <em>"atomos"</em> yang berarti <strong>tidak dapat dibagi</strong>.</p>'],
                ['type' => 'callout', 'variant' => 'note', 'content' => 'Kata "atom" berasal dari bahasa Yunani "atomos" = a (tidak) + tomos (dibagi). Menurut Democritus, jika suatu materi terus-menerus dipotong, pada akhirnya akan diperoleh partikel terkecil yang tidak dapat dipotong lagi.'],
                ['type' => 'rich_text', 'content' => '<p>Menurut Democritus, materi tersusun dari partikel-partikel yang:</p><ul><li>Tidak dapat dihancurkan</li><li>Bergerak dalam ruang hampa (vakum)</li><li>Berbeda bentuk dan ukuran untuk zat yang berbeda</li></ul><p>Namun, gagasan ini belum bisa dibuktikan secara eksperimental pada masanya.</p>'],
            ],
        ]);

        // Section 1.2: John Dalton
        MaterialSection::create([
            'material_id' => $m1->id,
            'title' => 'John Dalton — Model Bola Biliar',
            'slug' => 'john-dalton-bola-biliar',
            'sort_order' => 2,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Pada awal abad ke-19, <strong>John Dalton</strong> mengusulkan teori atom modern pertama berdasarkan eksperimen kimia. Dalton menggambarkan atom sebagai <strong>bola pejal yang sangat kecil</strong>, mirip bola biliar.</p>'],
                ['type' => 'callout', 'variant' => 'info', 'content' => 'Teori Dalton didasarkan pada Hukum Kekekalan Massa (Lavoisier) dan Hukum Perbandingan Tetap (Proust).'],
                ['type' => 'rich_text', 'content' => '<h3>Postulat Dalton:</h3><ol><li>Setiap unsur terdiri dari partikel yang sangat kecil yang disebut <strong>atom</strong></li><li>Atom-atom dari unsur yang sama bersifat <strong>identik</strong> (massa dan sifat yang sama)</li><li>Atom-atom unsur yang berbeda memiliki massa dan sifat yang <strong>berbeda</strong></li><li>Atom tidak dapat diciptakan, dimusnahkan, atau dibagi menjadi partikel yang lebih kecil</li><li>Dalam reaksi kimia, atom-atom bergabung dalam perbandingan bilangan bulat sederhana</li></ol>'],
                ['type' => 'callout', 'variant' => 'warning', 'content' => 'Kelemahan: Dalton menyatakan atom tidak dapat dibagi. Namun, penemuan elektron oleh Thomson membuktikan bahwa atom ternyata bisa dibagi lagi menjadi partikel yang lebih kecil.'],
            ],
        ]);

        // Section 1.3: J.J. Thomson
        MaterialSection::create([
            'material_id' => $m1->id,
            'title' => 'J.J. Thomson — Model Roti Kismis',
            'slug' => 'jj-thomson-roti-kismis',
            'sort_order' => 3,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Pada tahun <strong>1897</strong>, <strong>Joseph John Thomson</strong> menemukan <strong>elektron</strong> melalui eksperimen tabung sinar katoda. Penemuan ini membuktikan bahwa atom ternyata <em>bukan</em> partikel terkecil.</p>'],
                ['type' => 'rich_text', 'content' => '<p>Thomson mengajukan model atom yang dikenal sebagai <strong>"Plum Pudding"</strong> atau <strong>"Roti Kismis"</strong>:</p><ul><li>Atom adalah bola bermuatan <strong>positif</strong></li><li>Elektron-elektron bermuatan <strong>negatif</strong> tersebar di dalamnya</li><li>Seperti kismis yang tersebar dalam roti</li></ul>'],
                ['type' => 'embed_youtube', 'videoId' => 'Q3z4C4NNb88'],
                ['type' => 'callout', 'variant' => 'tip', 'content' => 'Bayangkan atom seperti roti bulat, dan elektron-elektron adalah kismis yang tertanam di dalamnya. Muatan positif menyebar merata di seluruh bola, sementara elektron negatif tersebar di dalamnya.'],
            ],
        ]);

        // Section 1.4: Ernest Rutherford
        MaterialSection::create([
            'material_id' => $m1->id,
            'title' => 'Ernest Rutherford — Model Atom Inti',
            'slug' => 'ernest-rutherford-atom-inti',
            'sort_order' => 4,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Pada tahun <strong>1911</strong>, <strong>Ernest Rutherford</strong> melakukan <em>eksperimen hamburan partikel alfa</em> yang terkenal (Gold Foil Experiment). Hasilnya sangat mengejutkan dan mengubah pemahaman tentang struktur atom.</p>'],
                ['type' => 'rich_text', 'content' => '<h3>Hasil Eksperimen:</h3><ol><li>Sebagian besar partikel alfa <strong>menembus</strong> lembaran emas → Atom sebagian besar adalah <strong>ruang hampa</strong></li><li>Beberapa partikel <strong>dibelokkan</strong> → Ada sesuatu yang bermuatan positif di dalam atom</li><li>Sedikit partikel <strong>dipantulkan balik</strong> → Ada inti yang sangat padat dan bermuatan positif</li></ol>'],
                ['type' => 'embed_youtube', 'videoId' => 'WEPMwhNsLbU'],
                ['type' => 'callout', 'variant' => 'info', 'content' => 'Rutherford menemukan bahwa atom memiliki INTI (nukleus) yang sangat kecil, padat, dan bermuatan positif. Elektron mengorbit inti ini, mirip planet mengelilingi matahari.'],
                ['type' => 'callout', 'variant' => 'warning', 'content' => 'Kelemahan: Menurut teori elektromagnetik klasik, elektron yang bergerak mengelilingi inti seharusnya memancarkan energi terus-menerus dan akhirnya jatuh ke inti. Namun kenyataannya atom bersifat stabil.'],
            ],
        ]);

        // Section 1.5: Niels Bohr
        MaterialSection::create([
            'material_id' => $m1->id,
            'title' => 'Niels Bohr — Model Atom Orbit',
            'slug' => 'niels-bohr-orbit',
            'sort_order' => 5,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Pada tahun <strong>1913</strong>, <strong>Niels Bohr</strong> menyempurnakan model Rutherford dengan teori orbit elektron. Model ini sering disebut model <strong>atom planet</strong>.</p>'],
                ['type' => 'rich_text', 'content' => '<h3>Postulat Bohr:</h3><ol><li>Elektron mengorbit inti pada lintasan tertentu yang disebut <strong>orbit</strong> atau <strong>kulit</strong></li><li>Kulit-kulit atom diberi label: <strong>K, L, M, N, O</strong> (sesuai nomor kuantum n = 1, 2, 3, 4, 5)</li><li>Elektron <strong>tidak memancarkan energi</strong> selama bergerak di orbitnya</li><li>Elektron bisa <strong>berpindah kulit</strong> dengan menyerap atau melepaskan energi</li></ol>'],
                ['type' => 'embed_youtube', 'videoId' => 'L3c_9lakU3M'],
            ],
        ]);

        // Section 1.6: Mekanika Kuantum
        MaterialSection::create([
            'material_id' => $m1->id,
            'title' => 'Model Atom Modern (Mekanika Kuantum)',
            'slug' => 'mekanika-kuantum',
            'sort_order' => 6,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Model atom modern didasarkan pada <strong>mekanika kuantum</strong>, yang menggabungkan sifat gelombang dan partikel elektron (dualisme gelombang-partikel).</p>'],
                ['type' => 'rich_text', 'content' => '<h3>Konsep Utama:</h3><ul><li>Posisi elektron tidak dapat ditentukan secara pasti (Prinsip Ketidakpastian Heisenberg)</li><li>Yang bisa diketahui hanyalah <strong>probabilitas</strong> menemukan elektron di suatu daerah</li><li>Daerah probabilitas ini disebut <strong>orbital</strong></li><li>Ada 4 jenis orbital: <strong>s, p, d, f</strong> dengan bentuk yang berbeda-beda</li></ul>'],
                ['type' => 'embed_youtube', 'videoId' => 'pJEk52iN5Rk'],
                ['type' => 'callout', 'variant' => 'tip', 'content' => 'Perbedaan orbit (Bohr) vs orbital (kuantum): Orbit adalah lintasan pasti, sedangkan orbital adalah daerah probabilitas menemukan elektron.'],
            ],
        ]);

        // ═══════════════════════════════════════════════════
        // MATERIAL 2: Partikel Penyusun Atom
        // ═══════════════════════════════════════════════════
        $m2 = Material::create([
            'class_id' => $course->id,
            'title' => 'Partikel Penyusun Atom',
            'slug' => 'partikel-penyusun-atom',
            'excerpt' => 'Mengenal proton, elektron, dan neutron beserta sifat-sifat dan penemu masing-masing partikel subatom.',
            'status' => 'published',
            'estimated_read_time' => 12,
            'sort_order' => 2,
            'created_by' => $admin->id,
            'published_at' => now(),
        ]);

        MaterialSection::create([
            'material_id' => $m2->id,
            'title' => 'Proton',
            'slug' => 'proton',
            'sort_order' => 1,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p><strong>Proton</strong> adalah partikel subatom yang memiliki muatan <strong>positif (+1)</strong>.</p><ul><li>Terletak di dalam <strong>inti atom (nukleus)</strong></li><li>Massa ≈ 1 sma (satuan massa atom)</li><li>Ditemukan oleh <strong>Eugen Goldstein</strong> melalui eksperimen sinar kanal</li><li>Jumlah proton = <strong>nomor atom (Z)</strong></li></ul>'],
                ['type' => 'callout', 'variant' => 'info', 'content' => 'Jumlah proton menentukan identitas suatu unsur. Misalnya, semua atom dengan 6 proton adalah atom Karbon (C), dan semua atom dengan 11 proton adalah atom Natrium (Na).'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m2->id,
            'title' => 'Elektron',
            'slug' => 'elektron',
            'sort_order' => 2,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p><strong>Elektron</strong> adalah partikel subatom yang memiliki muatan <strong>negatif (-1)</strong>.</p><ul><li>Bergerak di <strong>orbital</strong> di sekitar inti atom</li><li>Massa sangat kecil: ≈ 1/1836 massa proton</li><li>Ditemukan oleh <strong>J.J. Thomson</strong> (1897)</li><li>Menentukan sifat <strong>kimia</strong> dan <strong>reaktivitas</strong> suatu unsur</li></ul>'],
                ['type' => 'embed_youtube', 'videoId' => '3zL-bQh8h7E'],
                ['type' => 'callout', 'variant' => 'tip', 'content' => 'Untuk atom netral, jumlah elektron = jumlah proton. Jika atom kehilangan elektron, ia menjadi ion positif (kation). Jika mendapat tambahan elektron, ia menjadi ion negatif (anion).'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m2->id,
            'title' => 'Neutron',
            'slug' => 'neutron',
            'sort_order' => 3,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p><strong>Neutron</strong> adalah partikel subatom yang <strong>tidak bermuatan (netral)</strong>.</p><ul><li>Terletak di dalam <strong>inti atom (nukleus)</strong> bersama proton</li><li>Massa ≈ 1 sma (hampir sama dengan proton)</li><li>Ditemukan oleh <strong>James Chadwick</strong> pada tahun <strong>1932</strong></li><li>Berfungsi sebagai "perekat" yang menjaga stabilitas inti atom</li></ul>'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m2->id,
            'title' => 'Notasi Atom',
            'slug' => 'notasi-atom',
            'sort_order' => 4,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Notasi atom ditulis sebagai: <strong>ᴬ<sub>Z</sub>X</strong></p><ul><li><strong>X</strong> = Lambang unsur</li><li><strong>A</strong> = Nomor massa (jumlah proton + neutron)</li><li><strong>Z</strong> = Nomor atom (jumlah proton)</li></ul><p><strong>Contoh:</strong> ²³₁₁Na (Natrium)</p><ul><li>Proton (p) = 11</li><li>Elektron (e) = 11 (atom netral)</li><li>Neutron (n) = A - Z = 23 - 11 = <strong>12</strong></li></ul>'],
                ['type' => 'callout', 'variant' => 'note', 'content' => 'Rumus sederhana: Neutron = Nomor Massa - Nomor Atom (n = A - Z)'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m2->id,
            'title' => 'Isotop, Isobar, dan Isoton',
            'slug' => 'isotop-isobar-isoton',
            'sort_order' => 5,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<h3>Isotop</h3><p>Atom-atom dari unsur yang <strong>sama</strong> (nomor atom sama) tetapi memiliki <strong>nomor massa berbeda</strong>.</p><p>Contoh: ¹²C dan ¹³C (keduanya Karbon, tapi jumlah neutron berbeda)</p><h3>Isobar</h3><p>Atom-atom dari unsur yang <strong>berbeda</strong> tetapi memiliki <strong>nomor massa sama</strong>.</p><p>Contoh: ¹⁴C dan ¹⁴N (nomor massa sama = 14, tapi unsur berbeda)</p><h3>Isoton</h3><p>Atom-atom yang memiliki <strong>jumlah neutron sama</strong>.</p>'],
                ['type' => 'embed_youtube', 'videoId' => '5pasMF3LQX0'],
            ],
        ]);

        // ═══════════════════════════════════════════════════
        // MATERIAL 3: Konfigurasi Elektron
        // ═══════════════════════════════════════════════════
        $m3 = Material::create([
            'class_id' => $course->id,
            'title' => 'Konfigurasi Elektron',
            'slug' => 'konfigurasi-elektron',
            'excerpt' => 'Cara menentukan susunan elektron dalam atom menggunakan aturan Bohr dan prinsip Aufbau.',
            'status' => 'published',
            'estimated_read_time' => 10,
            'sort_order' => 3,
            'created_by' => $admin->id,
            'published_at' => now(),
        ]);

        MaterialSection::create([
            'material_id' => $m3->id,
            'title' => 'Konfigurasi Elektron Model Bohr',
            'slug' => 'konfigurasi-bohr',
            'sort_order' => 1,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Menurut model Bohr, elektron mengisi kulit atom mengikuti aturan <strong>2n²</strong>, di mana n adalah nomor kulit.</p>'],
                ['type' => 'rich_text', 'content' => '<h3>Jumlah maksimum elektron per kulit:</h3><ul><li>Kulit K (n=1): 2×1² = <strong>2 elektron</strong></li><li>Kulit L (n=2): 2×2² = <strong>8 elektron</strong></li><li>Kulit M (n=3): 2×3² = <strong>18 elektron</strong></li><li>Kulit N (n=4): 2×4² = <strong>32 elektron</strong></li></ul><p><strong>Catatan penting:</strong> Elektron valensi (kulit terluar) maksimal <strong>8 elektron</strong>.</p>'],
                ['type' => 'embed_youtube', 'videoId' => 'fv3-tWgFX4Y'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m3->id,
            'title' => 'Konfigurasi Elektron Mekanika Kuantum (Aufbau)',
            'slug' => 'konfigurasi-aufbau',
            'sort_order' => 2,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Menurut <strong>Prinsip Aufbau</strong>, elektron mengisi subkulit dari tingkat energi <strong>terendah</strong> ke tertinggi.</p>'],
                ['type' => 'rich_text', 'content' => '<h3>Urutan pengisian:</h3><p><strong>1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s → 4d → 5p → 6s → 4f → ...</strong></p><h3>Kapasitas subkulit:</h3><ul><li>s: maksimal <strong>2</strong> elektron</li><li>p: maksimal <strong>6</strong> elektron</li><li>d: maksimal <strong>10</strong> elektron</li><li>f: maksimal <strong>14</strong> elektron</li></ul>'],
                ['type' => 'rich_text', 'content' => '<h3>Contoh:</h3><p><strong>²¹Sc (Skandium, Z=21):</strong></p><p>1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹</p><p><strong>²⁶Fe (Besi, Z=26):</strong></p><p>1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶</p>'],
                ['type' => 'embed_youtube', 'videoId' => 'EcZmL1jI_TA'],
                ['type' => 'callout', 'variant' => 'warning', 'content' => 'Perhatikan! Urutan pengisian BUKAN berdasarkan nomor kulit saja. Subkulit 4s diisi SEBELUM 3d karena energi 4s lebih rendah dari 3d.'],
            ],
        ]);

        // ═══════════════════════════════════════════════════
        // MATERIAL 4: Bilangan Kuantum
        // ═══════════════════════════════════════════════════
        $m4 = Material::create([
            'class_id' => $course->id,
            'title' => 'Bilangan Kuantum',
            'slug' => 'bilangan-kuantum',
            'excerpt' => 'Empat bilangan kuantum yang mendeskripsikan posisi dan sifat elektron dalam atom.',
            'status' => 'published',
            'estimated_read_time' => 10,
            'sort_order' => 4,
            'created_by' => $admin->id,
            'published_at' => now(),
        ]);

        MaterialSection::create([
            'material_id' => $m4->id,
            'title' => 'Bilangan Kuantum Utama (n)',
            'slug' => 'bilangan-kuantum-utama',
            'sort_order' => 1,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Bilangan kuantum utama (<strong>n</strong>) menunjukkan <strong>nomor kulit</strong> atau tingkat energi utama elektron.</p><ul><li>Nilai: n = 1, 2, 3, 4, ... (bilangan bulat positif)</li><li>Semakin besar n, semakin <strong>jauh</strong> elektron dari inti</li><li>Semakin besar n, semakin <strong>besar</strong> energi elektron</li></ul>'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m4->id,
            'title' => 'Bilangan Kuantum Azimut (l)',
            'slug' => 'bilangan-kuantum-azimut',
            'sort_order' => 2,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Bilangan kuantum azimut (<strong>l</strong>) menunjukkan <strong>bentuk orbital</strong> (jenis subkulit).</p><ul><li>Nilai: l = 0, 1, 2, ..., (n-1)</li><li>l = 0 → subkulit <strong>s</strong> (bentuk bola)</li><li>l = 1 → subkulit <strong>p</strong> (bentuk dumbell/halter)</li><li>l = 2 → subkulit <strong>d</strong> (bentuk lebih kompleks)</li><li>l = 3 → subkulit <strong>f</strong> (bentuk sangat kompleks)</li></ul>'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m4->id,
            'title' => 'Bilangan Kuantum Magnetik (m)',
            'slug' => 'bilangan-kuantum-magnetik',
            'sort_order' => 3,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Bilangan kuantum magnetik (<strong>m</strong>) menunjukkan <strong>orientasi orbital</strong> dalam ruang.</p><ul><li>Nilai: m = -l, ..., 0, ..., +l</li><li>Jumlah nilai m = <strong>2l + 1</strong></li></ul><p><strong>Contoh:</strong></p><ul><li>Subkulit s (l=0): m = 0 → <strong>1 orbital</strong></li><li>Subkulit p (l=1): m = -1, 0, +1 → <strong>3 orbital</strong></li><li>Subkulit d (l=2): m = -2, -1, 0, +1, +2 → <strong>5 orbital</strong></li><li>Subkulit f (l=3): m = -3, -2, -1, 0, +1, +2, +3 → <strong>7 orbital</strong></li></ul>'],
            ],
        ]);

        MaterialSection::create([
            'material_id' => $m4->id,
            'title' => 'Bilangan Kuantum Spin (s)',
            'slug' => 'bilangan-kuantum-spin',
            'sort_order' => 4,
            'blocks' => [
                ['type' => 'rich_text', 'content' => '<p>Bilangan kuantum spin (<strong>s</strong>) menunjukkan <strong>arah rotasi</strong> elektron pada porosnya.</p><ul><li>Hanya memiliki 2 nilai: <strong>+½</strong> (spin up ↑) dan <strong>-½</strong> (spin down ↓)</li><li>Setiap orbital maksimal diisi <strong>2 elektron</strong> dengan spin berlawanan (Prinsip Larangan Pauli)</li></ul>'],
                ['type' => 'embed_youtube', 'videoId' => 'G0Hw3aRj73w'],
                ['type' => 'callout', 'variant' => 'info', 'content' => 'Prinsip Larangan Pauli: Tidak ada dua elektron dalam satu atom yang memiliki keempat bilangan kuantum yang sama persis.'],
            ],
        ]);

        // ═══════════════════════════════════════════════════
        // QUIZZES
        // ═══════════════════════════════════════════════════

        // Quiz 1: Perkembangan Model Atom
        $quiz1 = Quiz::create([
            'material_id' => $m1->id,
            'title' => 'Latihan Soal: Perkembangan Model Atom',
            'description' => 'Uji pemahamanmu tentang perkembangan model atom dari Democritus hingga mekanika kuantum.',
            'passing_score' => 60,
            'time_limit_minutes' => 15,
        ]);

        $this->createModelAtomQuestions($quiz1);

        // Quiz 2: Partikel Penyusun Atom
        $quiz2 = Quiz::create([
            'material_id' => $m2->id,
            'title' => 'Latihan Soal: Partikel Penyusun Atom',
            'description' => 'Uji pemahamanmu tentang proton, elektron, neutron, dan notasi atom.',
            'passing_score' => 60,
            'time_limit_minutes' => 15,
        ]);

        $this->createPartikelQuestions($quiz2);

        // Quiz 3: Konfigurasi Elektron
        $quiz3 = Quiz::create([
            'material_id' => $m3->id,
            'title' => 'Latihan Soal: Konfigurasi Elektron',
            'description' => 'Uji kemampuanmu menentukan konfigurasi elektron.',
            'passing_score' => 60,
            'time_limit_minutes' => 10,
        ]);

        $this->createKonfigurasiQuestions($quiz3);

        // Quiz 4: Drag & Drop — Model Atom
        $quiz4 = Quiz::create([
            'material_id' => $m1->id,
            'title' => 'Game: Cocokkan Ilmuwan dengan Model Atom',
            'description' => 'Drag and drop nama ilmuwan ke model atom yang tepat!',
            'passing_score' => 70,
        ]);

        QuizQuestion::create([
            'quiz_id' => $quiz4->id,
            'type' => 'drag_drop',
            'question' => 'Cocokkan setiap ilmuwan dengan model atom yang mereka usulkan!',
            'options' => [
                'items' => ['John Dalton', 'J.J. Thomson', 'Ernest Rutherford', 'Niels Bohr'],
                'targets' => ['Model Bola Biliar', 'Model Roti Kismis (Plum Pudding)', 'Model Atom Inti', 'Model Atom Orbit/Planet'],
            ],
            'correct_answer' => [
                'John Dalton' => 'Model Bola Biliar',
                'J.J. Thomson' => 'Model Roti Kismis (Plum Pudding)',
                'Ernest Rutherford' => 'Model Atom Inti',
                'Niels Bohr' => 'Model Atom Orbit/Planet',
            ],
            'points' => 40,
            'sort_order' => 1,
            'explanation' => 'Dalton = bola pejal, Thomson = roti kismis, Rutherford = inti atom (eksperimen hamburan alfa), Bohr = orbit planet.',
        ]);

        // Quiz 5: Drag & Drop — Penemu Partikel
        $quiz5 = Quiz::create([
            'material_id' => $m2->id,
            'title' => 'Game: Cocokkan Partikel dengan Penemunya',
            'description' => 'Drag and drop partikel subatom ke ilmuwan yang menemukannya!',
            'passing_score' => 70,
        ]);

        QuizQuestion::create([
            'quiz_id' => $quiz5->id,
            'type' => 'drag_drop',
            'question' => 'Cocokkan setiap partikel subatom dengan ilmuwan yang menemukannya!',
            'options' => [
                'items' => ['Proton', 'Elektron', 'Neutron'],
                'targets' => ['Eugen Goldstein', 'J.J. Thomson', 'James Chadwick'],
            ],
            'correct_answer' => [
                'Proton' => 'Eugen Goldstein',
                'Elektron' => 'J.J. Thomson',
                'Neutron' => 'James Chadwick',
            ],
            'points' => 30,
            'sort_order' => 1,
            'explanation' => 'Proton ditemukan oleh Goldstein (sinar kanal), Elektron oleh Thomson (sinar katoda), Neutron oleh Chadwick (1932).',
        ]);
    }

    private function createModelAtomQuestions(Quiz $quiz): void
    {
        $questions = [
            [
                'question' => 'Siapakah yang pertama kali memperkenalkan konsep "atomos" yang berarti tidak dapat dibagi?',
                'options' => ['John Dalton', 'Democritus', 'J.J. Thomson', 'Niels Bohr'],
                'correct_answer' => 'Democritus',
                'explanation' => 'Democritus, filsuf Yunani kuno pada abad ke-5 SM, memperkenalkan istilah "atomos".',
            ],
            [
                'question' => 'Model atom yang menggambarkan atom sebagai bola pejal (bola biliar) dikemukakan oleh...',
                'options' => ['J.J. Thomson', 'Ernest Rutherford', 'John Dalton', 'Erwin Schrödinger'],
                'correct_answer' => 'John Dalton',
                'explanation' => 'Dalton menggambarkan atom sebagai bola pejal yang sangat kecil, seperti bola biliar.',
            ],
            [
                'question' => 'Eksperimen apa yang dilakukan Rutherford untuk menemukan inti atom?',
                'options' => ['Eksperimen tabung sinar katoda', 'Eksperimen hamburan partikel alfa', 'Eksperimen sinar kanal', 'Eksperimen spektrum atom'],
                'correct_answer' => 'Eksperimen hamburan partikel alfa',
                'explanation' => 'Rutherford menembakkan partikel alfa ke lembaran emas tipis (Gold Foil Experiment) pada tahun 1911.',
            ],
            [
                'question' => 'Model atom "Roti Kismis" (Plum Pudding) menggambarkan atom sebagai...',
                'options' => [
                    'Bola pejal yang tidak dapat dibagi',
                    'Bola bermuatan positif dengan elektron tersebar di dalamnya',
                    'Elektron mengorbit inti pada lintasan tertentu',
                    'Awan probabilitas elektron mengelilingi inti',
                ],
                'correct_answer' => 'Bola bermuatan positif dengan elektron tersebar di dalamnya',
                'explanation' => 'Thomson menggambarkan atom sebagai bola positif dengan elektron negatif tersebar di dalamnya.',
            ],
            [
                'question' => 'Menurut model Bohr, elektron bergerak mengelilingi inti pada...',
                'options' => [
                    'Lintasan acak tanpa aturan',
                    'Lintasan tertentu yang disebut orbit/kulit',
                    'Awan probabilitas',
                    'Garis lurus menuju inti',
                ],
                'correct_answer' => 'Lintasan tertentu yang disebut orbit/kulit',
                'explanation' => 'Bohr menyatakan elektron bergerak di orbit/kulit tertentu (K, L, M, N, O).',
            ],
        ];

        foreach ($questions as $i => $q) {
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'type' => 'multiple_choice',
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'points' => 10,
                'sort_order' => $i + 1,
                'explanation' => $q['explanation'],
            ]);
        }
    }

    private function createPartikelQuestions(Quiz $quiz): void
    {
        $questions = [
            [
                'question' => 'Partikel subatom yang ditemukan oleh J.J. Thomson adalah...',
                'options' => ['Proton', 'Elektron', 'Neutron', 'Positron'],
                'correct_answer' => 'Elektron',
                'explanation' => 'Thomson menemukan elektron pada tahun 1897 melalui eksperimen tabung sinar katoda.',
            ],
            [
                'question' => 'Neutron ditemukan oleh...',
                'options' => ['Eugen Goldstein', 'J.J. Thomson', 'Ernest Rutherford', 'James Chadwick'],
                'correct_answer' => 'James Chadwick',
                'explanation' => 'James Chadwick menemukan neutron pada tahun 1932.',
            ],
            [
                'question' => 'Atom ²³₁₁Na memiliki berapa neutron?',
                'options' => ['11', '23', '12', '34'],
                'correct_answer' => '12',
                'explanation' => 'Neutron = A - Z = 23 - 11 = 12.',
            ],
            [
                'question' => 'Atom-atom dari unsur yang sama tetapi memiliki nomor massa berbeda disebut...',
                'options' => ['Isobar', 'Isoton', 'Isotop', 'Isomer'],
                'correct_answer' => 'Isotop',
                'explanation' => 'Isotop = nomor atom sama, nomor massa berbeda. Contoh: C-12 dan C-13.',
            ],
            [
                'question' => 'Partikel yang menentukan identitas suatu unsur adalah...',
                'options' => ['Elektron', 'Neutron', 'Proton', 'Positron'],
                'correct_answer' => 'Proton',
                'explanation' => 'Jumlah proton (nomor atom) menentukan unsur apa atom tersebut.',
            ],
        ];

        foreach ($questions as $i => $q) {
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'type' => 'multiple_choice',
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'points' => 10,
                'sort_order' => $i + 1,
                'explanation' => $q['explanation'],
            ]);
        }
    }

    private function createKonfigurasiQuestions(Quiz $quiz): void
    {
        $questions = [
            [
                'question' => 'Berapa jumlah maksimum elektron pada kulit M (n=3) menurut aturan 2n²?',
                'options' => ['2', '8', '18', '32'],
                'correct_answer' => '18',
                'explanation' => '2 × 3² = 2 × 9 = 18 elektron.',
            ],
            [
                'question' => 'Urutan pengisian subkulit yang benar menurut Prinsip Aufbau adalah...',
                'options' => ['1s, 2s, 2p, 3s, 3p, 3d, 4s', '1s, 2s, 2p, 3s, 3p, 4s, 3d', '1s, 2p, 3s, 3p, 3d, 4s', '1s, 2s, 3s, 2p, 3p, 4s'],
                'correct_answer' => '1s, 2s, 2p, 3s, 3p, 4s, 3d',
                'explanation' => 'Subkulit 4s memiliki energi lebih rendah dari 3d, sehingga diisi terlebih dahulu.',
            ],
            [
                'question' => 'Konfigurasi elektron dari atom Fe (Z=26) adalah...',
                'options' => [
                    '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁸',
                    '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶',
                    '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 4d⁴',
                    '1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²',
                ],
                'correct_answer' => '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶',
                'explanation' => 'Fe (26 elektron): pengisian mengikuti urutan Aufbau: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d⁶.',
            ],
        ];

        foreach ($questions as $i => $q) {
            QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'type' => 'multiple_choice',
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'points' => 10,
                'sort_order' => $i + 1,
                'explanation' => $q['explanation'],
            ]);
        }
    }
}
