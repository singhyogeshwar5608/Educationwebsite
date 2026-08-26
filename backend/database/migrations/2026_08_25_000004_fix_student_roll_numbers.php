<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $students = DB::table('students')
            ->join('courses', 'students.course_id', '=', 'courses.id')
            ->select('students.id', 'students.roll_number', 'courses.code', 'courses.slug')
            ->get();

        $seq = 0;
        foreach ($students as $student) {
            $seq++;
            $code = strtoupper($student->code ?: $student->slug ?: 'STU');
            $newRoll = $code . str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
            DB::table('students')->where('id', $student->id)->update(['roll_number' => $newRoll]);
        }
    }

    public function down(): void
    {
        // Cannot reverse data migration
    }
};
