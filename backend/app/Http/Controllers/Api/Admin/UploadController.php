<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:51200'],
            'folder' => ['nullable', 'string', 'max:100'],
        ]);

        $folder = $validated['folder'] ?? 'general';
        $folder = Str::slug($folder) ?: 'general';

        $path = $request->file('file')->store($folder, 'public');

        return response()->json([
            'url' => url('storage/' . ltrim($path, '/')),
            'path' => $path,
            'name' => basename($path),
        ], 201);
    }
}
