import { type ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-4 shadow-lg shadow-primary-500/20">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <h1 className="text-2xl font-bold text-surface-900">Atomverse</h1>
                    <p className="text-surface-500 mt-1">Modern Learning Platform</p>
                </div>

                {/* Card */}
                <div className="card p-6 sm:p-8 shadow-lg">
                    {children}
                </div>

                <p className="text-center text-xs text-surface-400 mt-6">
                    &copy; {new Date().getFullYear()} Atomverse. All rights reserved.
                </p>
            </div>
        </div>
    );
}
