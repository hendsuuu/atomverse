import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import FormField from '@/Components/FormField';
import Breadcrumb from '@/Components/Breadcrumb';
import type { User } from '@/types';

interface Props {
    user: User;
}

export default function UsersEdit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        is_active: user.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout title="Edit User">
            <Head title={`Edit ${user.name}`} />

            <Breadcrumb items={[
                { label: 'Users', href: '/admin/users' },
                { label: user.name },
            ]} />

            <div className="max-w-2xl">
                <div className="card p-6">
                    <h2 className="text-lg font-semibold text-surface-900 mb-6">Edit User</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField label="Name" name="name" error={errors.name} required>
                            <input
                                id="name"
                                className="input"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Email" name="email" error={errors.email} required>
                            <input
                                id="email"
                                type="email"
                                className="input"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Password" name="password" error={errors.password} hint="Leave blank to keep current password">
                            <input
                                id="password"
                                type="password"
                                className="input"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="New password (optional)"
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
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href="/admin/users" className="btn-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
