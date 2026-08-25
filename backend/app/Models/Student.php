<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'roll_number', 'registration_number', 'name', 'father_name', 'mother_name',
        'date_of_birth', 'gender', 'mobile', 'email', 'address', 'photo', 'aadhaar_card', 'matric_dmc',
        'batch', 'status', 'admission_date', 'course_id',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'admission_date' => 'date',
    ];

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }

    public function results(): HasMany { return $this->hasMany(Result::class); }

    public function certificates(): HasMany { return $this->hasMany(Certificate::class); }
}
