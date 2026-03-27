import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/Badge';
import type { DashboardStats, User, Course } from '@/types';

interface Props {
    stats: {
        total_users: number;
        total_courses: number;
        total_materials: number;
        total_sections: number;
    };
    recentUsers: User[];
    recentCourses: Course[];
}

export default function Dashboard({ stats, recentUsers, recentCourses }: Props) {
    const statCards = [
        { label: 'Total Students', value: stats.total_users, color: 'from-blue-500 to-blue-600', icon: '👥' },
        { label: 'Total Courses', value: stats.total_courses, color: 'from-purple-500 to-purple-600', icon: '📚' },
        { label: 'Total Materials', value: stats.total_materials, color: 'from-emerald-500 to-emerald-600', icon: '📝' },
        { label: 'Total Sections', value: stats.total_sections, color: 'from-amber-500 to-amber-600', icon: '📋' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.label} className="card p-5 animate-slide-up">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                                <span className="text-white font-bold text-sm">{stat.value}</span>
                            </div>
                        </div>
                        <p className="text-sm text-surface-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-surface-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="card">
                    <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                        <h2 className="font-semibold text-surface-900">Recent Students</h2>
                        <Link href="/admin/users" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-surface-100">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="px-5 py-3 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <span className="text-primary-700 font-semibold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-surface-900 truncate">{user.name}</p>
                                    <p className="text-xs text-surface-500 truncate">{user.email}</p>
                                </div>
                                <Badge variant={user.is_active ? 'success' : 'danger'}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Courses */}
                <div className="card">
                    <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
                        <h2 className="font-semibold text-surface-900">Recent Courses</h2>
                        <Link href="/admin/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-surface-100">
                        {recentCourses.map((course) => (
                            <div key={course.id} className="px-5 py-3 flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-surface-900 truncate">{course.title}</p>
                                    <p className="text-xs text-surface-500">
                                        {course.materials_count} materials · {course.students_count} students
                                    </p>
                                </div>
                                <Badge variant={course.status === 'published' ? 'success' : 'warning'}>
                                    {course.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
