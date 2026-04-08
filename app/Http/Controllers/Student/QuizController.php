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

        return Inertia::render('Student/Quizzes/Take', [
            'quiz' => $quiz,
            'previousAttempts' => $previousAttempts,
            'completedAttemptsCount' => $previousAttempts->count(),
        ]);
    }

    public function submit(Request $request, Quiz $quiz)
    {
        $answers = $request->input('answers', []);

        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'user_id' => Auth::id(),
            'score' => 0,
            'total_points' => 0,
            'answers' => $answers,
            'completed_at' => now(),
        ]);

        return redirect()->route('student.quizzes.result', $attempt->id);
    }

    public function result(QuizAttempt $attempt)
    {
        if ((int) $attempt->user_id !== (int) Auth::id()) {
            abort(403);
        }

        $attempt->load(['quiz.questions', 'quiz.material.course']);

        return Inertia::render('Student/Quizzes/Result', [
            'attempt' => $attempt,
        ]);
    }
}
