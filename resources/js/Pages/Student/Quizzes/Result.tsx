import { Head, Link } from '@inertiajs/react';

interface QuizQuestion {
    id: number;
    type: 'multiple_choice' | 'drag_drop' | 'essay';
    question: string;
    image_path?: string | null;
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
        quiz: {
            id: number;
            title: string;
            passing_score: number;
            questions: QuizQuestion[];
            material: {
                id: number;
                title: string;
                slug: string;
                course: { id: number; title: string; slug: string };
            };
        };
    };
}

export default function QuizResult({ attempt }: Props) {
    const { quiz } = attempt;

    const getAnswerStatus = (question: QuizQuestion): 'correct' | 'wrong' | 'unanswered' => {
        const userAnswer = attempt.answers?.[question.id];
        if (userAnswer === undefined || userAnswer === null) return 'unanswered';

        if (question.type === 'multiple_choice') {
            return userAnswer === question.correct_answer ? 'correct' : 'wrong';
        }

        if (question.type === 'drag_drop') {
            const correct = question.correct_answer as Record<string, string>;
            const user = userAnswer as Record<string, string>;
            const allCorrect = Object.entries(correct).every(
                ([key, val]) => user[key] === val
            );
            return allCorrect ? 'correct' : 'wrong';
        }

        if (question.type === 'essay') {
            return typeof userAnswer === 'string' && userAnswer.trim() !== ''
                ? 'correct'
                : 'unanswered';
        }

        return 'unanswered';
    };

    return (
        <div className="min-h-screen bg-surface-50">
            <Head title={`Hasil — ${quiz.title}`} />

            <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
                <div className="card p-8 text-center mb-8 border-2 border-primary-200">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
                        <span className="text-white text-3xl">📝</span>
                    </div>

                    <h1 className="text-2xl font-bold text-surface-900 mb-2">
                        Latihan Selesai
                    </h1>
                    <p className="text-surface-500">
                        Tidak ada skor akhir untuk latihan ini. Kamu bisa melihat feedback per soal di bawah.
                    </p>
                </div>

                {/* Review */}
                <h2 className="text-lg font-bold text-surface-900 mb-4">Pembahasan Soal</h2>
                <div className="space-y-4">
                    {quiz.questions.map((question, i) => {
                        const status = getAnswerStatus(question);
                        const userAnswer = attempt.answers?.[question.id];

                        return (
                            <div key={question.id} className={`card p-5 border-l-4 ${
                                status === 'correct' ? 'border-l-success-500' :
                                status === 'wrong' ? 'border-l-danger-500' : 'border-l-surface-300'
                            }`}>
                                <div className="flex items-start gap-3 mb-3">
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                        status === 'correct' ? 'bg-success-100 text-success-700' :
                                        status === 'wrong' ? 'bg-danger-100 text-danger-700' : 'bg-surface-100 text-surface-500'
                                    }`}>
                                        {status === 'correct' ? '✓' : status === 'wrong' ? '✕' : '—'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-surface-900">{question.question}</p>
                                        <p className="text-xs text-surface-400 mt-1">{question.type === 'essay' ? 'Essay' : `${question.points} poin`}</p>
                                    </div>
                                </div>

                                {question.image_path && (
                                    <div className="ml-10 mb-3 rounded-lg border border-surface-200 bg-white p-2">
                                        <img
                                            src={`/${question.image_path}`}
                                            alt={`Soal ${i + 1}`}
                                            className="w-full max-h-72 object-contain rounded"
                                        />
                                    </div>
                                )}

                                {question.type === 'multiple_choice' && (
                                    <div className="ml-10 space-y-1.5">
                                        {(question.options as string[]).map((opt, j) => {
                                            const isCorrect = opt === question.correct_answer;
                                            const isUserAnswer = opt === userAnswer;

                                            return (
                                                <div key={j} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                                                    isCorrect ? 'bg-success-50 text-success-700 font-medium' :
                                                    isUserAnswer && !isCorrect ? 'bg-danger-50 text-danger-700 line-through' :
                                                    'text-surface-600'
                                                }`}>
                                                    {isCorrect && <span>✓</span>}
                                                    {isUserAnswer && !isCorrect && <span>✕</span>}
                                                    {opt}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {question.type === 'drag_drop' && (
                                    <div className="ml-10 space-y-1.5">
                                        {Object.entries(question.correct_answer as Record<string, string>).map(([item, target]) => {
                                            const userTarget = (userAnswer as Record<string, string>)?.[item];
                                            const isCorrect = userTarget === target;

                                            return (
                                                <div key={item} className={`px-3 py-2 rounded-lg text-sm ${
                                                    isCorrect ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'
                                                }`}>
                                                    <strong>{item}</strong> → {target}
                                                    {!isCorrect && userTarget && (
                                                        <span className="text-danger-500 ml-2">(kamu: {userTarget})</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {question.type === 'essay' && (
                                    <div className="ml-10 space-y-2 text-sm">
                                        <div className="rounded-lg bg-surface-50 p-3 text-surface-700">
                                            <p className="font-medium mb-1">Jawaban kamu:</p>
                                            <p>{(userAnswer as string) || 'Belum dijawab.'}</p>
                                        </div>
                                        {question.correct_answer && (
                                            <div className="rounded-lg bg-success-50 p-3 text-success-800">
                                                <p className="font-medium mb-1">Contoh jawaban:</p>
                                                <p>{question.correct_answer as string}</p>
                                            </div>
                                        )}
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
                    <Link href={`/quizzes/${quiz.id}`} className="btn-primary flex-1 text-center">
                        Ulangi Quiz
                    </Link>
                    <Link href={`/materials/${quiz.material.slug}`} className="btn-secondary flex-1 text-center">
                        Kembali ke Materi
                    </Link>
                    <Link href="/dashboard" className="btn-ghost flex-1 text-center">
                        Menu Utama
                    </Link>
                </div>
            </div>
        </div>
    );
}
