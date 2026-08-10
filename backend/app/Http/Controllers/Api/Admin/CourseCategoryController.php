<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = CourseCategory::query()
            ->withCount('courses')
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'sort_order' => $category->sort_order,
                'courses_count' => $category->courses_count,
            ]);

        return response()->json($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:course_categories,name'],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $category = CourseCategory::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, CourseCategory $courseCategory): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:course_categories,name,' . $courseCategory->id],
            'description' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $courseCategory->update($validated);

        return response()->json($courseCategory);
    }

    public function destroy(CourseCategory $courseCategory): JsonResponse
    {
        $courseCategory->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
