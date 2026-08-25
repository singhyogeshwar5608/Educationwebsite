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
        $request->validate(['registration_number' => ['required', 'string']]);

        $student = Student::query()
            ->with(['course', 'results.subjectMarks'])
            ->where('registration_number', $request->registration_number)
            ->first();

        abort_if(!$student, 404, 'Result not found for this registration number');

        $result = $student->results->sortByDesc('issue_date')->first();

        abort_if(!$result, 404, 'No result has been published for this student');

        $subjects = $result->subjectMarks->map(function ($mark) {
            return [
                'subject' => $mark->subject_name,
                'maxMarks' => $mark->max_marks,
                'obtainedMarks' => $mark->obtained_marks,
                'theoryMaxMarks' => $mark->theory_max_marks,
                'theoryMarks' => $mark->theory_obtained_marks,
                'practicalMaxMarks' => $mark->practical_max_marks,
                'practicalMarks' => $mark->practical_obtained_marks,
            ];
        })->values()->toArray();

        return response()->json([
            'rollNumber' => $student->roll_number,
            'registrationNumber' => $student->registration_number,
            'studentName' => $student->name,
            'fatherName' => $student->father_name,
            'motherName' => $student->mother_name,
            'dob' => $student->date_of_birth?->format('d-m-Y'),
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
