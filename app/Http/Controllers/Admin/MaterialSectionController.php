<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\MaterialSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MaterialSectionController extends Controller
{
    public function store(Request $request, Material $material)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'blocks' => ['nullable', 'array'],
            'blocks.*.type' => ['required', 'string'],
            'blocks.*.content' => ['nullable', 'string'],
            'blocks.*.url' => ['nullable', 'string'],
            'blocks.*.caption' => ['nullable', 'string'],
            'blocks.*.author' => ['nullable', 'string'],
            'blocks.*.variant' => ['nullable', 'string'],
            'blocks.*.videoId' => ['nullable', 'string'],
            'blocks.*.width' => ['nullable', 'string'],
            'blocks.*.align' => ['nullable', 'string'],
            'blocks.*.columns' => ['nullable', 'integer'],
            'blocks.*.gap' => ['nullable', 'string'],
            'blocks.*.images' => ['nullable', 'array'],
            'blocks.*.images.*.url' => ['nullable', 'string'],
            'blocks.*.images.*.caption' => ['nullable', 'string'],
            'blocks.*.images.*.objectPosition' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'image_caption' => ['nullable', 'string', 'max:255'],
            'layout_variant' => ['nullable', 'string'],
        ]);

        $validated['material_id'] = $material->id;
        $validated['slug'] = Str::slug($validated['title']);
        $validated['sort_order'] = $material->sections()->max('sort_order') + 1;
        $validated['blocks'] = $validated['blocks'] ?? [['type' => 'rich_text', 'content' => '']];

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')
                ->store('materials/sections', 'public');
        }

        MaterialSection::create($validated);

        return back()->with('success', 'Section added.');
    }

    public function update(Request $request, MaterialSection $section)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'blocks' => ['nullable', 'array'],
            'blocks.*.type' => ['required', 'string'],
            'blocks.*.content' => ['nullable', 'string'],
            'blocks.*.url' => ['nullable', 'string'],
            'blocks.*.caption' => ['nullable', 'string'],
            'blocks.*.author' => ['nullable', 'string'],
            'blocks.*.variant' => ['nullable', 'string'],
            'blocks.*.videoId' => ['nullable', 'string'],
            'blocks.*.width' => ['nullable', 'string'],
            'blocks.*.align' => ['nullable', 'string'],
            'blocks.*.columns' => ['nullable', 'integer'],
            'blocks.*.gap' => ['nullable', 'string'],
            'blocks.*.images' => ['nullable', 'array'],
            'blocks.*.images.*.url' => ['nullable', 'string'],
            'blocks.*.images.*.caption' => ['nullable', 'string'],
            'blocks.*.images.*.objectPosition' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:2048'],
            'image_caption' => ['nullable', 'string', 'max:255'],
            'layout_variant' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('image')) {
            if ($section->image) {
                Storage::disk('public')->delete($section->image);
            }
            $validated['image'] = $request->file('image')
                ->store('materials/sections', 'public');
        }

        $section->update($validated);

        return back()->with('success', 'Section updated.');
    }

    public function destroy(MaterialSection $section)
    {
        if ($section->image) {
            Storage::disk('public')->delete($section->image);
        }

        $section->delete();

        return back()->with('success', 'Section deleted.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:material_sections,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        foreach ($validated['items'] as $item) {
            MaterialSection::where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'Section order updated.');
    }
}
