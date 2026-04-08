import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Breadcrumb from "@/Components/Breadcrumb";

const steps = [
    {
        title: "Mulai dari menu utama",
        description:
            "Setelah login, halaman pertama yang tampil adalah Menu Utama. Dari sini kamu bisa memilih tujuh menu pembelajaran sesuai kebutuhan.",
    },
    {
        title: "Buka materi yang ingin dipelajari",
        description:
            "Masuk ke menu Materi untuk melihat seluruh daftar materi. Klik salah satu materi untuk membaca isi pembelajaran secara lengkap dan memainkan game interaktif yang muncul di sela-sela materi tertentu.",
    },
    {
        title: "Kerjakan latihan soal",
        description:
            "Setelah mempelajari materi dan game interaktif di dalamnya, buka menu Latihan Soal atau kerjakan quiz pilihan ganda yang tersedia pada akhir halaman materi.",
    },
    {
        title: "Selesaikan tes",
        description:
            "Masuk ke menu Tes untuk mengerjakan evaluasi dengan jumlah soal yang lebih banyak. Kerjakan sampai selesai agar nilainya tercatat.",
    },
    {
        title: "Pantau riwayat belajar",
        description:
            "Buka Riwayat Belajar untuk melihat hasil latihan soal dan tes yang sudah kamu kerjakan.",
    },
];

export default function MediaGuide() {
    return (
        <AppLayout title="Petunjuk Media">
            <Head title="Petunjuk Media" />

            <Breadcrumb
                items={[
                    { label: "Menu Utama", href: "/dashboard" },
                    { label: "Petunjuk Media" },
                ]}
            />

            <section className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
                    Petunjuk penggunaan
                </p>
                <h1 className="mt-3 text-3xl font-bold text-surface-900">
                    Cara menggunakan aplikasi Atomverse
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-surface-500 sm:text-base">
                    Halaman ini membantu pengguna memahami letak materi,
                    bagaimana cara mengambil latihan soal, dan bagaimana
                    menyelesaikan tes sampai hasilnya tercatat di riwayat
                    belajar.
                </p>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-surface-900">
                        Alur belajar yang disarankan
                    </h2>
                    <div className="mt-6 space-y-4">
                        {steps.map((step, index) => (
                            <div
                                key={step.title}
                                className="rounded-2xl border border-surface-200/70 bg-surface-50 px-4 py-4"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-sm font-bold text-white">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-surface-900">
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-surface-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-5">
                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-surface-900">
                            Lokasi fitur penting
                        </h2>
                        <div className="mt-4 space-y-3 text-sm text-surface-600">
                            <div className="rounded-2xl bg-surface-50 px-4 py-3">
                                <span className="font-semibold text-surface-900">
                                    Materi:
                                </span>{" "}
                                buka menu{" "}
                                <Link
                                    href="/materials"
                                    className="font-semibold text-primary-700"
                                >
                                    Materi
                                </Link>
                                .
                            </div>
                            <div className="rounded-2xl bg-surface-50 px-4 py-3">
                                <span className="font-semibold text-surface-900">
                                    Latihan soal:
                                </span>{" "}
                                buka menu{" "}
                                <Link
                                    href="/latihan-soal"
                                    className="font-semibold text-primary-700"
                                >
                                    Latihan Soal
                                </Link>
                                .
                            </div>
                            <div className="rounded-2xl bg-surface-50 px-4 py-3">
                                <span className="font-semibold text-surface-900">
                                    Tes:
                                </span>{" "}
                                buka menu{" "}
                                <Link
                                    href="/tes"
                                    className="font-semibold text-primary-700"
                                >
                                    Tes
                                </Link>
                                .
                            </div>
                            <div className="rounded-2xl bg-surface-50 px-4 py-3">
                                <span className="font-semibold text-surface-900">
                                    Riwayat:
                                </span>{" "}
                                buka menu{" "}
                                <Link
                                    href="/history"
                                    className="font-semibold text-primary-700"
                                >
                                    Riwayat Belajar
                                </Link>
                                .
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-surface-200/70 bg-primary-900 p-6 text-white shadow-sm">
                        <h2 className="text-lg font-bold">Tips penggunaan</h2>
                        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/80">
                            <li>
                                Baca materi terlebih dahulu sebelum membuka
                                latihan soal.
                            </li>
                            <li>
                                Pastikan latihan atau tes disubmit sampai selesai
                                agar hasilnya masuk ke riwayat belajar.
                            </li>
                            <li>
                                Gunakan riwayat belajar untuk memantau progres
                                dan hasil yang sudah dicapai.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
