import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import ConfirmDialog from '@/Components/ConfirmDialog';
import type { PaginatedData, Course } from '@/types';

interface Props {
    courses: PaginatedData<Course & { materials_count: number; students_count: number; creator?: { id: number; name: string } }>;
    filters: { search?: string; status?: string };
}

export default function CoursesIndex({ courses, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/courses', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/courses/${deleteId}`, {
                onFinish: () => setDeleteId(null),
            });
        }
    };

    return (
        <AdminLayout title="Courses">
            <Head title="Manage Courses" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-surface-900">Courses</h2>
                    <p className="text-sm text-surface-500 mt-0.5">Manage your learning courses</p>
                </div>
                <Link href="/admin/courses/create" className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Course
                </Link>
            </div>

            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="input flex-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn-secondary">Search</button>
                </form>
            </div>

            {courses.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.data.map((course) => (
                            <div key={course.id} className="card-hover overflow-hidden">
                                {/* Thumbnail */}
                                <div className="h-36 bg-gradient-to-br from-primary-500 to-primary-700 relative">
                                    {course.thumbnail_url && (
                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <Badge variant={course.status === 'published' ? 'success' : 'warning'}>
                                            {course.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-surface-900 mb-1 truncate">{course.title}</h3>
                                    <p className="text-xs text-surface-500 mb-3">
                                        {course.materials_count} materials · {course.students_count} students
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/admin/courses/${course.id}/materials`}
                                            className="btn-primary btn-sm flex-1"
                                        >
                                            Materials
                                        </Link>
                                        <Link
                                            href={`/admin/courses/${course.id}/edit`}
                                            className="btn-secondary btn-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(course.id)}
                                            className="btn-ghost btn-sm text-danger-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination links={courses.links} from={courses.from} to={courses.to} total={courses.total} />
                </>
            ) : (
                <div className="card">
                    <EmptyState
                        title="No courses yet"
                        description="Create your first course to start building learning content."
                        action={<Link href="/admin/courses/create" className="btn-primary btn-sm">Add Course</Link>}
                    />
                </div>
            )}

            <ConfirmDialog
                open={deleteId !== null}
                title="Delete Course"
                message="This will also delete all materials and sections. This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </AdminLayout>
    );
}
