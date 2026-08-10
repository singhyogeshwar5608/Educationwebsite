<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubjectSyllabusTopic extends Model
{
    protected $fillable = ['topic', 'description', 'sort_order', 'subject_id'];

    public function subject(): BelongsTo { return $this->belongsTo(Subject::class); }
}
