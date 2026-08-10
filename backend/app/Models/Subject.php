<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = ['name', 'max_marks', 'passing_marks'];

    public function courses(): BelongsToMany { return $this->belongsToMany(Course::class); }

    public function syllabusTopics(): HasMany { return $this->hasMany(SubjectSyllabusTopic::class)->orderBy('sort_order'); }
}
