<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Result;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Certificate::query()->with(['student.course', 'result']);

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q
                ->where('certificate_no', 'like', "%{$request->search}%")
                ->orWhereHas('student', fn ($q) => $q->where('name', 'like', "%{$request->search}%")));
        }

        if ($request->filled('course')) {
            $query->whereHas('student.course', fn ($q) => $q->where('title', 'like', "%{$request->course}%"));
        }

        $certificates = $query->orderBy('created_at', 'desc')->get();

        return response()->json($certificates->map(fn (Certificate $c) => $this->map($c)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'studentId' => ['nullable', 'integer', 'exists:students,id'],
            'rollNo' => ['nullable', 'string'],
            'enrollmentNo' => ['nullable', 'string'],
            'certificateNo' => ['required', 'string', 'unique:certificates,certificate_no'],
            'session' => ['nullable', 'string', 'max:255'],
            'issueDate' => ['nullable', 'date'],
            'serialNo' => ['nullable', 'string', 'max:255'],
            'validUntil' => ['nullable', 'string', 'max:255'],
        ]);

        $student = $this->resolveStudent($request);

        if (!$student) {
            return response()->json(['error' => 'Student not found. Provide studentId, rollNo or enrollmentNo.'], 422);
        }

        $result = $student->results()->latest('issue_date')->first();
        $instituteCode = config('app.name');

        $certificate = Certificate::create([
            'certificate_no' => $validated['certificateNo'],
            'serial_no' => $validated['serialNo'] ?? null,
            'enrollment_no' => $student->registration_number,
            'session' => $validated['session'] ?? $student->batch,
            'institute_code' => $instituteCode,
            'valid_until' => $validated['validUntil'] ?? 'Lifetime',
            'is_verified' => true,
            'qr_code_data' => $request->qrCode ?? $request->verificationUrl ?? null,
            'student_id' => $student->id,
            'result_id' => $result?->id,
        ]);

        return response()->json($this->map($certificate->load(['student.course', 'result'])), 201);
    }

    public function show(Certificate $certificate): JsonResponse
    {
        $certificate->load(['student.course', 'result']);

        return response()->json($this->map($certificate));
    }

    public function destroy(Certificate $certificate): JsonResponse
    {
        $certificate->delete();

        return response()->json(['message' => 'Certificate deleted successfully']);
    }

    public function eligibleStudents(Request $request): JsonResponse
    {
        $query = Student::query()
            ->with(['course', 'results', 'certificates'])
            ->whereHas('results', fn ($q) => $q->whereIn('result_status', ['PASS', 'DISTINCTION']))
            ->whereDoesntHave('certificates');

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$request->search}%")
                ->orWhere('roll_number', 'like', "%{$request->search}%"));
        }

        $students = $query->orderBy('name')->get()
            ->filter(function (Student $s) {
                // Certificate is only issued after the FINAL year — every study
                // year of the course must have a PASS result.
                $courseYears = $s->course?->studyYears() ?? 1;
                $passedYears = $s->results
                    ->whereIn('result_status', ['PASS', 'DISTINCTION'])
                    ->pluck('year')
                    ->map(fn ($y) => (int) $y)
                    ->all();

                for ($y = 1; $y <= $courseYears; $y++) {
                    if (!in_array($y, $passedYears, true)) {
                        return false;
                    }
                }

                return true;
            })
            ->values()
            ->map(function (Student $s) {
                $result = $s->results->whereIn('result_status', ['PASS', 'DISTINCTION'])->sortByDesc('year')->first();

                return [
                    'id' => (string) $s->id,
                    'name' => $s->name,
                    'course' => $s->course?->title,
                    'courseId' => $s->course_id ? (string) $s->course_id : null,
                    'rollNo' => $s->roll_number,
                    'registrationNo' => $s->registration_number,
                    'batch' => $s->batch,
                    'fatherName' => $s->father_name,
                    'motherName' => $s->mother_name,
                    'dob' => $s->date_of_birth?->toDateString(),
                    'percentage' => $result ? (float) $result->percentage : null,
                    'grade' => $result?->grade,
                ];
            });

        return response()->json($students);
    }

    private function resolveStudent(Request $request): ?Student
    {
        if ($request->filled('studentId')) {
            return Student::find($request->studentId);
        }

        if ($request->filled('rollNo')) {
            return Student::where('roll_number', $request->rollNo)->first();
        }

        if ($request->filled('enrollmentNo')) {
            return Student::where('registration_number', $request->enrollmentNo)->first();
        }

        if ($request->filled('studentName')) {
            return Student::where('name', $request->studentName)->first();
        }

        return null;
    }

    private function map(Certificate $certificate): array
    {
        $student = $certificate->student;
        $result = $certificate->result;

        return [
            'id' => (string) $certificate->id,
            'certificateNo' => $certificate->certificate_no,
            'studentId' => $student ? (string) $student->id : null,
            'studentName' => $student?->name,
            'course' => $student?->course?->title,
            'duration' => $student?->course?->duration,
            'session' => $certificate->session,
            'enrollmentNo' => $certificate->enrollment_no,
            'rollNo' => $student?->roll_number,
            'issueDate' => $certificate->created_at?->toDateString(),
            'percentage' => $result ? (float) $result->percentage : null,
            'grade' => $result?->grade,
            'qrCode' => $certificate->qr_code_data,
            'verificationUrl' => $certificate->qr_code_data,
            'serialNo' => $certificate->serial_no,
        ];
    }
}
