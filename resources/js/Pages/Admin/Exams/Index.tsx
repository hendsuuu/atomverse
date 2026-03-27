import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import ConfirmDialog from "@/Components/ConfirmDialog";

interface Exam {
    id: number;
    title: string;
    description: string | null;
    passing_score: number;
    time_limit_minutes: number | null;
    questions_count: number;
    attempts_count: number;
}

interface Props {
    course: {
        id: number;
        title: string;
        slug: string;
    };
    exams: Exam[];
}

export default function ExamsIndex({ course, exams }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/exams/${deleteId}`, {
                onFinish: () => setDeleteId(null),
            });
        }
    };

    return (
        <AdminLayout title="Final Test Management">
            <Head title={`Final Tests — ${course.title}`} />
            <Breadcrumb
                items={[
                    { label: "Courses", href: "/admin/courses" },
                    {
                        label: course.title,
                        href: `/admin/courses/${course.id}/materials`,
                    },
                    { label: "Final Tests" },
                ]}
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-surface-900">
                        Final Tests: {course.title}
                    </h2>
                    <p className="text-sm text-surface-500 mt-1">
                        {exams.length} test(s)
                    </p>
                </div>
                <Link
                    href={`/admin/courses/${course.id}/exams/create`}
                    className="btn-primary btn-sm"
                >
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Final Test
                </Link>
            </div>

            {exams.length === 0 ? (
                <div className="card p-8 text-center">
                    <p className="text-surface-500 mb-3">
                        No final tests yet for this course.
                    </p>
                    <Link
                        href={`/admin/courses/${course.id}/exams/create`}
                        className="btn-primary btn-sm"
                    >
                        Create First Final Test
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {exams.map((exam) => (
                        <div key={exam.id} className="card p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-surface-900">
                                        {exam.title}
                                    </h3>
                                    {exam.description && (
                                        <p className="text-sm text-surface-500 mt-1">
                                            {exam.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <span className="badge-primary text-xs">
                                            {exam.questions_count} Questions
                                        </span>
                                        <span className="badge-surface text-xs">
                                            Passing: {exam.passing_score}%
                                        </span>
                                        {exam.time_limit_minutes && (
                                            <span className="badge-surface text-xs">
                                                {exam.time_limit_minutes} min
                                            </span>
                                        )}
                                        <span className="badge-surface text-xs">
                                            {exam.attempts_count} Attempts
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Link
                                        href={`/admin/exams/${exam.id}/edit`}
                                        className="btn-secondary btn-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteId(exam.id)}
                                        className="btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={deleteId !== null}
                title="Delete Final Test"
                message="This will permanently delete this test and all its questions and attempts."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </AdminLayout>
    );
}
