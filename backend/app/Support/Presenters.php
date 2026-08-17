<?php

namespace App\Support;

use App\Models\Course;

class Presenters
{
    public static function money(float|int|null $value, bool $suffix = true): string
    {
        $value = (float) ($value ?? 0);
        return $suffix ? number_format($value) : (string) $value;
    }

    public static function publicCourse(Course $course): array
    {
        $category = $course->category;
        $gallery = $course->gallery->pluck('image_url')->map(function ($url) {
            return self::absoluteUrl($url);
        })->values()->toArray();

        $syllabus = $course->subjects->map(function ($subject) {
            return [
                'id' => (string) $subject->id,
                'name' => $subject->name,
                'topics' => $subject->syllabusTopics->map(fn ($t) => [
                    'topic' => $t->topic,
                    'description' => $t->description,
                ])->values()->toArray(),
            ];
        })->values()->toArray();

        $subjects = $course->subjects->pluck('name')->values()->toArray();

        return [
            'id' => (string) $course->id,
            'slug' => $course->slug,
            'title' => $course->title,
            'subtitle' => $course->subtitle,
            'duration' => $course->duration,
            'durationMonths' => $course->duration_months,
            'price' => self::money($course->course_fee),
            'priceValue' => (float) $course->course_fee,
            'rating' => 4.5,
            'category' => $category?->name,
            'level' => $course->level,
            'featured' => (bool) $course->featured,
            'popular' => (bool) $course->popular,
            'students' => $course->students_count ?? $course->students()->count(),
            'registrationFee' => self::money($course->registration_fee),
            'description' => $course->short_description,
            'longDescription' => $course->long_description,
            'features' => [],
            'syllabus' => $syllabus,
            'subjects' => $subjects,
            'eligibility' => array_values($course->eligibility ?? []),
            'gallery' => $gallery,
        ];
    }

    public static function adminCourse(Course $course): array
    {
        $subjects = $course->subjects->map(function ($subject) {
            return [
                'id' => (string) $subject->id,
                'name' => $subject->name,
                'maxMarks' => $subject->max_marks,
                'passingMarks' => $subject->passing_marks,
                'syllabusTopics' => $subject->syllabusTopics->map(fn ($t) => [
                    'id' => (string) $t->id,
                    'topic' => $t->topic,
                    'description' => $t->description,
                ])->values()->toArray(),
            ];
        })->values()->toArray();

        // First gallery image as thumbnail (subquery in list API; full gallery in show()).
        $firstImage = $course->first_gallery_image
            ?? ($course->relationLoaded('gallery') ? $course->gallery->first()?->image_url : null);

        return [
            'id' => (string) $course->id,
            'name' => $course->title,
            'subtitle' => $course->subtitle,
            'code' => $course->code ?? strtoupper($course->slug),
            'category' => $course->category?->name,
            'category_id' => $course->category_id,
            'duration' => $course->duration,
            'durationMonths' => $course->duration_months,
            'courseFee' => (float) $course->course_fee,
            'registrationFee' => (float) $course->registration_fee,
            'eligibility' => array_values($course->eligibility ?? []),
            'description' => $course->short_description,
            'longDescription' => $course->long_description,
            'pdf' => self::absoluteUrl($course->course_pdf),
            'certificateTemplate' => self::absoluteUrl($course->certificate_template),
            'marksheetTemplate' => self::absoluteUrl($course->marksheet_template),
            'status' => $course->active ? 'Active' : 'Inactive',
            'featured' => (bool) $course->featured,
            'popular' => (bool) $course->popular,
            'level' => $course->level,
            'subjects' => $subjects,
            'thumbnail' => $firstImage ? self::absoluteUrl($firstImage) : null,
        ];
    }

    public static function absoluteUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        $path = ltrim($path, '/');

        return url('storage/' . $path);
    }
}
