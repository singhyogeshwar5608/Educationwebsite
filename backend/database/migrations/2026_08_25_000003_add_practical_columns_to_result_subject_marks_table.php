<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('result_subject_marks', function (Blueprint $table) {
            if (!Schema::hasColumn('result_subject_marks', 'theory_max_marks')) {
                $table->integer('theory_max_marks')->nullable()->after('passing_marks');
            }
            if (!Schema::hasColumn('result_subject_marks', 'theory_obtained_marks')) {
                $table->integer('theory_obtained_marks')->nullable()->after('theory_max_marks');
            }
            if (!Schema::hasColumn('result_subject_marks', 'practical_max_marks')) {
                $table->integer('practical_max_marks')->nullable()->after('theory_obtained_marks');
            }
            if (!Schema::hasColumn('result_subject_marks', 'practical_obtained_marks')) {
                $table->integer('practical_obtained_marks')->nullable()->after('practical_max_marks');
            }
        });
    }

    public function down(): void
    {
        Schema::table('result_subject_marks', function (Blueprint $table) {
            $table->dropColumn(['theory_max_marks', 'theory_obtained_marks', 'practical_max_marks', 'practical_obtained_marks']);
        });
    }
};
