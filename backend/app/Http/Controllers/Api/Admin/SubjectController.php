<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Subject::query()->with(['courses', 'syllabusTopics']);

        if ($request->filled('course_id')) {
            $query->whereHas('courses', fn ($q) => $q->where('courses.id', $request->course_id));
        }

        $subjects = $query->orderBy('name')->get()->map(fn ($subject) => $this->map($subject));

        return response()->json($subjects);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'maxMarks' => ['nullable', 'integer', 'min:1'],
            'passingMarks' => ['nullable', 'integer', 'min:0'],
            'courseIds' => ['nullable', 'array'],
            'courseIds.*' => ['integer', 'exists:courses,id'],
        ]);

        $subject = Subject::create([
            'name' => $validated['name'],
            'max_marks' => $validated['maxMarks'] ?? 100,
            'passing_marks' => $validated['passingMarks'] ?? 33,
        ]);

        if (!empty($validated['courseIds'])) {
            $subject->courses()->attach($validated['courseIds']);
        }

        return response()->json($this->map($subject->load('courses')), 201);
    }

    public function update(Request $request, Subject $subject): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'maxMarks' => ['nullable', 'integer', 'min:1'],
            'passingMarks' => ['nullable', 'integer', 'min:0'],
            'courseIds' => ['nullable', 'array'],
            'courseIds.*' => ['integer', 'exists:courses,id'],
        ]);

        $subject->update([
            'name' => $validated['name'],
            'max_marks' => $validated['maxMarks'] ?? $subject->max_marks,
            'passing_marks' => $validated['passingMarks'] ?? $subject->passing_marks,
        ]);

        if (array_key_exists('courseIds', $validated)) {
            $subject->courses()->sync($validated['courseIds'] ?? []);
        }

        return response()->json($this->map($subject->load('courses')));
    }

    public function destroy(Subject $subject): JsonResponse
    {
        $subject->delete();

        return response()->json(['message' => 'Subject deleted successfully']);
    }

    private function map(Subject $subject): array
    {
        return [
            'id' => (string) $subject->id,
            'name' => $subject->name,
            'courses' => $subject->courses->map(fn ($c) => [
                'id' => (string) $c->id,
                'name' => $c->title,
            ])->values(),
            'syllabusTopics' => $subject->syllabusTopics->map(fn ($t) => [
                'id' => (string) $t->id,
                'topic' => $t->topic,
                'description' => $t->description,
            ])->values(),
            'maxMarks' => $subject->max_marks,
            'passingMarks' => $subject->passing_marks,
        ];
    }
}
