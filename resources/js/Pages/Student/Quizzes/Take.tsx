import { useState, useCallback, useEffect, useRef } from "react";
import { Head, Link, router } from "@inertiajs/react";
import DragDropGame from "@/Components/DragDropGame";

interface QuizQuestion {
    id: number;
    type: "multiple_choice" | "drag_drop";
    question: string;
    options: any;
    points: number;
    sort_order: number;
}

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    passing_score: number;
    time_limit_minutes: number | null;
    material: {
        id: number;
        title: string;
        slug: string;
        course: { id: number; title: string; slug: string };
    };
    questions: QuizQuestion[];
}

interface QuizAttempt {
    id: number;
    score: number;
    total_points: number;
    completed_at: string;
}

interface Props {
    quiz: Quiz;
    previousAttempts: QuizAttempt[];
    bestAttempt: QuizAttempt | null;
}

export default function QuizTake({
    quiz,
    previousAttempts,
    bestAttempt,
}: Props) {
    const [started, setStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(
        quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null,
    );

    const question = quiz.questions[currentQuestion];
    const totalQuestions = quiz.questions.length;
    const answered = Object.keys(answers).length;

    const setAnswer = useCallback((questionId: number, answer: any) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    }, []);

    const handleSubmit = useCallback(() => {
        setSubmitting(true);
        router.post(
            `/quizzes/${quiz.id}/submit`,
            { answers },
            {
                onFinish: () => setSubmitting(false),
            },
        );
    }, [quiz.id, answers]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    // Timer
    const handleSubmitRef = useRef(handleSubmit);
    handleSubmitRef.current = handleSubmit;

    useEffect(() => {
        if (!started || timeLeft === null) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev !== null && prev <= 1) {
                    clearInterval(interval);
                    handleSubmitRef.current();
                    return 0;
                }
                return prev !== null ? prev - 1 : null;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [started]);

    // ── Pre-start screen ──
    if (!started) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
                <Head title={quiz.title} />
                <div className="max-w-lg w-full">
                    <div className="card p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">📝</span>
                        </div>
                        <h1 className="text-2xl font-bold text-surface-900 mb-2">
                            {quiz.title}
                        </h1>
                        {quiz.description && (
                            <p className="text-surface-500 mb-6">
                                {quiz.description}
                            </p>
                        )}

                        <div className="flex justify-center gap-6 mb-8 text-sm">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary-600">
                                    {quiz.questions.length}
                                </p>
                                <p className="text-surface-500">Soal</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-primary-600">
                                    {quiz.passing_score}%
                                </p>
                                <p className="text-surface-500">KKM</p>
                            </div>
                            {quiz.time_limit_minutes && (
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-primary-600">
                                        {quiz.time_limit_minutes}
                                    </p>
                                    <p className="text-surface-500">Menit</p>
                                </div>
                            )}
                        </div>

                        {bestAttempt && (
                            <div className="bg-surface-50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-surface-600">
                                    Skor terbaik:{" "}
                                    <span className="font-bold text-primary-600">
                                        {Math.round(
                                            (bestAttempt.score /
                                                bestAttempt.total_points) *
                                                100,
                                        )}
                                        %
                                    </span>
                                    ({bestAttempt.score}/
                                    {bestAttempt.total_points})
                                </p>
                                <p className="text-xs text-surface-400 mt-1">
                                    {previousAttempts.length} percobaan
                                    sebelumnya
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => setStarted(true)}
                            className="btn-primary btn-lg w-full"
                        >
                            Mulai Mengerjakan
                        </button>

                        <Link
                            href={`/materials/${quiz.material.slug}`}
                            className="btn-ghost mt-3 w-full block text-center"
                        >
                            ← Kembali ke Materi
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Quiz in progress ──
    return (
        <div className="min-h-screen bg-surface-50">
            <Head title={`${quiz.title} — Soal ${currentQuestion + 1}`} />

            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/90 glass border-b border-surface-200/60">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-medium text-surface-900 truncate">
                            {quiz.title}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        {timeLeft !== null && (
                            <span
                                className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                                    timeLeft < 60
                                        ? "bg-danger-50 text-danger-600"
                                        : "bg-surface-100 text-surface-600"
                                }`}
                            >
                                ⏱ {formatTime(timeLeft)}
                            </span>
                        )}
                        <span className="badge-primary">
                            {answered}/{totalQuestions}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-surface-100">
                    <div
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all"
                        style={{
                            width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
                        }}
                    />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Question card */}
                <div
                    className="card p-6 sm:p-8 mb-6 animate-slide-up"
                    key={question.id}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                            {currentQuestion + 1}
                        </span>
                        <span className="text-xs text-surface-400">
                            {question.points} poin ·{" "}
                            {question.type === "drag_drop"
                                ? "Drag & Drop"
                                : "Pilihan Ganda"}
                        </span>
                    </div>

                    <h2 className="text-lg font-semibold text-surface-900 mb-6">
                        {question.question}
                    </h2>

                    {question.type === "multiple_choice" && (
                        <div className="space-y-3">
                            {(question.options as string[]).map((option, i) => (
                                <button
                                    key={i}
                                    onClick={() =>
                                        setAnswer(question.id, option)
                                    }
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                        answers[question.id] === option
                                            ? "border-primary-500 bg-primary-50 text-primary-700"
                                            : "border-surface-200 hover:border-surface-300 text-surface-700"
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                answers[question.id] === option
                                                    ? "border-primary-500 bg-primary-500"
                                                    : "border-surface-300"
                                            }`}
                                        >
                                            {answers[question.id] ===
                                                option && (
                                                <span className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </span>
                                        <span className="text-sm">
                                            {option}
                                        </span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {question.type === "drag_drop" && (
                        <DragDropGame
                            questionId={question.id}
                            items={(question.options as any).items}
                            targets={(question.options as any).targets}
                            onAnswer={(mapping) =>
                                setAnswer(question.id, mapping)
                            }
                            existingAnswer={answers[question.id]}
                        />
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() =>
                            setCurrentQuestion(Math.max(0, currentQuestion - 1))
                        }
                        disabled={currentQuestion === 0}
                        className="btn-secondary"
                    >
                        ← Sebelumnya
                    </button>

                    {currentQuestion < totalQuestions - 1 ? (
                        <button
                            onClick={() =>
                                setCurrentQuestion(currentQuestion + 1)
                            }
                            className="btn-primary"
                        >
                            Berikutnya →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-primary bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                        >
                            {submitting ? "Mengirim..." : "✓ Selesai & Kirim"}
                        </button>
                    )}
                </div>

                {/* Question dots */}
                <div className="flex items-center justify-center gap-2 mt-8">
                    {quiz.questions.map((q, i) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestion(i)}
                            className={`w-3 h-3 rounded-full transition-all ${
                                i === currentQuestion
                                    ? "bg-primary-500 scale-125"
                                    : answers[q.id] !== undefined
                                      ? "bg-success-500"
                                      : "bg-surface-300"
                            }`}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
