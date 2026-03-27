import { useState, type ChangeEvent } from 'react';

interface ImageUploaderProps {
    name: string;
    currentUrl?: string | null;
    onChange: (file: File | null) => void;
    error?: string;
}

export default function ImageUploader({ name, currentUrl, onChange, error }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(currentUrl || null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(currentUrl || null);
        }
    };

    return (
        <div>
            <div className="relative group">
                {preview ? (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-surface-200 bg-surface-50">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label
                                htmlFor={name}
                                className="btn-secondary btn-sm cursor-pointer"
                            >
                                Change Image
                            </label>
                        </div>
                    </div>
                ) : (
                    <label
                        htmlFor={name}
                        className="flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed border-surface-300 bg-surface-50 hover:bg-surface-100 hover:border-primary-400 transition-colors cursor-pointer"
                    >
                        <svg className="w-8 h-8 text-surface-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-surface-500">Click to upload image</span>
                        <span className="text-xs text-surface-400 mt-1">JPG, PNG, GIF, WebP up to 2MB</span>
                    </label>
                )}
                <input
                    id={name}
                    name={name}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
            </div>
            {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
        </div>
    );
}
