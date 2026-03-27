import type { ReactNode } from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    error?: string;
    required?: boolean;
    children: ReactNode;
    hint?: string;
}

export default function FormField({ label, name, error, required, children, hint }: FormFieldProps) {
    return (
        <div>
            <label htmlFor={name} className="label">
                {label}
                {required && <span className="text-danger-500 ml-0.5">*</span>}
            </label>
            {children}
            {hint && !error && (
                <p className="mt-1 text-xs text-surface-400">{hint}</p>
            )}
            {error && (
                <p className="mt-1 text-xs text-danger-600">{error}</p>
            )}
        </div>
    );
}
