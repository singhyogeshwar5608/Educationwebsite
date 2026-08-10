<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $request->validate(['roll_number' => ['required', 'string']]);

        $student = Student::query()
            ->with(['course', 'results.subjectMarks'])
            ->where('roll_number', $request->roll_number)
            ->first();

        abort_if(!$student, 404, 'Result not found for this roll number');

        $result = $student->results->sortByDesc('issue_date')->first();

        abort_if(!$result, 404, 'No result has been published for this student');

        $subjects = $result->subjectMarks->map(function ($mark) {
            return [
                'subject' => $mark->subject_name,
                'maxMarks' => $mark->max_marks,
                'obtainedMarks' => $mark->obtained_marks,
            ];
        })->values()->toArray();

        return response()->json([
            'rollNumber' => $student->roll_number,
            'studentName' => $student->name,
            'fatherName' => $student->father_name,
            'courseName' => $student->course?->title,
            'courseDuration' => $student->course?->duration,
            'batchYear' => $student->batch,
            'photo' => $student->photo ? url('storage/' . ltrim($student->photo, '/')) : null,
            'subjects' => $subjects,
            'grade' => $result->grade,
            'percentage' => (float) $result->percentage,
            'totalMaxMarks' => $result->total_max_marks,
            'totalObtainedMarks' => $result->total_obtained_marks,
            'resultStatus' => strtoupper($result->result_status),
            'issueDate' => $result->issue_date?->toDateString(),
            'certificateNo' => $result->certificate_no,
        ]);
    }
}
