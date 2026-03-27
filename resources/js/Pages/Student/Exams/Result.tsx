import { Head, Link } from "@inertiajs/react";

interface ExamQuestion {
    id: number;
    type: "multiple_choice" | "drag_drop";
    question: string;
    options: any;
    correct_answer: any;
    points: number;
    explanation: string | null;
}

interface Props {
    attempt: {
        id: number;
        score: number;
        total_points: number;
        answers: Record<number, any>;
        completed_at: string;
        exam: {
            id: number;
            title: string;
            passing_score: number;
            questions: ExamQuestion[];
            course: {
                id: number;
                title: string;
                slug: string;
            };
        };
    };
}

export default function ExamResult({ attempt }: Props) {
    const { exam } = attempt;
    const percentage =
        attempt.total_points > 0
            ? Math.round((attempt.score / attempt.total_points) * 100)
            : 0;
    const passed = percentage >= exam.passing_score;

    const getAnswerStatus = (
        question: ExamQuestion,
    ): "correct" | "wrong" | "unanswered" => {
        const userAnswer = attempt.answers?.[question.id];
        if (userAnswer === undefined || userAnswer === null)
            return "unanswered";

        if (question.type === "multiple_choice") {
            return userAnswer === question.correct_answer ? "correct" : "wrong";
        }

        if (question.type === "drag_drop") {
            const correct = question.correct_answer as Record<string, string>;
            const user = userAnswer as Record<string, string>;
            const allCorrect = Object.entries(correct).every(
                ([key, val]) => user[key] === val,
            );
            return allCorrect ? "correct" : "wrong";
        }

        return "unanswered";
    };

    const correctCount = exam.questions.filter(
        (q) => getAnswerStatus(q) === "correct",
    ).length;

    return (
        <div className="min-h-screen bg-surface-50">
            <Head title={`Hasil — ${exam.title}`} />

            <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
                {/* Score card */}
                <div
                    className={`card p-8 text-center mb-8 ${
                        passed ? "border-success-300" : "border-danger-300"
                    } border-2`}
                >
                    <div
                        className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                            passed
                                ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                                : "bg-gradient-to-br from-red-400 to-red-600"
                        }`}
                    >
                        <span className="text-white text-3xl font-bold">
                            {percentage}%
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-surface-900 mb-2">
                        {passed
                            ? "🎉 Selamat! Kamu Lulus Final Test!"
                            : "😔 Belum Lulus Final Test"}
                    </h1>
                    <p className="text-surface-500 mb-4">
                        {passed
                            ? "Kamu berhasil menyelesaikan ujian akhir kelas ini."
                            : `Kamu perlu skor minimal ${exam.passing_score}% untuk lulus.`}
                    </p>

                    <div className="flex justify-center gap-8 text-sm">
                        <div className="text-center">
                            <p className="text-xl font-bold text-surface-900">
                                {attempt.score}/{attempt.total_points}
                            </p>
                            <p className="text-surface-500">Skor</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-success-600">
                                {correctCount}
                            </p>
                            <p className="text-surface-500">Benar</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold text-danger-600">
                                {exam.questions.length - correctCount}
                            </p>
                            <p className="text-surface-500">Salah</p>
                        </div>
                    </div>
                </div>

                {/* Review */}
                <h2 className="text-lg font-bold text-surface-900 mb-4">
                    Pembahasan Soal
                </h2>
                <div className="space-y-4">
                    {exam.questions.map((question, i) => {
                        const status = getAnswerStatus(question);
                        const userAnswer = attempt.answers?.[question.id];

                        return (
                            <div
                                key={question.id}
                                className={`card p-5 border-l-4 ${
                                    status === "correct"
                                        ? "border-l-success-500"
                                        : status === "wrong"
                                          ? "border-l-danger-500"
                                          : "border-l-surface-300"
                                }`}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <span
                                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                            status === "correct"
                                                ? "bg-success-100 text-success-700"
                                                : status === "wrong"
                                                  ? "bg-danger-100 text-danger-700"
                                                  : "bg-surface-100 text-surface-500"
                                        }`}
                                    >
                                        {status === "correct"
                                            ? "✓"
                                            : status === "wrong"
                                              ? "✕"
                                              : "—"}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-surface-900">
                                            {question.question}
                                        </p>
                                        <p className="text-xs text-surface-400 mt-1">
                                            {question.points} poin
                                        </p>
                                    </div>
                                </div>

                                {question.type === "multiple_choice" && (
                                    <div className="ml-10 space-y-1.5">
                                        {(question.options as string[]).map(
                                            (opt, j) => {
                                                const isCorrect =
                                                    opt ===
                                                    question.correct_answer;
                                                const isUserAnswer =
                                                    opt === userAnswer;

                                                return (
                                                    <div
                                                        key={j}
                                                        className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                                                            isCorrect
                                                                ? "bg-success-50 text-success-700 font-medium"
                                                                : isUserAnswer &&
                                                                    !isCorrect
                                                                  ? "bg-danger-50 text-danger-700 line-through"
                                                                  : "text-surface-600"
                                                        }`}
                                                    >
                                                        {isCorrect && (
                                                            <span>✓</span>
                                                        )}
                                                        {isUserAnswer &&
                                                            !isCorrect && (
                                                                <span>✕</span>
                                                            )}
                                                        {opt}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                )}

                                {question.type === "drag_drop" && (
                                    <div className="ml-10 space-y-1.5">
                                        {Object.entries(
                                            question.correct_answer as Record<
                                                string,
                                                string
                                            >,
                                        ).map(([item, target]) => {
                                            const userTarget = (
                                                userAnswer as Record<
                                                    string,
                                                    string
                                                >
                                            )?.[item];
                                            const isCorrect =
                                                userTarget === target;

                                            return (
                                                <div
                                                    key={item}
                                                    className={`px-3 py-2 rounded-lg text-sm ${
                                                        isCorrect
                                                            ? "bg-success-50 text-success-700"
                                                            : "bg-danger-50 text-danger-700"
                                                    }`}
                                                >
                                                    <strong>{item}</strong> →{" "}
                                                    {target}
                                                    {!isCorrect &&
                                                        userTarget && (
                                                            <span className="text-danger-500 ml-2">
                                                                (kamu:{" "}
                                                                {userTarget})
                                                            </span>
                                                        )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {question.explanation && (
                                    <div className="ml-10 mt-3 bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                                        💡 {question.explanation}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link
                        href={`/exams/${exam.id}`}
                        className="btn-primary flex-1 text-center"
                    >
                        Ulangi Ujian
                    </Link>
                    <Link
                        href={`/courses/${exam.course.slug}`}
                        className="btn-secondary flex-1 text-center"
                    >
                        Kembali ke Kelas
                    </Link>
                    <Link
                        href="/dashboard"
                        className="btn-ghost flex-1 text-center"
                    >
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
