<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Support\Presenters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Course::query()
            ->with(['category', 'subjects.syllabusTopics', 'gallery'])
            ->withCount('students')
            ->where('active', true);

        if ($request->filled('category') && $request->category !== 'All Courses') {
            $query->whereHas('category', fn ($q) => $q->where('name', $request->category));
        }

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('subtitle', 'like', "%{$request->search}%");
            });
        }

        $courses = $query->orderBy('title')->get();

        return response()->json($courses->map(fn (Course $c) => Presenters::publicCourse($c)));
    }

    public function show(string $slug): JsonResponse
    {
        $course = Course::query()
            ->with(['category', 'subjects.syllabusTopics', 'gallery'])
            ->withCount('students')
            ->where('active', true)
            ->where('slug', $slug)
            ->first();

        abort_if(!$course, 404, 'Course not found');

        return response()->json(Presenters::publicCourse($course));
    }

    public function categories(): JsonResponse
    {
        $categories = CourseCategory::query()
            ->whereHas('courses', fn ($q) => $q->where('active', true))
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($category) => [
                'id' => (string) $category->id,
                'name' => $category->name,
                'slug' => Str::slug($category->name),
            ]);

        return response()->json($categories);
    }
}
