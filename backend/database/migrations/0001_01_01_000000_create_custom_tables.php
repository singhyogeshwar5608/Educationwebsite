<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('role')->default('admin');
            $table->boolean('two_factor_enabled')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('course_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('long_description')->nullable();
            $table->string('duration')->nullable();
            $table->integer('duration_months')->nullable();
            $table->decimal('course_fee', 10, 2)->default(0);
            $table->decimal('registration_fee', 10, 2)->default(0);
            $table->string('level')->default('Beginner');
            $table->string('banner_image')->nullable();
            $table->string('thumbnail_image')->nullable();
            $table->string('certificate_template')->nullable();
            $table->string('marksheet_template')->nullable();
            $table->string('course_pdf')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('popular')->default(false);
            $table->boolean('active')->default(true);
            $table->foreignId('category_id')->nullable()->constrained('course_categories')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('max_marks')->default(100);
            $table->integer('passing_marks')->default(33);
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('course_syllabus_modules', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('duration')->nullable();
            $table->integer('sort_order')->default(0);
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('course_syllabus_topics', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('module_id')->constrained('course_syllabus_modules')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('course_career_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('salary_range')->nullable();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('course_gallery', function (Blueprint $table) {
            $table->id();
            $table->string('image_url');
            $table->string('caption')->nullable();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('roll_number')->unique()->nullable();
            $table->string('registration_number')->unique()->nullable();
            $table->string('name');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('mobile', 20)->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('photo')->nullable();
            $table->string('batch')->nullable();
            $table->string('status')->default('Active');
            $table->date('admission_date')->nullable();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('admission_requests', function (Blueprint $table) {
            $table->id();
            $table->string('student_name');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->string('mobile', 20);
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('batch')->nullable();
            $table->string('status')->default('Pending');
            $table->date('applied_date')->nullable();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->string('grade')->nullable();
            $table->decimal('percentage', 5, 2)->nullable();
            $table->integer('total_max_marks')->default(0);
            $table->integer('total_obtained_marks')->default(0);
            $table->string('result_status');
            $table->string('certificate_no')->nullable();
            $table->date('issue_date')->nullable();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('result_subject_marks', function (Blueprint $table) {
            $table->id();
            $table->string('subject_name');
            $table->integer('max_marks');
            $table->integer('obtained_marks');
            $table->foreignId('result_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_no')->unique();
            $table->string('serial_no')->nullable();
            $table->string('enrollment_no')->nullable();
            $table->string('session')->nullable();
            $table->string('institute_code')->nullable();
            $table->string('valid_until')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->string('qr_code_data')->nullable();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('result_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('gallery_albums', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->string('file_url');
            $table->string('file_type')->default('image');
            $table->string('title')->nullable();
            $table->foreignId('album_id')->nullable()->constrained('gallery_albums')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone', 20)->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status')->default('pending');
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        $tables = [
            'result_subject_marks', 'results', 'certificates',
            'course_syllabus_topics', 'course_syllabus_modules',
            'course_career_opportunities', 'course_gallery',
            'admission_requests', 'students', 'subjects',
            'gallery_items', 'gallery_albums', 'enquiries',
            'settings', 'courses', 'course_categories', 'admins',
        ];
        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
    }
};
