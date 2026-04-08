import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

interface Props {
    studentName: string;
    menuStats: {
        materials: number;
        practice: number;
        tests: number;
        history: number;
    };
}

const menuItems = [
    {
        number: "01",
        title: "Petunjuk Media",
        description:
            "Pelajari alur penggunaan aplikasi mulai dari membuka materi, latihan soal, hingga menyelesaikan tes.",
        href: "/petunjuk-media",
        accent: "from-sky-500 to-cyan-500",
    },
    {
        number: "02",
        title: "Kompetensi Pembelajaran",
        description:
            "Lihat capaian pembelajaran, keterampilan proses, indikator, dan alur tujuan pembelajaran.",
        href: "/kompetensi-pembelajaran",
        accent: "from-indigo-500 to-blue-600",
    },
    {
        number: "03",
        title: "Materi",
        description:
            "Akses seluruh materi perkembangan teori atom yang tersedia pada aplikasi.",
        href: "/materials",
        accent: "from-emerald-500 to-teal-500",
    },
    {
        number: "04",
        title: "Latihan Soal",
        description:
            "Kerjakan seluruh latihan soal yang terhubung dengan materi untuk menguji pemahaman.",
        href: "/latihan-soal",
        accent: "from-amber-500 to-orange-500",
    },
    {
        number: "05",
        title: "Tes",
        description:
            "Selesaikan tes dengan jumlah soal yang lebih banyak sebagai evaluasi akhir.",
        href: "/tes",
        accent: "from-rose-500 to-pink-500",
    },
    {
        number: "06",
        title: "Riwayat Belajar",
        description:
            "Buka riwayat quiz dan ujian yang sudah pernah dikerjakan beserta progres belajarmu.",
        href: "/history",
        accent: "from-violet-500 to-fuchsia-500",
    },
    {
        number: "07",
        title: "Profil Pengembang",
        description:
            "Kenali pengembang, latar belakang pengembangan media, dan kontak yang bisa dihubungi.",
        href: "/profil-pengembang",
        accent: "from-slate-600 to-slate-800",
    },
];

export default function MenuHome({ studentName, menuStats }: Props) {
    const stats = [
        { label: "Materi", value: menuStats.materials },
        { label: "Latihan Soal", value: menuStats.practice },
        { label: "Tes", value: menuStats.tests },
        { label: "Riwayat Tercatat", value: menuStats.history },
    ];

    return (
        <AppLayout title="Menu Utama">
            <Head title="Menu Utama" />

            {/* <section className="mb-8 overflow-hidden rounded-3xl border border-surface-200/70 bg-white shadow-sm">
                <div className="bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_28%),linear-gradient(135deg,#0f172a,#1d4ed8)] px-6 py-8 text-white sm:px-8 sm:py-10">
                    <p className="mb-3 text-sm uppercase tracking-[0.22em] text-white/70">
                        Atomverse
                    </p>
                    <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                        Menu pembelajaran untuk {studentName}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                        Setelah login, kamu langsung masuk ke halaman ini.
                        Gunakan tujuh menu berikut untuk membaca materi,
                        mengerjakan latihan, menyelesaikan tes, melihat
                        riwayat, dan mengenal profil pengembang.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 px-6 py-6 sm:grid-cols-4 sm:px-8">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-surface-200/70 bg-surface-50 px-4 py-4"
                        >
                            <p className="text-2xl font-bold text-surface-900">
                                {item.value}
                            </p>
                            <p className="mt-1 text-sm text-surface-500">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section> */}

            <section>
                <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-surface-900">
                            Menu Utama
                        </h2>
                    </div>
                    <Link
                        href="/petunjuk-media"
                        className="hidden items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100 sm:inline-flex"
                    >
                        Lihat petunjuk
                    </Link>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="group rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                className={`inline-flex rounded-2xl bg-gradient-to-br ${item.accent} px-3 py-2 text-sm font-bold text-white shadow-sm`}
                            >
                                {item.number}
                            </div>
                            <h3 className="mt-5 text-xl font-bold text-surface-900 transition-colors group-hover:text-primary-700">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-surface-500">
                                {item.description}
                            </p>
                            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-primary-700">
                                <span>Buka menu</span>
                                <span className="transition-transform group-hover:translate-x-1">
                                    &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </AppLayout>
    );
}
