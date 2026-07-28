import { useMemo, useState } from "react";

type Particle = "Proton" | "Neutron" | "Elektron";
type ZoneId = "proton-zone" | "neutron-zone" | "electron-zone";

interface PlacementZone {
    id: ZoneId;
    expectedParticle: Particle;
    positionClass: string;
    mobilePositionClass: string;
}

const particles: Particle[] = ["Proton", "Neutron", "Elektron"];

const zones: PlacementZone[] = [
    {
        id: "proton-zone",
        expectedParticle: "Proton",
        positionClass:
            "left-[30%] top-[44%] -translate-x-1/2 -translate-y-1/2",
        mobilePositionClass:
            "left-[32%] top-[48%] -translate-x-1/2 -translate-y-1/2",
    },
    {
        id: "neutron-zone",
        expectedParticle: "Neutron",
        positionClass:
            "left-[50%] top-[57%] -translate-x-1/2 -translate-y-1/2",
        mobilePositionClass:
            "left-[51%] top-[60%] -translate-x-1/2 -translate-y-1/2",
    },
    {
        id: "electron-zone",
        expectedParticle: "Elektron",
        positionClass:
            "left-[77%] top-[24%] -translate-x-1/2 -translate-y-1/2",
        mobilePositionClass:
            "left-[77%] top-[23%] -translate-x-1/2 -translate-y-1/2",
    },
];

export default function SubatomicStructureGame() {
    const [mapping, setMapping] = useState<Partial<Record<ZoneId, Particle>>>({});
    const [selectedParticle, setSelectedParticle] = useState<Particle | null>(
        null,
    );
    const [draggedParticle, setDraggedParticle] = useState<Particle | null>(
        null,
    );
    const [activeZone, setActiveZone] = useState<ZoneId | null>(null);

    const assignedParticles = new Set(Object.values(mapping));
    const availableParticles = particles.filter(
        (particle) => !assignedParticles.has(particle),
    );
    const placedCount = Object.keys(mapping).length;
    const correctCount = useMemo(
        () =>
            zones.filter((zone) => mapping[zone.id] === zone.expectedParticle)
                .length,
        [mapping],
    );
    const isCompleted = placedCount === zones.length;
    const isPerfect = isCompleted && correctCount === zones.length;

    const placeParticle = (particle: Particle, zoneId: ZoneId) => {
        setMapping((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((key) => {
                if (next[key as ZoneId] === particle) {
                    delete next[key as ZoneId];
                }
            });
            next[zoneId] = particle;
            return next;
        });
        setSelectedParticle(null);
        setDraggedParticle(null);
        setActiveZone(null);
    };

    const clearZone = (zoneId: ZoneId) => {
        setMapping((prev) => {
            const next = { ...prev };
            delete next[zoneId];
            return next;
        });
    };

    return (
        <section className="overflow-hidden rounded-[2rem] border border-surface-200/70 bg-white shadow-sm">
            <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700">
                            Game Interaktif
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-surface-900 sm:text-2xl">
                            Letakkan partikel pada posisi yang tepat
                        </h3>
                    </div>
                    <p className="text-sm font-semibold text-surface-500">
                        {placedCount}/{zones.length}
                    </p>
                </div>

                <div className="mt-4 rounded-3xl border border-primary-200/70 bg-primary-50/60 p-4">
                    <div className="flex flex-wrap gap-2.5">
                            {availableParticles.map((particle) => (
                                <button
                                    key={particle}
                                    draggable
                                    onDragStart={() => setDraggedParticle(particle)}
                                    onClick={() =>
                                        setSelectedParticle((current) =>
                                            current === particle ? null : particle,
                                        )
                                    }
                                    className={`rounded-2xl border px-3.5 py-2.5 text-sm font-semibold transition-all ${
                                        selectedParticle === particle
                                            ? "border-primary-600 bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                                            : "border-primary-200 bg-white text-primary-700 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                                    }`}
                                >
                                    {particle}
                                </button>
                            ))}
                        {availableParticles.length === 0 && (
                            <p className="text-sm font-medium text-emerald-700">
                                Semua partikel sudah dipasang.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-4 bg-[linear-gradient(180deg,#eef6ff,#ffffff)] p-3 sm:p-5 rounded-[1.75rem]">
                    <div className="relative mx-auto aspect-square w-full max-w-[34rem] overflow-hidden rounded-[1.6rem] border border-surface-200/70 bg-white shadow-[0_20px_50px_rgba(59,130,246,0.10)]">
                        <img
                            src="/images/games/atom-structure-board.svg"
                            alt="Ilustrasi struktur atom"
                            className="h-full w-full object-cover"
                            draggable={false}
                        />

                        {zones.map((zone) => {
                            const assignedParticle = mapping[zone.id];
                            const isCorrect =
                                assignedParticle === zone.expectedParticle;

                            return (
                                <div
                                    key={zone.id}
                                    onDragOver={(event) => {
                                        event.preventDefault();
                                        setActiveZone(zone.id);
                                    }}
                                    onDragLeave={() => setActiveZone(null)}
                                    onDrop={() => {
                                        if (draggedParticle) {
                                            placeParticle(draggedParticle, zone.id);
                                        }
                                    }}
                                    onClick={() => {
                                        if (selectedParticle) {
                                            placeParticle(selectedParticle, zone.id);
                                        }
                                    }}
                                    className={`absolute ${zone.mobilePositionClass} sm:${zone.positionClass} flex min-h-14 w-[30%] max-w-32 flex-col items-center justify-center rounded-2xl border-2 px-2 py-2 text-center backdrop-blur-sm transition-all sm:min-h-20 sm:max-w-40 sm:rounded-3xl sm:px-3 sm:py-3 ${
                                        activeZone === zone.id
                                            ? "border-primary-400 bg-primary-50/90 shadow-lg shadow-primary-500/10"
                                            : assignedParticle
                                              ? isCorrect
                                                  ? "border-emerald-300 bg-emerald-50/90 shadow-md shadow-emerald-500/10"
                                                  : "border-rose-300 bg-rose-50/90 shadow-md shadow-rose-500/10"
                                              : "border-dashed border-white/70 bg-white/75 shadow-md"
                                    }`}
                                >
                                    {assignedParticle ? (
                                        <>
                                            <span className="text-xs font-bold text-surface-900 sm:text-sm">
                                                {assignedParticle}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    clearZone(zone.id);
                                                }}
                                                className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-surface-500 shadow-sm transition-colors hover:bg-surface-100 hover:text-surface-700 sm:mt-2 sm:h-7 sm:w-7"
                                            >
                                                x
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-[11px] font-medium text-surface-400 sm:text-xs">
                                            {activeZone === zone.id ? "Lepas" : "Taruh"}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 rounded-3xl border border-surface-200/70 bg-surface-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-surface-900">
                        {isPerfect
                            ? "Semua benar."
                            : isCompleted
                              ? `${correctCount} dari ${zones.length} benar.`
                              : "Pasangkan semua partikel."}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setMapping({});
                            setSelectedParticle(null);
                            setDraggedParticle(null);
                            setActiveZone(null);
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
