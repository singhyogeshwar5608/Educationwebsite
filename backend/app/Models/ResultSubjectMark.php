<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResultSubjectMark extends Model
{
    protected $fillable = ['subject_name', 'max_marks', 'obtained_marks', 'passing_marks',
        'theory_max_marks', 'theory_obtained_marks', 'practical_max_marks', 'practical_obtained_marks',
        'result_id'];

    public function result(): BelongsTo { return $this->belongsTo(Result::class); }
}
