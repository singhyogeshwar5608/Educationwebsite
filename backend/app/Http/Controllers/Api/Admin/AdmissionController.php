<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdmissionRequest;
use App\Models\Student;
use App\Support\StudentNumbering;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdmissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AdmissionRequest::query()->with('course');

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q
                ->where('student_name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
                ->orWhere('mobile', 'like', "%{$request->search}%"));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('course')) {
            $query->whereHas('course', fn ($q) => $q->where('title', 'like', "%{$request->course}%"));
        }

        $admissions = $query->orderBy('created_at', 'desc')->get();

        return response()->json($admissions->map(fn (AdmissionRequest $a) => $this->map($a)));
    }

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
            'admissionDate' => ['nullable', 'date'],
            'photo' => ['nullable', 'string'],
            'aadhaarCard' => ['nullable', 'string'],
            'aadhaarNumber' => ['nullable', 'string', 'regex:/^[0-9]{12}$/'],
            'matricDmc' => ['nullable', 'string'],
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
            'applied_date' => $validated['admissionDate'] ?? now()->toDateString(),
            'status' => 'Pending',
            'photo' => $validated['photo'] ?? null,
            'aadhaar_card' => $validated['aadhaarCard'] ?? null,
            'aadhaar_number' => $validated['aadhaarNumber'] ?? null,
            'matric_dmc' => $validated['matricDmc'] ?? null,
        ]);

        return response()->json($this->map($admission->load('course')), 201);
    }

    public function show(AdmissionRequest $admission): JsonResponse
    {
        $admission->load('course');

        return response()->json($this->map($admission));
    }

    public function updateStatus(Request $request, AdmissionRequest $admission): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['Pending', 'Approved', 'Rejected'])],
        ]);

        $admission->update(['status' => $validated['status']]);

        if ($validated['status'] === 'Approved' && !$admission->student_id) {
            $this->convertToStudent($admission);
        }

        return response()->json($this->map($admission->load('course')));
    }

    public function destroy(AdmissionRequest $admission): JsonResponse
    {
        $admission->delete();

        return response()->json(['message' => 'Admission request deleted successfully']);
    }

    private function convertToStudent(AdmissionRequest $admission): void
    {
        $existing = Student::where('email', $admission->email)->where('name', $admission->student_name)->first();
        if ($existing) {
            return;
        }

        $course = $admission->course ?? $admission->course()->first();
        $code = $course ? strtoupper($course->code ?: $course->slug ?: 'STU') : 'STU';
        $batch = $admission->batch ?? now()->year . '-' . (now()->year + 1);

        Student::create([
            'name' => $admission->student_name,
            'father_name' => $admission->father_name ?? '',
            'mother_name' => $admission->mother_name ?? '',
            'date_of_birth' => $admission->date_of_birth ?? now()->toDateString(),
            'gender' => $admission->gender ?? 'Other',
            'mobile' => $admission->mobile,
            'email' => $admission->email,
            'address' => $admission->address ?? '',
            'course_id' => $admission->course_id,
            'batch' => $batch,
            'admission_date' => now()->toDateString(),
            'status' => 'Active',
            'roll_number' => StudentNumbering::nextRollNumber($code),
            'registration_number' => StudentNumbering::nextRegistrationNumber($batch),
            'enrollment_number' => StudentNumbering::nextEnrollmentNumber($batch),
            'photo' => $admission->photo,
            'aadhaar_card' => $admission->aadhaar_card,
            'aadhaar_number' => $admission->aadhaar_number,
            'matric_dmc' => $admission->matric_dmc,
        ]);
    }

    private function map(AdmissionRequest $admission): array
    {
        return [
            'id' => (string) $admission->id,
            'studentName' => $admission->student_name,
            'fatherName' => $admission->father_name,
            'motherName' => $admission->mother_name,
            'dob' => $admission->date_of_birth?->toDateString(),
            'gender' => $admission->gender,
            'email' => $admission->email,
            'mobile' => $admission->mobile,
            'address' => $admission->address,
            'course' => $admission->course?->title,
            'courseId' => $admission->course_id ? (string) $admission->course_id : null,
            'batch' => $admission->batch,
            'appliedDate' => $admission->applied_date?->toDateString(),
            'status' => $admission->status,
            'photo' => $admission->photo ? url('storage/' . ltrim($admission->photo, '/')) : null,
            'aadhaarCard' => $admission->aadhaar_card ? url('storage/' . ltrim($admission->aadhaar_card, '/')) : null,
            'aadhaarNumber' => $admission->aadhaar_number,
            'matricDmc' => $admission->matric_dmc ? url('storage/' . ltrim($admission->matric_dmc, '/')) : null,
        ];
    }
}
