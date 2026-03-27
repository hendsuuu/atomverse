<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function show(Quiz $quiz)
    {
        $quiz->load(['questions', 'material.course']);

        $previousAttempts = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        $bestAttempt = $previousAttempts->sortByDesc('score')->first();

        return Inertia::render('Student/Quizzes/Take', [
            'quiz' => $quiz,
            'previousAttempts' => $previousAttempts,
            'bestAttempt' => $bestAttempt,
        ]);
    }

    public function submit(Request $request, Quiz $quiz)
    {
        $quiz->load('questions');

        $answers = $request->input('answers', []);
        $score = 0;
        $totalPoints = 0;

        foreach ($quiz->questions as $question) {
            $totalPoints += $question->points;
            $userAnswer = $answers[$question->id] ?? null;

            if ($question->type === 'multiple_choice') {
                if ($userAnswer === $question->correct_answer) {
                    $score += $question->points;
                }
            } elseif ($question->type === 'drag_drop') {
                if (is_array($userAnswer) && is_array($question->correct_answer)) {
                    $correctCount = 0;
                    $totalItems = count($question->correct_answer);
                    foreach ($question->correct_answer as $key => $value) {
                        if (isset($userAnswer[$key]) && $userAnswer[$key] === $value) {
                            $correctCount++;
                        }
                    }
                    $score += (int) round(($correctCount / max($totalItems, 1)) * $question->points);
                }
            }
        }

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => Auth::id(),
            'score' => $score,
            'total_points' => $totalPoints,
            'answers' => $answers,
            'completed_at' => now(),
        ]);

        return redirect()->route('student.quizzes.result', $attempt->id);
    }

    public function result(QuizAttempt $attempt)
    {
        if ($attempt->user_id !== Auth::id()) {
            abort(403);
        }

        $attempt->load(['quiz.questions', 'quiz.material.course']);

        return Inertia::render('Student/Quizzes/Result', [
            'attempt' => $attempt,
        ]);
    }
}
