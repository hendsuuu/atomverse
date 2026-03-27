import { usePage } from '@inertiajs/react';
import type { FlashMessages } from '@/types';

export function useAuth() {
    const { auth } = usePage().props as any;
    return auth;
}

export function useFlash(): FlashMessages {
    const { flash } = usePage().props as any;
    return flash;
}
