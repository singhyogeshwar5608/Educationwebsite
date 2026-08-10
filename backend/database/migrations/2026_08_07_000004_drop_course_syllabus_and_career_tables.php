<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('course_syllabus_topics');
        Schema::dropIfExists('course_syllabus_modules');
        Schema::dropIfExists('course_career_opportunities');
    }

    public function down(): void
    {
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
    }
};
