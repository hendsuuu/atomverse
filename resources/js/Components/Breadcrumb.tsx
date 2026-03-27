import { Link } from '@inertiajs/react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="flex items-center gap-1.5 text-sm mb-4">
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && (
                        <svg className="w-3.5 h-3.5 text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-surface-500 hover:text-primary-600 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-surface-900 font-medium">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
