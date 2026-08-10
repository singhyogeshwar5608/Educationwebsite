<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['course_id']);

            $table->string('father_name')->nullable(false)->change();
            $table->string('mother_name')->nullable(false)->change();
            $table->date('date_of_birth')->nullable(false)->change();
            $table->string('gender')->nullable(false)->change();
            $table->string('mobile', 20)->nullable(false)->change();
            $table->text('address')->nullable(false)->change();
            $table->string('batch')->nullable(false)->change();
            $table->date('admission_date')->nullable(false)->change();
            $table->string('roll_number')->nullable(false)->change();
            $table->string('registration_number')->nullable(false)->change();
            $table->unsignedBigInteger('course_id')->nullable(false)->change();

            $table->foreign('course_id')->references('id')->on('courses')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['course_id']);

            $table->string('father_name')->nullable()->change();
            $table->string('mother_name')->nullable()->change();
            $table->date('date_of_birth')->nullable()->change();
            $table->string('gender')->nullable()->change();
            $table->string('mobile', 20)->nullable()->change();
            $table->text('address')->nullable()->change();
            $table->string('batch')->nullable()->change();
            $table->date('admission_date')->nullable()->change();
            $table->string('roll_number')->nullable()->change();
            $table->string('registration_number')->nullable()->change();
            $table->unsignedBigInteger('course_id')->nullable()->change();

            $table->foreign('course_id')->references('id')->on('courses')->nullOnDelete();
        });
    }
};
