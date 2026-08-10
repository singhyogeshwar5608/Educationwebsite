<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\AdmissionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdmissionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'studentName' => ['required', 'string', 'max:255'],
            'fatherName' => ['nullable', 'string', 'max:255'],
            'motherName' => ['nullable', 'string', 'max:255'],
            'dob' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:20'],
            'mobile' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['nullable', 'string'],
            'courseId' => ['required', 'integer', 'exists:courses,id'],
            'batch' => ['nullable', 'string', 'max:255'],
        ]);

        $admission = AdmissionRequest::create([
            'student_name' => $validated['studentName'],
            'father_name' => $validated['fatherName'] ?? null,
            'mother_name' => $validated['motherName'] ?? null,
            'date_of_birth' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'mobile' => $validated['mobile'],
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'course_id' => $validated['courseId'],
            'batch' => $validated['batch'] ?? null,
            'applied_date' => now()->toDateString(),
            'status' => 'Pending',
        ]);

        return response()->json([
            'message' => 'Admission request submitted successfully',
            'admission' => $admission->load('course'),
        ], 201);
    }
}
