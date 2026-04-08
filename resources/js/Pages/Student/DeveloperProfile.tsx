import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Breadcrumb from "@/Components/Breadcrumb";

const identityItems = [
    { label: "Nama", value: "Meyza Aurelya Nurrahma" },
    { label: "NIM", value: "220331600953" },
    { label: "Program Studi", value: "S1 Pendidikan Kimia" },
    {
        label: "Fakultas",
        value: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
    },
    { label: "Universitas", value: "Universitas Negeri Malang" },
];

export default function DeveloperProfile() {
    return (
        <AppLayout title="Profil Pengembang">
            <Head title="Profil Pengembang" />

            <Breadcrumb
                items={[
                    { label: "Menu Utama", href: "/dashboard" },
                    { label: "Profil Pengembang" },
                ]}
            />

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
                        Profil Pengembang
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-surface-900">
                        Meyza Aurelya Nurrahma
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-surface-500">
                        Informasi pengembang media pembelajaran berbasis web
                        pada materi perkembangan teori atom.
                    </p>

                    <div className="mt-8 rounded-3xl border border-dashed border-surface-300 bg-surface-50 p-6">
                        <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-[2rem] bg-[linear-gradient(145deg,#0f172a,#2563eb)] text-white shadow-lg">
                            <div className="text-center">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-2xl font-bold">
                                    MN
                                </div>
                                <p className="mt-4 text-sm font-semibold">
                                    Foto Pengembang
                                </p>
                                <p className="mt-1 text-xs text-white/70">
                                    Area ini siap diganti dengan foto asli.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl bg-primary-900 px-5 py-5 text-white">
                        <p className="text-sm font-semibold">Dosen pembimbing</p>
                        <p className="mt-2 text-lg font-bold">
                            M. Muchson, Ph.D.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-xl font-bold text-surface-900">
                            Identitas pengembang
                        </h2>
                        <div className="mt-5 space-y-3">
                            {identityItems.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl bg-surface-50 px-4 py-4"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface-500">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-sm font-medium leading-relaxed text-surface-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-xl font-bold text-surface-900">
                            Latar belakang dan tujuan pengembangan
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-surface-600">
                            Website pembelajaran ini dikembangkan sebagai media
                            pembelajaran berbasis web dengan bantuan teknologi
                            Artificial Intelligence (AI) pada materi
                            perkembangan teori atom. Media ini bertujuan untuk
                            membantu siswa memahami konsep perkembangan teori
                            atom secara lebih interaktif, menarik, dan mudah
                            dipahami.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-surface-200/70 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-xl font-bold text-surface-900">
                            Kontak pengembang
                        </h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <a
                                href="mailto:meyzaaurelya4524@gmail.com"
                                className="rounded-2xl bg-surface-50 px-4 py-4 transition-colors hover:bg-surface-100"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface-500">
                                    Email
                                </p>
                                <p className="mt-2 text-sm font-medium text-surface-900">
                                    meyzaaurelya4524@gmail.com
                                </p>
                            </a>
                            <a
                                href="https://instagram.com/mzaaurel"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl bg-surface-50 px-4 py-4 transition-colors hover:bg-surface-100"
                            >
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface-500">
                                    Instagram
                                </p>
                                <p className="mt-2 text-sm font-medium text-surface-900">
                                    @mzaaurel
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
