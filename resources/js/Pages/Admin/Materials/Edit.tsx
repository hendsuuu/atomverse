import { Head, useForm, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import FormField from "@/Components/FormField";
import Breadcrumb from "@/Components/Breadcrumb";
import ImageUploader from "@/Components/ImageUploader";
import ConfirmDialog from "@/Components/ConfirmDialog";
import RichTextEditor from "@/Components/RichTextEditor";
import type { Material, MaterialSection, ContentBlock } from "@/types";

interface Props {
    material: Material & {
        course: { id: number; title: string; slug: string };
        sections: MaterialSection[];
    };
}

export default function MaterialsEdit({ material }: Props) {
    const [deleteSectionId, setDeleteSectionId] = useState<number | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(
        new Set(),
    );

    // Material metadata form
    const metaForm = useForm<{
        title: string;
        excerpt: string;
        status: string;
        estimated_read_time: string;
        sort_order: number;
        cover_image: File | null;
        _method: string;
    }>({
        title: material.title,
        excerpt: material.excerpt || "",
        status: material.status,
        estimated_read_time: material.estimated_read_time?.toString() || "",
        sort_order: material.sort_order,
        cover_image: null,
        _method: "PUT",
    });

    const handleMetaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        metaForm.post(`/admin/materials/${material.id}`, {
            forceFormData: true,
        });
    };

    // Section management
    const toggleSection = (id: number) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const handleDeleteSection = () => {
        if (deleteSectionId) {
            router.delete(`/admin/sections/${deleteSectionId}`, {
                onFinish: () => setDeleteSectionId(null),
            });
        }
    };

    const handleAddSection = () => {
        router.post(
            `/admin/materials/${material.id}/sections`,
            {
                title: "New Section",
                blocks: [
                    {
                        type: "rich_text",
                        content: "<p>Write your content here...</p>",
                    },
                ],
            },
            { preserveScroll: true },
        );
    };

    const handleSectionMoveUp = (index: number) => {
        if (index === 0) return;
        const items = material.sections.map((s, i) => ({
            id: s.id,
            sort_order: i === index ? index - 1 : i === index - 1 ? index : i,
        }));
        router.post(
            "/admin/sections/reorder",
            { items },
            { preserveScroll: true },
        );
    };

    const handleSectionMoveDown = (index: number) => {
        if (index === material.sections.length - 1) return;
        const items = material.sections.map((s, i) => ({
            id: s.id,
            sort_order: i === index ? index + 1 : i === index + 1 ? index : i,
        }));
        router.post(
            "/admin/sections/reorder",
            { items },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout title="Edit Material">
            <Head title={`Edit — ${material.title}`} />
            <Breadcrumb
                items={[
                    { label: "Courses", href: "/admin/courses" },
                    {
                        label: material.course.title,
                        href: `/admin/courses/${material.course.id}/materials`,
                    },
                    { label: material.title },
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Material metadata */}
                <div className="lg:col-span-1">
                    <div className="card p-5 sticky top-24">
                        <h3 className="font-semibold text-surface-900 mb-4">
                            Material Info
                        </h3>
                        <form onSubmit={handleMetaSubmit} className="space-y-4">
                            <FormField
                                label="Title"
                                name="title"
                                error={metaForm.errors.title}
                                required
                            >
                                <input
                                    id="title"
                                    className="input"
                                    value={metaForm.data.title}
                                    onChange={(e) =>
                                        metaForm.setData(
                                            "title",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormField>
                            <FormField
                                label="Excerpt"
                                name="excerpt"
                                error={metaForm.errors.excerpt}
                            >
                                <textarea
                                    id="excerpt"
                                    className="input min-h-[80px]"
                                    value={metaForm.data.excerpt}
                                    onChange={(e) =>
                                        metaForm.setData(
                                            "excerpt",
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormField>
                            <FormField label="Cover Image" name="cover_image">
                                <ImageUploader
                                    name="cover_image"
                                    currentUrl={material.cover_image_url}
                                    onChange={(f) =>
                                        metaForm.setData("cover_image", f)
                                    }
                                />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    label="Read Time"
                                    name="estimated_read_time"
                                >
                                    <input
                                        id="estimated_read_time"
                                        type="number"
                                        className="input"
                                        value={
                                            metaForm.data.estimated_read_time
                                        }
                                        onChange={(e) =>
                                            metaForm.setData(
                                                "estimated_read_time",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </FormField>
                                <FormField label="Order" name="sort_order">
                                    <input
                                        id="sort_order"
                                        type="number"
                                        className="input"
                                        value={metaForm.data.sort_order}
                                        onChange={(e) =>
                                            metaForm.setData(
                                                "sort_order",
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                </FormField>
                            </div>
                            <FormField label="Status" name="status" required>
                                <select
                                    id="status"
                                    className="input"
                                    value={metaForm.data.status}
                                    onChange={(e) =>
                                        metaForm.setData(
                                            "status",
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </FormField>
                            <button
                                type="submit"
                                disabled={metaForm.processing}
                                className="btn-primary w-full"
                            >
                                {metaForm.processing
                                    ? "Saving..."
                                    : "Save Material"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sections editor */}
                <div className="lg:col-span-2">
                    {/* Quiz management link */}
                    <div className="card p-4 mb-4 flex items-center justify-between bg-primary-50/50 border-primary-100">
                        <div>
                            <h4 className="font-medium text-surface-900">
                                Quiz Management
                            </h4>
                            <p className="text-sm text-surface-500">
                                Manage quizzes and questions for this material
                            </p>
                        </div>
                        <Link
                            href={`/admin/materials/${material.id}/quizzes`}
                            className="btn-primary btn-sm"
                        >
                            Manage Quizzes
                        </Link>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-surface-900">
                            Sections ({material.sections.length})
                        </h3>
                        <button
                            onClick={handleAddSection}
                            className="btn-primary btn-sm"
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
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Section
                        </button>
                    </div>

                    {material.sections.length === 0 ? (
                        <div className="card p-8 text-center">
                            <p className="text-surface-500 mb-3">
                                No sections yet. Add your first section.
                            </p>
                            <button
                                onClick={handleAddSection}
                                className="btn-primary btn-sm"
                            >
                                Add Section
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {material.sections.map((section, index) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    index={index}
                                    total={material.sections.length}
                                    expanded={expandedSections.has(section.id)}
                                    onToggle={() => toggleSection(section.id)}
                                    onMoveUp={() => handleSectionMoveUp(index)}
                                    onMoveDown={() =>
                                        handleSectionMoveDown(index)
                                    }
                                    onDelete={() =>
                                        setDeleteSectionId(section.id)
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmDialog
                open={deleteSectionId !== null}
                title="Delete Section"
                message="This will permanently delete this section and its content."
                onConfirm={handleDeleteSection}
                onCancel={() => setDeleteSectionId(null)}
            />
        </AdminLayout>
    );
}

// ── Section Card Component ──

interface SectionCardProps {
    section: MaterialSection;
    index: number;
    total: number;
    expanded: boolean;
    onToggle: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
}

function SectionCard({
    section,
    index,
    total,
    expanded,
    onToggle,
    onMoveUp,
    onMoveDown,
    onDelete,
}: SectionCardProps) {
    const { data, setData, put, processing } = useForm({
        title: section.title,
        blocks: section.blocks || [],
        image_caption: section.image_caption || "",
        layout_variant: section.layout_variant || "default",
    });

    const handleSave = () => {
        put(`/admin/sections/${section.id}`, { preserveScroll: true });
    };

    const updateBlock = (
        blockIndex: number,
        updates: Partial<ContentBlock>,
    ) => {
        const newBlocks = [...data.blocks];
        newBlocks[blockIndex] = {
            ...newBlocks[blockIndex],
            ...updates,
        } as ContentBlock;
        setData("blocks", newBlocks);
    };

    const addBlock = (type: string) => {
        const newBlock: ContentBlock =
            type === "rich_text"
                ? { type: "rich_text", content: "" }
                : type === "image"
                  ? { type: "image", url: "", caption: "" }
                  : type === "embed_youtube"
                    ? { type: "embed_youtube", videoId: "" }
                    : type === "callout"
                      ? { type: "callout", variant: "info", content: "" }
                      : type === "quote"
                        ? { type: "quote", content: "", author: "" }
                        : { type: "divider" };
        setData("blocks", [...data.blocks, newBlock]);
    };

    const removeBlock = (blockIndex: number) => {
        setData(
            "blocks",
            data.blocks.filter((_, i) => i !== blockIndex),
        );
    };

    const moveBlockUp = (blockIndex: number) => {
        if (blockIndex === 0) return;
        const newBlocks = [...data.blocks];
        [newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [
            newBlocks[blockIndex],
            newBlocks[blockIndex - 1],
        ];
        setData("blocks", newBlocks);
    };

    const moveBlockDown = (blockIndex: number) => {
        if (blockIndex === data.blocks.length - 1) return;
        const newBlocks = [...data.blocks];
        [newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [
            newBlocks[blockIndex + 1],
            newBlocks[blockIndex],
        ];
        setData("blocks", newBlocks);
    };

    return (
        <div className="card overflow-hidden">
            {/* Header - always visible */}
            <div
                className="flex items-center gap-3 px-4 py-3 bg-surface-50/50 border-b border-surface-100 cursor-pointer"
                onClick={onToggle}
            >
                <div className="flex flex-col gap-0.5">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveUp();
                        }}
                        disabled={index === 0}
                        className="p-0.5 rounded hover:bg-surface-200 disabled:opacity-30 text-surface-400"
                    >
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveDown();
                        }}
                        disabled={index === total - 1}
                        className="p-0.5 rounded hover:bg-surface-200 disabled:opacity-30 text-surface-400"
                    >
                        <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                </div>
                <span className="w-6 h-6 rounded bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                </span>
                <span className="font-medium text-sm text-surface-900 flex-1 truncate">
                    {section.title}
                </span>
                <span className="text-xs text-surface-400">
                    {data.blocks.length} blocks
                </span>
                <svg
                    className={`w-4 h-4 text-surface-400 transition-transform ${expanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className="p-4 space-y-4 animate-fade-in">
                    <FormField
                        label="Section Title"
                        name={`section-${section.id}-title`}
                    >
                        <input
                            className="input"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                    </FormField>

                    {/* Blocks */}
                    <div className="space-y-3">
                        <label className="label">Content Blocks</label>
                        {data.blocks.map((block, bi) => (
                            <div
                                key={bi}
                                className="relative bg-surface-50 rounded-xl p-3 border border-surface-200"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="badge-primary text-xs">
                                            {block.type === "embed_youtube"
                                                ? "YouTube"
                                                : block.type}
                                        </span>
                                        <div className="flex items-center gap-0.5">
                                            <button
                                                onClick={() => moveBlockUp(bi)}
                                                disabled={bi === 0}
                                                className="p-0.5 rounded hover:bg-surface-200 disabled:opacity-30 text-surface-400"
                                                title="Move up"
                                            >
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
                                                        d="M5 15l7-7 7 7"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    moveBlockDown(bi)
                                                }
                                                disabled={
                                                    bi ===
                                                    data.blocks.length - 1
                                                }
                                                className="p-0.5 rounded hover:bg-surface-200 disabled:opacity-30 text-surface-400"
                                                title="Move down"
                                            >
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
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeBlock(bi)}
                                        className="text-danger-500 hover:text-danger-700 text-xs"
                                    >
                                        Remove
                                    </button>
                                </div>
                                {block.type === "rich_text" && (
                                    <RichTextEditor
                                        content={block.content}
                                        onChange={(html) =>
                                            updateBlock(bi, { content: html })
                                        }
                                    />
                                )}
                                {block.type === "image" && (
                                    <div className="space-y-2">
                                        <input
                                            className="input"
                                            value={block.url || ""}
                                            onChange={(e) =>
                                                updateBlock(bi, {
                                                    url: e.target.value,
                                                })
                                            }
                                            placeholder="Image URL (e.g. /storage/media/image.png)"
                                        />
                                        {block.url && (
                                            <img
                                                src={block.url}
                                                alt={block.caption || ""}
                                                className="max-h-40 rounded-lg object-cover"
                                            />
                                        )}
                                        <input
                                            className="input"
                                            value={block.caption || ""}
                                            onChange={(e) =>
                                                updateBlock(bi, {
                                                    caption: e.target.value,
                                                })
                                            }
                                            placeholder="Caption (optional)"
                                        />
                                    </div>
                                )}
                                {block.type === "callout" && (
                                    <div className="space-y-2">
                                        <select
                                            className="input"
                                            value={block.variant}
                                            onChange={(e) =>
                                                updateBlock(bi, {
                                                    variant: e.target
                                                        .value as any,
                                                })
                                            }
                                        >
                                            <option value="info">Info</option>
                                            <option value="warning">
                                                Warning
                                            </option>
                                            <option value="tip">Tip</option>
                                            <option value="note">Note</option>
                                        </select>
                                        <textarea
                                            className="input min-h-[60px]"
                                            value={block.content}
                                            onChange={(e) =>
                                                updateBlock(bi, {
                                                    content: e.target.value,
                                                })
                                            }
                                            placeholder="Callout content..."
                                        />
                                    </div>
                                )}
                                {block.type === "quote" && (
                                    <div className="space-y-2">
                                        <textarea
                                            className="input min-h-[60px]"
                                            value={block.content}
                                            onChange={(e) =>
                                                updateBlock(bi, {
                                                    content: e.target.value,
                                                })
                                            }
                                            placeholder="Quote text..."
                                        />
                                        <input
                                            className="input"
                                            value={block.author || ""}
                                            onChange={(e) =>
                                                updateBlock(bi, {
                                                    author: e.target.value,
                                                })
                                            }
                                            placeholder="Author"
                                        />
                                    </div>
                                )}
                                {block.type === "embed_youtube" && (
                                    <div className="space-y-2">
                                        <input
                                            className="input"
                                            value={block.videoId || ""}
                                            onChange={(e) => {
                                                let val = e.target.value;
                                                const match = val.match(
                                                    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/,
                                                );
                                                if (match) val = match[1];
                                                updateBlock(bi, {
                                                    videoId: val,
                                                });
                                            }}
                                            placeholder="YouTube Video ID or URL"
                                        />
                                        {block.videoId &&
                                            block.videoId.length === 11 && (
                                                <div className="aspect-video rounded-lg overflow-hidden bg-surface-100">
                                                    <iframe
                                                        src={`https://www.youtube-nocookie.com/embed/${block.videoId}`}
                                                        className="w-full h-full"
                                                        allowFullScreen
                                                        title="YouTube preview"
                                                    />
                                                </div>
                                            )}
                                    </div>
                                )}
                                {block.type === "divider" && (
                                    <hr className="border-surface-300" />
                                )}
                            </div>
                        ))}

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => addBlock("rich_text")}
                                className="btn-secondary btn-sm"
                            >
                                + Rich Text
                            </button>
                            <button
                                onClick={() => addBlock("image")}
                                className="btn-secondary btn-sm"
                            >
                                + Image
                            </button>
                            <button
                                onClick={() => addBlock("callout")}
                                className="btn-secondary btn-sm"
                            >
                                + Callout
                            </button>
                            <button
                                onClick={() => addBlock("quote")}
                                className="btn-secondary btn-sm"
                            >
                                + Quote
                            </button>
                            <button
                                onClick={() => addBlock("embed_youtube")}
                                className="btn-secondary btn-sm"
                            >
                                + YouTube
                            </button>
                            <button
                                onClick={() => addBlock("divider")}
                                className="btn-secondary btn-sm"
                            >
                                + Divider
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-surface-100">
                        <button
                            onClick={handleSave}
                            disabled={processing}
                            className="btn-primary btn-sm"
                        >
                            {processing ? "Saving..." : "Save Section"}
                        </button>
                        <button
                            onClick={onDelete}
                            className="btn-ghost btn-sm text-danger-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
