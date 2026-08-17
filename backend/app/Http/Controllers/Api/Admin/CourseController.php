<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\CourseGallery;
use App\Models\Subject;
use App\Support\Presenters;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Course::query()
            ->with(['category', 'subjects'])
            ->withCount('students')
            ->addSelect([
                // Efficient single-image thumbnail (first gallery image) — no full gallery load.
                'first_gallery_image' => CourseGallery::query()
                    ->select('image_url')
                    ->whereColumn('course_gallery.course_id', 'courses.id')
                    ->orderBy('id')
                    ->limit(1),
            ]);

        if ($request->filled('search')) {
            $query->where(fn ($q) => $q
                ->where('title', 'like', "%{$request->search}%")
                ->orWhere('slug', 'like', "%{$request->search}%"));
        }

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('name', $request->category));
        }

        if ($request->filled('status')) {
            $query->where('active', $request->status === 'Active');
        }

        if ($request->filled('featured')) {
            $query->where('featured', filter_var($request->featured, FILTER_VALIDATE_BOOL));
        }

        if ($request->filled('popular')) {
            $query->where('popular', filter_var($request->popular, FILTER_VALIDATE_BOOL));
        }

        $courses = $query->orderBy('title')->get();

        return response()->json($courses->map(fn (Course $c) => Presenters::adminCourse($c)));
    }

    public function show(Course $course): JsonResponse
    {
        $course->load(['category', 'subjects.syllabusTopics', 'gallery']);

        return response()->json($this->courseWithGallery($course));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateCourse($request);

        $course = Course::create($this->coursePayload($validated, null));

        $this->syncNested($course, $validated);
        $this->syncGallery($course, $request);

        return response()->json($this->courseWithGallery($course->load(['category', 'subjects', 'gallery'])), 201);
    }

    public function update(Request $request, Course $course): JsonResponse
    {
        $validated = $this->validateCourse($request, $course);

        $course->update($this->coursePayload($validated, $course));

        $this->syncNested($course, $validated);
        $this->syncGallery($course, $request);

        return response()->json($this->courseWithGallery($course->load(['category', 'subjects', 'gallery'])));
    }

    public function destroy(Course $course): JsonResponse
    {
        // Students.course_id is NOT NULL with restrictOnDelete(), so MySQL blocks
        // deleting a course that still has enrolled students. Refuse the delete with
        // a clear message instead of letting the raw SQLSTATE error surface.
        $enrolled = $course->students()->count();
        if ($enrolled > 0) {
            return response()->json([
                'message' => "Cannot delete this course — {$enrolled} student(s) are enrolled in it. Move or delete those students first, or deactivate the course instead.",
            ], 409);
        }

        // Remove physical gallery image files BEFORE the course delete —
        // the course_gallery rows are removed by the DB cascade, but the
        // actual files in storage/app/public/course-gallery would otherwise
        // be left behind as orphans.
        foreach ($course->gallery as $image) {
            if ($image->image_url && Storage::disk('public')->exists($image->image_url)) {
                Storage::disk('public')->delete($image->image_url);
            }
        }

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully']);
    }

    private function validateCourse(Request $request, ?Course $course = null): array
    {
        // FormData (multipart) sends nested fields as JSON strings — decode before validation.
        foreach (['eligibility', 'subjectSyllabus'] as $jsonField) {
            if ($request->has($jsonField) && is_string($request->input($jsonField))) {
                $decoded = json_decode($request->input($jsonField), true);
                $request->merge([$jsonField => is_array($decoded) ? $decoded : []]);
            }
        }

        // Normalize boolean-ish fields so any representation (true/false/1/0/on/off,
        // or even empty/undefined) passes the 'boolean' rule without error.
        foreach (['featured', 'popular'] as $boolField) {
            if ($request->has($boolField)) {
                $parsed = filter_var($request->input($boolField), FILTER_VALIDATE_BOOL, FILTER_NULL_ON_FAILURE);
                $request->merge([$boolField => $parsed === null ? false : $parsed]);
            }
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255', Rule::unique('courses', 'code')->ignore($course?->id)],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:course_categories,id'],
            'duration' => ['nullable', 'string', 'max:255'],
            'durationMonths' => ['nullable', 'integer', 'min:1'],
            'courseFee' => ['nullable', 'numeric', 'min:0'],
            'registrationFee' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'longDescription' => ['nullable', 'string'],
            'status' => ['nullable', Rule::in(['Active', 'Inactive'])],
            'featured' => ['nullable', 'boolean'],
            'popular' => ['nullable', 'boolean'],
            'level' => ['nullable', 'string', 'max:255'],
            'eligibility' => ['nullable', 'array'],
            'subjects' => ['nullable', 'array'],
            'subjects.*' => ['integer', 'exists:subjects,id'],
            'subjectSyllabus' => ['nullable', 'array'],
            'galleryFiles' => ['nullable', 'array'],
            'galleryFiles.*' => ['image', 'mimes:jpeg,jpg,png,webp', 'max:5120'],
            'galleryCaptions' => ['nullable', 'array'],
            'galleryCaptions.*' => ['nullable', 'string', 'max:255'],
            'galleryDeletedIds' => ['nullable', 'array'],
            'galleryDeletedIds.*' => ['integer', 'exists:course_gallery,id'],
        ]);

        return $data;
    }

    private function coursePayload(array $data, ?Course $course = null): array
    {
        $categoryId = $data['category_id'] ?? null;

        if (!$categoryId && !empty($data['category'])) {
            $category = CourseCategory::where('name', $data['category'])->first();
            $categoryId = $category?->id;
        }

        $payload = [
            'title' => $data['name'],
            'code' => $data['code'],
            // Slug is derived from the code but must stay URL-safe, so special
            // characters (e.g. "#") are stripped and digits kept (e.g. "ADCA-01#" → "adca-01").
            'slug' => $this->uniqueSlug($data['code'] ?? $data['name'], $course),
            'subtitle' => $data['subtitle'] ?? null,
            'category_id' => $categoryId,
            'duration' => $data['duration'] ?? null,
            'duration_months' => $data['durationMonths'] ?? null,
            'course_fee' => $data['courseFee'] ?? 0,
            'registration_fee' => $data['registrationFee'] ?? 0,
            'short_description' => $data['description'] ?? null,
            'long_description' => $data['longDescription'] ?? null,
            'eligibility' => $data['eligibility'] ?? [],
        ];

        // Featured/Popular/Level handling — same pattern as Status below:
        // new courses get defaults; edits keep the existing database value
        // unless the field is explicitly provided in the request.
        if (array_key_exists('featured', $data)) {
            $payload['featured'] = filter_var($data['featured'], FILTER_VALIDATE_BOOL);
        } elseif (($course === null)) {
            $payload['featured'] = false;
        }

        if (array_key_exists('popular', $data)) {
            $payload['popular'] = filter_var($data['popular'], FILTER_VALIDATE_BOOL);
        } elseif (($course === null)) {
            $payload['popular'] = false;
        }

        if (array_key_exists('level', $data)) {
            $payload['level'] = $data['level'] ?? 'Beginner';
        } elseif (($course === null)) {
            $payload['level'] = 'Beginner';
        }

        // Status handling: new courses default to Active; edits keep the existing value
        // unless a status is explicitly provided in the request.
        if (array_key_exists('status', $data)) {
            $payload['active'] = ($data['status'] ?? 'Active') === 'Active';
        } elseif (($course === null)) {
            $payload['active'] = true;
        }

        return $payload;
    }

    /**
     * Build a URL-safe slug from a code that may contain special characters
     * (e.g. "ADCA-01#" → "adca-01"). Ensures the slug is unique in the table,
     * appending a numeric suffix if needed — codes like "ADCA-01#" and "ADCA-01!"
     * both slugify to "adca-01", so this keeps the slug column collision-free.
     */
    private function uniqueSlug(string $code, ?Course $ignore = null): string
    {
        $base = Str::slug($code) ?: Str::slug('course');
        $slug = $base;
        $i = 2;
        while (Course::where('slug', $slug)
            ->when($ignore, fn ($q) => $q->where('id', '!=', $ignore->id))
            ->exists()) {
            $slug = $base . '-' . $i;
            $i++;
        }
        return $slug;
    }

    private function syncNested(Course $course, array $data): void
    {
        if (array_key_exists('subjects', $data)) {
            $course->subjects()->sync($data['subjects'] ?? []);
        }

        if (isset($data['subjectSyllabus']) && is_array($data['subjectSyllabus'])) {
            foreach ($data['subjectSyllabus'] as $subjectId => $topics) {
                if (!is_numeric($subjectId) || !is_array($topics)) {
                    continue;
                }
                $subject = Subject::find((int) $subjectId);
                if (!$subject) {
                    continue;
                }
                $subject->syllabusTopics()->delete();
                foreach (array_values($topics) as $i => $topic) {
                    if (empty($topic['topic'])) {
                        continue;
                    }
                    $subject->syllabusTopics()->create([
                        'topic' => $topic['topic'],
                        'description' => $topic['description'] ?? null,
                        'sort_order' => $i,
                    ]);
                }
            }
        }
    }

    private function courseWithGallery(Course $course): array
    {
        $data = Presenters::adminCourse($course);
        $data['gallery'] = $course->gallery->map(function ($img) {
            return ['id' => (string) $img->id, 'image_url' => Presenters::absoluteUrl($img->image_url), 'caption' => $img->caption];
        })->values();

        return $data;
    }

    private function syncGallery(Course $course, Request $request): void
    {
        // 1. Delete images the admin removed (row + physical file).
        if ($request->filled('galleryDeletedIds')) {
            $ids = collect($request->input('galleryDeletedIds'))->map(fn ($id) => (int) $id)->all();
            $removed = $course->gallery()->whereIn('id', $ids)->get();
            foreach ($removed as $image) {
                Storage::disk('public')->delete($image->image_url);
                $image->delete();
            }
        }

        // 2. Enforce max 5 images per course (existing remaining + new uploads).
        $newFiles = $request->file('galleryFiles') ?? [];
        if (count($newFiles) > 0) {
            $remainingCount = $course->gallery()->count();
            if ($remainingCount + count($newFiles) > 5) {
                throw ValidationException::withMessages([
                    'galleryFiles' => "Maximum 5 images allowed. This course already has {$remainingCount} image(s).",
                ]);
            }
        }

        // 3. Store newly uploaded images in storage/app/public/course-gallery/.
        $captions = $request->input('galleryCaptions') ?? [];
        foreach (array_values($newFiles) as $i => $file) {
            $path = $this->storeCompressedGalleryImage($file);
            $course->gallery()->create([
                'image_url' => $path,
                'caption' => $captions[$i] ?? null,
            ]);
        }
    }

    /**
     * Compress/resize a freshly uploaded gallery image before saving it to disk.
     * Keeps the original format, caps the max dimension at 1200px and applies
     * ~80% quality. Falls back to the raw file if the GD/Imagick driver is
     * unavailable (e.g. missing PHP extension) so uploads never break.
     */
    private function storeCompressedGalleryImage(UploadedFile $file): string
    {
        $mime = $file->getMimeType() ?: 'image/jpeg';
        $ext = str_contains($mime, 'png') ? 'png' : (str_contains($mime, 'webp') ? 'webp' : 'jpg');

        try {
            $driver = extension_loaded('imagick') ? new ImagickDriver() : new GdDriver();
            $manager = new ImageManager($driver);

            $image = $manager->read($file->getRealPath());
            $image->scaleDown(1200, 1200);

            $encoded = match (true) {
                str_contains($mime, 'png') => $image->toPng(),
                str_contains($mime, 'webp') => $image->toWebp(80),
                default => $image->toJpeg(80),
            };

            $path = 'course-gallery/' . Str::random(20) . '.' . $ext;
            Storage::disk('public')->put($path, $encoded->toString());

            return $path;
        } catch (\Throwable $e) {
            // Driver missing or processing failed — store the original file instead,
            // but log the real reason so it can be diagnosed.
            Log::warning('Gallery image compression failed, storing original file.', [
                'error' => $e->getMessage(),
                'mime' => $mime,
            ]);
            return $file->store('course-gallery', 'public');
        }
    }
}

