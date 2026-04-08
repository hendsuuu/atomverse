import { useMemo, useState } from "react";

type Scientist =
    | "John Dalton"
    | "J.J. Thomson"
    | "Ernest Rutherford"
    | "Niels Bohr";

type ModelId = "dalton" | "thomson" | "rutherford" | "bohr";

interface ModelCard {
    id: ModelId;
    title: string;
    year: string;
    scientist: Scientist;
    accent: string;
}

const scientists: Scientist[] = [
    "John Dalton",
    "J.J. Thomson",
    "Ernest Rutherford",
    "Niels Bohr",
];

const modelCards: ModelCard[] = [
    {
        id: "dalton",
        title: "Model Bola Biliar",
        year: "1803",
        scientist: "John Dalton",
        accent: "from-slate-700 via-slate-800 to-slate-900",
    },
    {
        id: "thomson",
        title: "Model Roti Kismis",
        year: "1897",
        scientist: "J.J. Thomson",
        accent: "from-amber-500 via-orange-500 to-rose-500",
    },
    {
        id: "rutherford",
        title: "Model Atom Inti",
        year: "1911",
        scientist: "Ernest Rutherford",
        accent: "from-emerald-500 via-teal-500 to-cyan-500",
    },
    {
        id: "bohr",
        title: "Model Atom Orbit",
        year: "1913",
        scientist: "Niels Bohr",
        accent: "from-indigo-500 via-blue-600 to-sky-600",
    },
];

