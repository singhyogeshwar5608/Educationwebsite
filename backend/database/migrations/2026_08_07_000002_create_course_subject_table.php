<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_subject', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->primary(['course_id', 'subject_id']);
        });

        // Copy existing one-to-many associations into the pivot before dropping the column.
        DB::table('course_subject')->insertUsing(
            ['course_id', 'subject_id'],
            DB::table('subjects')
                ->whereNotNull('course_id')
                ->select('course_id', 'id')
        );

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn('course_id');
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignId('course_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });

        // Restore one association per subject from the pivot (first course wins).
        $rows = DB::table('course_subject')->orderBy('course_id')->get();
        foreach ($rows as $row) {
            DB::table('subjects')
                ->where('id', $row->subject_id)
                ->whereNull('course_id')
                ->update(['course_id' => $row->course_id]);
        }

        Schema::dropIfExists('course_subject');
    }
};
