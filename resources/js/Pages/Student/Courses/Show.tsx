import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Badge from "@/Components/Badge";
import Breadcrumb from "@/Components/Breadcrumb";
import type { Course, Material } from "@/types";

interface Exam {
    id: number;
    title: string;
    description: string | null;
    passing_score: number;
    time_limit_minutes: number | null;
    questions_count: number;
}

interface Props {
    course: Course & {
        materials: (Material & { quizzes_count: number })[];
        exams?: Exam[];
        creator?: { id: number; name: string };
        materials_count: number;
        students_count: number;
    };
}

export default function CoursesShow({ course }: Props) {
    return (
        <AppLayout>
            <Head title={course.title} />

            <Breadcrumb
                items={[
                    { label: "My Courses", href: "/courses" },
                    { label: course.title },
                ]}
            />

            {/* Course Hero */}
            <div className="card overflow-hidden mb-8">
                <div className="h-48 sm:h-56 bg-gradient-to-br from-primary-600 to-accent-500 relative">
                    {course.thumbnail_url && (
                        <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            {course.title}
                        </h1>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                            <span>{course.materials_count} materials</span>
                            <span>·</span>
                            <span>{course.students_count} students</span>
                            {course.creator && (
                                <>
                                    <span>·</span>
                                    <span>by {course.creator.name}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {course.description && (
                    <div className="p-6 border-t border-surface-100">
                        <p className="text-surface-600 leading-relaxed">
                            {course.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Materials List */}
            <h2 className="text-lg font-bold text-surface-900 mb-4">
                Course Materials
            </h2>

            {course.materials.length > 0 ? (
                <div className="space-y-3">
                    {course.materials.map((material, index) => (
                        <Link
                            key={material.id}
                            href={`/materials/${material.slug}`}
                            className="card-hover p-4 flex items-center gap-4 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                                <span className="text-primary-700 font-bold text-sm">
                                    {index + 1}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-surface-900 group-hover:text-primary-700 transition-colors truncate">
                                    {material.title}
                                </h3>
                                {material.excerpt && (
                                    <p className="text-sm text-surface-500 truncate mt-0.5">
                                        {material.excerpt}
                                    </p>
                                )}
                                {material.quizzes_count > 0 && (
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-50 text-accent-700 text-xs font-medium">
                                            <svg
                                                className="w-3 h-3"
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
                                            {material.quizzes_count} Quiz/Game
                                        </span>
                                    </div>
                                )}
                            </div>
                            {material.estimated_read_time && (
                                <span className="text-xs text-surface-400 flex-shrink-0">
                                    {material.estimated_read_time} min
                                </span>
                            )}
                            <svg
                                className="w-5 h-5 text-surface-300 group-hover:text-primary-500 transition-colors flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="card p-8 text-center">
                    <p className="text-surface-500">
                        No materials available yet.
                    </p>
                </div>
            )}

            {/* Final Tests */}
            {course.exams && course.exams.length > 0 && (
                <>
                    <h2 className="text-lg font-bold text-surface-900 mb-4 mt-8">
                        Ujian Akhir
                    </h2>
                    <div className="space-y-3">
                        {course.exams.map((exam) => (
                            <Link
                                key={exam.id}
                                href={`/exams/${exam.id}`}
                                className="card-hover p-4 flex items-center gap-4 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                                    <span className="text-emerald-600 text-lg">
                                        🎓
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-surface-900 group-hover:text-emerald-700 transition-colors truncate">
                                        {exam.title}
                                    </h3>
                                    {exam.description && (
                                        <p className="text-sm text-surface-500 truncate mt-0.5">
                                            {exam.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                                            {exam.questions_count} Soal
                                        </span>
                                        <span className="text-xs text-surface-400">
                                            KKM: {exam.passing_score}%
                                        </span>
                                        {exam.time_limit_minutes && (
                                            <span className="text-xs text-surface-400">
                                                · {exam.time_limit_minutes}{" "}
                                                menit
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <svg
                                    className="w-5 h-5 text-surface-300 group-hover:text-emerald-500 transition-colors flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </AppLayout>
    );
}
