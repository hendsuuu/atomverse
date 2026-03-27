<?php

use App\Http\Controllers\Admin\CourseController as AdminCourseController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\MaterialController as AdminMaterialController;
use App\Http\Controllers\Admin\MaterialSectionController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\ExamController as AdminExamController;
use App\Http\Controllers\Admin\QuizController as AdminQuizController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Student\CourseController as StudentCourseController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\ExamController as StudentExamController;
use App\Http\Controllers\Student\HistoryController;
use App\Http\Controllers\Student\MaterialController as StudentMaterialController;
use App\Http\Controllers\Student\QuizController as StudentQuizController;
use Illuminate\Support\Facades\Route;

// ── Auth ──
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
});

Route::post('/logout', [LoginController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// ── Redirect root ──
Route::get('/', function () {
    if (auth()->check()) {
        return auth()->user()->isSuperadmin()
            ? redirect('/admin/dashboard')
            : redirect('/dashboard');
    }
    return \Inertia\Inertia::render('Welcome');
});

// ── Admin Routes ──
Route::prefix('admin')
    ->middleware(['auth', 'role:superadmin'])
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Users
        Route::resource('users', AdminUserController::class)->except(['show']);

        // Courses (classes)
        Route::resource('courses', AdminCourseController::class)->except(['show']);

        // Materials scoped to course
        Route::get('/courses/{course}/materials', [AdminMaterialController::class, 'index'])->name('courses.materials.index');
        Route::get('/courses/{course}/materials/create', [AdminMaterialController::class, 'create'])->name('courses.materials.create');
        Route::post('/courses/{course}/materials', [AdminMaterialController::class, 'store'])->name('courses.materials.store');

        // Materials standalone edit/update/delete
        Route::get('/materials/{material}/edit', [AdminMaterialController::class, 'edit'])->name('materials.edit');
        Route::put('/materials/{material}', [AdminMaterialController::class, 'update'])->name('materials.update');
        Route::delete('/materials/{material}', [AdminMaterialController::class, 'destroy'])->name('materials.destroy');

        // Material reorder
        Route::post('/materials/reorder', [AdminMaterialController::class, 'reorder'])->name('materials.reorder');

        // Material Sections
        Route::post('/materials/{material}/sections', [MaterialSectionController::class, 'store'])->name('materials.sections.store');
        Route::put('/sections/{section}', [MaterialSectionController::class, 'update'])->name('sections.update');
        Route::delete('/sections/{section}', [MaterialSectionController::class, 'destroy'])->name('sections.destroy');
        Route::post('/sections/reorder', [MaterialSectionController::class, 'reorder'])->name('sections.reorder');

        // Media upload
        Route::post('/media/upload', [MediaController::class, 'upload'])->name('media.upload');

        // Quizzes scoped to material
        Route::get('/materials/{material}/quizzes', [AdminQuizController::class, 'index'])->name('materials.quizzes.index');
        Route::get('/materials/{material}/quizzes/create', [AdminQuizController::class, 'create'])->name('materials.quizzes.create');
        Route::post('/materials/{material}/quizzes', [AdminQuizController::class, 'store'])->name('materials.quizzes.store');
        Route::get('/quizzes/{quiz}/edit', [AdminQuizController::class, 'edit'])->name('quizzes.edit');
        Route::put('/quizzes/{quiz}', [AdminQuizController::class, 'update'])->name('quizzes.update');
        Route::delete('/quizzes/{quiz}', [AdminQuizController::class, 'destroy'])->name('quizzes.destroy');

        // Exams (final tests) scoped to course
        Route::get('/courses/{course}/exams', [AdminExamController::class, 'index'])->name('courses.exams.index');
        Route::get('/courses/{course}/exams/create', [AdminExamController::class, 'create'])->name('courses.exams.create');
        Route::post('/courses/{course}/exams', [AdminExamController::class, 'store'])->name('courses.exams.store');
        Route::get('/exams/{exam}/edit', [AdminExamController::class, 'edit'])->name('exams.edit');
        Route::put('/exams/{exam}', [AdminExamController::class, 'update'])->name('exams.update');
        Route::delete('/exams/{exam}', [AdminExamController::class, 'destroy'])->name('exams.destroy');
    });

// ── Student Routes ──
Route::middleware(['auth', 'role:user'])
    ->name('student.')
    ->group(function () {
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');

        Route::get('/courses', [StudentCourseController::class, 'index'])->name('courses.index');
        Route::get('/courses/{course:slug}', [StudentCourseController::class, 'show'])->name('courses.show');

        Route::get('/materials/{material:slug}', [StudentMaterialController::class, 'show'])->name('materials.show');

        // Quizzes
        Route::get('/quizzes/{quiz}', [StudentQuizController::class, 'show'])->name('quizzes.show');
        Route::post('/quizzes/{quiz}/submit', [StudentQuizController::class, 'submit'])->name('quizzes.submit');
        Route::get('/quizzes/result/{attempt}', [StudentQuizController::class, 'result'])->name('quizzes.result');

        // Exams (final tests)
        Route::get('/exams/{exam}', [StudentExamController::class, 'show'])->name('exams.show');
        Route::post('/exams/{exam}/submit', [StudentExamController::class, 'submit'])->name('exams.submit');
        Route::get('/exams/result/{attempt}', [StudentExamController::class, 'result'])->name('exams.result');

        // Learning History
        Route::get('/history', [HistoryController::class, 'index'])->name('history');
    });
