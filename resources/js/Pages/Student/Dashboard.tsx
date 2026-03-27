import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import type { Course } from "@/types";

interface QuizScore {
    quiz_id: number;
    quiz_title: string;
    material_title: string;
    material_slug: string;
    score: number;
    total_points: number;
    percentage: number;
    passed: boolean;
    attempts_count: number;
    completed_at: string;
}

interface Props {
    enrolledCourses: (Course & { materials_count: number })[];
    totalEnrolled: number;
    quizScores: QuizScore[];
    quizStats: { total: number; passed: number; average: number };
}

export default function Dashboard({
    enrolledCourses,
    totalEnrolled,
    quizScores,
    quizStats,
}: Props) {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Hero */}
            <div className="rounded-2xl gradient-hero p-6 sm:p-8 mb-8 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Selamat Datang! 👋
                </h1>
                <p className="text-white/80 text-sm sm:text-base">
                    Kamu memiliki akses ke{" "}
                    <span className="font-semibold text-white">
                        {totalEnrolled} kelas
                    </span>
                    . Terus semangat belajar!
                </p>
            </div>

            {/* Stats cards */}
            {quizStats.total > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="card p-4 text-center">
                        <p className="text-2xl font-bold text-primary-600">
                            {quizStats.total}
                        </p>
                        <p className="text-xs text-surface-500 mt-1">
                            Quiz Dikerjakan
                        </p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-2xl font-bold text-success-600">
                            {quizStats.passed}
                        </p>
                        <p className="text-xs text-surface-500 mt-1">Lulus</p>
                    </div>
                    <div className="card p-4 text-center">
                        <p className="text-2xl font-bold text-accent-500">
                            {quizStats.average}%
                        </p>
                        <p className="text-xs text-surface-500 mt-1">
                            Rata-rata
                        </p>
                    </div>
                </div>
            )}

            {/* Quiz Scores */}
            {quizScores.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-surface-900 mb-4">
                        📊 Skor Quiz Terbaru
                    </h2>
                    <div className="space-y-3">
                        {quizScores.map((qs) => (
                            <div
                                key={qs.quiz_id}
                                className="card p-4 flex items-center gap-4"
                            >
                                {/* Score circle */}
                                <div
                                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        qs.passed
                                            ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                                            : "bg-gradient-to-br from-red-400 to-red-600"
                                    }`}
                                >
                                    <span className="text-white font-bold text-sm">
                                        {qs.percentage}%
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-surface-900 text-sm truncate">
                                        {qs.quiz_title}
                                    </p>
                                    <p className="text-xs text-surface-500">
                                        {qs.material_title} · {qs.score}/
                                        {qs.total_points} poin ·{" "}
                                        {qs.attempts_count}x percobaan
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    {qs.passed ? (
                                        <span className="badge-success">
                                            ✓ Lulus
                                        </span>
                                    ) : (
                                        <Link
                                            href={`/materials/${qs.material_slug}`}
                                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Ulangi →
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Enrolled Courses */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-surface-900">
                    📚 Kelas Saya
                </h2>
                <Link
                    href="/courses"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    Lihat semua →
                </Link>
            </div>

            {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enrolledCourses.map((course) => (
                        <Link
                            key={course.id}
                            href={`/courses/${course.slug}`}
                            className="card-hover overflow-hidden group"
                        >
                            <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
                                {course.thumbnail_url && (
                                    <img
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-surface-900 mb-1 truncate group-hover:text-primary-700 transition-colors">
                                    {course.title}
                                </h3>
                                {course.description && (
                                    <p className="text-sm text-surface-500 line-clamp-2 mb-3">
                                        {course.description}
                                    </p>
                                )}
                                <p className="text-xs text-surface-500">
                                    {course.materials_count} materi
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card p-8 text-center">
                    <p className="text-surface-500">
                        Belum ada kelas yang tersedia.
                    </p>
                </div>
            )}
        </AppLayout>
    );
}
