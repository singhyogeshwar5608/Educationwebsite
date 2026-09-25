<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Result extends Model
{
    protected $fillable = [
        'grade', 'percentage', 'total_max_marks', 'total_obtained_marks',
        'result_status', 'certificate_no', 'issue_date', 'student_id', 'course_id', 'year',
    ];

    protected $casts = ['issue_date' => 'date'];

    public function student(): BelongsTo { return $this->belongsTo(Student::class); }

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }

    public function subjectMarks(): HasMany { return $this->hasMany(ResultSubjectMark::class); }

    public function certificate(): HasOne { return $this->hasOne(Certificate::class); }
}
