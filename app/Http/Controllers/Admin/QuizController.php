<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Material $material)
    {
        $material->load('course');

        $quizzes = $material->quizzes()
            ->withCount(['questions', 'attempts'])
            ->orderBy('id')
            ->get();

        return Inertia::render('Admin/Quizzes/Index', [
            'material' => $material,
            'quizzes' => $quizzes,
        ]);
    }

    public function create(Material $material)
    {
        $material->load('course');

        return Inertia::render('Admin/Quizzes/Form', [
            'material' => $material,
            'quiz' => null,
        ]);
    }

    public function store(Request $request, Material $material)
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

        $quiz = $material->quizzes()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'passing_score' => $validated['passing_score'],
            'time_limit_minutes' => $validated['time_limit_minutes'] ?? null,
        ]);

        foreach ($validated['questions'] as $index => $q) {
            $quiz->questions()->create([
                'type' => $q['type'],
                'question' => $q['question'],
                'options' => $q['options'],
                'correct_answer' => $q['correct_answer'],
                'points' => $q['points'],
                'explanation' => $q['explanation'] ?? null,
                'sort_order' => $index,
            ]);
        }

        return redirect()->route('admin.materials.quizzes.index', $material)
            ->with('success', 'Quiz created successfully.');
    }

    public function edit(Quiz $quiz)
    {
        $quiz->load(['material.course', 'questions']);

        return Inertia::render('Admin/Quizzes/Form', [
            'material' => $quiz->material,
            'quiz' => $quiz,
        ]);
    }

    public function update(Request $request, Quiz $quiz)
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

        $quiz->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'passing_score' => $validated['passing_score'],
            'time_limit_minutes' => $validated['time_limit_minutes'] ?? null,
        ]);

        // Sync questions: delete removed, update existing, create new
        $incomingIds = collect($validated['questions'])
            ->pluck('id')
            ->filter()
            ->toArray();

        $quiz->questions()->whereNotIn('id', $incomingIds)->delete();

        foreach ($validated['questions'] as $index => $q) {
            if (!empty($q['id'])) {
                QuizQuestion::where('id', $q['id'])->update([
                    'type' => $q['type'],
                    'question' => $q['question'],
                    'options' => $q['options'],
                    'correct_answer' => $q['correct_answer'],
                    'points' => $q['points'],
                    'explanation' => $q['explanation'] ?? null,
                    'sort_order' => $index,
                ]);
            } else {
                $quiz->questions()->create([
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

        return redirect()->route('admin.materials.quizzes.index', $quiz->material_id)
            ->with('success', 'Quiz updated successfully.');
    }

    public function destroy(Quiz $quiz)
    {
        $materialId = $quiz->material_id;
        $quiz->delete();

        return redirect()->route('admin.materials.quizzes.index', $materialId)
            ->with('success', 'Quiz deleted successfully.');
    }
}
