import type { ContentBlock } from "@/types";
import YouTubePlayer from "@/Components/YouTubePlayer";

interface ContentBlockRendererProps {
    blocks: ContentBlock[];
}

export default function ContentBlockRenderer({
    blocks,
}: ContentBlockRendererProps) {
    return (
        <div className="space-y-6">
            {blocks.map((block, index) => (
                <BlockItem key={index} block={block} />
            ))}
        </div>
    );
}

function BlockItem({ block }: { block: ContentBlock }) {
    switch (block.type) {
        case "rich_text":
            return (
                <div
                    className="prose-reader"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                />
            );

        case "image": {
            const widthPercent =
                {
                    small: "25%",
                    medium: "50%",
                    large: "75%",
                    full: "100%",
                }[block.width || "full"] || "100%";

            const alignClass =
                {
                    left: "mr-auto",
                    center: "mx-auto",
                    right: "ml-auto",
                }[block.align || "center"] || "mx-auto";

            return (
                <figure
                    className={`my-8 ${alignClass}`}
                    style={{ width: widthPercent }}
                >
                    <img
                        src={block.url}
                        alt={block.caption || ""}
                        className="w-full rounded-xl shadow-sm"
                        loading="lazy"
                    />
                    {block.caption && (
                        <figcaption className="text-center text-sm text-surface-500 mt-3 italic">
                            {block.caption}
                        </figcaption>
                    )}
                </figure>
            );
        }

        case "image_gallery": {
            const colsClass =
                {
                    2: "grid-cols-2",
                    3: "grid-cols-2 sm:grid-cols-3",
                    4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
                }[block.columns || 3] || "grid-cols-2 sm:grid-cols-3";

            const gapClass =
                {
                    small: "gap-2",
                    medium: "gap-4",
                    large: "gap-6",
                }[block.gap || "medium"] || "gap-4";

            return (
                <div className={`grid ${colsClass} ${gapClass} my-8`}>
                    {(block.images || []).map((img, idx) => (
                        <figure
                            key={idx}
                            className="overflow-hidden rounded-xl shadow-sm"
                        >
                            <img
                                src={img.url}
                                alt={img.caption || ""}
                                className="w-full aspect-square object-cover"
                                style={{
                                    objectPosition:
                                        img.objectPosition || "center center",
                                }}
                                loading="lazy"
                            />
                            {img.caption && (
                                <figcaption className="text-center text-xs text-surface-500 py-2 px-2 italic bg-surface-50">
                                    {img.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            );
        }

        case "callout":
            return <Callout variant={block.variant} content={block.content} />;

        case "quote":
            return (
                <blockquote className="border-l-4 border-primary-400 pl-5 py-3 my-8 bg-primary-50/30 rounded-r-xl">
                    <p className="text-surface-700 italic text-lg leading-relaxed">
                        "{block.content}"
                    </p>
                    {block.author && (
                        <cite className="text-sm text-surface-500 mt-2 block not-italic">
                            — {block.author}
                        </cite>
                    )}
                </blockquote>
            );

        case "divider":
            return (
                <div className="flex items-center gap-4 my-10">
                    <div className="flex-1 h-px bg-surface-200" />
                    <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-300" />
                    </div>
                    <div className="flex-1 h-px bg-surface-200" />
                </div>
            );

        case "embed_youtube":
            return <YouTubePlayer videoId={block.videoId} />;

        default:
            return null;
    }
}

function Callout({ variant, content }: { variant: string; content: string }) {
    const styles = {
        info: {
            bg: "bg-blue-50",
            border: "border-blue-400",
            icon: "ℹ️",
            text: "text-blue-800",
        },
        warning: {
            bg: "bg-amber-50",
            border: "border-amber-400",
            icon: "⚠️",
            text: "text-amber-800",
        },
        tip: {
            bg: "bg-emerald-50",
            border: "border-emerald-400",
            icon: "💡",
            text: "text-emerald-800",
        },
        note: {
            bg: "bg-purple-50",
            border: "border-purple-400",
            icon: "📌",
            text: "text-purple-800",
        },
    };

    const s = styles[variant as keyof typeof styles] || styles.info;

    return (
        <div className={`${s.bg} border-l-4 ${s.border} rounded-r-xl p-4 my-6`}>
            <div className="flex gap-3">
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <p className={`${s.text} text-sm leading-relaxed`}>{content}</p>
            </div>
        </div>
    );
}
