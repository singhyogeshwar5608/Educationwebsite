// API Service Layer — Real Laravel API integration
// Each function calls the corresponding backend endpoint

import { coursesService } from '@/services/courses.service';
import { studentsService, admissionsService } from '@/services/students.service';
import { resultsService, certificatesService } from '@/services/results.service';
import { galleryService, settingsService } from '@/services/gallery.service';
import { enquiriesService } from '@/services/enquiries.service';
import { dashboardService } from '@/services/dashboard.service';
import { authService } from '@/services/auth.service';

export const getCourseDetails = (courseId: string) =>
  coursesService.show(Number(courseId)).then(c => ({
    ...c,
    name: c.name,
    code: c.code || '',
    courseFee: Number(c.courseFee ?? 0),
    registrationFee: Number(c.registrationFee ?? 0),
    eligibility: (c as any).eligibility?.[0] || '',
  }));

export const courseCategories = [
  'All Courses', 'Computer Applications', 'Accounting & Finance',
  'Digital Marketing', 'Web Development', 'Graphic Design', 'Office & Productivity',
];

export const galleryAlbums = ['Campus', 'Events', 'Classroom', 'Activities', 'Graduation'];
export const mockGallery: any[] = [];

// ─── Types ────────────────────────────────────────────

export interface Student {
  id: string; name: string; fatherName: string; motherName: string;
  dob: string; gender: 'Male' | 'Female'; mobile: string; email: string;
  address: string; course: string; courseId: string; batch: string;
  admissionDate: string; registrationNo: string; rollNo: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  photo?: string; aadhaarCard?: string; matricDmc?: string;
  resultPublished?: boolean; passed?: boolean;
  certificateIssued?: boolean; percentage?: number; grade?: string;
  results?: StudentResult | null;
  certificate?: StudentCertificate | null;
}

export interface StudentResult {
  id: string;
  subjects: { name: string; marks: number; maxMarks: number; passingMarks: number }[];
  total: number; maxTotal: number; percentage: number;
  grade: string; pass: boolean; publishedDate: string;
}

export interface StudentCertificate {
  id: string; certificateNo: string; issueDate: string;
  verificationUrl: string | null; grade?: string | null; percentage?: number | null;
}

export interface Course {
  id: string; name: string; code: string; subtitle?: string; category: string; category_id?: number | string;
  duration: string; courseFee: number; registrationFee: number;
  level?: string; eligibility: string; description: string;
  pdf?: string; certificateTemplate?: string; marksheetTemplate?: string;
  status: 'Active' | 'Inactive'; featured?: boolean; subjects: Subject[];
  thumbnail?: string | null;
}

export interface Subject {
  id: string; name: string; maxMarks: number; passingMarks: number;
  courses?: { id: string; name: string }[];
}

export interface Teacher {
  id: string; name: string; email: string; mobile: string;
  qualification: string; specialization: string; subjects: string[];
  status: 'Active' | 'Inactive'; joinDate: string; photo?: string;
}

export interface AdmissionRequest {
  id: string; studentName: string; email: string; mobile: string;
  course: string; courseId?: string | null; appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  fatherName: string; motherName?: string | null; dob: string; gender?: string | null;
  address: string; batch?: string | null;
  photo?: string; aadhaarCard?: string; matricDmc?: string;
}

export interface Result {
  id: string; studentId: string; studentName: string; course: string;
  rollNo?: string;
  subjects: { name: string; marks: number; maxMarks: number; passingMarks: number; theoryMaxMarks?: number; theoryMarks?: number; practicalMaxMarks?: number; practicalMarks?: number }[];
  total: number; maxTotal: number; percentage: number;
  grade: string; pass: boolean; publishedDate: string;
}

export interface Certificate {
  id: string; certificateNo: string; studentId: string; studentName: string;
  course: string; duration: string; session: string; enrollmentNo: string;
  rollNo: string; issueDate: string; percentage: number; grade: string;
  qrCode: string; verificationUrl: string;
}

export interface GalleryItem {
  id: string; type: 'image' | 'video'; title: string; album: string;
  url: string; thumbnail?: string; uploadedDate: string;
}

export interface Enquiry {
  id: string; name: string; email: string; mobile: string; phone: string;
  subject: string; message: string; date: string;
  status: string;
}

// ─── Re-export all API functions ─────────────────────

export const loginAdmin = (email: string, password: string) =>
  authService.login(email, password);

export const getDashboardStats = () => dashboardService.stats();
export const getEnrollmentData = () => dashboardService.enrollmentTrend();
export const getCourseDistribution = () => dashboardService.courseDistribution();
export const getRecentAdmissions = () => dashboardService.recentAdmissions();

export const getStudents = (params?: any) => studentsService.list(params);
export const getStudentById = (id: number) => studentsService.show(id);
export const createStudent = (data: any) => studentsService.create(data);
export const updateStudent = (id: number, data: any) => studentsService.update(id, data);
export const deleteStudent = (id: number) => studentsService.delete(id);

export const getAdmissions = (params?: any) => admissionsService.list(params);
export const updateAdmissionStatus = (id: number, status: string) =>
  admissionsService.updateStatus(id, status);

export const getCourses = (params?: any) => coursesService.list(params);
export const getCourseById = (id: number) => coursesService.show(id);
export const getCourseSubjects = (courseId: string | number) => coursesService.subjects.list(Number(courseId) || undefined);

export const getResults = (params?: any) => resultsService.list(params);
export const getResultsByStudent = (studentId: number) =>
  resultsService.list({ student_id: studentId });
export const publishResult = (data: any) => resultsService.create(data);

export const getCertificates = (params?: any) => certificatesService.list(params);
export const issueCertificate = (data: any) => certificatesService.issue(data);

export const getEnquiries = (params?: any) => enquiriesService.list(params);
export const updateEnquiryStatus = (id: number, status: string) =>
  enquiriesService.updateStatus(id, status);

export const getGallery = (params?: any) => galleryService.list(params);

export const calculateGrade = (percentage: number): { grade: string; pass: boolean } => {
  const grade: string = percentage >= 75 ? 'A+' : percentage >= 60 ? 'A' : percentage >= 50 ? 'B' : percentage >= 40 ? 'C' : percentage >= 33 ? 'D' : 'F';
  const pass = percentage >= 33;
  return { grade, pass };
};

// ─── Keep mock data for backward compat until full integration ───
import { mockStudents, mockCourses, mockAdmissions, mockCertificates, mockResults, mockTeachers } from './mock-data';
export { mockStudents, mockCourses, mockAdmissions, mockCertificates, mockResults, mockTeachers };
