interface BadgeProps {
    variant?: 'success' | 'warning' | 'danger' | 'primary' | 'surface';
    children: React.ReactNode;
}

const variantMap = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    primary: 'badge-primary',
    surface: 'badge-surface',
};

export default function Badge({ variant = 'surface', children }: BadgeProps) {
    return (
        <span className={variantMap[variant]}>
            {children}
        </span>
    );
}
