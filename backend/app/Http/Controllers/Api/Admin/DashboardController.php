<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdmissionRequest;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\Result;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'totalStudents' => Student::count(),
            'pendingAdmissions' => AdmissionRequest::where('status', 'Pending')->count(),
            'totalCourses' => Course::count(),
            'certificatesIssued' => Certificate::count(),
            'resultsPublished' => Result::count(),
        ]);
    }

    public function enrollmentTrend(): JsonResponse
    {
        $rows = Student::query()
            ->whereNotNull('admission_date')
            ->orderBy('admission_date')
            ->get(['admission_date'])
            ->groupBy(fn ($s) => $s->admission_date->format('Y-m'))
            ->map(fn ($group) => [
                'month' => $group->first()->admission_date->format('M Y'),
                'count' => $group->count(),
            ])
            ->values();

        return response()->json($rows);
    }

    public function courseDistribution(): JsonResponse
    {
        $distribution = Course::query()
            ->withCount('students')
            ->whereHas('students')
            ->orderByDesc('students_count')
            ->get()
            ->map(fn ($course) => [
                'name' => $course->title,
                'value' => $course->students_count,
            ]);

        return response()->json($distribution);
    }

    public function recentAdmissions(): JsonResponse
    {
        $admissions = AdmissionRequest::query()
            ->with('course')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn ($admission) => [
                'id' => (string) $admission->id,
                'studentName' => $admission->student_name,
                'email' => $admission->email,
                'mobile' => $admission->mobile,
                'course' => $admission->course?->title,
                'appliedDate' => $admission->applied_date?->toDateString(),
                'status' => $admission->status,
            ]);

        return response()->json($admissions);
    }

    public function recentActivities(): JsonResponse
    {
        $activities = collect([])
            ->merge(Student::query()->latest()->limit(5)->get()->map(fn ($s) => [
                'text' => "New student {$s->name} registered",
                'time' => $s->created_at->diffForHumans(),
            ]))
            ->merge(AdmissionRequest::query()->latest()->limit(5)->get()->map(fn ($a) => [
                'text' => "Admission request from {$a->student_name}",
                'time' => $a->created_at->diffForHumans(),
            ]))
            ->merge(Certificate::query()->latest()->limit(5)->get()->map(fn ($c) => [
                'text' => "Certificate {$c->certificate_no} issued",
                'time' => $c->created_at->diffForHumans(),
            ]))
            ->sortByDesc('time')
            ->take(8)
            ->values();

        return response()->json($activities);
    }
}
