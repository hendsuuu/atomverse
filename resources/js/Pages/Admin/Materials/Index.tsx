import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Badge from "@/Components/Badge";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import EmptyState from "@/Components/EmptyState";
import ConfirmDialog from "@/Components/ConfirmDialog";
import type { PaginatedData, Material, Course } from "@/types";

interface Props {
    course: Course;
    materials: PaginatedData<Material & { sections_count: number }>;
    filters: { search?: string };
}

export default function MaterialsIndex({ course, materials, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/materials/${deleteId}`, {
                onFinish: () => setDeleteId(null),
            });
        }
    };

    const handleMoveUp = (material: Material, index: number) => {
        if (index === 0) return;
        const items = materials.data.map((m, i) => ({
            id: m.id,
            sort_order: i === index ? index - 1 : i === index - 1 ? index : i,
        }));
        router.post(
            "/admin/materials/reorder",
            { items },
            { preserveState: true },
        );
    };

    const handleMoveDown = (material: Material, index: number) => {
        if (index === materials.data.length - 1) return;
        const items = materials.data.map((m, i) => ({
            id: m.id,
            sort_order: i === index ? index + 1 : i === index + 1 ? index : i,
        }));
        router.post(
            "/admin/materials/reorder",
            { items },
            { preserveState: true },
        );
    };

    return (
        <AdminLayout title="Materials">
            <Head title={`Materials — ${course.title}`} />

            <Breadcrumb
                items={[
                    { label: "Courses", href: "/admin/courses" },
                    {
                        label: course.title,
                        href: `/admin/courses/${course.id}/edit`,
                    },
                    { label: "Materials" },
                ]}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-surface-900">
                        {course.title}
                    </h2>
                    <p className="text-sm text-surface-500 mt-0.5">
                        Manage materials for this course
                    </p>
                </div>
                <Link
                    href={`/admin/courses/${course.id}/materials/create`}
                    className="btn-primary"
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
                    Add Material
                </Link>
                <Link
                    href={`/admin/courses/${course.id}/exams`}
                    className="btn-secondary"
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
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        />
                    </svg>
                    Final Tests
                </Link>
            </div>

            {materials.data.length > 0 ? (
                <div className="space-y-3">
                    {materials.data.map((material, index) => (
                        <div
                            key={material.id}
                            className="card p-4 flex items-center gap-4"
                        >
                            {/* Order controls */}
                            <div className="flex flex-col gap-0.5">
                                <button
                                    onClick={() =>
                                        handleMoveUp(material, index)
                                    }
                                    disabled={index === 0}
                                    className="p-1 rounded hover:bg-surface-100 disabled:opacity-30 text-surface-400"
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
                                            d="M5 15l7-7 7 7"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() =>
                                        handleMoveDown(material, index)
                                    }
                                    disabled={
                                        index === materials.data.length - 1
                                    }
                                    className="p-1 rounded hover:bg-surface-100 disabled:opacity-30 text-surface-400"
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
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Order number */}
                            <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-sm font-semibold text-surface-500 flex-shrink-0">
                                {index + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-surface-900 truncate">
                                    {material.title}
                                </p>
                                <p className="text-xs text-surface-500 mt-0.5">
                                    {material.sections_count} sections
                                    {material.estimated_read_time &&
                                        ` · ${material.estimated_read_time} min read`}
                                </p>
                            </div>

                            {/* Status */}
                            <Badge
                                variant={
                                    material.status === "published"
                                        ? "success"
                                        : "warning"
                                }
                            >
                                {material.status}
                            </Badge>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/admin/materials/${material.id}/edit`}
                                    className="btn-ghost btn-sm"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => setDeleteId(material.id)}
                                    className="btn-ghost btn-sm text-danger-600"
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
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card">
                    <EmptyState
                        title="No materials yet"
                        description="Add your first material to this course."
                        action={
                            <Link
                                href={`/admin/courses/${course.id}/materials/create`}
                                className="btn-primary btn-sm"
                            >
                                Add Material
                            </Link>
                        }
                    />
                </div>
            )}

            <Pagination
                links={materials.links}
                from={materials.from}
                to={materials.to}
                total={materials.total}
            />

            <ConfirmDialog
                open={deleteId !== null}
                title="Delete Material"
                message="This will also delete all sections. This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </AdminLayout>
    );
}