export default function AtomModelDiscoveryGame() {
    const [mapping, setMapping] = useState<Partial<Record<ModelId, Scientist>>>(
        {},
    );
    const [selectedScientist, setSelectedScientist] = useState<Scientist | null>(
        null,
    );
    const [draggedScientist, setDraggedScientist] = useState<Scientist | null>(
        null,
    );
    const [activeTarget, setActiveTarget] = useState<ModelId | null>(null);

    const assignedScientists = new Set(Object.values(mapping));
    const availableScientists = scientists.filter(
        (scientist) => !assignedScientists.has(scientist),
    );

    const progress = Object.keys(mapping).length;
    const correctCount = useMemo(
        () =>
            modelCards.filter((card) => mapping[card.id] === card.scientist).length,
        [mapping],
    );
    const isCompleted = progress === modelCards.length;
    const isPerfect = isCompleted && correctCount === modelCards.length;

    const assignScientist = (scientist: Scientist, target: ModelId) => {
        setMapping((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((key) => {
                if (next[key as ModelId] === scientist) {
                    delete next[key as ModelId];
                }
            });
            next[target] = scientist;
            return next;
        });
        setSelectedScientist(null);
        setDraggedScientist(null);
        setActiveTarget(null);
    };

    const clearTarget = (target: ModelId) => {
        setMapping((prev) => {
            const next = { ...prev };
            delete next[target];
            return next;
        });
    };

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-surface-200/70 bg-white shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12),_transparent_34%)]" />
            <div className="relative p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
                            Game Interaktif
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-surface-900 sm:text-2xl">
                            Cocokkan model atom dan ilmuwannya
                        </h3>
                    </div>
                    <p className="text-sm font-semibold text-surface-500">
                        {progress}/{modelCards.length}
                    </p>
                </div>

                <div className="mt-4 rounded-3xl border border-primary-200/70 bg-primary-50/60 p-4">
                    <div className="flex flex-wrap gap-2.5">
                        {availableScientists.map((scientist) => (
                            <button
                                key={scientist}
                                draggable
                                onDragStart={() => setDraggedScientist(scientist)}
                                onClick={() =>
                                    setSelectedScientist((current) =>
                                        current === scientist ? null : scientist,
                                    )
                                }
                                className={`rounded-2xl border px-3.5 py-2.5 text-sm font-semibold transition-all ${
                                    selectedScientist === scientist
                                        ? "border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                                        : "border-primary-200 bg-white text-primary-700 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                                }`}
                            >
                                {scientist}
                            </button>
                        ))}
                        {availableScientists.length === 0 && (
                            <p className="text-sm font-medium text-emerald-700">
                                Semua nama sudah dipasang.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid gap-3 sm:gap-4 xl:grid-cols-2">
                    {modelCards.map((card) => {
                        const assignedScientist = mapping[card.id];
                        const isCorrect = assignedScientist === card.scientist;
                        const isWrong = !!assignedScientist && !isCorrect;

                        return (
                            <div
                                key={card.id}
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    setActiveTarget(card.id);
                                }}
                                onDragLeave={() => setActiveTarget(null)}
                                onDrop={() => {
                                    if (draggedScientist) {
                                        assignScientist(draggedScientist, card.id);
                                    }
                                }}
                                onClick={() => {
                                    if (selectedScientist) {
                                        assignScientist(selectedScientist, card.id);
                                    }
                                }}
                                className={`rounded-[1.6rem] border-2 bg-white p-4 transition-all ${
                                    activeTarget === card.id
                                        ? "border-primary-400 shadow-lg shadow-primary-500/10"
                                        : isCorrect
                                          ? "border-emerald-300 shadow-md shadow-emerald-500/10"
                                          : isWrong
                                            ? "border-rose-300 shadow-md shadow-rose-500/10"
                                            : "border-surface-200/80 hover:border-surface-300"
                                }`}
                            >
                                <div
                                    className={`rounded-[1.35rem] bg-gradient-to-br ${card.accent} p-4 text-white`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                                                {card.year}
                                            </p>
                                            <h4 className="mt-2 text-lg font-bold sm:text-xl">
                                                {card.title}
                                            </h4>
                                        </div>
                                        <AtomModelIllustration model={card.id} />
                                    </div>
                                </div>

                                <div className="mt-3 flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-dashed border-surface-300 bg-surface-50/70 px-4 py-3">
                                    {assignedScientist ? (
                                        <>
                                            <div className="min-w-0">
                                                <p
                                                    className={`text-sm font-bold ${
                                                        isCorrect
                                                            ? "text-emerald-700"
                                                            : "text-rose-700"
                                                    }`}
                                                >
                                                    {assignedScientist}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        isCorrect
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-rose-100 text-rose-700"
                                                    }`}
                                                >
                                                    {isCorrect ? "Benar" : "Coba lagi"}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        clearTarget(card.id);
                                                    }}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-surface-500 shadow-sm transition-colors hover:bg-surface-100 hover:text-surface-700"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm font-medium text-surface-400">
                                            {activeTarget === card.id ? "Lepas di sini" : "Taruh nama di sini"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-surface-200/70 bg-surface-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-surface-900">
                        {isPerfect
                            ? "Semua benar."
                            : isCompleted
                              ? `${correctCount} dari ${modelCards.length} benar.`
                              : "Pasangkan semua kartu."}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setMapping({});
                            setSelectedScientist(null);
                            setDraggedScientist(null);
                            setActiveTarget(null);
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-surface-300 bg-white px-4 py-2 text-sm font-semibold text-surface-700 transition-colors hover:bg-surface-100"
                    >
                        Ulangi
                    </button>
                </div>
            </div>
        </section>
    );
}

function AtomModelIllustration({ model }: { model: ModelId }) {
    if (model === "dalton") {
        return (
            <svg
                viewBox="0 0 120 120"
                className="h-20 w-20 shrink-0 drop-shadow-[0_14px_24px_rgba(15,23,42,0.28)] sm:h-24 sm:w-24"
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id="dalton-core" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.92)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
                    </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="42" fill="url(#dalton-core)" />
                <circle
                    cx="60"
                    cy="60"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="2.5"
                />
            </svg>
        );
    }

    if (model === "thomson") {
        return (
            <svg
                viewBox="0 0 120 120"
                className="h-20 w-20 shrink-0 drop-shadow-[0_14px_24px_rgba(15,23,42,0.28)] sm:h-24 sm:w-24"
                aria-hidden="true"
            >
                <defs>
                    <radialGradient id="thomson-body" cx="40%" cy="35%" r="70%">
                        <stop offset="0%" stopColor="#ffe3b3" />
                        <stop offset="100%" stopColor="#f97316" />
                    </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="42" fill="url(#thomson-body)" />
                {[
                    [40, 36],
                    [74, 40],
                    [32, 67],
                    [67, 72],
                    [55, 54],
                    [83, 62],
                ].map(([x, y]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#1f2937" />
                ))}
            </svg>
        );
    }

    if (model === "rutherford") {
        return (
            <svg
                viewBox="0 0 120 120"
                className="h-20 w-20 shrink-0 drop-shadow-[0_14px_24px_rgba(15,23,42,0.28)] sm:h-24 sm:w-24"
                aria-hidden="true"
            >
                <ellipse
                    cx="60"
                    cy="60"
                    rx="38"
                    ry="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="2"
                />
                <ellipse
                    cx="60"
                    cy="60"
                    rx="18"
                    ry="40"
                    fill="none"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="2"
                    transform="rotate(25 60 60)"
                />
                <circle cx="60" cy="60" r="10" fill="#fef08a" />
                <circle cx="86" cy="59" r="4.5" fill="#ffffff" />
                <circle cx="53" cy="27" r="4.5" fill="#ffffff" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 120 120"
            className="h-20 w-20 shrink-0 drop-shadow-[0_14px_24px_rgba(15,23,42,0.28)] sm:h-24 sm:w-24"
            aria-hidden="true"
        >
            <circle cx="60" cy="60" r="9" fill="#fde68a" />
            <circle
                cx="60"
                cy="60"
                r="24"
                fill="none"
                stroke="rgba(255,255,255,0.48)"
                strokeWidth="2"
            />
            <circle
                cx="60"
                cy="60"
                r="38"
                fill="none"
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="2"
            />
            <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255,255,255,0.36)"
                strokeWidth="2"
            />
            <circle cx="84" cy="60" r="4.5" fill="#ffffff" />
            <circle cx="24" cy="60" r="4.5" fill="#ffffff" />
            <circle cx="60" cy="10" r="4.5" fill="#ffffff" />
        </svg>
    );
}
