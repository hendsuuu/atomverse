import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormField from '@/Components/FormField';
import Breadcrumb from '@/Components/Breadcrumb';

export default function UsersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout title="Create User">
            <Head title="Create User" />

            <Breadcrumb items={[
                { label: 'Users', href: '/admin/users' },
                { label: 'Create User' },
            ]} />

            <div className="max-w-2xl">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-surface-900 mb-6">New User</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField label="Name" name="name" error={errors.name} required>
                            <input
                                id="name"
                                className="input"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Full name"
                            />
                        </FormField>

                        <FormField label="Email" name="email" error={errors.email} required>
                            <input
                                id="email"
                                type="email"
                                className="input"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                        </FormField>

                        <FormField label="Password" name="password" error={errors.password} required>
                            <input
                                id="password"
                                type="password"
                                className="input"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimum 8 characters"
                            />
                        </FormField>

                        <FormField label="Role" name="role" error={errors.role} required>
                            <select
                                id="role"
                                className="input"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                            >
                                <option value="user">Student</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        </FormField>

                        <div className="flex items-center gap-2">
                            <input
                                id="is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 rounded border-surface-300 text-primary-600"
                            />
                            <label htmlFor="is_active" className="text-sm text-surface-700">Active</label>
                        </div>

                        <div className="flex items-center gap-3 pt-4 border-t border-surface-100">
                            <button type="submit" disabled={processing} className="btn-primary">
                                {processing ? 'Creating...' : 'Create User'}
                            </button>
                            <Link href="/admin/users" className="btn-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
