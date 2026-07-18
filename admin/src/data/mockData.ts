// Mock data for the admin panel - all types and sample data

export interface Student {
  id: string
  name: string
  fatherName: string
  motherName: string
  dob: string
  gender: 'Male' | 'Female'
  mobile: string
  email: string
  address: string
  course: string
  courseId: string
  batch: string
  admissionDate: string
  registrationNo: string
  rollNo: string
  status: 'Active' | 'Inactive' | 'Graduated'
  photo?: string
  resultPublished?: boolean
  passed?: boolean
  certificateIssued?: boolean
  percentage?: number
  grade?: string
}

export interface Course {
  id: string
  name: string
  code: string
  category: string
  duration: string
  courseFee: number
  registrationFee: number
  eligibility: string
  description: string
  banner?: string
  image?: string
  pdf?: string
  certificateTemplate?: string
  marksheetTemplate?: string
  status: 'Active' | 'Inactive'
  subjects: Subject[]
}

export interface Subject {
  id: string
  name: string
  courseId: string
  courseName: string
  maxMarks: number
  passingMarks: number
}

export interface Teacher {
  id: string
  name: string
  email: string
  mobile: string
  qualification: string
  specialization: string
  subjects: string[]
  status: 'Active' | 'Inactive'
  joinDate: string
  photo?: string
}

export interface AdmissionRequest {
  id: string
  studentName: string
  email: string
  mobile: string
  course: string
  appliedDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  fatherName: string
  dob: string
  address: string
}

export interface Result {
  id: string
  studentId: string
  studentName: string
  course: string
  subjects: { name: string; marks: number; maxMarks: number; passingMarks: number }[]
  total: number
  maxTotal: number
  percentage: number
  grade: string
  pass: boolean
  publishedDate: string
}

export interface Certificate {
  id: string
  certificateNo: string
  studentId: string
  studentName: string
  course: string
  duration: string
  session: string
  enrollmentNo: string
  rollNo: string
  issueDate: string
  percentage: number
  grade: string
  qrCode: string
  verificationUrl: string
}

export interface GalleryItem {
  id: string
  type: 'image' | 'video'
  title: string
  album: string
  url: string
  thumbnail?: string
  uploadedDate: string
}

export interface Enquiry {
  id: string
  name: string
  email: string
  mobile: string
  subject: string
  message: string
  date: string
  status: 'New' | 'Read' | 'Replied'
}

// =========== MOCK DATA ===========

