<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function verify(Request $request): JsonResponse
    {
        $request->validate(['cert_no' => ['required', 'string']]);

        $certificate = Certificate::query()
            ->with(['student.course', 'result.subjectMarks'])
            ->where('certificate_no', $request->cert_no)
            ->first();

        abort_if(!$certificate, 404, 'Certificate not found');

        $student = $certificate->student;
        $course = $student->course;
        $result = $certificate->result;

        $instituteName = Setting::where('key', 'institute_name')->value('value') ?? 'Z-TECH Career Academy';
        $instituteCode = $certificate->institute_code;

        return response()->json([
            'certificateNo' => $certificate->certificate_no,
            'serialNo' => $certificate->serial_no,
            'studentName' => $student->name,
            'fatherName' => $student->father_name,
            'motherName' => $student->mother_name,
            'dob' => $student->date_of_birth?->format('d-m-Y'),
            'rollNumber' => $student->roll_number,
            'enrollmentNo' => $student->registration_number,
            'courseName' => $course?->title,
            'courseDuration' => $course?->duration,
            'courseDurationFrom' => null,
            'courseDurationTo' => null,
            'batchYear' => $student->batch,
            'grade' => $result?->grade,
            'percentage' => $result ? number_format((float) $result->percentage, 2) . '%' : null,
            'resultStatus' => $result ? strtoupper($result->result_status) : null,
            'issueDate' => $certificate->created_at?->toDateString(),
            'validUntil' => $certificate->valid_until ?? 'Lifetime',
            'photo' => $student->photo ? url('storage/' . ltrim($student->photo, '/')) : null,
            'qrCodeData' => $certificate->qr_code_data,
            'isVerified' => (bool) $certificate->is_verified,
            'instituteName' => $instituteName,
            'instituteCode' => $instituteCode,
            'session' => $certificate->session,
        ]);
    }
}
