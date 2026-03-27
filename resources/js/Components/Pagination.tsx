import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types';

interface PaginationProps {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}

export default function Pagination({ links, from, to, total }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <p className="text-sm text-surface-500">
                Showing <span className="font-medium text-surface-700">{from}</span> to{' '}
                <span className="font-medium text-surface-700">{to}</span> of{' '}
                <span className="font-medium text-surface-700">{total}</span> results
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    if (!link.url) {
                        return (
                            <span
                                key={i}
                                className="px-3 py-1.5 text-sm text-surface-300 rounded-lg"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    }
                    return (
                        <Link
                            key={i}
                            href={link.url}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                link.active
                                    ? 'bg-primary-600 text-white font-medium'
                                    : 'text-surface-600 hover:bg-surface-100'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
