<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        'slug', 'code', 'title', 'subtitle', 'short_description', 'long_description',
        'duration', 'duration_months', 'course_fee', 'registration_fee',
        'level', 'eligibility', 'certificate_template',
        'marksheet_template', 'course_pdf', 'featured', 'popular', 'active',
        'category_id',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'popular' => 'boolean',
        'active' => 'boolean',
        'eligibility' => 'array',
    ];

    public function category(): BelongsTo { return $this->belongsTo(CourseCategory::class); }

    public function subjects(): BelongsToMany { return $this->belongsToMany(Subject::class)->withPivot('year'); }

    public function gallery(): HasMany { return $this->hasMany(CourseGallery::class); }

    public function students(): HasMany { return $this->hasMany(Student::class); }

    public function results(): HasMany { return $this->hasMany(Result::class); }

    public function admissionRequests(): HasMany { return $this->hasMany(AdmissionRequest::class); }

    /**
     * Number of study-years a course lasts, derived from duration_months
     * (preferred) or the duration text (e.g. "2 Years" → 2). Falls back to 1.
     */
    public function studyYears(): int
    {
        $months = (int) $this->duration_months;
        if ($months > 0) {
            return max(1, (int) ceil($months / 12));
        }

        if (preg_match('/(\d+(?:\.\d+)?)\s*(year|yr)/i', (string) $this->duration, $m)) {
            return max(1, (int) ceil((float) $m[1]));
        }

        return 1;
    }
}
