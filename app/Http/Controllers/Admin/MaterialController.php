<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index(Request $request, Course $course)
    {
        $materials = $course->materials()
            ->search($request->search)
            ->withCount('sections')
            ->orderBy('sort_order')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Materials/Index', [
            'course' => $course,
            'materials' => $materials,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(Course $course)
    {
        $nextOrder = $course->materials()->max('sort_order') + 1;

        return Inertia::render('Admin/Materials/Create', [
            'course' => $course,
            'nextOrder' => $nextOrder,
        ]);
    }

    public function store(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'estimated_read_time' => ['nullable', 'integer', 'min:1'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
        ]);

        $validated['class_id'] = $course->id;
        $validated['slug'] = Str::slug($validated['title']);
        $validated['created_by'] = auth()->id();

        if ($validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')
                ->store('materials/covers', 'public');
        }

        $material = Material::create($validated);

        return redirect()->route('admin.materials.edit', $material)
            ->with('success', 'Material created. Now add sections.');
    }

    public function edit(Material $material)
    {
        $material->load(['course', 'sections' => fn ($q) => $q->orderBy('sort_order')]);

        return Inertia::render('Admin/Materials/Edit', [
            'material' => $material,
        ]);
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'estimated_read_time' => ['nullable', 'integer', 'min:1'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'cover_image' => ['nullable', 'image', 'max:2048'],
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($validated['status'] === 'published' && !$material->published_at) {
            $validated['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            if ($material->cover_image) {
                Storage::disk('public')->delete($material->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')
                ->store('materials/covers', 'public');
        }

        $material->update($validated);

        return back()->with('success', 'Material updated successfully.');
    }

    public function destroy(Material $material)
    {
        $courseId = $material->class_id;

        if ($material->cover_image) {
            Storage::disk('public')->delete($material->cover_image);
        }

        $material->delete();

        return redirect()->route('admin.courses.materials.index', $courseId)
            ->with('success', 'Material deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:materials,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            Material::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Order updated.');
    }
}
