<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Result;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Result::query()->with(['student.course', 'subjectMarks']);

        if ($request->filled('search')) {
            $query->whereHas('student', fn ($q) => $q->where('name', 'like', "%{$request->search}%"));
        }

        if ($request->filled('course')) {
            $query->whereHas('course', fn ($q) => $q->where('title', 'like', "%{$request->course}%"));
        }

        if ($request->filled('grade')) {
            $query->where('grade', $request->grade);
        }

        $results = $query->orderBy('created_at', 'desc')->get();

        return response()->json($results->map(fn (Result $r) => $this->map($r)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'studentId' => ['required', 'integer', 'exists:students,id'],
            'subjects' => ['required', 'array', 'min:1'],
            'subjects.*.name' => ['required', 'string', 'max:255'],
            'subjects.*.marks' => ['required', 'integer', 'min:0'],
            'subjects.*.maxMarks' => ['required', 'integer', 'min:1'],
            'subjects.*.passingMarks' => ['required', 'integer', 'min:0'],
            'total' => ['nullable', 'integer'],
            'maxTotal' => ['nullable', 'integer'],
            'percentage' => ['nullable', 'numeric'],
            'grade' => ['nullable', 'string', 'max:10'],
            'pass' => ['nullable', 'boolean'],
            'publishedDate' => ['nullable', 'date'],
        ]);

        $student = Student::with('course')->findOrFail($validated['studentId']);

        $percentage = $validated['percentage'] ?? $this->calculatePercentage($validated['subjects']);
        $failedCount = count(array_filter($validated['subjects'], fn ($s) => ($s['marks'] ?? 0) < ($s['passingMarks'] ?? 33)));
        // Pass rule: a student is PASS unless they fail 3 or more subjects.
        $pass = $validated['pass'] ?? ($failedCount < 3);
        $grade = $validated['grade'] ?? $this->calculateGrade($percentage);
        $resultStatus = $pass ? ($percentage >= 75 ? 'DISTINCTION' : 'PASS') : 'FAIL';

        $result = Result::create([
            'student_id' => $student->id,
            'course_id' => $student->course_id,
            'total_obtained_marks' => $validated['total'] ?? $this->sumMarks($validated['subjects']),
            'total_max_marks' => $validated['maxTotal'] ?? $this->sumMax($validated['subjects']),
            'percentage' => round($percentage, 2),
            'grade' => $grade,
            'result_status' => $resultStatus,
            'issue_date' => $validated['publishedDate'] ?? now()->toDateString(),
        ]);

        foreach ($validated['subjects'] as $subject) {
            $result->subjectMarks()->create([
                'subject_name' => $subject['name'],
                'max_marks' => $subject['maxMarks'],
                'obtained_marks' => $subject['marks'],
                'passing_marks' => $subject['passingMarks'] ?? 33,
            ]);
        }

        return response()->json($this->map($result->load(['student.course', 'subjectMarks'])), 201);
    }

    public function show(Result $result): JsonResponse
    {
        $result->load(['student.course', 'subjectMarks']);

        return response()->json($this->map($result));
    }

    public function destroy(Result $result): JsonResponse
    {
        $result->delete();

        return response()->json(['message' => 'Result deleted successfully']);
    }

    public function availableStudents(Request $request): JsonResponse
    {
        $query = Student::query()->with('course');

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
            $query->whereDoesntHave('results', fn ($q) => $q->where('course_id', $request->course_id));
        } else {
            $query->whereDoesntHave('results');
        }

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('roll_number', 'like', "%{$request->search}%"));
        }

        $students = $query->orderBy('name')->get()->map(function (Student $s) {
            return [
                'id' => (string) $s->id,
                'name' => $s->name,
                'course' => $s->course?->title,
                'courseId' => $s->course_id ? (string) $s->course_id : null,
                'rollNo' => $s->roll_number,
                'registrationNo' => $s->registration_number,
                'batch' => $s->batch,
            ];
        });

        return response()->json($students);
    }

    private function map(Result $result): array
    {
        return [
            'id' => (string) $result->id,
            'studentId' => (string) $result->student_id,
            'studentName' => $result->student?->name,
            'course' => $result->course?->title ?? $result->student?->course?->title,
            'courseId' => $result->course_id ? (string) $result->course_id : null,
            'rollNo' => $result->student?->roll_number,
            'subjects' => $result->subjectMarks->map(fn ($m) => [
                'name' => $m->subject_name,
                'marks' => $m->obtained_marks,
                'maxMarks' => $m->max_marks,
                'passingMarks' => $m->passing_marks,
            ])->values(),
            'total' => $result->total_obtained_marks,
            'maxTotal' => $result->total_max_marks,
            'percentage' => (float) $result->percentage,
            'grade' => $result->grade,
            'pass' => in_array($result->result_status, ['PASS', 'DISTINCTION']),
            'publishedDate' => $result->issue_date?->toDateString(),
        ];
    }

    private function sumMarks(array $subjects): int
    {
        return array_sum(array_column($subjects, 'marks'));
    }

    private function sumMax(array $subjects): int
    {
        return array_sum(array_column($subjects, 'maxMarks'));
    }

    private function calculatePercentage(array $subjects): float
    {
        $max = $this->sumMax($subjects);
        return $max > 0 ? round(($this->sumMarks($subjects) / $max) * 100, 2) : 0;
    }

    private function calculateGrade(float $percentage): string
    {
        return match (true) {
            $percentage >= 75 => 'A+',
            $percentage >= 60 => 'A',
            $percentage >= 50 => 'B',
            $percentage >= 40 => 'C',
            $percentage >= 33 => 'D',
            default => 'F',
        };
    }
}
