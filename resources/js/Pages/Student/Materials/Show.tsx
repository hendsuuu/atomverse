import { useState, useEffect, useRef, useCallback } from "react";
import { Head, Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/Breadcrumb";
import ContentBlockRenderer from "@/Components/ContentBlockRenderer";
import type { Material, MaterialSection } from "@/types";
import ChatBot from "@/Components/ChatBot";

interface QuizInfo {
    id: number;
    title: string;
    description: string | null;
    questions_count: number;
    passing_score: number;
    time_limit_minutes: number | null;
    has_drag_drop: boolean;
    best_score: {
        score: number;
        total_points: number;
        percentage: number;
        passed: boolean;
    } | null;
}

interface Props {
    material: Material & {
        course: { id: number; title: string; slug: string };
        sections: MaterialSection[];
        creator?: { id: number; name: string };
    };
    previousMaterial: { id: number; title: string; slug: string } | null;
    nextMaterial: { id: number; title: string; slug: string } | null;
    courseMaterials: {
        id: number;
        title: string;
        slug: string;
        sort_order: number;
    }[];
    quizzes: QuizInfo[];
}

export default function MaterialShow({
    material,
    previousMaterial,
    nextMaterial,
    courseMaterials,
    quizzes,
}: Props) {
    const [activeSection, setActiveSection] = useState<string>("");
    const [tocOpen, setTocOpen] = useState(false);
    const [readProgress, setReadProgress] = useState(0);
    const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

    // ScrollSpy with IntersectionObserver
    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sectionRefs.current.forEach((el, slug) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveSection(slug);
                    }
                },
                { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [material.sections]);

    // Reading progress
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            setReadProgress(
                docHeight > 0
                    ? Math.min((scrollTop / docHeight) * 100, 100)
                    : 0,
            );
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = useCallback((slug: string) => {
        const el = sectionRefs.current.get(slug);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setTocOpen(false);
        }
    }, []);

    const registerRef = useCallback((slug: string, el: HTMLElement | null) => {
        if (el) sectionRefs.current.set(slug, el);
    }, []);

    return (
        <div className="min-h-screen bg-surface-50">
            <Head title={`${material.title} — Atomverse`} />

            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-surface-200">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-150"
                    style={{ width: `${readProgress}%` }}
                />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 glass border-b border-surface-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-3 min-w-0">
                            <Link
                                href={`/courses/${material.course.slug}`}
                                className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-500 flex-shrink-0"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </Link>
                            <div className="min-w-0">
                                <p className="text-xs text-surface-500 truncate">
                                    {material.course.title}
                                </p>
                                <p className="text-sm font-medium text-surface-900 truncate">
                                    {material.title}
                                </p>
                            </div>
                        </div>

                        {/* Mobile TOC button */}
                        <button
                            onClick={() => setTocOpen(true)}
                            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium hover:bg-primary-100 transition-colors"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h7"
                                />
                            </svg>
                            Daftar Isi
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-8">
                    {/* Main content */}
                    <article className="min-w-0">
                        {/* Breadcrumb */}
                        <Breadcrumb
                            items={[
                                { label: "Courses", href: "/courses" },
                                {
                                    label: material.course.title,
                                    href: `/courses/${material.course.slug}`,
                                },
                                { label: material.title },
                            ]}
                        />

                        {/* Cover */}
                        {material.cover_image_url && (
                            <div className="rounded-2xl overflow-hidden mb-8 shadow-sm">
                                <img
                                    src={material.cover_image_url}
                                    alt={material.title}
                                    className="w-full h-48 sm:h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* Title & meta */}
                        <header className="mb-10">
                            <h1 className="text-3xl sm:text-4xl font-bold text-surface-900 leading-tight mb-4">
                                {material.title}
                            </h1>
                            {material.excerpt && (
                                <p className="text-lg text-surface-500 leading-relaxed mb-4">
                                    {material.excerpt}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 text-sm text-surface-400">
                                {material.creator && (
                                    <span>By {material.creator.name}</span>
                                )}
                                {material.estimated_read_time && (
                                    <>
                                        <span>·</span>
                                        <span>
                                            {material.estimated_read_time} min
                                            read
                                        </span>
                                    </>
                                )}
                                {material.published_at && (
                                    <>
                                        <span>·</span>
                                        <span>
                                            {new Date(
                                                material.published_at,
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </>
                                )}
                            </div>
                        </header>

                        {/* Sections */}
                        <div className="space-y-16">
                            {material.sections.map((section) => (
                                <section
                                    key={section.id}
                                    id={section.slug}
                                    ref={(el) => registerRef(section.slug, el)}
                                    className="scroll-mt-24"
                                >
                                    <h2 className="text-2xl font-bold text-surface-900 mb-6 flex items-center gap-3">
                                        <span className="w-1 h-7 rounded-full bg-primary-500 flex-shrink-0" />
                                        {section.title}
                                    </h2>

                                    {section.image_url && (
                                        <figure className="mb-6">
                                            <img
                                                src={section.image_url}
                                                alt={
                                                    section.image_caption ||
                                                    section.title
                                                }
                                                className="w-full rounded-xl shadow-sm"
                                                loading="lazy"
                                            />
                                            {section.image_caption && (
                                                <figcaption className="text-center text-sm text-surface-500 mt-2 italic">
                                                    {section.image_caption}
                                                </figcaption>
                                            )}
                                        </figure>
                                    )}

                                    <ContentBlockRenderer
                                        blocks={section.blocks || []}
                                    />
                                </section>
                            ))}
                        </div>

                        {/* Quizzes & Games Section */}
                        {quizzes.length > 0 && (
                            <div className="mt-16 pt-10 border-t border-surface-200">
                                <h2 className="text-2xl font-bold text-surface-900 mb-2 flex items-center gap-3">
                                    <span className="w-1 h-7 rounded-full bg-accent-500 flex-shrink-0" />
                                    Latihan & Game Interaktif
                                </h2>
                                <p className="text-surface-500 mb-6">
                                    Uji pemahamanmu dengan mengerjakan quiz dan
                                    game berikut.
                                </p>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {quizzes.map((quiz) => (
                                        <Link
                                            key={quiz.id}
                                            href={`/quizzes/${quiz.id}`}
                                            className="group relative overflow-hidden rounded-2xl border-2 border-surface-200 hover:border-primary-300 bg-white p-5 transition-all hover:shadow-lg hover:shadow-primary-500/10"
                                        >
                                            {/* Type badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                {quiz.has_drag_drop ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold">
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                                                            />
                                                        </svg>
                                                        Drag & Drop Game
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                            />
                                                        </svg>
                                                        Quiz Pilihan Ganda
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-semibold text-surface-900 group-hover:text-primary-700 transition-colors mb-1">
                                                {quiz.title}
                                            </h3>
                                            {quiz.description && (
                                                <p className="text-sm text-surface-500 mb-4 line-clamp-2">
                                                    {quiz.description}
                                                </p>
                                            )}

                                            {/* Meta info */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-surface-400 mb-4">
                                                <span>
                                                    {quiz.questions_count} soal
                                                </span>
                                                <span>·</span>
                                                <span>
                                                    KKM {quiz.passing_score}%
                                                </span>
                                                {quiz.time_limit_minutes && (
                                                    <>
                                                        <span>·</span>
                                                        <span>
                                                            ⏱{" "}
                                                            {
                                                                quiz.time_limit_minutes
                                                            }{" "}
                                                            menit
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Best score or Start */}
                                            {quiz.best_score ? (
                                                <div
                                                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 ${
                                                        quiz.best_score.passed
                                                            ? "bg-emerald-50 border border-emerald-200"
                                                            : "bg-amber-50 border border-amber-200"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {quiz.best_score
                                                            .passed ? (
                                                            <span className="text-emerald-600 text-sm font-semibold">
                                                                ✓ Lulus
                                                            </span>
                                                        ) : (
                                                            <span className="text-amber-600 text-sm font-semibold">
                                                                ✗ Belum Lulus
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <span
                                                            className={`text-lg font-bold ${
                                                                quiz.best_score
                                                                    .passed
                                                                    ? "text-emerald-600"
                                                                    : "text-amber-600"
                                                            }`}
                                                        >
                                                            {
                                                                quiz.best_score
                                                                    .percentage
                                                            }
                                                            %
                                                        </span>
                                                        <p className="text-xs text-surface-400">
                                                            {
                                                                quiz.best_score
                                                                    .score
                                                            }
                                                            /
                                                            {
                                                                quiz.best_score
                                                                    .total_points
                                                            }{" "}
                                                            poin
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-primary-50 border border-primary-200">
                                                    <span className="text-primary-700 text-sm font-semibold">
                                                        Mulai mengerjakan
                                                    </span>
                                                    <svg
                                                        className="w-5 h-5 text-primary-500 group-hover:translate-x-1 transition-transform"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="mt-16 pt-8 border-t border-surface-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {previousMaterial ? (
                                    <Link
                                        href={`/materials/${previousMaterial.slug}`}
                                        className="card-hover p-4 group"
                                    >
                                        <span className="text-xs text-surface-400 mb-1 block">
                                            ← Previous
                                        </span>
                                        <span className="text-sm font-medium text-surface-900 group-hover:text-primary-700 transition-colors">
                                            {previousMaterial.title}
                                        </span>
                                    </Link>
                                ) : (
                                    <div />
                                )}
                                {nextMaterial && (
                                    <Link
                                        href={`/materials/${nextMaterial.slug}`}
                                        className="card-hover p-4 text-right group"
                                    >
                                        <span className="text-xs text-surface-400 mb-1 block">
                                            Next →
                                        </span>
                                        <span className="text-sm font-medium text-surface-900 group-hover:text-primary-700 transition-colors">
                                            {nextMaterial.title}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Desktop TOC Sidebar */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24">
                            <div className="card p-4">
                                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                                    On this page
                                </h3>
                                <nav className="space-y-0.5">
                                    {material.sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() =>
                                                scrollToSection(section.slug)
                                            }
                                            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                                activeSection === section.slug
                                                    ? "bg-primary-50 text-primary-700 font-medium"
                                                    : "text-surface-500 hover:text-surface-900 hover:bg-surface-50"
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                                                        activeSection ===
                                                        section.slug
                                                            ? "bg-primary-500"
                                                            : "bg-surface-300"
                                                    }`}
                                                />
                                                <span className="truncate">
                                                    {section.title}
                                                </span>
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Quiz & Games shortcut */}
                            {quizzes.length > 0 && (
                                <div className="card p-4 mt-4">
                                    <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                                        Latihan
                                    </h3>
                                    <nav className="space-y-0.5">
                                        {quizzes.map((quiz) => (
                                            <Link
                                                key={quiz.id}
                                                href={`/quizzes/${quiz.id}`}
                                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-surface-500 hover:text-surface-900 hover:bg-surface-50 transition-colors"
                                            >
                                                <span className="flex-shrink-0">
                                                    {quiz.has_drag_drop
                                                        ? "🎮"
                                                        : "📝"}
                                                </span>
                                                <span className="truncate">
                                                    {quiz.title
                                                        .replace(
                                                            "Latihan Soal: ",
                                                            "",
                                                        )
                                                        .replace("Game: ", "")}
                                                </span>
                                                {quiz.best_score?.passed && (
                                                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs">
                                                        ✓
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>
                            )}

                            {/* Course materials nav */}
                            <div className="card p-4 mt-4">
                                <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                                    Course Materials
                                </h3>
                                <nav className="space-y-0.5">
                                    {courseMaterials.map((m) => (
                                        <Link
                                            key={m.id}
                                            href={`/materials/${m.slug}`}
                                            className={`block px-3 py-1.5 rounded-lg text-sm transition-colors truncate ${
                                                m.id === material.id
                                                    ? "bg-primary-50 text-primary-700 font-medium"
                                                    : "text-surface-500 hover:text-surface-900 hover:bg-surface-50"
                                            }`}
                                        >
                                            {m.title}
                                        </Link>
                                    ))}
                                </nav>
                            </div>

                                <ChatBot />
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile TOC Drawer */}
            {tocOpen && (
                <>
                    <div
                        className="fixed inset-0 z-50 bg-black/30 animate-fade-in lg:hidden"
                        onClick={() => setTocOpen(false)}
                    />
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-slide-up lg:hidden">
                        {/* Handle */}
                        <div className="flex justify-center py-3">
                            <div className="w-10 h-1 rounded-full bg-surface-300" />
                        </div>

                        <div className="px-5 pb-2 flex items-center justify-between">
                            <h3 className="font-semibold text-surface-900">
                                Daftar Isi
                            </h3>
                            <button
                                onClick={() => setTocOpen(false)}
                                className="p-1 text-surface-400 hover:text-surface-600"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto px-5 pb-8">
                            <nav className="space-y-1">
                                {material.sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() =>
                                            scrollToSection(section.slug)
                                        }
                                        className={`block w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                                            activeSection === section.slug
                                                ? "bg-primary-50 text-primary-700 font-medium"
                                                : "text-surface-600 hover:bg-surface-50"
                                        }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span
                                                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                    activeSection ===
                                                    section.slug
                                                        ? "bg-primary-500"
                                                        : "bg-surface-300"
                                                }`}
                                            />
                                            {section.title}
                                        </span>
                                    </button>
                                ))}
                            </nav>

                            {/* Quiz & Games in mobile drawer */}
                            {quizzes.length > 0 && (
                                <>
                                    <hr className="my-4 border-surface-200" />
                                    <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 px-4">
                                        Latihan & Game
                                    </h4>
                                    <nav className="space-y-0.5">
                                        {quizzes.map((quiz) => (
                                            <Link
                                                key={quiz.id}
                                                href={`/quizzes/${quiz.id}`}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-surface-600 hover:bg-surface-50"
                                            >
                                                <span>
                                                    {quiz.has_drag_drop
                                                        ? "🎮"
                                                        : "📝"}
                                                </span>
                                                <span className="flex-1">
                                                    {quiz.title
                                                        .replace(
                                                            "Latihan Soal: ",
                                                            "",
                                                        )
                                                        .replace("Game: ", "")}
                                                </span>
                                                {quiz.best_score?.passed && (
                                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">
                                                        ✓
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </nav>
                                </>
                            )}

                            <hr className="my-4 border-surface-200" />

                            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 px-4">
                                Other Materials
                            </h4>
                            <nav className="space-y-0.5">
                                {courseMaterials.map((m) => (
                                    <Link
                                        key={m.id}
                                        href={`/materials/${m.slug}`}
                                        className={`block px-4 py-2 rounded-lg text-sm ${
                                            m.id === material.id
                                                ? "text-primary-700 font-medium"
                                                : "text-surface-500"
                                        }`}
                                    >
                                        {m.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </>
            )}

            {/* Mobile floating chatbot (hidden on desktop where sidebar chatbot is used) */}
            <div className="lg:hidden">
                <ChatBot variant="floating" />
            </div>
        </div>
    );
}
