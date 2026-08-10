<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Certificate extends Model
{
    protected $fillable = [
        'certificate_no', 'serial_no', 'enrollment_no', 'session',
        'institute_code', 'valid_until', 'is_verified', 'qr_code_data',
        'student_id', 'result_id',
    ];

    protected $casts = ['is_verified' => 'boolean'];

    public function student(): BelongsTo { return $this->belongsTo(Student::class); }

    public function result(): BelongsTo { return $this->belongsTo(Result::class); }
}
