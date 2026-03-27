export interface User {
    id: number;
    name: string;
    email: string;
    role: 'superadmin' | 'user';
    avatar: string | null;
    is_active: boolean;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail: string | null;
    thumbnail_url: string | null;
    status: 'draft' | 'published';
    created_by: number;
    creator?: User;
    materials_count?: number;
    students_count?: number;
    materials?: Material[];
    students?: User[];
    created_at: string;
    updated_at: string;
}

export interface Material {
    id: number;
    class_id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    cover_image_url: string | null;
    status: 'draft' | 'published';
    estimated_read_time: number | null;
    sort_order: number;
    published_at: string | null;
    created_by: number;
    course?: Course;
    creator?: User;
    sections?: MaterialSection[];
    sections_count?: number;
    created_at: string;
    updated_at: string;
}

export interface MaterialSection {
    id: number;
    material_id: number;
    title: string;
    slug: string;
    blocks: ContentBlock[];
    image: string | null;
    image_url: string | null;
    image_caption: string | null;
    layout_variant: 'default' | 'wide' | 'centered' | 'split';
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export type ContentBlock =
    | { type: 'rich_text'; content: string }
    | { type: 'image'; url: string; caption?: string }
    | { type: 'callout'; variant: 'info' | 'warning' | 'tip' | 'note'; content: string }
    | { type: 'quote'; content: string; author?: string }
    | { type: 'divider' }
    | { type: 'embed_youtube'; videoId: string };

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface SharedProps {
    auth: {
        user: User;
    };
    flash: FlashMessages;
    ziggy: {
        url: string;
        port: number | null;
        defaults: Record<string, unknown>;
        routes: Record<string, unknown>;
    };
}

export interface Media {
    id: number;
    filename: string;
    path: string;
    url: string;
    mime_type: string;
    size: number;
    uploaded_by: number;
    created_at: string;
}

export interface DashboardStats {
    total_users: number;
    total_courses: number;
    total_materials: number;
    total_sections: number;
    recent_users: User[];
    recent_courses: Course[];
}
