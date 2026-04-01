import { useState, type ChangeEvent } from "react";
import axios from "axios";
import type { ImageAlign, ImageWidth } from "@/types";

interface BlockImageUploaderProps {
    url: string;
    caption: string;
    width: ImageWidth;
    align: ImageAlign;
    onChange: (updates: {
        url?: string;
        caption?: string;
        width?: ImageWidth;
        align?: ImageAlign;
    }) => void;
}

const widthOptions: { value: ImageWidth; label: string }[] = [
    { value: "small", label: "25%" },
    { value: "medium", label: "50%" },
    { value: "large", label: "75%" },
    { value: "full", label: "100%" },
];

const alignOptions: {
    value: ImageAlign;
    label: string;
    icon: React.ReactNode;
}[] = [
    {
        value: "left",
        label: "Left",
        icon: (
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
                    d="M3 10h18M3 14h12"
                />
            </svg>
        ),
    },
    {
        value: "center",
        label: "Center",
        icon: (
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
                    d="M3 10h18M6 14h12"
                />
            </svg>
        ),
    },
    {
        value: "right",
        label: "Right",
        icon: (
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
                    d="M3 10h18M9 14h12"
                />
            </svg>
        ),
    },
];

export default function BlockImageUploader({
    url,
    caption,
    width,
    align,
    onChange,
}: BlockImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(url || null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate client-side
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be less than 5MB.");
            return;
        }

        setError(null);

        // Show instant preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("/admin/media/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            onChange({ url: response.data.url });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Upload failed. Please try again.",
            );
            setPreview(url || null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange({ url: "" });
    };

    const inputId = `block-img-${Math.random().toString(36).slice(2, 9)}`;

    return (
        <div className="space-y-3">
            {/* Upload area */}
            {preview ? (
                <div className="relative group">
                    <div className="relative rounded-xl overflow-hidden border border-surface-200 bg-surface-50">
                        <img
                            src={preview}
                            alt={caption || "Uploaded image"}
                            className="max-h-60 w-full object-contain bg-surface-100"
                        />
                        {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-white text-sm">
                                    <svg
                                        className="animate-spin w-4 h-4"
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
                                    Uploading...
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <label
                                htmlFor={inputId}
                                className="btn-secondary btn-sm cursor-pointer"
                            >
                                Change
                            </label>
                            <button
                                onClick={handleRemove}
                                className="btn-sm bg-white/90 text-danger-600 hover:bg-white rounded-lg px-3 py-1.5 text-xs font-medium"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <label
                    htmlFor={inputId}
                    className="flex flex-col items-center justify-center w-full h-36 rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 hover:bg-surface-100 hover:border-primary-400 transition-colors cursor-pointer"
                >
                    <svg
                        className="w-8 h-8 text-surface-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="text-sm text-surface-500">
                        Click to upload image
                    </span>
                    <span className="text-xs text-surface-400 mt-1">
                        JPG, PNG, GIF, WebP up to 5MB
                    </span>
                </label>
            )}
            <input
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
            />

            {error && <p className="text-xs text-danger-600">{error}</p>}

            {/* Layout controls */}
            <div className="grid grid-cols-2 gap-3">
                {/* Size selector */}
                <div>
                    <label className="text-xs font-medium text-surface-600 mb-1.5 block">
                        Size
                    </label>
                    <div className="flex gap-1">
                        {widthOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onChange({ width: opt.value })}
                                className={`flex-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    width === opt.value
                                        ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                                        : "bg-surface-100 text-surface-500 hover:bg-surface-200"
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Align selector */}
                <div>
                    <label className="text-xs font-medium text-surface-600 mb-1.5 block">
                        Alignment
                    </label>
                    <div className="flex gap-1">
                        {alignOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onChange({ align: opt.value })}
                                className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    align === opt.value
                                        ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                                        : "bg-surface-100 text-surface-500 hover:bg-surface-200"
                                }`}
                                title={opt.label}
                            >
                                {opt.icon}
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Caption */}
            <input
                className="input"
                value={caption}
                onChange={(e) => onChange({ caption: e.target.value })}
                placeholder="Caption (optional)"
            />
        </div>
    );
}
