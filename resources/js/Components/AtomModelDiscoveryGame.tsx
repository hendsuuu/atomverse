import { useMemo, useState } from "react";

type Scientist =
    | "John Dalton"
    | "J.J. Thomson"
    | "Ernest Rutherford"
    | "Niels Bohr"
    | "Erwin Schrödinger";

type ModelId = "dalton" | "thomson" | "rutherford" | "bohr" | "quantum";

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
    "Erwin Schrödinger",
];

const modelCards: ModelCard[] = [
    {
        id: "dalton",
        title: "Model Bola Biliar",
        year: "1803",
        scientist: "John Dalton",
        accent: "from-blue-600 via-blue-700 to-blue-800",
    },
    {
        id: "thomson",
        title: "Model Roti Kismis",
        year: "1897",
        scientist: "J.J. Thomson",
        accent: "from-red-500 via-red-600 to-red-700",
    },
    {
        id: "rutherford",
        title: "Model Atom Inti",
        year: "1911",
        scientist: "Ernest Rutherford",
        accent: "from-gray-100 via-gray-200 to-gray-300",
    },
    {
        id: "bohr",
        title: "Model Atom Orbit",
        year: "1913",
        scientist: "Niels Bohr",
        accent: "from-cyan-300 via-cyan-400 to-cyan-500",
    },
    {
        id: "quantum",
        title: "Model Mekanika Kuantum",
        year: "1926",
        scientist: "Erwin Schrödinger",
        accent: "from-blue-300 via-blue-400 to-blue-500",
    },
];

export default function AtomModelDiscoveryGame() {
    const [mapping, setMapping] = useState<Partial<Record<ModelId, Scientist>>>(
        {},
    );
    const [selectedScientist, setSelectedScientist] =
        useState<Scientist | null>(null);
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
            modelCards.filter((card) => mapping[card.id] === card.scientist)
                .length,
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
                                onDragStart={() =>
                                    setDraggedScientist(scientist)
                                }
                                onClick={() =>
                                    setSelectedScientist((current) =>
                                        current === scientist
                                            ? null
                                            : scientist,
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
                                        assignScientist(
                                            draggedScientist,
                                            card.id,
                                        );
                                    }
                                }}
                                onClick={() => {
                                    if (selectedScientist) {
                                        assignScientist(
                                            selectedScientist,
                                            card.id,
                                        );
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
                                        <AtomModelIllustration
                                            model={card.id}
                                        />
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
                                                    {isCorrect
                                                        ? "Benar"
                                                        : "Coba lagi"}
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
                                            {activeTarget === card.id
                                                ? "Lepas di sini"
                                                : "Taruh nama di sini"}
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
    const imageMap: Record<ModelId, string> = {
        dalton: "/images/dalton.png",
        thomson: "/images/thomson.jpg",
        rutherford: "/images/rutherford.png",
        bohr: "/images/bohr.png",
        quantum: "/images/quantum.png",
    };

    return (
        <img
            src={imageMap[model]}
            alt={`${model} atom model`}
            className="h-20 w-20 shrink-0 object-cover drop-shadow-[0_14px_24px_rgba(15,23,42,0.28)] sm:h-24 sm:w-24"
        />
    );
}