export const mockStudents: Student[] = [
  { id: 'STU001', name: 'Amit Kumar Sharma', fatherName: 'Rajesh Sharma', motherName: 'Sunita Sharma', dob: '2000-05-15', gender: 'Male', mobile: '9876543210', email: 'amit@example.com', address: '123 Main St, Patna', course: 'ADCA', courseId: 'CRS001', batch: '2024-2025', admissionDate: '2024-01-10', registrationNo: 'REG2024001', rollNo: 'ADCA001', status: 'Active', resultPublished: true, passed: true, certificateIssued: true, percentage: 78.5, grade: 'A' },
  { id: 'STU002', name: 'Priya Singh', fatherName: 'Vijay Singh', motherName: 'Meena Singh', dob: '2001-08-22', gender: 'Female', mobile: '9876543211', email: 'priya@example.com', address: '456 Park Road, Patna', course: 'DCA', courseId: 'CRS002', batch: '2024-2025', admissionDate: '2024-02-15', registrationNo: 'REG2024002', rollNo: 'DCA001', status: 'Active', resultPublished: true, passed: true, certificateIssued: false, percentage: 85.2, grade: 'A+' },
  { id: 'STU003', name: 'Rahul Verma', fatherName: 'Suresh Verma', motherName: 'Kamla Verma', dob: '1999-12-03', gender: 'Male', mobile: '9876543212', email: 'rahul@example.com', address: '789 Lake View, Patna', course: 'ADCA', courseId: 'CRS001', batch: '2024-2025', admissionDate: '2024-03-05', registrationNo: 'REG2024003', rollNo: 'ADCA002', status: 'Active', resultPublished: false },
  { id: 'STU004', name: 'Sneha Gupta', fatherName: 'Anil Gupta', motherName: 'Rekha Gupta', dob: '2002-01-18', gender: 'Female', mobile: '9876543213', email: 'sneha@example.com', address: '321 River Bank, Patna', course: 'Digital Marketing', courseId: 'CRS003', batch: '2024-2025', admissionDate: '2024-04-20', registrationNo: 'REG2024004', rollNo: 'DM001', status: 'Active', resultPublished: true, passed: false, certificateIssued: false, percentage: 35.0, grade: 'F' },
  { id: 'STU005', name: 'Vikram Patel', fatherName: 'Mahesh Patel', motherName: 'Laxmi Patel', dob: '2000-07-10', gender: 'Male', mobile: '9876543214', email: 'vikram@example.com', address: '555 Station Road, Patna', course: 'Tally Prime', courseId: 'CRS004', batch: '2024-2025', admissionDate: '2024-05-12', registrationNo: 'REG2024005', rollNo: 'TLY001', status: 'Graduated', resultPublished: true, passed: true, certificateIssued: true, percentage: 92.0, grade: 'A+' },
  { id: 'STU006', name: 'Neha Kumari', fatherName: 'Dinesh Kumar', motherName: 'Priti Devi', dob: '2001-03-25', gender: 'Female', mobile: '9876543215', email: 'neha@example.com', address: '888 Gandhi Nagar, Patna', course: 'ADCA', courseId: 'CRS001', batch: '2024-2025', admissionDate: '2024-06-01', registrationNo: 'REG2024006', rollNo: 'ADCA003', status: 'Active', resultPublished: true, passed: true, certificateIssued: true, percentage: 71.3, grade: 'B+' },
  { id: 'STU007', name: 'Arjun Mishra', fatherName: 'Ramesh Mishra', motherName: 'Asha Mishra', dob: '1999-09-08', gender: 'Male', mobile: '9876543216', email: 'arjun@example.com', address: '999 Colony Road, Patna', course: 'DCA', courseId: 'CRS002', batch: '2024-2025', admissionDate: '2024-06-15', registrationNo: 'REG2024007', rollNo: 'DCA002', status: 'Active', resultPublished: false },
  { id: 'STU008', name: 'Pooja Rai', fatherName: 'Vinod Rai', motherName: 'Savita Rai', dob: '2002-11-30', gender: 'Female', mobile: '9876543217', email: 'pooja@example.com', address: '111 Ashok Nagar, Patna', course: 'Digital Marketing', courseId: 'CRS003', batch: '2024-2025', admissionDate: '2024-07-10', registrationNo: 'REG2024008', rollNo: 'DM002', status: 'Active', resultPublished: true, passed: true, certificateIssued: false, percentage: 68.5, grade: 'B' },
  { id: 'STU009', name: 'Manish Tiwari', fatherName: 'Kamlesh Tiwari', motherName: 'Geeta Tiwari', dob: '2000-04-14', gender: 'Male', mobile: '9876543218', email: 'manish@example.com', address: '222 Kankarbagh, Patna', course: 'Tally Prime', courseId: 'CRS004', batch: '2024-2025', admissionDate: '2024-08-01', registrationNo: 'REG2024009', rollNo: 'TLY002', status: 'Inactive', resultPublished: true, passed: true, certificateIssued: true, percentage: 55.0, grade: 'C' },
  { id: 'STU010', name: 'Ritu Yadav', fatherName: 'Laloo Yadav', motherName: 'Rabri Devi', dob: '2001-06-20', gender: 'Female', mobile: '9876543219', email: 'ritu@example.com', address: '333 Boring Road, Patna', course: 'ADCA', courseId: 'CRS001', batch: '2024-2025', admissionDate: '2024-09-05', registrationNo: 'REG2024010', rollNo: 'ADCA004', status: 'Active', resultPublished: true, passed: true, certificateIssued: true, percentage: 88.7, grade: 'A+' },
]

