import { useState, useRef, useCallback } from 'react';

interface YouTubePlayerProps {
    videoId: string;
    title?: string;
}

export default function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    if (!isPlaying) {
        return (
            <div className="my-8 relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                 onClick={() => setIsPlaying(true)}>
                <div className="aspect-video bg-surface-900 relative">
                    <img
                        src={thumbnailUrl}
                        alt={title || 'Video thumbnail'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                        }}
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all flex items-center justify-center shadow-xl">
                            <svg className="w-8 h-8 text-red-600 ml-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                    {/* YouTube badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 rounded-lg px-3 py-1.5">
                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
                            <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white"/>
                        </svg>
                        <span className="text-white text-xs font-medium">Video Pembelajaran</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-8 rounded-2xl overflow-hidden shadow-lg">
            <div className="aspect-video bg-surface-900">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title || 'Video Pembelajaran'}
                />
            </div>
        </div>
    );
}
