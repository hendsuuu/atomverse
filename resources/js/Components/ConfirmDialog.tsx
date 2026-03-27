import { useState, type ReactNode } from 'react';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/30 animate-fade-in" onClick={onCancel} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-slide-up">
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{title}</h3>
                <p className="text-sm text-surface-600 mb-6">{message}</p>
                <div className="flex items-center justify-end gap-3">
                    <button onClick={onCancel} className="btn-secondary btn-sm">
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={variant === 'danger' ? 'btn-danger btn-sm' : 'btn-primary btn-sm'}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
