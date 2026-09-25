<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Result;
use App\Models\Student;
use App\Support\StudentNumbering;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Student::query()->with(['course', 'results.subjectMarks', 'certificates.result']);

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
                ->orWhere('roll_number', 'like', "%{$request->search}%")
                ->orWhere('mobile', 'like', "%{$request->search}%"));
        }

        if ($request->filled('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        $students = $query->orderBy('created_at', 'desc')->get();

        return response()->json($students->map(fn (Student $s) => $this->map($s)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'fatherName' => ['required', 'string', 'max:255'],
            'motherName' => ['required', 'string', 'max:255'],
            'dob' => ['required', 'date'],
            'gender' => ['required', Rule::in(['Male', 'Female', 'Other'])],
            'mobile' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['required', 'string'],
            'courseId' => ['required', 'integer', 'exists:courses,id'],
            'batch' => ['required', 'string', 'max:255'],
            'admissionDate' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'string'],
            'aadhaarCard' => ['nullable', 'string'],
            'aadhaarNumber' => ['nullable', 'string', 'regex:/^[0-9]{12}$/'],
            'enrollmentNumber' => ['nullable', 'string', 'max:30', Rule::unique('students', 'enrollment_number')],
            'matricDmc' => ['nullable', 'string'],
        ]);

        $course = Course::findOrFail($validated['courseId']);
        $batch = $validated['batch'] ?? now()->year . '-' . (now()->year + 1);
        $code = strtoupper($course->code ?: $course->slug ?: 'STU');

        $student = Student::create([
            'name' => $validated['name'],
            'father_name' => $validated['fatherName'] ?? null,
            'mother_name' => $validated['motherName'] ?? null,
            'date_of_birth' => $validated['dob'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'mobile' => $validated['mobile'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'course_id' => $validated['courseId'],
            'batch' => $batch,
            'admission_date' => $validated['admissionDate'] ?? now()->toDateString(),
            'status' => $validated['status'] ?? 'Active',
            'photo' => $validated['photo'] ?? null,
            'aadhaar_card' => $validated['aadhaarCard'] ?? null,
            'aadhaar_number' => $validated['aadhaarNumber'] ?? null,
            'matric_dmc' => $validated['matricDmc'] ?? null,
            'registration_number' => $request->registrationNo ?? StudentNumbering::nextRegistrationNumber($batch),
            'roll_number' => $request->rollNo ?? StudentNumbering::nextRollNumber($code),
            'enrollment_number' => $request->enrollmentNumber ?? StudentNumbering::nextEnrollmentNumber($batch),
        ]);

        return response()->json($this->map($student->load(['course', 'results'])), 201);
    }

    public function show(Student $student): JsonResponse
    {
        $student->load(['course', 'results.subjectMarks', 'certificates.result']);

        return response()->json($this->map($student));
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'fatherName' => ['required', 'string', 'max:255'],
            'motherName' => ['required', 'string', 'max:255'],
            'dob' => ['required', 'date'],
            'gender' => ['required', Rule::in(['Male', 'Female', 'Other'])],
            'mobile' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['required', 'string'],
            'courseId' => ['required', 'integer', 'exists:courses,id'],
            'batch' => ['required', 'string', 'max:255'],
            'admissionDate' => ['required', 'date'],
            'status' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'string'],
            'aadhaarCard' => ['nullable', 'string'],
            'aadhaarNumber' => ['nullable', 'string', 'regex:/^[0-9]{12}$/'],
            'enrollmentNumber' => ['nullable', 'string', 'max:30', Rule::unique('students', 'enrollment_number')->ignore($student->id)],
            'matricDmc' => ['nullable', 'string'],
        ]);

        $student->update([
            'name' => $validated['name'],
            'father_name' => $validated['fatherName'] ?? $student->father_name,
            'mother_name' => $validated['motherName'] ?? $student->mother_name,
            'date_of_birth' => $validated['dob'] ?? $student->date_of_birth,
            'gender' => $validated['gender'] ?? $student->gender,
            'mobile' => $validated['mobile'] ?? $student->mobile,
            'email' => $validated['email'] ?? $student->email,
            'address' => $validated['address'] ?? $student->address,
            'course_id' => $validated['courseId'],
            'batch' => $validated['batch'] ?? $student->batch,
            'admission_date' => $validated['admissionDate'] ?? $student->admission_date,
            'status' => $validated['status'] ?? $student->status,
            'photo' => $validated['photo'] ?? $student->photo,
            'aadhaar_card' => $validated['aadhaarCard'] ?? $student->aadhaar_card,
            'aadhaar_number' => $validated['aadhaarNumber'] ?? $student->aadhaar_number,
            'enrollment_number' => !empty($validated['enrollmentNumber']) ? $validated['enrollmentNumber'] : $student->enrollment_number,
            'matric_dmc' => $validated['matricDmc'] ?? $student->matric_dmc,
        ]);

        return response()->json($this->map($student->load(['course', 'results'])));
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully']);
    }

    private function map(Student $student): array
    {
        $latestResult = $student->results->sortByDesc('issue_date')->first();
        $hasCertificate = $student->certificates->isNotEmpty();
        $latestResult?->loadMissing('subjectMarks');
        $certificate = $student->certificates->sortByDesc('created_at')->first();

        return [
            'id' => (string) $student->id,
            'name' => $student->name,
            'fatherName' => $student->father_name,
            'motherName' => $student->mother_name,
            'dob' => $student->date_of_birth?->toDateString(),
            'gender' => $student->gender,
            'mobile' => $student->mobile,
            'email' => $student->email,
            'address' => $student->address,
            'course' => $student->course?->title,
            'courseId' => $student->course_id ? (string) $student->course_id : null,
            'batch' => $student->batch,
            'admissionDate' => $student->admission_date?->toDateString(),
            'registrationNo' => $student->registration_number,
            'enrollmentNo' => $student->enrollment_number,
            'rollNo' => $student->roll_number,
            'status' => $student->status,
            'photo' => $student->photo ? url('storage/' . ltrim($student->photo, '/')) : null,
            'aadhaarCard' => $student->aadhaar_card ? url('storage/' . ltrim($student->aadhaar_card, '/')) : null,
            'aadhaarNumber' => $student->aadhaar_number,
            'matricDmc' => $student->matric_dmc ? url('storage/' . ltrim($student->matric_dmc, '/')) : null,
            'resultPublished' => $latestResult !== null,
            'passed' => $latestResult ? ($latestResult->result_status === 'PASS' || $latestResult->result_status === 'DISTINCTION') : null,
            'certificateIssued' => $hasCertificate,
            'percentage' => $latestResult ? (float) $latestResult->percentage : null,
            'grade' => $latestResult?->grade,
            'results' => $latestResult ? $this->mapResult($latestResult) : null,
            'certificate' => $certificate ? [
                'id' => (string) $certificate->id,
                'certificateNo' => $certificate->certificate_no,
                'issueDate' => $certificate->created_at?->toDateString(),
                'verificationUrl' => $certificate->qr_code_data,
                'grade' => $certificate->result?->grade,
                'percentage' => $certificate->result && $certificate->result->percentage !== null
                    ? (float) $certificate->result->percentage
                    : null,
            ] : null,
        ];
    }

    private function mapResult(Result $result): array
    {
        return [
            'id' => (string) $result->id,
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
}
