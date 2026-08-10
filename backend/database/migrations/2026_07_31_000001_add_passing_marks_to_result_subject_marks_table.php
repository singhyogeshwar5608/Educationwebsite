<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('result_subject_marks', function (Blueprint $table) {
            $table->integer('passing_marks')->default(33)->after('obtained_marks');
        });
    }

    public function down(): void
    {
        Schema::table('result_subject_marks', function (Blueprint $table) {
            $table->dropColumn('passing_marks');
        });
    }
};
