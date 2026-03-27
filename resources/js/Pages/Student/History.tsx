import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Breadcrumb from "@/Components/Breadcrumb";

interface QuizAttempt {
    id: number;
    quiz_title: string;
    material_title: string;
    course_title: string;
    score: number;
    total_points: number;
    percentage: number;
    passed: boolean;
    completed_at: string;
}

interface ExamAttempt {
    id: number;
    exam_title: string;
    course_title: string;
    score: number;
    total_points: number;
    percentage: number;
    passed: boolean;
    completed_at: string;
}

interface Props {
    student: {
        name: string;
        email: string;
        created_at: string;
    };
    courses: {
        id: number;
        title: string;
        slug: string;
        materials_count: number;
    }[];
    quizAttempts: QuizAttempt[];
    examAttempts: ExamAttempt[];
    stats: {
        total_courses: number;
        total_quiz_attempts: number;
        passed_quizzes: number;
        total_exam_attempts: number;
        passed_exams: number;
        avg_quiz_score: number;
        avg_exam_score: number;
    };
}

export default function History({
    student,
    courses,
    quizAttempts,
    examAttempts,
    stats,
}: Props) {
    const formatDate = (d: string) => {
        return new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AppLayout>
            <Head title="Riwayat Belajar" />

            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "Riwayat Belajar" },
                ]}
            />

            <h1 className="text-2xl font-bold text-surface-900 mb-6">
                Riwayat Belajar
            </h1>

            {/* Section 1: Student Identity */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    Profil Siswa
                </h2>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-bold text-xl">
                            {student.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-surface-900">
                            {student.name}
                        </p>
                        <p className="text-sm text-surface-500">
                            {student.email}
                        </p>
                        <p className="text-xs text-surface-400 mt-1">
                            Bergabung sejak {student.created_at}
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2: Progress Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label="Kelas Diikuti"
                    value={stats.total_courses}
                    color="primary"
                />
                <StatCard
                    label="Quiz Dikerjakan"
                    value={stats.total_quiz_attempts}
                    sub={`${stats.passed_quizzes} lulus`}
                    color="accent"
                />
                <StatCard
                    label="Ujian Dikerjakan"
                    value={stats.total_exam_attempts}
                    sub={`${stats.passed_exams} lulus`}
                    color="success"
                />
                <StatCard
                    label="Rata-rata Skor"
                    value={`${stats.avg_quiz_score}%`}
                    sub={`Ujian: ${stats.avg_exam_score}%`}
                    color="warning"
                />
            </div>

            {/* Section 3: Enrolled Courses */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                    Kelas yang Diikuti
                </h2>
                {courses.length === 0 ? (
                    <p className="text-surface-500 text-sm">
                        Belum mengikuti kelas apapun.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {courses.map((c) => (
                            <Link
                                key={c.id}
                                href={`/courses/${c.slug}`}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 transition-colors"
                            >
                                <span className="font-medium text-surface-900 text-sm">
                                    {c.title}
                                </span>
                                <span className="text-xs text-surface-400">
                                    {c.materials_count} materi
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Section 4: Quiz History */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-accent-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    Riwayat Quiz
                </h2>
                {quizAttempts.length === 0 ? (
                    <p className="text-surface-500 text-sm">
                        Belum mengerjakan quiz apapun.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200 text-left">
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Quiz
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Materi
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Skor
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Status
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Tanggal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {quizAttempts.map((a) => (
                                    <tr key={a.id}>
                                        <td className="py-3 font-medium text-surface-900">
                                            {a.quiz_title}
                                        </td>
                                        <td className="py-3 text-surface-500">
                                            {a.material_title}
                                        </td>
                                        <td className="py-3">
                                            <span className="font-semibold">
                                                {a.percentage}%
                                            </span>
                                            <span className="text-surface-400 ml-1 text-xs">
                                                ({a.score}/{a.total_points})
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    a.passed
                                                        ? "bg-success-100 text-success-700"
                                                        : "bg-danger-100 text-danger-700"
                                                }`}
                                            >
                                                {a.passed
                                                    ? "Lulus"
                                                    : "Belum Lulus"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-surface-400 text-xs">
                                            {a.completed_at
                                                ? formatDate(a.completed_at)
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Section 5: Exam History */}
            <div className="card p-6 mb-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-success-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                    </svg>
                    Riwayat Ujian Akhir
                </h2>
                {examAttempts.length === 0 ? (
                    <p className="text-surface-500 text-sm">
                        Belum mengerjakan ujian akhir apapun.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-surface-200 text-left">
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Ujian
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Kelas
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Skor
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Status
                                    </th>
                                    <th className="pb-2 font-semibold text-surface-600">
                                        Tanggal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {examAttempts.map((a) => (
                                    <tr key={a.id}>
                                        <td className="py-3 font-medium text-surface-900">
                                            {a.exam_title}
                                        </td>
                                        <td className="py-3 text-surface-500">
                                            {a.course_title}
                                        </td>
                                        <td className="py-3">
                                            <span className="font-semibold">
                                                {a.percentage}%
                                            </span>
                                            <span className="text-surface-400 ml-1 text-xs">
                                                ({a.score}/{a.total_points})
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    a.passed
                                                        ? "bg-success-100 text-success-700"
                                                        : "bg-danger-100 text-danger-700"
                                                }`}
                                            >
                                                {a.passed
                                                    ? "Lulus"
                                                    : "Belum Lulus"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-surface-400 text-xs">
                                            {a.completed_at
                                                ? formatDate(a.completed_at)
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Section 6: Progress Chart (simple bar chart) */}
            <div className="card p-6">
                <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-primary-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    Grafik Kemajuan
                </h2>
                <div className="space-y-4">
                    <ProgressBar
                        label="Quiz Lulus"
                        value={stats.passed_quizzes}
                        max={Math.max(stats.total_quiz_attempts, 1)}
                        color="bg-accent-500"
                    />
                    <ProgressBar
                        label="Ujian Lulus"
                        value={stats.passed_exams}
                        max={Math.max(stats.total_exam_attempts, 1)}
                        color="bg-success-500"
                    />
                    <ProgressBar
                        label="Rata-rata Quiz"
                        value={stats.avg_quiz_score}
                        max={100}
                        color="bg-primary-500"
                        suffix="%"
                    />
                    <ProgressBar
                        label="Rata-rata Ujian"
                        value={stats.avg_exam_score}
                        max={100}
                        color="bg-emerald-500"
                        suffix="%"
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    label,
    value,
    sub,
    color,
}: {
    label: string;
    value: number | string;
    sub?: string;
    color: string;
}) {
    const colorMap: Record<string, string> = {
        primary: "bg-primary-50 text-primary-700",
        accent: "bg-accent-50 text-accent-700",
        success: "bg-success-50 text-success-700",
        warning: "bg-amber-50 text-amber-700",
    };

    return (
        <div className="card p-4 text-center">
            <p
                className={`text-2xl font-bold ${colorMap[color]?.split(" ")[1] || "text-surface-900"}`}
            >
                {value}
            </p>
            <p className="text-xs text-surface-500 mt-1">{label}</p>
            {sub && <p className="text-xs text-surface-400 mt-0.5">{sub}</p>}
        </div>
    );
}

function ProgressBar({
    label,
    value,
    max,
    color,
    suffix = "",
}: {
    label: string;
    value: number;
    max: number;
    color: string;
    suffix?: string;
}) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-surface-700">
                    {label}
                </span>
                <span className="text-sm font-semibold text-surface-900">
                    {value}
                    {suffix}{" "}
                    {!suffix && (
                        <span className="text-surface-400 font-normal">
                            / {max}
                        </span>
                    )}
                </span>
            </div>
            <div className="w-full h-2.5 bg-surface-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
