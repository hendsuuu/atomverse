<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function show(Exam $exam)
    {
        $exam->load(['questions', 'course']);

        $previousAttempts = ExamAttempt::where('exam_id', $exam->id)
            ->where('user_id', Auth::id())
            ->orderByDesc('created_at')
            ->get();

        $bestAttempt = $previousAttempts->sortByDesc('score')->first();

        return Inertia::render('Student/Exams/Take', [
            'exam' => $exam,
            'previousAttempts' => $previousAttempts,
            'bestAttempt' => $bestAttempt,
        ]);
    }

    public function submit(Request $request, Exam $exam)
    {
        $exam->load('questions');

        $answers = $request->input('answers', []);
        $score = 0;
        $totalPoints = 0;

        foreach ($exam->questions as $question) {
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

        $attempt = ExamAttempt::create([
            'exam_id' => $exam->id,
            'user_id' => Auth::id(),
            'score' => $score,
            'total_points' => $totalPoints,
            'answers' => $answers,
            'completed_at' => now(),
        ]);

        return redirect()->route('student.exams.result', $attempt->id);
    }

    public function result(ExamAttempt $attempt)
    {
        if ($attempt->user_id !== Auth::id()) {
            abort(403);
        }

        $attempt->load(['exam.questions', 'exam.course']);

        return Inertia::render('Student/Exams/Result', [
            'attempt' => $attempt,
        ]);
    }
}
