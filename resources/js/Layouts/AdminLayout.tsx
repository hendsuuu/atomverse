import { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { useAuth, useFlash } from "@/hooks/useAuth";
import FlashMessage from "@/Components/FlashMessage";

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
    { name: "Users", href: "/admin/users", icon: UsersIcon },
    { name: "Courses", href: "/admin/courses", icon: CoursesIcon },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { user } = useAuth();
    const flash = useFlash();
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => url.startsWith(href);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(e.target as Node)
            ) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-surface-200/60 transform transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-100">
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <span className="font-bold text-lg text-surface-900 tracking-tight">
                        Atomverse
                    </span>
                </div>

                <nav className="mt-4 px-3 space-y-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive(item.href)
                                    ? "bg-primary-50 text-primary-700"
                                    : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
                            }`}
                        >
                            <item.icon active={isActive(item.href)} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* User section at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-primary-700 font-semibold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-surface-500 truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 bg-white/80 glass border-b border-surface-200/60">
                    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-surface-100 text-surface-500"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            {title && (
                                <h1 className="text-lg font-semibold text-surface-900">
                                    {title}
                                </h1>
                            )}
                        </div>

                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-50 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-700 font-semibold text-xs">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-surface-700 hidden sm:block">
                                    {user.name}
                                </span>
                                <svg
                                    className={`w-4 h-4 text-surface-400 transition-transform ${profileOpen ? "rotate-180" : ""}`}
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

                            {profileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-surface-200/60 py-1 z-50 animate-fade-in">
                                    <div className="px-4 py-3 border-b border-surface-100">
                                        <p className="text-sm font-semibold text-surface-900 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-surface-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="border-t border-surface-100">
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors w-full"
                                            onClick={() =>
                                                setProfileOpen(false)
                                            }
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
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            Logout
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                <FlashMessage flash={flash} />

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

// ── Icons ──

function DashboardIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-5 h-5 ${active ? "text-primary-600" : "text-surface-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
        </svg>
    );
}

function UsersIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-5 h-5 ${active ? "text-primary-600" : "text-surface-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
        </svg>
    );
}

function CoursesIcon({ active }: { active: boolean }) {
    return (
        <svg
            className={`w-5 h-5 ${active ? "text-primary-600" : "text-surface-400"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
        </svg>
    );
}
