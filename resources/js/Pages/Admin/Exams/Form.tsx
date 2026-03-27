import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import FormField from "@/Components/FormField";

interface Question {
    id?: number;
    type: "multiple_choice" | "drag_drop";
    question: string;
    options: string[] | Record<string, string>;
    correct_answer: string | Record<string, string>;
    points: number;
    explanation: string;
}

interface Exam {
    id: number;
    title: string;
    description: string | null;
    passing_score: number;
    time_limit_minutes: number | null;
    questions: Question[];
}

interface Props {
    course: {
        id: number;
        title: string;
        slug: string;
    };
    exam: Exam | null;
}

function emptyMCQuestion(): Question {
    return {
        type: "multiple_choice",
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
        points: 10,
        explanation: "",
    };
}

function emptyDDQuestion(): Question {
    return {
        type: "drag_drop",
        question: "",
        options: {},
        correct_answer: {},
        points: 10,
        explanation: "",
    };
}

export default function ExamForm({ course, exam }: Props) {
    const isEdit = !!exam;

    const { data, setData, post, put, processing, errors } = useForm<{
        title: string;
        description: string;
        passing_score: number;
        time_limit_minutes: string;
        questions: Question[];
    }>({
        title: exam?.title || "",
        description: exam?.description || "",
        passing_score: exam?.passing_score || 60,
        time_limit_minutes: exam?.time_limit_minutes?.toString() || "",
        questions: exam?.questions?.length
            ? exam.questions
            : [emptyMCQuestion()],
    });

    const [expandedQ, setExpandedQ] = useState<Set<number>>(new Set([0]));

    const toggleQ = (i: number) => {
        setExpandedQ((prev) => {
            const next = new Set(prev);
            next.has(i) ? next.delete(i) : next.add(i);
            return next;
        });
    };

    const updateQuestion = (index: number, updates: Partial<Question>) => {
        const newQ = [...data.questions];
        newQ[index] = { ...newQ[index], ...updates };
        setData("questions", newQ);
    };

    const addQuestion = (type: "multiple_choice" | "drag_drop") => {
        const q =
            type === "multiple_choice" ? emptyMCQuestion() : emptyDDQuestion();
        const newQ = [...data.questions, q];
        setData("questions", newQ);
        setExpandedQ((prev) => new Set(prev).add(newQ.length - 1));
    };

    const removeQuestion = (index: number) => {
        setData(
            "questions",
            data.questions.filter((_, i) => i !== index),
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/exams/${exam!.id}`);
        } else {
            post(`/admin/courses/${course.id}/exams`);
        }
    };

    return (
        <AdminLayout title={isEdit ? "Edit Final Test" : "Create Final Test"}>
            <Head
                title={isEdit ? `Edit — ${exam!.title}` : "Create Final Test"}
            />
            <Breadcrumb
                items={[
                    { label: "Courses", href: "/admin/courses" },
                    {
                        label: course.title,
                        href: `/admin/courses/${course.id}/materials`,
                    },
                    {
                        label: "Final Tests",
                        href: `/admin/courses/${course.id}/exams`,
                    },
                    { label: isEdit ? "Edit" : "Create" },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {/* Exam Info */}
                <div className="card p-5">
                    <h3 className="font-semibold text-surface-900 mb-4">
                        Test Information
                    </h3>
                    <div className="space-y-4">
                        <FormField
                            label="Title"
                            name="title"
                            error={errors.title}
                            required
                        >
                            <input
                                id="title"
                                className="input"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                placeholder="Final Test title"
                            />
                        </FormField>
                        <FormField
                            label="Description"
                            name="description"
                            error={errors.description}
                        >
                            <textarea
                                id="description"
                                className="input min-h-[60px]"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Brief description (optional)"
                            />
                        </FormField>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                label="Passing Score (%)"
                                name="passing_score"
                                error={errors.passing_score}
                                required
                            >
                                <input
                                    id="passing_score"
                                    type="number"
                                    className="input"
                                    min={0}
                                    max={100}
                                    value={data.passing_score}
                                    onChange={(e) =>
                                        setData(
                                            "passing_score",
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                />
                            </FormField>
                            <FormField
                                label="Time Limit (minutes)"
                                name="time_limit_minutes"
                                error={errors.time_limit_minutes}
                            >
                                <input
                                    id="time_limit_minutes"
                                    type="number"
                                    className="input"
                                    min={1}
                                    value={data.time_limit_minutes}
                                    onChange={(e) =>
                                        setData(
                                            "time_limit_minutes",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="No limit"
                                />
                            </FormField>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-surface-900">
                            Questions ({data.questions.length})
                        </h3>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => addQuestion("multiple_choice")}
                                className="btn-secondary btn-sm"
                            >
                                + Multiple Choice
                            </button>
                            <button
                                type="button"
                                onClick={() => addQuestion("drag_drop")}
                                className="btn-secondary btn-sm"
                            >
                                + Drag & Drop
                            </button>
                        </div>
                    </div>

                    {(errors as Record<string, string>).questions && (
                        <p className="text-danger-600 text-sm mb-3">
                            {(errors as Record<string, string>).questions}
                        </p>
                    )}

                    <div className="space-y-3">
                        {data.questions.map((q, qi) => (
                            <div key={qi} className="card overflow-hidden">
                                <div
                                    className="flex items-center gap-3 px-4 py-3 bg-surface-50/50 border-b border-surface-100 cursor-pointer"
                                    onClick={() => toggleQ(qi)}
                                >
                                    <span className="w-6 h-6 rounded bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                        {qi + 1}
                                    </span>
                                    <span className="badge-primary text-xs">
                                        {q.type === "multiple_choice"
                                            ? "MC"
                                            : "Drag & Drop"}
                                    </span>
                                    <span className="font-medium text-sm text-surface-900 flex-1 truncate">
                                        {q.question || "New question..."}
                                    </span>
                                    <span className="text-xs text-surface-400">
                                        {q.points} pts
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-surface-400 transition-transform ${expandedQ.has(qi) ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>

                                {expandedQ.has(qi) && (
                                    <div className="p-4 space-y-4 animate-fade-in">
                                        <FormField
                                            label="Question"
                                            name={`q-${qi}`}
                                        >
                                            <textarea
                                                className="input min-h-[60px]"
                                                value={q.question}
                                                onChange={(e) =>
                                                    updateQuestion(qi, {
                                                        question:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Enter question text..."
                                            />
                                        </FormField>

                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField
                                                label="Points"
                                                name={`pts-${qi}`}
                                            >
                                                <input
                                                    type="number"
                                                    className="input"
                                                    min={1}
                                                    value={q.points}
                                                    onChange={(e) =>
                                                        updateQuestion(qi, {
                                                            points:
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 10,
                                                        })
                                                    }
                                                />
                                            </FormField>
                                            <FormField
                                                label="Type"
                                                name={`type-${qi}`}
                                            >
                                                <select
                                                    className="input"
                                                    value={q.type}
                                                    onChange={(e) => {
                                                        const type = e.target
                                                            .value as
                                                            | "multiple_choice"
                                                            | "drag_drop";
                                                        if (
                                                            type ===
                                                            "multiple_choice"
                                                        ) {
                                                            updateQuestion(qi, {
                                                                type,
                                                                options: [
                                                                    "",
                                                                    "",
                                                                    "",
                                                                    "",
                                                                ],
                                                                correct_answer:
                                                                    "",
                                                            });
                                                        } else {
                                                            updateQuestion(qi, {
                                                                type,
                                                                options: {},
                                                                correct_answer:
                                                                    {},
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <option value="multiple_choice">
                                                        Multiple Choice
                                                    </option>
                                                    <option value="drag_drop">
                                                        Drag & Drop
                                                    </option>
                                                </select>
                                            </FormField>
                                        </div>

                                        {q.type === "multiple_choice" && (
                                            <MCEditor
                                                options={
                                                    Array.isArray(q.options)
                                                        ? q.options
                                                        : []
                                                }
                                                correctAnswer={
                                                    typeof q.correct_answer ===
                                                    "string"
                                                        ? q.correct_answer
                                                        : ""
                                                }
                                                onChange={(options, correct) =>
                                                    updateQuestion(qi, {
                                                        options,
                                                        correct_answer: correct,
                                                    })
                                                }
                                            />
                                        )}

                                        {q.type === "drag_drop" && (
                                            <DDEditor
                                                pairs={
                                                    typeof q.correct_answer ===
                                                        "object" &&
                                                    !Array.isArray(
                                                        q.correct_answer,
                                                    )
                                                        ? (q.correct_answer as Record<
                                                              string,
                                                              string
                                                          >)
                                                        : {}
                                                }
                                                onChange={(pairs) => {
                                                    updateQuestion(qi, {
                                                        options:
                                                            Object.keys(pairs),
                                                        correct_answer: pairs,
                                                    });
                                                }}
                                            />
                                        )}

                                        <FormField
                                            label="Explanation (shown after answer)"
                                            name={`exp-${qi}`}
                                        >
                                            <textarea
                                                className="input min-h-[50px]"
                                                value={q.explanation}
                                                onChange={(e) =>
                                                    updateQuestion(qi, {
                                                        explanation:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Explain the correct answer (optional)"
                                            />
                                        </FormField>

                                        <div className="flex justify-end pt-2 border-t border-surface-100">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeQuestion(qi)
                                                }
                                                className="btn-ghost btn-sm text-danger-600"
                                            >
                                                Remove Question
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                    >
                        {processing
                            ? "Saving..."
                            : isEdit
                              ? "Update Final Test"
                              : "Create Final Test"}
                    </button>
                    <Link
                        href={`/admin/courses/${course.id}/exams`}
                        className="btn-secondary"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}

// ── Multiple Choice Editor ──
function MCEditor({
    options,
    correctAnswer,
    onChange,
}: {
    options: string[];
    correctAnswer: string;
    onChange: (options: string[], correct: string) => void;
}) {
    const updateOption = (index: number, value: string) => {
        const newOpts = [...options];
        newOpts[index] = value;
        onChange(newOpts, correctAnswer);
    };

    const addOption = () => onChange([...options, ""], correctAnswer);
    const removeOption = (index: number) => {
        const newOpts = options.filter((_, i) => i !== index);
        onChange(newOpts, correctAnswer);
    };

    return (
        <div className="space-y-2">
            <label className="label">Options (select the correct one)</label>
            {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        type="radio"
                        name="correct_mc"
                        checked={correctAnswer === opt && opt !== ""}
                        onChange={() => onChange(options, opt)}
                        className="w-4 h-4 text-primary-600"
                    />
                    <input
                        className="input flex-1"
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                        placeholder={`Option ${i + 1}`}
                    />
                    {options.length > 2 && (
                        <button
                            type="button"
                            onClick={() => removeOption(i)}
                            className="text-danger-500 hover:text-danger-700 text-xs p-1"
                        >
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addOption}
                className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
                + Add option
            </button>
        </div>
    );
}

// ── Drag & Drop Editor ──
function DDEditor({
    pairs,
    onChange,
}: {
    pairs: Record<string, string>;
    onChange: (pairs: Record<string, string>) => void;
}) {
    const entries = Object.entries(pairs);

    const updatePair = (oldKey: string, newKey: string, newValue: string) => {
        const newPairs: Record<string, string> = {};
        for (const [k, v] of Object.entries(pairs)) {
            if (k === oldKey) {
                newPairs[newKey] = newValue;
            } else {
                newPairs[k] = v;
            }
        }
        onChange(newPairs);
    };

    const addPair = () => {
        onChange({ ...pairs, "": "" });
    };

    const removePair = (key: string) => {
        const newPairs = { ...pairs };
        delete newPairs[key];
        onChange(newPairs);
    };

    return (
        <div className="space-y-2">
            <label className="label">Match Pairs (item → correct target)</label>
            {entries.map(([key, value], i) => (
                <div key={i} className="flex items-center gap-2">
                    <input
                        className="input flex-1"
                        value={key}
                        onChange={(e) => updatePair(key, e.target.value, value)}
                        placeholder="Item"
                    />
                    <svg
                        className="w-4 h-4 text-surface-400 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                    <input
                        className="input flex-1"
                        value={value}
                        onChange={(e) => updatePair(key, key, e.target.value)}
                        placeholder="Target"
                    />
                    {entries.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removePair(key)}
                            className="text-danger-500 hover:text-danger-700 text-xs p-1"
                        >
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addPair}
                className="text-primary-600 text-sm font-medium hover:text-primary-700"
            >
                + Add pair
            </button>
        </div>
    );
}
