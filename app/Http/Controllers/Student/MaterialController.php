<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function show(Material $material)
    {
        $user = auth()->user();

        $material->load([
            'course:id,title,slug',
            'sections' => fn ($q) => $q->orderBy('sort_order'),
            'creator:id,name',
        ]);

        // Get adjacent materials for navigation
        $course = $material->course;
        $allMaterials = $course->materials()
            ->published()
            ->orderBy('sort_order')
            ->get(['id', 'title', 'slug', 'sort_order']);

        $currentIndex = $allMaterials->search(fn ($m) => $m->id === $material->id);

        // Get quizzes for this material
        $quizzes = Quiz::where('material_id', $material->id)
            ->whereHas('questions', fn ($query) => $query->where('type', 'multiple_choice'))
            ->withCount('questions')
            ->get()
            ->map(function ($quiz) use ($user) {
                $bestAttempt = QuizAttempt::where('quiz_id', $quiz->id)
                    ->where('user_id', $user->id)
                    ->whereNotNull('completed_at')
                    ->orderByDesc('completed_at')
                    ->first();

                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'questions_count' => $quiz->questions_count,
                    'time_limit_minutes' => $quiz->time_limit_minutes,
                    'latest_attempt' => $bestAttempt ? [
                        'completed_at' => $bestAttempt->completed_at?->toDateTimeString(),
                    ] : null,
                ];
            });

        return Inertia::render('Student/Materials/Show', [
            'material' => $material,
            'previousMaterial' => $currentIndex > 0 ? $allMaterials[$currentIndex - 1] : null,
            'nextMaterial' => $currentIndex < $allMaterials->count() - 1 ? $allMaterials[$currentIndex + 1] : null,
            'courseMaterials' => $allMaterials,
            'quizzes' => $quizzes,
        ]);
    }
}
