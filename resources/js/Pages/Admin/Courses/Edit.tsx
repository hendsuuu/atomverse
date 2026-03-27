import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormField from '@/Components/FormField';
import Breadcrumb from '@/Components/Breadcrumb';
import ImageUploader from '@/Components/ImageUploader';
import type { Course } from '@/types';

interface Props {
    course: Course;
}

export default function CoursesEdit({ course }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        description: string;
        status: string;
        thumbnail: File | null;
        _method: string;
    }>({
        title: course.title,
        description: course.description || '',
        status: course.status,
        thumbnail: null,
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/courses/${course.id}`, { forceFormData: true });
    };

    return (
        <AdminLayout title="Edit Course">
            <Head title={`Edit ${course.title}`} />
            <Breadcrumb items={[
                { label: 'Courses', href: '/admin/courses' },
                { label: course.title },
            ]} />

            <div className="max-w-2xl">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-surface-900 mb-6">Edit Course</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField label="Title" name="title" error={errors.title} required>
                            <input
                                id="title"
                                className="input"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Description" name="description" error={errors.description}>
                            <textarea
                                id="description"
                                className="input min-h-[120px]"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Thumbnail" name="thumbnail" error={errors.thumbnail}>
                            <ImageUploader
                                name="thumbnail"
                                currentUrl={course.thumbnail_url}
                                onChange={(file) => setData('thumbnail', file)}
                                error={errors.thumbnail}
                            />
                        </FormField>

                        <FormField label="Status" name="status" error={errors.status} required>
                            <select
                                id="status"
                                className="input"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </FormField>

                        <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href="/admin/courses" className="btn-secondary">Cancel</Link>
                            <Link
                                href={`/admin/courses/${course.id}/materials`}
                                className="btn-ghost ml-auto"
                            >
                                Manage Materials →
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
