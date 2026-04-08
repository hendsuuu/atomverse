import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Breadcrumb from "@/Components/Breadcrumb";

interface PracticeItem {
    id: number;
    title: string;
    description: string | null;
    questions_count: number;
    passing_score: number;
    time_limit_minutes: number | null;
    material: {
        title: string | null;
        slug: string | null;
    };
    course: {
        title: string | null;
        slug: string | null;
    };
    best_attempt: {
        score: number;
        total_points: number;
        percentage: number | null;
        passed: boolean;
        completed_at: string | null;
    } | null;
}

interface Props {
    practiceItems: PracticeItem[];
}

export default function PracticeIndex({ practiceItems }: Props) {
    return (
        <AppLayout title="Latihan Soal">
            <Head title="Latihan Soal" />

            <Breadcrumb
                items={[
                    { label: "Menu Utama", href: "/dashboard" },
                    { label: "Latihan Soal" },
                ]}
            />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-surface-900">
                    Daftar latihan soal
                </h1>
                <p className="mt-2 text-sm text-surface-500">
                    Semua latihan soal ditampilkan lengkap dengan materi yang
                    terkait.
                </p>
            </div>

            {practiceItems.length === 0 ? (
                <div className="rounded-3xl border border-surface-200/70 bg-white p-8 text-center shadow-sm">
                    <p className="text-surface-500">
                        Belum ada latihan soal yang tersedia.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {practiceItems.map((item) => (
                        <Link
                            key={item.id}
                            href={`/quizzes/${item.id}`}
                            className="group block rounded-3xl border border-surface-200/70 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-surface-600">
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                                            Latihan soal
                                        </span>
                                        {item.course.title && (
                                            <span className="rounded-full bg-surface-100 px-3 py-1">
                                                {item.course.title}
                                            </span>
                                        )}
                                        {item.material.title && (
                                            <span className="rounded-full bg-surface-100 px-3 py-1">
                                                Materi: {item.material.title}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="mt-4 text-xl font-bold text-surface-900 transition-colors group-hover:text-primary-700">
                                        {item.title}
                                    </h2>
                                    {item.description && (
                                        <p className="mt-2 text-sm leading-relaxed text-surface-500">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-surface-600">
                                        <span className="rounded-full bg-surface-100 px-3 py-1">
                                            {item.questions_count} soal
                                        </span>
                                        <span className="rounded-full bg-surface-100 px-3 py-1">
                                            KKM {item.passing_score}%
                                        </span>
                                        {item.time_limit_minutes && (
                                            <span className="rounded-full bg-surface-100 px-3 py-1">
                                                {item.time_limit_minutes} menit
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full rounded-2xl border border-surface-200/70 bg-surface-50 p-4 lg:max-w-xs">
                                    {item.best_attempt ? (
                                        <>
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface-500">
                                                Hasil terbaik
                                            </p>
                                            <div className="mt-3 flex items-end justify-between gap-4">
                                                <div>
                                                    <p
                                                        className={`text-sm font-semibold ${item.best_attempt.passed ? "text-emerald-600" : "text-amber-600"}`}
                                                    >
                                                        {item.best_attempt.passed
                                                            ? "Sudah lulus"
                                                            : "Perlu ditingkatkan"}
                                                    </p>
                                                    <p className="mt-1 text-xs text-surface-500">
                                                        {item.best_attempt.score}/
                                                        {item.best_attempt.total_points} poin
                                                    </p>
                                                </div>
                                                <p className="text-3xl font-bold text-surface-900">
                                                    {item.best_attempt.percentage}%
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-surface-500">
                                                Status
                                            </p>
                                            <p className="mt-3 text-sm font-semibold text-primary-700">
                                                Belum pernah dikerjakan
                                            </p>
                                            <p className="mt-1 text-xs text-surface-500">
                                                Klik latihan untuk mulai mengerjakan.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