export const mockCourses: Course[] = [
  {
    id: 'CRS001', name: 'ADCA', code: 'ADCA', category: 'Computer Applications', duration: '12 Months',
    courseFee: 15000, registrationFee: 500, eligibility: '10th Pass', description: 'Advanced Diploma in Computer Applications - A comprehensive course covering all fundamental and advanced computer skills.',
    status: 'Active',
    subjects: [
      { id: 'SUB001', name: 'Computer Fundamentals', courseId: 'CRS001', courseName: 'ADCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB002', name: 'MS Word', courseId: 'CRS001', courseName: 'ADCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB003', name: 'MS Excel', courseId: 'CRS001', courseName: 'ADCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB004', name: 'PowerPoint', courseId: 'CRS001', courseName: 'ADCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB005', name: 'Internet', courseId: 'CRS001', courseName: 'ADCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB006', name: 'C Programming', courseId: 'CRS001', courseName: 'ADCA', maxMarks: 100, passingMarks: 35 },
    ]
  },
  {
    id: 'CRS002', name: 'DCA', code: 'DCA', category: 'Computer Applications', duration: '6 Months',
    courseFee: 8000, registrationFee: 300, eligibility: '10th Pass', description: 'Diploma in Computer Applications - Learn essential computer skills for office and personal use.',
    status: 'Active',
    subjects: [
      { id: 'SUB007', name: 'Computer Basics', courseId: 'CRS002', courseName: 'DCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB008', name: 'MS Office', courseId: 'CRS002', courseName: 'DCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB009', name: 'Internet', courseId: 'CRS002', courseName: 'DCA', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB010', name: 'Typing', courseId: 'CRS002', courseName: 'DCA', maxMarks: 100, passingMarks: 35 },
    ]
  },
  {
    id: 'CRS003', name: 'Digital Marketing', code: 'DM', category: 'Marketing', duration: '6 Months',
    courseFee: 12000, registrationFee: 500, eligibility: '12th Pass', description: 'Master digital marketing strategies including SEO, social media, and Google Ads.',
    status: 'Active',
    subjects: [
      { id: 'SUB011', name: 'SEO', courseId: 'CRS003', courseName: 'Digital Marketing', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB012', name: 'Google Ads', courseId: 'CRS003', courseName: 'Digital Marketing', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB013', name: 'Meta Ads', courseId: 'CRS003', courseName: 'Digital Marketing', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB014', name: 'WordPress', courseId: 'CRS003', courseName: 'Digital Marketing', maxMarks: 100, passingMarks: 35 },
    ]
  },
  {
    id: 'CRS004', name: 'Tally Prime', code: 'TLY', category: 'Accounting', duration: '3 Months',
    courseFee: 5000, registrationFee: 200, eligibility: '12th Pass', description: 'Learn Tally Prime for professional accounting and GST compliance.',
    status: 'Active',
    subjects: [
      { id: 'SUB015', name: 'Accounting Basics', courseId: 'CRS004', courseName: 'Tally Prime', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB016', name: 'Tally Operations', courseId: 'CRS004', courseName: 'Tally Prime', maxMarks: 100, passingMarks: 35 },
      { id: 'SUB017', name: 'GST in Tally', courseId: 'CRS004', courseName: 'Tally Prime', maxMarks: 100, passingMarks: 35 },
    ]
  },
]

export const mockAdmissions: AdmissionRequest[] = [
  { id: 'ADM001', studentName: 'Ravi Shankar', email: 'ravi@example.com', mobile: '9123456780', course: 'ADCA', appliedDate: '2024-11-01', status: 'Pending', fatherName: 'Birendra Shankar', dob: '2001-02-14', address: '45 MG Road, Patna' },
  { id: 'ADM002', studentName: 'Sita Kumari', email: 'sita@example.com', mobile: '9123456781', course: 'DCA', appliedDate: '2024-11-05', status: 'Pending', fatherName: 'Hari Prasad', dob: '2002-07-20', address: '78 Fraser Road, Patna' },
  { id: 'ADM003', studentName: 'Deepak Kumar', email: 'deepak@example.com', mobile: '9123456782', course: 'Digital Marketing', appliedDate: '2024-11-10', status: 'Approved', fatherName: 'Mohan Kumar', dob: '2000-11-05', address: '90 Bailey Road, Patna' },
  { id: 'ADM004', studentName: 'Anjali Singh', email: 'anjali@example.com', mobile: '9123456783', course: 'Tally Prime', appliedDate: '2024-11-12', status: 'Rejected', fatherName: 'Ram Singh', dob: '2003-03-18', address: '12 Jawahar Lal Nagar, Patna' },
  { id: 'ADM005', studentName: 'Kunal Pandey', email: 'kunal@example.com', mobile: '9123456784', course: 'ADCA', appliedDate: '2024-11-15', status: 'Pending', fatherName: 'Ajay Pandey', dob: '2001-09-25', address: '56 Sri Krishna Puri, Patna' },
]

export const mockTeachers: Teacher[] = [
  { id: 'TCH001', name: 'Dr. Sanjay Kumar', email: 'sanjay@ztech.edu', mobile: '9800000001', qualification: 'M.Tech, PhD', specialization: 'Computer Science', subjects: ['C Programming', 'Computer Fundamentals'], status: 'Active', joinDate: '2020-01-15' },
  { id: 'TCH002', name: 'Mrs. Anita Sharma', email: 'anita@ztech.edu', mobile: '9800000002', qualification: 'MCA', specialization: 'Office Applications', subjects: ['MS Word', 'MS Excel', 'PowerPoint'], status: 'Active', joinDate: '2021-03-10' },
  { id: 'TCH003', name: 'Mr. Prakash Jha', email: 'prakash@ztech.edu', mobile: '9800000003', qualification: 'MBA, Google Certified', specialization: 'Digital Marketing', subjects: ['SEO', 'Google Ads', 'Meta Ads', 'WordPress'], status: 'Active', joinDate: '2022-06-20' },
  { id: 'TCH004', name: 'Mrs. Ritu Verma', email: 'ritu.v@ztech.edu', mobile: '9800000004', qualification: 'B.Com, Tally Certified', specialization: 'Accounting', subjects: ['Accounting Basics', 'Tally Operations', 'GST in Tally'], status: 'Active', joinDate: '2023-01-05' },
  { id: 'TCH005', name: 'Mr. Vivek Singh', email: 'vivek@ztech.edu', mobile: '9800000005', qualification: 'BCA', specialization: 'Networking', subjects: ['Internet', 'Computer Basics'], status: 'Inactive', joinDate: '2021-08-12' },
]

export const mockResults: Result[] = [
  { id: 'RES001', studentId: 'STU001', studentName: 'Amit Kumar Sharma', course: 'ADCA', subjects: [{ name: 'Computer Fundamentals', marks: 78, maxMarks: 100, passingMarks: 35 }, { name: 'MS Word', marks: 82, maxMarks: 100, passingMarks: 35 }, { name: 'MS Excel', marks: 75, maxMarks: 100, passingMarks: 35 }, { name: 'PowerPoint', marks: 80, maxMarks: 100, passingMarks: 35 }, { name: 'Internet', marks: 72, maxMarks: 100, passingMarks: 35 }, { name: 'C Programming', marks: 84, maxMarks: 100, passingMarks: 35 }], total: 471, maxTotal: 600, percentage: 78.5, grade: 'A', pass: true, publishedDate: '2024-12-15' },
  { id: 'RES002', studentId: 'STU002', studentName: 'Priya Singh', course: 'DCA', subjects: [{ name: 'Computer Basics', marks: 88, maxMarks: 100, passingMarks: 35 }, { name: 'MS Office', marks: 90, maxMarks: 100, passingMarks: 35 }, { name: 'Internet', marks: 82, maxMarks: 100, passingMarks: 35 }, { name: 'Typing', marks: 81, maxMarks: 100, passingMarks: 35 }], total: 341, maxTotal: 400, percentage: 85.25, grade: 'A+', pass: true, publishedDate: '2024-12-15' },
]

export const mockCertificates: Certificate[] = [
  { id: 'CRT001', certificateNo: 'ZTECH-2024-001', studentId: 'STU001', studentName: 'Amit Kumar Sharma', course: 'ADCA', duration: '12 Months', session: '2024-2025', enrollmentNo: 'ENR2024001', rollNo: 'ADCA001', issueDate: '2024-12-20', percentage: 78.5, grade: 'A', qrCode: 'QR001', verificationUrl: 'https://ztech.edu/verify/ZTECH-2024-001' },
  { id: 'CRT002', certificateNo: 'ZTECH-2024-002', studentId: 'STU005', studentName: 'Vikram Patel', course: 'Tally Prime', duration: '3 Months', session: '2024-2025', enrollmentNo: 'ENR2024005', rollNo: 'TLY001', issueDate: '2024-12-22', percentage: 92.0, grade: 'A+', qrCode: 'QR002', verificationUrl: 'https://ztech.edu/verify/ZTECH-2024-002' },
  { id: 'CRT003', certificateNo: 'ZTECH-2024-003', studentId: 'STU006', studentName: 'Neha Kumari', course: 'ADCA', duration: '12 Months', session: '2024-2025', enrollmentNo: 'ENR2024006', rollNo: 'ADCA003', issueDate: '2024-12-25', percentage: 71.3, grade: 'B+', qrCode: 'QR003', verificationUrl: 'https://ztech.edu/verify/ZTECH-2024-003' },
  { id: 'CRT004', certificateNo: 'ZTECH-2024-004', studentId: 'STU009', studentName: 'Manish Tiwari', course: 'Tally Prime', duration: '3 Months', session: '2024-2025', enrollmentNo: 'ENR2024009', rollNo: 'TLY002', issueDate: '2024-12-28', percentage: 55.0, grade: 'C', qrCode: 'QR004', verificationUrl: 'https://ztech.edu/verify/ZTECH-2024-004' },
  { id: 'CRT005', certificateNo: 'ZTECH-2024-005', studentId: 'STU010', studentName: 'Ritu Yadav', course: 'ADCA', duration: '12 Months', session: '2024-2025', enrollmentNo: 'ENR2024010', rollNo: 'ADCA004', issueDate: '2025-01-02', percentage: 88.7, grade: 'A+', qrCode: 'QR005', verificationUrl: 'https://ztech.edu/verify/ZTECH-2024-005' },
]

export const mockEnquiries: Enquiry[] = [
  { id: 'ENQ001', name: 'Rahul Mehta', email: 'rahul.mehta@email.com', mobile: '9111111101', subject: 'Course Inquiry - ADCA', message: 'I want to know about ADCA course fees and duration.', date: '2024-11-20', status: 'New' },
  { id: 'ENQ002', name: 'Suman Devi', email: 'suman@email.com', mobile: '9111111102', subject: 'Admission Query', message: 'When is the next batch starting for DCA?', date: '2024-11-19', status: 'Read' },
  { id: 'ENQ003', name: 'Arun Kumar', email: 'arun@email.com', mobile: '9111111103', subject: 'Certificate Verification', message: 'How can I verify my certificate online?', date: '2024-11-18', status: 'Replied' },
  { id: 'ENQ004', name: 'Priya Jaiswal', email: 'priya.j@email.com', mobile: '9111111104', subject: 'Fee Structure', message: 'Please share the fee structure for Digital Marketing course.', date: '2024-11-17', status: 'New' },
  { id: 'ENQ005', name: 'Vikash Thakur', email: 'vikash@email.com', mobile: '9111111105', subject: 'Batch Timing', message: 'What are the batch timings for Tally Prime?', date: '2024-11-16', status: 'New' },
]

export const mockGallery: GalleryItem[] = [
  { id: 'GAL001', type: 'image', title: 'Computer Lab', album: 'Infrastructure', url: '/placeholder.jpg', uploadedDate: '2024-10-15' },
  { id: 'GAL002', type: 'image', title: 'Classroom Session', album: 'Activities', url: '/placeholder.jpg', uploadedDate: '2024-10-20' },
  { id: 'GAL003', type: 'video', title: 'Annual Day 2024', album: 'Events', url: '/placeholder.mp4', uploadedDate: '2024-11-05' },
  { id: 'GAL004', type: 'image', title: 'Practical Training', album: 'Activities', url: '/placeholder.jpg', uploadedDate: '2024-11-10' },
  { id: 'GAL005', type: 'image', title: 'Library', album: 'Infrastructure', url: '/placeholder.jpg', uploadedDate: '2024-11-12' },
]

export const courseCategories = [
  'Computer Applications',
  'Marketing',
  'Accounting',
  'Programming',
  'Design',
  'Other',
]

export const galleryAlbums = [
  'Infrastructure',
  'Activities',
  'Events',
  'Achievements',
  'Students',
]

// Helper functions
export function calculateGrade(percentage: number): { grade: string; pass: boolean } {
  if (percentage >= 90) return { grade: 'A+', pass: true }
  if (percentage >= 80) return { grade: 'A', pass: true }
  if (percentage >= 70) return { grade: 'B+', pass: true }
  if (percentage >= 60) return { grade: 'B', pass: true }
  if (percentage >= 50) return { grade: 'C', pass: true }
  if (percentage >= 35) return { grade: 'D', pass: true }
  return { grade: 'F', pass: false }
}

export function getCourseSubjects(courseId: string): Subject[] {
  const course = mockCourses.find(c => c.id === courseId)
  return course ? course.subjects : []
}

export function getCourseDetails(courseId: string): Course | undefined {
  return mockCourses.find(c => c.id === courseId)
}
