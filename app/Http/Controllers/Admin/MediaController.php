<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:jpg,jpeg,png,gif,webp,svg'],
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads/' . date('Y/m'), 'public');

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'uploaded_by' => auth()->id(),
        ]);

        return response()->json([
            'url' => asset('storage/' . $path),
            'media' => $media,
        ]);
    }
}
