<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Material;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => User::where('role', 'user')->count(),
                'total_courses' => Course::count(),
                'total_materials' => Material::count(),
                'total_sections' => \App\Models\MaterialSection::count(),
            ],
            'recentUsers' => User::where('role', 'user')
                ->latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'avatar', 'is_active', 'created_at']),
            'recentCourses' => Course::with('creator:id,name')
                ->withCount('materials', 'students')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
