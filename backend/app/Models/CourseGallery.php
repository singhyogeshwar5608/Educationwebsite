<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseGallery extends Model
{
    protected $table = 'course_gallery';

    protected $fillable = ['image_url', 'caption', 'course_id'];

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
}
