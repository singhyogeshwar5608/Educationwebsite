# Laravel Backend Implementation Plan — Z-TECH Career Academy

## Stack
- Laravel 12 + MySQL + Sanctum
- React frontend (unchanged)

---

## Phase 1 — Project Setup + Auth + Database

### Files to create
```
backend/
├── .env
├── composer.json
├── config/sanctum.php
├── config/cors.php
├── database/migrations/
│   ├── 0001_create_admins_table.php
│   ├── 0002_create_course_categories_table.php
│   ├── 0003_create_courses_table.php
│   ├── 0004_create_subjects_table.php
│   ├── 0005_create_course_syllabus_modules_table.php
│   ├── 0006_create_course_syllabus_topics_table.php
│   ├── 0007_create_course_career_opportunities_table.php
│   ├── 0008_create_course_faqs_table.php
│   ├── 0009_create_course_gallery_table.php
│   ├── 0010_create_students_table.php
│   ├── 0011_create_admission_requests_table.php
│   ├── 0012_create_results_table.php
│   ├── 0013_create_result_subject_marks_table.php
│   ├── 0014_create_certificates_table.php
│   ├── 0015_create_gallery_albums_table.php
│   ├── 0016_create_gallery_items_table.php
│   ├── 0017_create_enquiries_table.php
│   ├── 0018_create_settings_table.php
│   ├── 0019_create_personal_access_tokens_table.php (Sanctum)
├── app/Models/
│   ├── Admin.php
│   ├── Course.php
│   ├── CourseCategory.php
│   ├── Subject.php
│   ├── CourseSyllabusModule.php
│   ├── CourseCareerOpportunity.php
│   ├── CourseFaq.php
│   ├── CourseGallery.php
│   ├── Student.php
│   ├── AdmissionRequest.php
│   ├── Result.php
│   ├── ResultSubjectMark.php
│   ├── Certificate.php
│   ├── GalleryAlbum.php
│   ├── GalleryItem.php
│   ├── Enquiry.php
│   └── Setting.php
├── app/Http/Controllers/Api/
│   ├── AuthController.php
│   └── (to be added per phase)
├── app/Http/Requests/
│   └── (to be added per phase)
├── app/Policies/
│   └── (to be added per phase)
├── routes/api.php
└── storage/app/public/ (uploads)
```

---

## Phase 2 — Public APIs (Courses, Results, Certificates, Contact)

### Endpoints
```
GET  /api/courses                — List with filters
GET  /api/courses/:slug          — Full course detail
GET  /api/results/search         — ?roll_number=
GET  /api/certificates/verify    — ?cert_no=
POST /api/enquiries              — Contact form
GET  /api/gallery                — Public gallery
```

---

## Phase 3 — Admin Auth + Dashboard

### Endpoints
```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
GET    /api/admin/auth/user
PUT    /api/admin/auth/password
GET    /api/admin/dashboard/stats
GET    /api/admin/dashboard/enrollment-trend
GET    /api/admin/dashboard/course-distribution
```

---

## Phase 4 — Admin CRUD (Full)

### Endpoints
```
GET|POST|PUT|DELETE  /api/admin/courses
GET|POST|PUT|DELETE  /api/admin/course-categories
GET|POST|PUT|DELETE  /api/admin/subjects
GET|POST|PUT|DELETE  /api/admin/students
GET|POST|PUT|DELETE  /api/admin/admissions
GET|POST|PUT|DELETE  /api/admin/results
GET|POST|PUT|DELETE  /api/admin/certificates
GET|POST|PUT|DELETE  /api/admin/gallery
GET|PUT              /api/admin/enquiries
GET|PUT              /api/admin/settings
POST                 /api/admin/system/backup
POST                 /api/admin/system/cache-clear
POST                 /api/upload
```

---

## Phase 5 — Frontend Integration

- Update admin `services/api.ts` to call real Laravel endpoints
- Update public pages to call real API
- Remove mock data
- Replace `setTimeout` with real async calls
- Add axios interceptors for auth token
