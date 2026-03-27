<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\ExamAttempt;
use App\Models\QuizAttempt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // All published courses
        $courses = Course::published()
            ->withCount('materials')
            ->get()
            ->map(fn($course) => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'materials_count' => $course->materials_count,
            ]);

        // Quiz attempts with quiz + material info
        $quizAttempts = QuizAttempt::where('user_id', $user->id)
            ->with(['quiz.material.course'])
            ->orderByDesc('completed_at')
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'quiz_title' => $a->quiz->title,
                'material_title' => $a->quiz->material->title ?? '-',
                'course_title' => $a->quiz->material->course->title ?? '-',
                'score' => $a->score,
                'total_points' => $a->total_points,
                'percentage' => $a->total_points > 0
                    ? round(($a->score / $a->total_points) * 100)
                    : 0,
                'passed' => $a->total_points > 0
                    ? round(($a->score / $a->total_points) * 100) >= $a->quiz->passing_score
                    : false,
                'completed_at' => $a->completed_at?->toDateTimeString(),
            ]);

        // Exam attempts with exam + course info
        $examAttempts = ExamAttempt::where('user_id', $user->id)
            ->with(['exam.course'])
            ->orderByDesc('completed_at')
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'exam_title' => $a->exam->title,
                'course_title' => $a->exam->course->title ?? '-',
                'score' => $a->score,
                'total_points' => $a->total_points,
                'percentage' => $a->total_points > 0
                    ? round(($a->score / $a->total_points) * 100)
                    : 0,
                'passed' => $a->total_points > 0
                    ? round(($a->score / $a->total_points) * 100) >= $a->exam->passing_score
                    : false,
                'completed_at' => $a->completed_at?->toDateTimeString(),
            ]);

        // Progress stats
        $totalQuizAttempts = $quizAttempts->count();
        $passedQuizzes = $quizAttempts->where('passed', true)->count();
        $totalExamAttempts = $examAttempts->count();
        $passedExams = $examAttempts->where('passed', true)->count();
        $avgQuizScore = $quizAttempts->avg('percentage') ?? 0;
        $avgExamScore = $examAttempts->avg('percentage') ?? 0;

        return Inertia::render('Student/History', [
            'student' => [
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at->toDateString(),
            ],
            'courses' => $courses,
            'quizAttempts' => $quizAttempts->values(),
            'examAttempts' => $examAttempts->values(),
            'stats' => [
                'total_courses' => $courses->count(),
                'total_quiz_attempts' => $totalQuizAttempts,
                'passed_quizzes' => $passedQuizzes,
                'total_exam_attempts' => $totalExamAttempts,
                'passed_exams' => $passedExams,
                'avg_quiz_score' => round($avgQuizScore),
                'avg_exam_score' => round($avgExamScore),
            ],
        ]);
    }
}
