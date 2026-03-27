import { useEffect, useState } from 'react';
import type { FlashMessages } from '@/types';

interface FlashMessageProps {
    flash: FlashMessages;
}

export default function FlashMessage({ flash }: FlashMessageProps) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        const entries: [string, string | undefined][] = [
            ['success', flash.success],
            ['error', flash.error],
            ['warning', flash.warning],
            ['info', flash.info],
        ];
        for (const [key, value] of entries) {
            if (value) {
                setType(key as typeof type);
                setMessage(value);
                setVisible(true);
                const timeout = setTimeout(() => setVisible(false), 4000);
                return () => clearTimeout(timeout);
            }
        }
    }, [flash]);

    if (!visible || !message) return null;

    const styles = {
        success: 'bg-success-50 text-success-700 border-success-500/30',
        error: 'bg-danger-50 text-danger-700 border-danger-500/30',
        warning: 'bg-warning-50 text-warning-600 border-warning-500/30',
        info: 'bg-primary-50 text-primary-700 border-primary-500/30',
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className="sticky top-16 z-20 px-4 sm:px-6 lg:px-8 pt-4 lg:pl-72">
            <div className={`${styles[type]} border rounded-xl px-4 py-3 flex items-center gap-3 animate-slide-up shadow-sm`}>
                <span className="font-bold">{icons[type]}</span>
                <p className="text-sm font-medium flex-1">{message}</p>
                <button
                    onClick={() => setVisible(false)}
                    className="text-current opacity-50 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
