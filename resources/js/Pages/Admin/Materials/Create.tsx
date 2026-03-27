import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormField from '@/Components/FormField';
import Breadcrumb from '@/Components/Breadcrumb';
import ImageUploader from '@/Components/ImageUploader';
import type { Course } from '@/types';

interface Props {
    course: Course;
    nextOrder: number;
}

export default function MaterialsCreate({ course, nextOrder }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        excerpt: string;
        status: string;
        estimated_read_time: string;
        sort_order: number;
        cover_image: File | null;
    }>({
        title: '',
        excerpt: '',
        status: 'draft',
        estimated_read_time: '',
        sort_order: nextOrder,
        cover_image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/courses/${course.id}/materials`, { forceFormData: true });
    };

    return (
        <AdminLayout title="Create Material">
            <Head title="Create Material" />
            <Breadcrumb items={[
                { label: 'Courses', href: '/admin/courses' },
                { label: course.title, href: `/admin/courses/${course.id}/materials` },
                { label: 'Create Material' },
            ]} />

            <div className="max-w-2xl">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-surface-900 mb-6">New Material</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField label="Title" name="title" error={errors.title} required>
                            <input id="title" className="input" value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Getting Started with React" />
                        </FormField>

                        <FormField label="Excerpt" name="excerpt" error={errors.excerpt}>
                            <textarea id="excerpt" className="input min-h-[80px]" value={data.excerpt}
                                onChange={(e) => setData('excerpt', e.target.value)}
                                placeholder="Brief description..." />
                        </FormField>

                        <FormField label="Cover Image" name="cover_image" error={errors.cover_image}>
                            <ImageUploader name="cover_image" onChange={(f) => setData('cover_image', f)} />
                        </FormField>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Est. Read Time (min)" name="estimated_read_time" error={errors.estimated_read_time}>
                                <input id="estimated_read_time" type="number" className="input" value={data.estimated_read_time}
                                    onChange={(e) => setData('estimated_read_time', e.target.value)} />
                            </FormField>
                            <FormField label="Order" name="sort_order" error={errors.sort_order}>
                                <input id="sort_order" type="number" className="input" value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} />
                            </FormField>
                        </div>

                        <FormField label="Status" name="status" error={errors.status} required>
                            <select id="status" className="input" value={data.status}
                                onChange={(e) => setData('status', e.target.value)}>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </FormField>

                        <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Creating...' : 'Create Material'}
                            </button>
                            <Link href={`/admin/courses/${course.id}/materials`} className="btn-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
