import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormField from '@/Components/FormField';
import Breadcrumb from '@/Components/Breadcrumb';
import ImageUploader from '@/Components/ImageUploader';

export default function CoursesCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        description: string;
        status: string;
        thumbnail: File | null;
    }>({
        title: '',
        description: '',
        status: 'draft',
        thumbnail: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/courses', { forceFormData: true });
    };

    return (
        <AdminLayout title="Create Course">
            <Head title="Create Course" />
            <Breadcrumb items={[
                { label: 'Courses', href: '/admin/courses' },
                { label: 'Create Course' },
            ]} />

            <div className="max-w-2xl">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-surface-900 mb-6">New Course</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField label="Title" name="title" error={errors.title} required>
                            <input
                                id="title"
                                className="input"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Introduction to Web Development"
                            />
                        </FormField>

                        <FormField label="Description" name="description" error={errors.description}>
                            <textarea
                                id="description"
                                className="input min-h-[120px]"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe what students will learn..."
                            />
                        </FormField>

                        <FormField label="Thumbnail" name="thumbnail" error={errors.thumbnail}>
                            <ImageUploader
                                name="thumbnail"
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
                                {processing ? 'Creating...' : 'Create Course'}
                            </button>
                            <Link href="/admin/courses" className="btn-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
