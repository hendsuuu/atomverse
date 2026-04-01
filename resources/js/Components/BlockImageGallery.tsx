import {
    useState,
    useRef,
    useCallback,
    type ChangeEvent,
    type MouseEvent,
    type TouchEvent,
} from "react";
import axios from "axios";
import type { GalleryImage } from "@/types";

interface BlockImageGalleryProps {
    images: GalleryImage[];
    columns: 2 | 3 | 4;
    gap: "small" | "medium" | "large";
    onChange: (updates: {
        images?: GalleryImage[];
        columns?: 2 | 3 | 4;
        gap?: "small" | "medium" | "large";
    }) => void;
}

const columnOptions: { value: 2 | 3 | 4; label: string }[] = [
    { value: 2, label: "2 Columns" },
    { value: 3, label: "3 Columns" },
    { value: 4, label: "4 Columns" },
];

const gapOptions: { value: "small" | "medium" | "large"; label: string }[] = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
];

const gapClass = {
    small: "gap-2",
    medium: "gap-4",
    large: "gap-6",
};

const colsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
};

export default function BlockImageGallery({
    images,
    columns,
    gap,
    onChange,
}: BlockImageGalleryProps) {
    return (
        <div className="space-y-3">
            {/* Grid controls */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-surface-600 mb-1.5 block">
                        Columns
                    </label>
                    <div className="flex gap-1">
                        {columnOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onChange({ columns: opt.value })}
                                className={`flex-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    columns === opt.value
                                        ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                                        : "bg-surface-100 text-surface-500 hover:bg-surface-200"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-surface-600 mb-1.5 block">
                        Gap
                    </label>
                    <div className="flex gap-1">
                        {gapOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onChange({ gap: opt.value })}
                                className={`flex-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    gap === opt.value
                                        ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                                        : "bg-surface-100 text-surface-500 hover:bg-surface-200"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Image grid preview */}
            <div className={`grid ${colsClass[columns]} ${gapClass[gap]}`}>
                {images.map((img, idx) => (
                    <GalleryItem
                        key={idx}
                        image={img}
                        onUpdate={(updates) => {
                            const newImages = [...images];
                            newImages[idx] = { ...newImages[idx], ...updates };
                            onChange({ images: newImages });
                        }}
                        onRemove={() => {
                            onChange({
                                images: images.filter((_, i) => i !== idx),
                            });
                        }}
                    />
                ))}

                {/* Add image slot */}
                <AddImageSlot
                    onUploaded={(url) => {
                        onChange({ images: [...images, { url, caption: "" }] });
                    }}
                />
            </div>
        </div>
    );
}

function GalleryItem({
    image,
    onUpdate,
    onRemove,
}: {
    image: GalleryImage;
    onUpdate: (updates: Partial<GalleryImage>) => void;
    onRemove: () => void;
}) {
    const [adjusting, setAdjusting] = useState(false);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const currentPos = image.objectPosition || "50% 50%";

    // Parse "50% 50%" or "center center" to [x, y] percentages
    const parsePosition = (pos: string): [number, number] => {
        const map: Record<string, number> = {
            left: 0,
            center: 50,
            right: 100,
            top: 0,
            bottom: 100,
        };
        const parts = pos.split(/\s+/);
        const x = map[parts[0]] ?? (parseFloat(parts[0]) || 50);
        const y = map[parts[1]] ?? (parseFloat(parts[1]) || 50);
        return [x, y];
    };

    const [posX, posY] = parsePosition(currentPos);

    const updatePositionFromEvent = useCallback(
        (clientX: number, clientY: number) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = Math.max(
                0,
                Math.min(100, ((clientX - rect.left) / rect.width) * 100),
            );
            const y = Math.max(
                0,
                Math.min(100, ((clientY - rect.top) / rect.height) * 100),
            );
            onUpdate({ objectPosition: `${Math.round(x)}% ${Math.round(y)}%` });
        },
        [onUpdate],
    );

    const handleMouseDown = (e: MouseEvent) => {
        if (!adjusting) return;
        e.preventDefault();
        setDragging(true);
        updatePositionFromEvent(e.clientX, e.clientY);

        const onMouseMove = (ev: globalThis.MouseEvent) => {
            updatePositionFromEvent(ev.clientX, ev.clientY);
        };
        const onMouseUp = () => {
            setDragging(false);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const handleTouchStart = (e: TouchEvent) => {
        if (!adjusting) return;
        e.preventDefault();
        setDragging(true);
        const touch = e.touches[0];
        updatePositionFromEvent(touch.clientX, touch.clientY);

        const onTouchMove = (ev: globalThis.TouchEvent) => {
            const t = ev.touches[0];
            updatePositionFromEvent(t.clientX, t.clientY);
        };
        const onTouchEnd = () => {
            setDragging(false);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);
    };

    return (
        <div className="relative group rounded-xl overflow-hidden border border-surface-200 bg-surface-50">
            {image.url ? (
                <div className="relative">
                    <div
                        ref={containerRef}
                        className={`relative w-full aspect-square overflow-hidden ${adjusting ? "cursor-crosshair" : ""}`}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleTouchStart}
                    >
                        <img
                            src={image.url}
                            alt={image.caption || ""}
                            className={`w-full h-full object-cover pointer-events-none select-none ${adjusting ? "brightness-75" : ""}`}
                            style={{ objectPosition: currentPos }}
                            draggable={false}
                        />
                        {/* Focal point indicator */}
                        {adjusting && (
                            <>
                                {/* Crosshair lines */}
                                <div
                                    className="absolute top-0 bottom-0 w-px bg-white/50 pointer-events-none"
                                    style={{ left: `${posX}%` }}
                                />
                                <div
                                    className="absolute left-0 right-0 h-px bg-white/50 pointer-events-none"
                                    style={{ top: `${posY}%` }}
                                />
                                {/* Dot */}
                                <div
                                    className={`absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none ${
                                        dragging
                                            ? "bg-primary-500 scale-110"
                                            : "bg-primary-400"
                                    } transition-transform`}
                                    style={{
                                        left: `${posX}%`,
                                        top: `${posY}%`,
                                    }}
                                />
                                {/* Position label */}
                                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
                                    {Math.round(posX)}%, {Math.round(posY)}%
                                </div>
                            </>
                        )}
                    </div>
                    {/* Hover controls */}
                    <div
                        className={`absolute top-2 right-2 flex gap-1 ${adjusting ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                    >
                        <button
                            type="button"
                            onClick={() => setAdjusting(!adjusting)}
                            className={`rounded-lg px-2 py-1.5 text-xs font-medium shadow-sm transition-colors ${
                                adjusting
                                    ? "bg-primary-500 text-white hover:bg-primary-600"
                                    : "bg-white/90 text-surface-700 hover:bg-white"
                            }`}
                            title={
                                adjusting ? "Done adjusting" : "Adjust position"
                            }
                        >
                            {adjusting ? "✓ Done" : "Crop"}
                        </button>
                        {!adjusting && (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="rounded-lg px-2 py-1.5 text-xs font-medium bg-white/90 text-danger-600 hover:bg-white shadow-sm"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="w-full aspect-square flex items-center justify-center text-surface-400 text-xs">
                    No image
                </div>
            )}
            <input
                className="input border-0 border-t border-surface-200 rounded-none text-xs"
                value={image.caption || ""}
                onChange={(e) => onUpdate({ caption: e.target.value })}
                placeholder="Caption..."
            />
        </div>
    );
}

function AddImageSlot({ onUploaded }: { onUploaded: (url: string) => void }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputId = `gallery-add-${Math.random().toString(36).slice(2, 9)}`;

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB.");
            return;
        }

        setError(null);
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("/admin/media/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onUploaded(response.data.url);
        } catch (err: any) {
            setError(err.response?.data?.message || "Upload failed.");
        } finally {
            setUploading(false);
            // Reset input so same file can be selected again
            e.target.value = "";
        }
    };

    return (
        <div>
            <label
                htmlFor={inputId}
                className={`flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
                    uploading
                        ? "border-primary-300 bg-primary-50"
                        : "border-surface-300 bg-surface-50 hover:bg-surface-100 hover:border-primary-400"
                }`}
            >
                {uploading ? (
                    <div className="flex flex-col items-center gap-1">
                        <svg
                            className="animate-spin w-5 h-5 text-primary-500"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        <span className="text-xs text-primary-600">
                            Uploading...
                        </span>
                    </div>
                ) : (
                    <>
                        <svg
                            className="w-6 h-6 text-surface-400 mb-1"
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
                        <span className="text-xs text-surface-500">
                            Add Image
                        </span>
                    </>
                )}
            </label>
            <input
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
            />
            {error && <p className="text-xs text-danger-600 mt-1">{error}</p>}
        </div>
    );
}
