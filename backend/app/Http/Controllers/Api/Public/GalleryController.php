<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\GalleryAlbum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GalleryAlbum::query()->with('items');

        if ($request->filled('album')) {
            $query->where('name', $request->album);
        }

        $albums = $query->orderBy('name')->get();

        return response()->json($albums->map(function ($album) {
            return [
                'id' => (string) $album->id,
                'name' => $album->name,
                'description' => $album->description,
                'items' => $album->items->map(function ($item) {
                    return [
                        'id' => (string) $item->id,
                        'type' => $item->file_type,
                        'title' => $item->title,
                        'url' => $item->file_url ? url('storage/' . ltrim($item->file_url, '/')) : null,
                        'uploadedDate' => $item->created_at?->toDateString(),
                    ];
                })->values(),
            ];
        })->values());
    }
}
