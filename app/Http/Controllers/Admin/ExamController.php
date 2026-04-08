<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Exam;
use App\Models\ExamQuestion;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index(Course $course)
    {
        $exams = $course->exams()
            ->withCount(['questions', 'attempts'])
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin/Exams/Index', [
            'course' => $course,
            'exams' => $exams,
        ]);
    }

    public function create(Course $course)
    {
        return Inertia::render('Admin/Exams/Form', [
            'course' => $course,
            'exam' => null,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'passing_score' => ['required', 'integer', 'min:0', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.type' => ['required', Rule::in(['multiple_choice', 'drag_drop', 'essay'])],
            'questions.*.question' => ['required', 'string'],
            'questions.*.options' => ['nullable'],
            'questions.*.correct_answer' => ['required'],
            'questions.*.points' => ['required', 'integer', 'min:1'],
            'questions.*.explanation' => ['nullable', 'string'],
        ]);

        $exam = $course->exams()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'passing_score' => $validated['passing_score'],
            'time_limit_minutes' => $validated['time_limit_minutes'] ?? null,
        ]);

        foreach ($validated['questions'] as $index => $q) {
            $normalized = $this->normalizeQuestionPayload($q);
            $exam->questions()->create([
                'type' => $normalized['type'],
                'question' => $normalized['question'],
                'options' => $normalized['options'],
                'correct_answer' => $normalized['correct_answer'],
                'points' => $normalized['points'],
                'explanation' => $normalized['explanation'],
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('admin.courses.exams.index', $course)
            ->with('success', 'Final test created successfully.');
    }

    public function edit(Exam $exam)
    {
        $exam->load(['course', 'questions']);

        return Inertia::render('Admin/Exams/Form', [
            'course' => $exam->course,
            'exam' => $exam,
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'passing_score' => ['required', 'integer', 'min:0', 'max:100'],
            'time_limit_minutes' => ['nullable', 'integer', 'min:1'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.id' => ['nullable', 'integer'],
            'questions.*.type' => ['required', Rule::in(['multiple_choice', 'drag_drop', 'essay'])],
            'questions.*.question' => ['required', 'string'],
            'questions.*.options' => ['nullable'],
            'questions.*.correct_answer' => ['required'],
            'questions.*.points' => ['required', 'integer', 'min:1'],
            'questions.*.explanation' => ['nullable', 'string'],
        ]);

        $exam->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'passing_score' => $validated['passing_score'],
            'time_limit_minutes' => $validated['time_limit_minutes'] ?? null,
        ]);

        $incomingIds = collect($validated['questions'])->pluck('id')->filter()->toArray();
        $exam->questions()->whereNotIn('id', $incomingIds)->delete();

        foreach ($validated['questions'] as $index => $q) {
            $normalized = $this->normalizeQuestionPayload($q);
            if (!empty($q['id'])) {
                ExamQuestion::where('id', $q['id'])->update([
                    'type' => $normalized['type'],
                    'question' => $normalized['question'],
                    'options' => $normalized['options'],
                    'correct_answer' => $normalized['correct_answer'],
                    'points' => $normalized['points'],
                    'explanation' => $normalized['explanation'],
                    'sort_order' => $index,
                ]);
            } else {
                $exam->questions()->create([
                    'type' => $normalized['type'],
                    'question' => $normalized['question'],
                    'options' => $normalized['options'],
                    'correct_answer' => $normalized['correct_answer'],
                    'points' => $normalized['points'],
                    'explanation' => $normalized['explanation'],
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.courses.exams.index', $exam->course_id)
            ->with('success', 'Final test updated successfully.');
    }

    public function destroy(Exam $exam)
    {
        $courseId = $exam->course_id;
        $exam->delete();

        return redirect()->route('admin.courses.exams.index', $courseId)
            ->with('success', 'Final test deleted successfully.');
    }

    private function normalizeQuestionPayload(array $question): array
    {
        $type = $question['type'];

        if ($type === 'drag_drop') {
            $pairs = is_array($question['correct_answer']) ? $question['correct_answer'] : [];

            return [
                'type' => $type,
                'question' => $question['question'],
                'options' => [
                    'items' => array_keys($pairs),
                    'targets' => array_values($pairs),
                ],
                'correct_answer' => $pairs,
                'points' => $question['points'],
                'explanation' => $question['explanation'] ?? null,
            ];
        }

        if ($type === 'essay') {
            return [
                'type' => $type,
                'question' => $question['question'],
                'options' => [],
                'correct_answer' => is_string($question['correct_answer'])
                    ? $question['correct_answer']
                    : '',
                'points' => $question['points'],
                'explanation' => $question['explanation'] ?? null,
            ];
        }

        return [
            'type' => $type,
            'question' => $question['question'],
            'options' => is_array($question['options']) ? $question['options'] : [],
            'correct_answer' => is_string($question['correct_answer'])
                ? $question['correct_answer']
                : '',
            'points' => $question['points'],
            'explanation' => $question['explanation'] ?? null,
        ];
    }
}
