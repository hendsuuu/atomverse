import { useState, useCallback, useRef, useEffect } from 'react';

interface DragDropGameProps {
    questionId: number;
    items: string[];
    targets: string[];
    onAnswer: (mapping: Record<string, string>) => void;
    existingAnswer?: Record<string, string>;
}

export default function DragDropGame({ questionId, items, targets, onAnswer, existingAnswer }: DragDropGameProps) {
    const [mapping, setMapping] = useState<Record<string, string>>(existingAnswer || {});
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [dropTarget, setDropTarget] = useState<string | null>(null);

    // Get unassigned items
    const assignedItems = Object.keys(mapping);
    const unassignedItems = items.filter((item) => !assignedItems.includes(item));

    const handleDragStart = (item: string) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e: React.DragEvent, target: string) => {
        e.preventDefault();
        setDropTarget(target);
    };

    const handleDragLeave = () => {
        setDropTarget(null);
    };

    const handleDrop = (target: string) => {
        if (draggedItem) {
            const newMapping = { ...mapping };
            // Remove from old target if exists
            Object.entries(newMapping).forEach(([key, val]) => {
                if (val === target) delete newMapping[key];
            });
            newMapping[draggedItem] = target;
            setMapping(newMapping);
            onAnswer(newMapping);
        }
        setDraggedItem(null);
        setDropTarget(null);
    };

    const removeMapping = (item: string) => {
        const newMapping = { ...mapping };
        delete newMapping[item];
        setMapping(newMapping);
        onAnswer(newMapping);
    };

    // Mobile touch support
    const [touchItem, setTouchItem] = useState<string | null>(null);

    const handleTouchSelect = (item: string) => {
        setTouchItem(item);
    };

    const handleTouchTarget = (target: string) => {
        if (touchItem) {
            const newMapping = { ...mapping };
            Object.entries(newMapping).forEach(([key, val]) => {
                if (val === target) delete newMapping[key];
            });
            newMapping[touchItem] = target;
            setMapping(newMapping);
            onAnswer(newMapping);
            setTouchItem(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Items to drag */}
            <div>
                <p className="text-sm font-medium text-surface-600 mb-3">
                    {touchItem ? `Tap target untuk "${touchItem}"` : 'Drag item atau tap untuk memilih:'}
                </p>
                <div className="flex flex-wrap gap-2">
                    {unassignedItems.map((item) => (
                        <div
                            key={item}
                            draggable
                            onDragStart={() => handleDragStart(item)}
                            onClick={() => handleTouchSelect(item)}
                            className={`px-4 py-2.5 rounded-xl font-medium text-sm cursor-grab active:cursor-grabbing transition-all select-none
                                ${touchItem === item
                                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                                    : 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 hover:shadow-md'
                                }`}
                        >
                            ⬡ {item}
                        </div>
                    ))}
                    {unassignedItems.length === 0 && (
                        <p className="text-sm text-success-600 font-medium">✓ Semua item sudah ditempatkan!</p>
                    )}
                </div>
            </div>

            {/* Targets */}
            <div className="space-y-3">
                {targets.map((target) => {
                    const assignedItem = Object.entries(mapping).find(([_, val]) => val === target)?.[0];
                    const isDropZone = dropTarget === target;

                    return (
                        <div
                            key={target}
                            onDragOver={(e) => handleDragOver(e, target)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(target)}
                            onClick={() => handleTouchTarget(target)}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all min-h-[72px]
                                ${isDropZone
                                    ? 'border-primary-500 bg-primary-50 shadow-md'
                                    : assignedItem
                                        ? 'border-success-300 bg-success-50/30'
                                        : 'border-dashed border-surface-300 bg-surface-50 hover:border-surface-400'
                                }`}
                        >
                            {/* Target label */}
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-medium text-surface-700">{target}</span>
                            </div>

                            {/* Drop zone / assigned item */}
                            <div className="flex-shrink-0">
                                {assignedItem ? (
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1.5 rounded-lg bg-success-100 text-success-700 text-sm font-medium">
                                            {assignedItem}
                                        </span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeMapping(assignedItem); }}
                                            className="w-6 h-6 rounded-full bg-danger-100 text-danger-600 flex items-center justify-center hover:bg-danger-200 transition-colors text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`px-3 py-1.5 rounded-lg text-sm ${
                                        isDropZone
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-surface-100 text-surface-400'
                                    }`}>
                                        {isDropZone ? 'Lepaskan di sini!' : 'Drop di sini'}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
