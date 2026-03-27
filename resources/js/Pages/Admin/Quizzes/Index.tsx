import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import ConfirmDialog from "@/Components/ConfirmDialog";

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    passing_score: number;
    time_limit_minutes: number | null;
    questions_count: number;
    attempts_count: number;
}

interface Props {
    material: {
        id: number;
        title: string;
        course: { id: number; title: string; slug: string };
    };
    quizzes: Quiz[];
}

export default function QuizzesIndex({ material, quizzes }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/quizzes/${deleteId}`, {
                onFinish: () => setDeleteId(null),
            });
        }
    };

    return (
        <AdminLayout title="Quiz Management">
            <Head title={`Quizzes — ${material.title}`} />
            <Breadcrumb
                items={[
                    { label: "Courses", href: "/admin/courses" },
                    {
                        label: material.course.title,
                        href: `/admin/courses/${material.course.id}/materials`,
                    },
                    {
                        label: material.title,
                        href: `/admin/materials/${material.id}/edit`,
                    },
                    { label: "Quizzes" },
                ]}
            />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-surface-900">
                        Quizzes for: {material.title}
                    </h2>
                    <p className="text-sm text-surface-500 mt-1">
                        {quizzes.length} quiz(es)
                    </p>
                </div>
                <Link
                    href={`/admin/materials/${material.id}/quizzes/create`}
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
                    Add Quiz
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <div className="card p-8 text-center">
                    <p className="text-surface-500 mb-3">
                        No quizzes yet for this material.
                    </p>
                    <Link
                        href={`/admin/materials/${material.id}/quizzes/create`}
                        className="btn-primary btn-sm"
                    >
                        Create First Quiz
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="card p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-surface-900">
                                        {quiz.title}
                                    </h3>
                                    {quiz.description && (
                                        <p className="text-sm text-surface-500 mt-1">
                                            {quiz.description}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        <span className="badge-primary text-xs">
                                            {quiz.questions_count} Questions
                                        </span>
                                        <span className="badge-surface text-xs">
                                            Passing: {quiz.passing_score}%
                                        </span>
                                        {quiz.time_limit_minutes && (
                                            <span className="badge-surface text-xs">
                                                {quiz.time_limit_minutes} min
                                            </span>
                                        )}
                                        <span className="badge-surface text-xs">
                                            {quiz.attempts_count} Attempts
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Link
                                        href={`/admin/quizzes/${quiz.id}/edit`}
                                        className="btn-secondary btn-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteId(quiz.id)}
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
                title="Delete Quiz"
                message="This will permanently delete this quiz and all its questions and attempts."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </AdminLayout>
    );
}
