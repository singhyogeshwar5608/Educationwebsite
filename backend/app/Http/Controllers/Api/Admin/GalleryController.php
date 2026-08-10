<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = GalleryItem::query()->with('album');

        if ($request->filled('album')) {
            $query->whereHas('album', fn ($q) => $q->where('name', $request->album));
        }

        $items = $query->orderBy('created_at', 'desc')->get();

        return response()->json($items->map(fn (GalleryItem $item) => $this->map($item)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in(['image', 'video'])],
            'title' => ['nullable', 'string', 'max:255'],
            'album' => ['nullable', 'string', 'max:255'],
            'file' => ['required', 'file', 'max:51200'],
        ]);

        $file = $request->file('file');
        $folder = 'gallery';
        $path = $file->store($folder, 'public');

        $album = null;
        if ($validated['album'] ?? null) {
            $album = GalleryAlbum::firstOrCreate(['name' => $validated['album']]);
        }

        $item = GalleryItem::create([
            'file_url' => $path,
            'file_type' => $validated['type'],
            'title' => $validated['title'] ?? null,
            'album_id' => $album?->id,
        ]);

        return response()->json($this->map($item->load('album')), 201);
    }

    public function update(Request $request, GalleryItem $gallery): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'album' => ['nullable', 'string', 'max:255'],
            'type' => ['nullable', Rule::in(['image', 'video'])],
        ]);

        if (isset($validated['album']) && $validated['album'] !== '') {
            $album = GalleryAlbum::firstOrCreate(['name' => $validated['album']]);
            $gallery->album_id = $album->id;
        }

        if (isset($validated['title'])) {
            $gallery->title = $validated['title'];
        }

        if (isset($validated['type'])) {
            $gallery->file_type = $validated['type'];
        }

        $gallery->save();

        return response()->json($this->map($gallery->load('album')));
    }

    public function destroy(GalleryItem $gallery): JsonResponse
    {
        $gallery->delete();

        return response()->json(['message' => 'Gallery item deleted successfully']);
    }

    public function albums(): JsonResponse
    {
        $albums = GalleryAlbum::query()
            ->withCount('items')
            ->orderBy('name')
            ->get()
            ->map(fn ($album) => [
                'id' => (string) $album->id,
                'name' => $album->name,
                'description' => $album->description,
                'items_count' => $album->items_count,
            ]);

        return response()->json($albums);
    }

    public function storeAlbum(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $album = GalleryAlbum::firstOrCreate($validated);

        return response()->json($album, 201);
    }

    private function map(GalleryItem $item): array
    {
        return [
            'id' => (string) $item->id,
            'type' => $item->file_type,
            'title' => $item->title,
            'album' => $item->album?->name,
            'albumId' => $item->album_id ? (string) $item->album_id : null,
            'url' => $item->file_url ? url('storage/' . ltrim($item->file_url, '/')) : null,
            'uploadedDate' => $item->created_at?->toDateString(),
        ];
    }
}
