<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\AdmissionRequest;
use App\Models\Certificate;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\Enquiry;
use App\Models\GalleryAlbum;
use App\Models\GalleryItem;
use App\Models\Result;
use App\Models\Setting;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'admin@ztech.edu',
            'password' => Hash::make('admin123'),
            'role' => 'super_admin',
        ]);

        $categories = ['Computer Applications', 'Accounting & Finance', 'Digital Marketing', 'Web Development', 'Graphic Design', 'Office & Productivity'];
        foreach ($categories as $i => $name) {
            CourseCategory::create(['name' => $name, 'sort_order' => $i, 'description' => "Courses related to $name"]);
        }

        Setting::create(['key' => 'institute_name', 'value' => 'Z-TECH Career Academy']);
        Setting::create(['key' => 'institute_email', 'value' => 'ztca2012@gmail.com']);
        Setting::create(['key' => 'institute_phone', 'value' => '92150-52018']);

        $courses = [
            ['title' => 'Advanced Diploma in Computer Applications', 'slug' => 'adca', 'category' => 'Computer Applications', 'fee' => 15000, 'reg_fee' => 500, 'duration' => '12 Months', 'months' => 12, 'level' => 'Advanced', 'featured' => true, 'popular' => true, 'eligibility' => ['10th Pass', '12th Pass']],
            ['title' => 'Diploma in Financial Accounting', 'slug' => 'dfa', 'category' => 'Accounting & Finance', 'fee' => 12000, 'reg_fee' => 500, 'duration' => '6 Months', 'months' => 6, 'level' => 'Intermediate', 'featured' => true, 'popular' => false, 'eligibility' => ['10th Pass']],
            ['title' => 'Digital Marketing Professional', 'slug' => 'digital-marketing', 'category' => 'Digital Marketing', 'fee' => 18000, 'reg_fee' => 700, 'duration' => '6 Months', 'months' => 6, 'level' => 'Intermediate', 'featured' => false, 'popular' => true, 'eligibility' => ['10th Pass', 'Basic Computer Knowledge']],
            ['title' => 'Web Development Masterclass', 'slug' => 'web-development', 'category' => 'Web Development', 'fee' => 25000, 'reg_fee' => 1000, 'duration' => '12 Months', 'months' => 12, 'level' => 'Advanced', 'featured' => true, 'popular' => true, 'eligibility' => ['12th Pass', 'Basic Computer Knowledge']],
            ['title' => 'Graphic Design Essentials', 'slug' => 'graphic-design', 'category' => 'Graphic Design', 'fee' => 14000, 'reg_fee' => 600, 'duration' => '4 Months', 'months' => 4, 'level' => 'Beginner', 'featured' => false, 'popular' => false, 'eligibility' => ['10th Pass']],
            ['title' => 'Microsoft Office Specialist', 'slug' => 'ms-office', 'category' => 'Office & Productivity', 'fee' => 8000, 'reg_fee' => 300, 'duration' => '3 Months', 'months' => 3, 'level' => 'Beginner', 'featured' => false, 'popular' => false, 'eligibility' => ['No Formal Qualification Required']],
        ];

        $subjectNames = [
            'adca' => ['Computer Fundamentals', 'MS Windows', 'MS Word', 'MS Excel', 'MS PowerPoint', 'Tally ERP.9', 'Internet & Email'],
            'dfa' => ['Financial Accounting', 'Tally ERP.9', 'Payroll Management', 'GST & Taxation'],
            'digital-marketing' => ['SEO', 'Social Media Marketing', 'Google Ads', 'Email Marketing', 'Content Marketing'],
            'web-development' => ['HTML & CSS', 'JavaScript', 'PHP & MySQL', 'React', 'Node.js', 'WordPress'],
            'graphic-design' => ['Photoshop', 'Illustrator', 'CorelDRAW', 'Design Principles'],
            'ms-office' => ['MS Word', 'MS Excel', 'MS PowerPoint', 'MS Outlook'],
        ];

        $createdCourses = [];
        foreach ($courses as $i => $courseData) {
            $category = CourseCategory::where('name', $courseData['category'])->first();
            $course = Course::create([
                'title' => $courseData['title'],
                'slug' => $courseData['slug'],
                'subtitle' => "Professional {$courseData['title']} training",
                'short_description' => "Master {$courseData['title']} with hands-on practical training at Z-TECH Career Academy.",
                'long_description' => "This comprehensive {$courseData['title']} program prepares students for real-world careers with practical, project-based learning. Students receive personal attention and industry-relevant skills training from experienced faculty.",
                'duration' => $courseData['duration'],
                'duration_months' => $courseData['months'],
                'course_fee' => $courseData['fee'],
                'registration_fee' => $courseData['reg_fee'],
                'level' => $courseData['level'],
                'eligibility' => $courseData['eligibility'] ?? [],
                'featured' => $courseData['featured'],
                'popular' => $courseData['popular'],
                'active' => true,
                'category_id' => $category?->id,
            ]);

            $courseSubjectIds = [];
            foreach ($subjectNames[$courseData['slug']] ?? [] as $subjectName) {
                $subject = Subject::firstOrCreate(
                    ['name' => $subjectName],
                    ['max_marks' => 100, 'passing_marks' => 33]
                );
                $courseSubjectIds[] = $subject->id;
            }
            $course->subjects()->sync($courseSubjectIds);

            $createdCourses[] = $course;
        }

        // Sample syllabus topics shared per subject (same subject = same syllabus everywhere)
        $sampleTopics = [
            'MS Word' => [
                ['topic' => 'Getting Started with Word', 'description' => 'Interface, document creation and navigation basics.'],
                ['topic' => 'Formatting Documents', 'description' => 'Fonts, paragraphs, styles, headers and footers.'],
                ['topic' => 'Tables & Mail Merge', 'description' => 'Creating tables, merging letters and envelopes.'],
            ],
            'MS Excel' => [
                ['topic' => 'Spreadsheet Basics', 'description' => 'Cells, ranges, worksheets and data entry.'],
                ['topic' => 'Formulas & Functions', 'description' => 'SUM, AVERAGE, COUNT, IF and VLOOKUP.'],
                ['topic' => 'Charts & Printing', 'description' => 'Creating charts, page setup and print preview.'],
            ],
            'Tally ERP.9' => [
                ['topic' => 'Accounting Fundamentals', 'description' => 'Ledgers, vouchers and double-entry accounting.'],
                ['topic' => 'GST & Taxation', 'description' => 'GST invoices, returns and tax computation.'],
            ],
        ];
        foreach ($sampleTopics as $subjectName => $topics) {
            $subject = Subject::where('name', $subjectName)->first();
            if (!$subject) {
                continue;
            }
            foreach ($topics as $i => $t) {
                $subject->syllabusTopics()->create([
                    'topic' => $t['topic'],
                    'description' => $t['description'],
                    'sort_order' => $i,
                ]);
            }
        }

        $studentNames = [
            ['Rahul Sharma', 'male', 'active'],
            ['Priya Verma', 'female', 'active'],
            ['Amit Kumar', 'male', 'active'],
            ['Sneha Gupta', 'female', 'active'],
            ['Rohit Singh', 'male', 'graduated'],
            ['Neha Patel', 'female', 'active'],
            ['Vikram Yadav', 'male', 'graduated'],
            ['Anjali Mishra', 'female', 'active'],
        ];

        $students = [];
        foreach ($studentNames as $i => [$name, $gender, $status]) {
            $course = $createdCourses[$i % count($createdCourses)];
            $seq = str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT);
            $student = Student::create([
                'name' => $name,
                'father_name' => $gender === 'male' ? 'Rajesh Kumar' : 'Suresh Kumar',
                'mother_name' => $gender === 'male' ? 'Sunita Devi' : 'Kavita Devi',
                'date_of_birth' => now()->subYears(20 + $i)->toDateString(),
                'gender' => ucfirst($gender),
                'mobile' => '98' . str_pad((string) (10000000 + $i * 11111), 8, '0', STR_PAD_LEFT),
                'email' => strtolower(str_replace(' ', '.', $name)) . '@gmail.com',
                'address' => 'Street ' . ($i + 1) . ', Civil Lines, Jalandhar',
                'course_id' => $course->id,
                'batch' => '2025-2026',
                'admission_date' => now()->subMonths(6 - $i)->toDateString(),
                'status' => $status === 'graduated' ? 'Graduated' : 'Active',
                'registration_number' => 'REG2025' . $seq,
                'roll_number' => strtoupper($course->slug) . $seq,
            ]);

            if ($status === 'graduated') {
                $subjects = $course->subjects->take(4)->map(fn ($s, $idx) => [
                    'name' => $s->name,
                    'maxMarks' => 100,
                    'marks' => [78, 85, 66, 72, 90, 81][$idx % 6],
                ]);
                $total = $subjects->sum('marks');
                $maxTotal = $subjects->sum('maxMarks');
                $percentage = round(($total / $maxTotal) * 100, 2);
                $result = Result::create([
                    'student_id' => $student->id,
                    'course_id' => $course->id,
                    'total_obtained_marks' => $total,
                    'total_max_marks' => $maxTotal,
                    'percentage' => $percentage,
                    'grade' => $percentage >= 75 ? 'A+' : ($percentage >= 60 ? 'A' : 'B'),
                    'result_status' => $percentage >= 75 ? 'DISTINCTION' : 'PASS',
                    'issue_date' => now()->subMonths(2)->toDateString(),
                ]);
                foreach ($subjects as $subject) {
                    $result->subjectMarks()->create([
                        'subject_name' => $subject['name'],
                        'max_marks' => $subject['maxMarks'],
                        'obtained_marks' => $subject['marks'],
                        'passing_marks' => 33,
                    ]);
                }

                Certificate::create([
                    'certificate_no' => 'ZTECH-2026-' . str_pad((string) ($i + 1), 3, '0', STR_PAD_LEFT),
                    'serial_no' => '2025' . str_pad((string) ($i + 1), 4, '0', STR_PAD_LEFT),
                    'enrollment_no' => $student->registration_number,
                    'session' => $student->batch,
                    'institute_code' => 'Z-TECH Career Academy',
                    'valid_until' => 'Lifetime',
                    'is_verified' => true,
                    'qr_code_data' => url('/verify/' . $student->roll_number),
                    'student_id' => $student->id,
                    'result_id' => $result->id,
                ]);
            }

            $students[] = $student;
        }

        AdmissionRequest::create(['student_name' => 'Karan Malhotra', 'father_name' => 'Rajesh Malhotra', 'mobile' => '9812345678', 'email' => 'karan@gmail.com', 'course_id' => $createdCourses[0]->id, 'batch' => '2026-2027', 'applied_date' => now()->subDays(2)->toDateString(), 'status' => 'Pending']);
        AdmissionRequest::create(['student_name' => 'Pooja Nair', 'mobile' => '9876543210', 'email' => 'pooja@gmail.com', 'course_id' => $createdCourses[2]->id, 'batch' => '2026-2027', 'applied_date' => now()->subDay()->toDateString(), 'status' => 'Pending']);
        AdmissionRequest::create(['student_name' => 'Arjun Kapoor', 'mobile' => '9988776655', 'course_id' => $createdCourses[3]->id, 'batch' => '2025-2026', 'applied_date' => now()->subWeeks(2)->toDateString(), 'status' => 'Approved']);

        Enquiry::create(['name' => 'Harpreet Singh', 'email' => 'harpreet@gmail.com', 'phone' => '9911223344', 'subject' => 'Course fee details', 'message' => 'Please share fee structure for ADCA course.', 'status' => 'New']);
        Enquiry::create(['name' => 'Simran Kaur', 'email' => 'simran@gmail.com', 'phone' => '9877665544', 'subject' => 'Batch timings', 'message' => 'What are the morning batch timings for Digital Marketing?', 'status' => 'New']);

        $album = GalleryAlbum::create(['name' => 'Campus', 'description' => 'Campus photos']);
        GalleryItem::create(['file_url' => 'gallery/campus-1.jpg', 'file_type' => 'image', 'title' => 'Main Building', 'album_id' => $album->id]);
        GalleryItem::create(['file_url' => 'gallery/campus-2.jpg', 'file_type' => 'image', 'title' => 'Computer Lab', 'album_id' => $album->id]);
    }
}
