<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\QuizAttempt;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $enrolledCourses = Course::published()
            ->withCount('materials')
            ->latest('created_at')
            ->take(6)
            ->get();

        // Quiz scores summary
        $quizAttempts = QuizAttempt::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->with(['quiz.material'])
            ->orderByDesc('completed_at')
            ->get();

        // Best scores per quiz
        $bestScores = $quizAttempts->groupBy('quiz_id')->map(function ($attempts) {
            $best = $attempts->sortByDesc('score')->first();
            return [
                'quiz_id' => $best->quiz_id,
                'quiz_title' => $best->quiz->title,
                'material_title' => $best->quiz->material->title ?? '',
                'material_slug' => $best->quiz->material->slug ?? '',
                'score' => $best->score,
                'total_points' => $best->total_points,
                'percentage' => $best->total_points > 0 ? round(($best->score / $best->total_points) * 100) : 0,
                'passed' => $best->total_points > 0 && (($best->score / $best->total_points) * 100) >= ($best->quiz->passing_score ?? 60),
                'attempts_count' => $attempts->count(),
                'completed_at' => $best->completed_at->toISOString(),
            ];
        })->values();

        // Overall stats
        $totalQuizzes = $bestScores->count();
        $passedQuizzes = $bestScores->where('passed', true)->count();
        $avgScore = $bestScores->avg('percentage') ?: 0;

        return Inertia::render('Student/Dashboard', [
            'enrolledCourses' => $enrolledCourses,
            'totalEnrolled' => Course::published()->count(),
            'quizScores' => $bestScores,
            'quizStats' => [
                'total' => $totalQuizzes,
                'passed' => $passedQuizzes,
                'average' => round($avgScore),
            ],
        ]);
    }
}
