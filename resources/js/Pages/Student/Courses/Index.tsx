import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import type { PaginatedData, Course } from '@/types';

interface Props {
    courses: PaginatedData<Course & { materials_count: number }>;
    filters: { search?: string };
}

export default function CoursesIndex({ courses, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/courses', { search }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout title="My Courses">
            <Head title="My Courses" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-surface-900 mb-1">My Courses</h1>
                <p className="text-surface-500 text-sm">Browse all available courses</p>
            </div>

            <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="input flex-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="btn-secondary">Search</button>
            </form>

            {courses.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {courses.data.map((course) => (
                            <Link
                                key={course.id}
                                href={`/courses/${course.slug}`}
                                className="card-hover overflow-hidden group"
                            >
                                <div className="h-40 bg-gradient-to-br from-primary-500 to-accent-500 relative overflow-hidden">
                                    {course.thumbnail_url && (
                                        <img src={course.thumbnail_url} alt={course.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-surface-900 mb-2 group-hover:text-primary-700 transition-colors">
                                        {course.title}
                                    </h3>
                                    {course.description && (
                                        <p className="text-sm text-surface-500 line-clamp-2 mb-3">
                                            {course.description}
                                        </p>
                                    )}
                                    <p className="text-xs text-surface-400">
                                        {course.materials_count} materi
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <Pagination links={courses.links} from={courses.from} to={courses.to} total={courses.total} />
                </>
            ) : (
                <EmptyState
                    title="No courses found"
                    description="Try adjusting your search or check back later."
                />
            )}
        </AppLayout>
    );
}
