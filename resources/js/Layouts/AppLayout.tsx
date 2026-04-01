import { type ReactNode, useState, useRef, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useAuth, useFlash } from "@/hooks/useAuth";
import FlashMessage from "@/Components/FlashMessage";
import ChatBot from "@/Components/ChatBot";

interface AppLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
    const { user } = useAuth();
    const flash = useFlash();
    const { url } = usePage();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

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

    const navItems = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "My Courses", href: "/courses" },
    ];

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 glass border-b border-surface-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo + Nav */}
                        <div className="flex items-center gap-8">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2.5"
                            >
                                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        A
                                    </span>
                                </div>
                                <span className="font-bold text-lg text-surface-900 tracking-tight hidden sm:block">
                                    Atomverse
                                </span>
                            </Link>

                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            url.startsWith(item.href)
                                                ? "text-primary-700 bg-primary-50"
                                                : "text-surface-600 hover:text-surface-900 hover:bg-surface-50"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Right side — Profile Dropdown */}
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
                                <span className="hidden sm:block text-sm font-medium text-surface-700">
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
                                    <Link
                                        href="/history"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 transition-colors"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <svg
                                            className="w-4 h-4 text-surface-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Riwayat Belajar
                                    </Link>
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
                </div>
            </header>

            <FlashMessage flash={flash} />

            {/* Mobile nav */}
            <div className="md:hidden border-b border-surface-200/60 bg-white px-4 py-2 flex gap-1 overflow-x-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            url.startsWith(item.href)
                                ? "text-primary-700 bg-primary-50"
                                : "text-surface-600 hover:text-surface-900"
                        }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {children}
            </main>

            {/* Hide chatbot on quiz, exam, and game pages */}
            {!url.match(/^\/(quizzes|exams)\//) && <ChatBot />}
        </div>
    );
}
