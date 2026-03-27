import { Head, Link } from "@inertiajs/react";

export default function Welcome() {
    return (
        <>
            <Head title="Atomverse — Modern Learning Platform" />

            <div className="min-h-screen bg-white">
                {/* Navigation */}
                <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary-500/20">
                                    <span className="text-white font-bold text-sm">
                                        A
                                    </span>
                                </div>
                                <span className="font-bold text-xl text-surface-900 tracking-tight">
                                    Atomverse
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="btn-ghost btn-sm"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-primary btn-sm"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl" />
                        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-accent-400/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-primary-200/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-8 border border-primary-100">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                            Platform Pembelajaran Interaktif
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-surface-900 leading-tight tracking-tight">
                            Jelajahi Dunia Sains
                            <br />
                            <span className="text-gradient">
                                Bersama Atomverse
                            </span>
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto leading-relaxed">
                            Platform pembelajaran kimia modern dengan materi
                            interaktif, kuis seru, dan visualisasi yang membantu
                            kamu memahami konsep sains dengan lebih mudah dan
                            menyenangkan.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/register"
                                className="btn-primary btn-lg shadow-lg shadow-primary-500/25 w-full sm:w-auto"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                                Mulai Belajar Gratis
                            </Link>
                            <Link
                                href="/login"
                                className="btn-secondary btn-lg w-full sm:w-auto"
                            >
                                Sudah punya akun? Masuk
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-surface-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900">
                                Cara Belajar di Atomverse
                            </h2>
                            <p className="mt-4 text-surface-500 text-lg max-w-xl mx-auto">
                                Tiga langkah mudah untuk memulai perjalanan
                                belajarmu
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                step={1}
                                title="Pilih Kursus"
                                description="Pilih materi yang ingin kamu pelajari dari koleksi kursus kimia kami yang lengkap dan terstruktur."
                                icon={
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                }
                            />
                            <FeatureCard
                                step={2}
                                title="Baca Materi"
                                description="Pelajari materi interaktif dengan gambar, callout, dan visualisasi yang membantu pemahaman."
                                icon={
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                        />
                                    </svg>
                                }
                            />
                            <FeatureCard
                                step={3}
                                title="Kerjakan Kuis"
                                description="Uji pemahamanmu dengan kuis pilihan ganda dan drag & drop yang interaktif dan menyenangkan."
                                icon={
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                        />
                                    </svg>
                                }
                            />
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <StatCard value="100+" label="Materi Interaktif" />
                            <StatCard value="50+" label="Kuis & Game" />
                            <StatCard value="1000+" label="Siswa Aktif" />
                            <StatCard value="4.9" label="Rating Pengguna" />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 relative overflow-hidden">
                    <div className="absolute inset-0 gradient-primary opacity-95" />
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            Siap Memulai Petualangan Belajar?
                        </h2>
                        <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
                            Bergabunglah dengan ribuan siswa lainnya yang sudah
                            merasakan pengalaman belajar sains yang menyenangkan
                            di Atomverse.
                        </p>
                        <div className="mt-8">
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary-700 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all text-base"
                            >
                                Daftar Sekarang — Gratis!
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-surface-900 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        A
                                    </span>
                                </div>
                                <span className="font-bold text-lg text-white tracking-tight">
                                    Atomverse
                                </span>
                            </div>
                            <p className="text-surface-400 text-sm">
                                &copy; {new Date().getFullYear()} Atomverse. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({
    step,
    title,
    description,
    icon,
}: {
    step: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="card-hover p-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 mb-5">
                {icon}
            </div>
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-600 text-white text-xs font-bold mb-3">
                {step}
            </div>
            <h3 className="text-lg font-semibold text-surface-900 mb-2">
                {title}
            </h3>
            <p className="text-surface-500 leading-relaxed">{description}</p>
        </div>
    );
}

function StatCard({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-primary-600">
                {value}
            </p>
            <p className="mt-1 text-sm text-surface-500">{label}</p>
        </div>
    );
}
