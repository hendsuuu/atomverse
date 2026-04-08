<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $quizAttempts = QuizAttempt::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->count();

        $examAttempts = ExamAttempt::where('user_id', $user->id)
            ->whereNotNull('completed_at')
            ->count();

        return Inertia::render('Student/MenuHome', [
            'studentName' => $user->name,
            'menuStats' => [
                'materials' => Material::published()
                    ->whereHas('course', fn ($query) => $query->published())
                    ->count(),
                'practice' => Quiz::whereHas('material', fn ($query) => $query->published()
                    ->whereHas('course', fn ($courseQuery) => $courseQuery->published()))
                    ->whereHas('questions', fn ($query) => $query->where('type', 'multiple_choice'))
                    ->count(),
                'tests' => Exam::whereHas('course', fn ($query) => $query->published())->count(),
                'history' => $quizAttempts + $examAttempts,
            ],
        ]);
    }
}
