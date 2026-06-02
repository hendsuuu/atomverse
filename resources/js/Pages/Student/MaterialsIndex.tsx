import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import Breadcrumb from "@/Components/Breadcrumb";

interface MaterialItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image_url: string | null;
    estimated_read_time: number | null;
    sections_count: number;
    quizzes_count: number;
    course: {
        title: string | null;
        slug: string | null;
    };
}

interface Props {
    materials: MaterialItem[];
}

export default function MaterialsIndex({ materials }: Props) {
    return (
        <AppLayout title="Materi">
            <Head title="Materi" />

            <Breadcrumb
                items={[
                    { label: "Menu Utama", href: "/dashboard" },
                    { label: "Materi" },
                ]}
            />

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-surface-900">
                    Daftar materi
                </h1>
                <p className="mt-2 text-sm text-surface-500">
                    Seluruh materi yang tersedia dapat diakses dari halaman ini.
                </p>
            </div>

            {materials.length === 0 ? (
                <div className="rounded-3xl border border-surface-200/70 bg-white p-8 text-center shadow-sm">
                    <p className="text-surface-500">
                        Belum ada materi yang tersedia.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {materials.map((material, index) => (
                        <Link
                            key={material.id}
                            href={`/materials/${material.slug}`}
                            className="group overflow-hidden rounded-3xl border border-surface-200/70 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-500 via-sky-500 to-cyan-500">
                                {material.cover_image_url ? (
                                    <img
                                        src={material.cover_image_url}
                                        alt={material.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-end justify-between p-5 text-white">
                                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                                            Materi {index + 1}
                                        </span>
                                        <span className="text-xs text-white/80">
                                            Atomverse
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/15 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                                        {material.course.title ||
                                            "Materi pembelajaran"}
                                    </p>
                                    <h2 className="mt-2 text-xl font-bold leading-snug">
                                        {material.title}
                                    </h2>
                                </div>
                            </div>

                            <div className="p-5">
                                {material.excerpt && (
                                    <p className="line-clamp-3 text-sm leading-relaxed text-surface-500">
                                        {material.excerpt}
                                    </p>
                                )}

                                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-surface-600">
                                    <span className="rounded-full bg-surface-100 px-3 py-1">
                                        {material.sections_count} bagian
                                    </span>
                                    {material.estimated_read_time && (
                                        <span className="rounded-full bg-surface-100 px-3 py-1">
                                            {material.estimated_read_time} menit
                                        </span>
                                    )}
                                </div>

                                <div className="mt-5 flex items-center justify-between text-sm font-semibold text-primary-700">
                                    <span>Buka materi</span>
                                    <span className="transition-transform group-hover:translate-x-1">
                                        &rarr;
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}
