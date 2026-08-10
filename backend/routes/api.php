<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
Route::get('/health', fn() => response()->json(['status' => 'ok', 'message' => 'Z-TECH API is running']));

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/
Route::get('courses', [App\Http\Controllers\Api\Public\CourseController::class, 'index']);
Route::get('courses/{slug}', [App\Http\Controllers\Api\Public\CourseController::class, 'show']);
Route::get('course-categories', [App\Http\Controllers\Api\Public\CourseController::class, 'categories']);
Route::post('enquiries', [App\Http\Controllers\Api\Public\EnquiryController::class, 'store']);
Route::post('admissions', [App\Http\Controllers\Api\Public\AdmissionController::class, 'store']);
Route::get('results/search', [App\Http\Controllers\Api\Public\ResultController::class, 'search']);
Route::get('certificates/verify', [App\Http\Controllers\Api\Public\CertificateController::class, 'verify']);
Route::get('gallery', [App\Http\Controllers\Api\Public\GalleryController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Admin API Routes
|--------------------------------------------------------------------------
*/
Route::post('admin/auth/login', [App\Http\Controllers\Api\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('auth/logout', [App\Http\Controllers\Api\AuthController::class, 'logout']);
    Route::get('auth/user', [App\Http\Controllers\Api\AuthController::class, 'user']);
    Route::put('auth/password', [App\Http\Controllers\Api\AuthController::class, 'changePassword']);

    Route::get('dashboard/stats', [App\Http\Controllers\Api\Admin\DashboardController::class, 'stats']);
    Route::get('dashboard/enrollment-trend', [App\Http\Controllers\Api\Admin\DashboardController::class, 'enrollmentTrend']);
    Route::get('dashboard/course-distribution', [App\Http\Controllers\Api\Admin\DashboardController::class, 'courseDistribution']);
    Route::get('dashboard/recent-admissions', [App\Http\Controllers\Api\Admin\DashboardController::class, 'recentAdmissions']);
    Route::get('dashboard/recent-activities', [App\Http\Controllers\Api\Admin\DashboardController::class, 'recentActivities']);

    Route::apiResource('courses', App\Http\Controllers\Api\Admin\CourseController::class);
    Route::apiResource('course-categories', App\Http\Controllers\Api\Admin\CourseCategoryController::class)->except('show');
    Route::apiResource('subjects', App\Http\Controllers\Api\Admin\SubjectController::class)->except('show');
    Route::apiResource('students', App\Http\Controllers\Api\Admin\StudentController::class);
    Route::get('students/{student}', [App\Http\Controllers\Api\Admin\StudentController::class, 'show']);
    Route::apiResource('admissions', App\Http\Controllers\Api\Admin\AdmissionController::class)->except('edit', 'update');
    Route::put('admissions/{admission}/status', [App\Http\Controllers\Api\Admin\AdmissionController::class, 'updateStatus']);
    Route::get('results/available-students', [App\Http\Controllers\Api\Admin\ResultController::class, 'availableStudents']);
    Route::apiResource('results', App\Http\Controllers\Api\Admin\ResultController::class)->except('edit', 'update');
    Route::get('certificates/eligible-students', [App\Http\Controllers\Api\Admin\CertificateController::class, 'eligibleStudents']);
    Route::apiResource('certificates', App\Http\Controllers\Api\Admin\CertificateController::class)->except('edit', 'update');
    Route::get('gallery/albums', [App\Http\Controllers\Api\Admin\GalleryController::class, 'albums']);
    Route::post('gallery/albums', [App\Http\Controllers\Api\Admin\GalleryController::class, 'storeAlbum']);
    Route::apiResource('gallery', App\Http\Controllers\Api\Admin\GalleryController::class)->except('show');
    Route::post('upload', [App\Http\Controllers\Api\Admin\UploadController::class, 'upload']);
    Route::get('settings', [App\Http\Controllers\Api\Admin\SettingsController::class, 'index']);
    Route::put('settings/institute', [App\Http\Controllers\Api\Admin\SettingsController::class, 'updateInstitute']);
    Route::put('settings/notifications', [App\Http\Controllers\Api\Admin\SettingsController::class, 'updateNotifications']);
    Route::get('enquiries', [App\Http\Controllers\Api\Admin\EnquiryController::class, 'index']);
    Route::get('enquiries/{enquiry}', [App\Http\Controllers\Api\Admin\EnquiryController::class, 'show']);
    Route::put('enquiries/{enquiry}/status', [App\Http\Controllers\Api\Admin\EnquiryController::class, 'updateStatus']);
    Route::delete('enquiries/{enquiry}', [App\Http\Controllers\Api\Admin\EnquiryController::class, 'destroy']);
    Route::post('system/backup', [App\Http\Controllers\Api\Admin\SettingsController::class, 'backup']);
    Route::post('system/cache-clear', [App\Http\Controllers\Api\Admin\SettingsController::class, 'clearCache']);
});
