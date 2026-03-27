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
            'questions.*.type' => ['required', Rule::in(['multiple_choice', 'drag_drop'])],
            'questions.*.question' => ['required', 'string'],
            'questions.*.options' => ['required', 'array'],
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
            $exam->questions()->create([
                'type' => $q['type'],
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'points' => $q['points'],
                'explanation' => $q['explanation'] ?? null,
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
            'questions.*.type' => ['required', Rule::in(['multiple_choice', 'drag_drop'])],
            'questions.*.question' => ['required', 'string'],
            'questions.*.options' => ['required', 'array'],
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
            if (!empty($q['id'])) {
                ExamQuestion::where('id', $q['id'])->update([
                    'type' => $q['type'],
                    'question' => $q['question'],
                    'options' => $q['options'],
                    'correct_answer' => $q['correct_answer'],
                    'points' => $q['points'],
                    'explanation' => $q['explanation'] ?? null,
                    'sort_order' => $index,
                ]);
            } else {
                $exam->questions()->create([
                    'type' => $q['type'],
                    'question' => $q['question'],
                    'options' => $q['options'],
                    'correct_answer' => $q['correct_answer'],
                    'points' => $q['points'],
                    'explanation' => $q['explanation'] ?? null,
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
}
