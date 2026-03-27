import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import Pagination from '@/Components/Pagination';
import EmptyState from '@/Components/EmptyState';
import ConfirmDialog from '@/Components/ConfirmDialog';
import type { PaginatedData, User } from '@/types';

interface Props {
    users: PaginatedData<User>;
    filters: { search?: string; role?: string; status?: string };
}

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true, replace: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/users/${deleteId}`, {
                onFinish: () => setDeleteId(null),
            });
        }
    };

    return (
        <AdminLayout title="Users">
            <Head title="Manage Users" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-surface-900">Users</h2>
                    <p className="text-sm text-surface-500 mt-0.5">Manage platform users and roles</p>
                </div>
                <Link href="/admin/users/create" className="btn-primary">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                </Link>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-secondary">Search</button>
                </form>
            </div>

            {/* Table */}
            {users.data.length > 0 ? (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-100">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Joined</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-primary-700 font-semibold text-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-surface-900">{user.name}</p>
                                                    <p className="text-xs text-surface-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <Badge variant={user.role === 'superadmin' ? 'primary' : 'surface'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3">
                                            <Badge variant={user.is_active ? 'success' : 'danger'}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-surface-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="btn-ghost btn-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(user.id)}
                                                    className="btn-ghost btn-sm text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 border-t border-surface-100">
                        <Pagination
                            links={users.links}
                            from={users.from}
                            to={users.to}
                            total={users.total}
                        />
                    </div>
                </div>
            ) : (
                <div className="card">
                    <EmptyState
                        title="No users found"
                        description="Get started by creating your first user."
                        action={
                            <Link href="/admin/users/create" className="btn-primary btn-sm">
                                Add User
                            </Link>
                        }
                    />
                </div>
            )}

            <ConfirmDialog
                open={deleteId !== null}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />
        </AdminLayout>
    );
}
