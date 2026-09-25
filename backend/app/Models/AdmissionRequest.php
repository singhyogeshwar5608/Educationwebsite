<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdmissionRequest extends Model
{
    protected $fillable = [
        'student_name', 'father_name', 'mother_name', 'date_of_birth', 'gender',
        'mobile', 'email', 'address', 'photo', 'aadhaar_card', 'aadhaar_number', 'matric_dmc',
        'batch', 'status', 'applied_date', 'course_id',
    ];

    protected $casts = [
        'applied_date' => 'date',
        'date_of_birth' => 'date',
    ];

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
}
