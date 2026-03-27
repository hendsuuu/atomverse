<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $courses = Course::published()
            ->withCount('materials')
            ->search($request->search)
            ->latest('created_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Student/Courses/Index', [
            'courses' => $courses,
            'filters' => $request->only(['search']),
        ]);
    }

    public function show(Course $course)
    {
        $course->load([
            'materials' => fn ($q) => $q->published()->orderBy('sort_order')->withCount('quizzes'),
            'creator:id,name',
            'exams' => fn ($q) => $q->withCount('questions'),
        ]);
        $course->loadCount('materials', 'students');

        return Inertia::render('Student/Courses/Show', [
            'course' => $course,
        ]);
    }
}
