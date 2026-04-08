<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Material;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Inertia\Inertia;
use Inertia\Response;

class LearningMenuController extends Controller
{
    public function mediaGuide(): Response
    {
        return Inertia::render('Student/MediaGuide');
    }

    public function competencies(): Response
    {
        return Inertia::render('Student/Competencies');
    }

    public function materials(): Response
    {
        $materials = Material::published()
            ->whereHas('course', fn ($query) => $query->published())
            ->with(['course:id,title,slug'])
            ->withCount([
                'sections',
                'quizzes as quizzes_count' => fn ($query) => $query
                    ->whereHas('questions', fn ($questionQuery) => $questionQuery->where('type', 'multiple_choice')),
            ])
            ->orderBy('class_id')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (Material $material) => [
                'id' => $material->id,
                'title' => $material->title,
                'slug' => $material->slug,
                'excerpt' => $material->excerpt,
                'cover_image_url' => $material->cover_image_url,
                'estimated_read_time' => $material->estimated_read_time,
                'sections_count' => $material->sections_count,
                'quizzes_count' => $material->quizzes_count,
                'course' => [
                    'title' => $material->course?->title,
                    'slug' => $material->course?->slug,
                ],
            ]);

        return Inertia::render('Student/MaterialsIndex', [
            'materials' => $materials->values(),
        ]);
    }

    public function practice(): Response
    {
        $userId = auth()->id();

        $quizzes = Quiz::query()
            ->whereHas('material', fn ($query) => $query->published()
                ->whereHas('course', fn ($courseQuery) => $courseQuery->published()))
            ->whereHas('questions', fn ($query) => $query->where('type', 'multiple_choice'))
            ->with(['material.course'])
            ->withCount('questions')
            ->get()
            ->sortBy(fn (Quiz $quiz) => sprintf(
                '%s-%06d-%06d',
                $quiz->material?->course?->title ?? '',
                $quiz->material?->sort_order ?? 0,
                $quiz->id
            ))
            ->values();

        $attemptsByQuiz = QuizAttempt::where('user_id', $userId)
            ->whereIn('quiz_id', $quizzes->pluck('id'))
            ->whereNotNull('completed_at')
            ->orderByDesc('score')
            ->get()
            ->groupBy('quiz_id');

        $practiceItems = $quizzes->map(function (Quiz $quiz) use ($attemptsByQuiz) {
            $bestAttempt = $attemptsByQuiz->get($quiz->id)?->first();
            $percentage = $bestAttempt && $bestAttempt->total_points > 0
                ? round(($bestAttempt->score / $bestAttempt->total_points) * 100)
                : null;

            return [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description,
                'questions_count' => $quiz->questions_count,
                'passing_score' => $quiz->passing_score,
                'time_limit_minutes' => $quiz->time_limit_minutes,
                'material' => [
                    'title' => $quiz->material?->title,
                    'slug' => $quiz->material?->slug,
                ],
                'course' => [
                    'title' => $quiz->material?->course?->title,
                    'slug' => $quiz->material?->course?->slug,
                ],
                'best_attempt' => $bestAttempt ? [
                    'score' => $bestAttempt->score,
                    'total_points' => $bestAttempt->total_points,
                    'percentage' => $percentage,
                    'passed' => $percentage !== null && $percentage >= $quiz->passing_score,
                    'completed_at' => $bestAttempt->completed_at?->toDateTimeString(),
                ] : null,
            ];
        });

        return Inertia::render('Student/PracticeIndex', [
            'practiceItems' => $practiceItems->values(),
        ]);
    }

    public function tests(): Response
    {
        $userId = auth()->id();

        $exams = Exam::query()
            ->whereHas('course', fn ($query) => $query->published())
            ->with('course:id,title,slug')
            ->withCount('questions')
            ->orderBy('course_id')
            ->orderBy('id')
            ->get();

        $attemptsByExam = ExamAttempt::where('user_id', $userId)
            ->whereIn('exam_id', $exams->pluck('id'))
            ->whereNotNull('completed_at')
            ->orderByDesc('score')
            ->get()
            ->groupBy('exam_id');

        $testItems = $exams->map(function (Exam $exam) use ($attemptsByExam) {
            $bestAttempt = $attemptsByExam->get($exam->id)?->first();
            $percentage = $bestAttempt && $bestAttempt->total_points > 0
                ? round(($bestAttempt->score / $bestAttempt->total_points) * 100)
                : null;

            return [
                'id' => $exam->id,
                'title' => $exam->title,
                'description' => $exam->description,
                'questions_count' => $exam->questions_count,
                'passing_score' => $exam->passing_score,
                'time_limit_minutes' => $exam->time_limit_minutes,
                'course' => [
                    'title' => $exam->course?->title,
                    'slug' => $exam->course?->slug,
                ],
                'best_attempt' => $bestAttempt ? [
                    'score' => $bestAttempt->score,
                    'total_points' => $bestAttempt->total_points,
                    'percentage' => $percentage,
                    'passed' => $percentage !== null && $percentage >= $exam->passing_score,
                    'completed_at' => $bestAttempt->completed_at?->toDateTimeString(),
                ] : null,
            ];
        });

        return Inertia::render('Student/TestsIndex', [
            'testItems' => $testItems->values(),
        ]);
    }

    public function developerProfile(): Response
    {
        return Inertia::render('Student/DeveloperProfile');
    }
}
