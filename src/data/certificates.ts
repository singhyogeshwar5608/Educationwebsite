// ============================================================
// Certificate Data — Z-TECH CAREER ACADEMY
// ============================================================

export interface CertificateData {
  certificateNo: string;
  serialNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  rollNumber: string;
  enrollmentNo: string;
  courseName: string;
  courseDuration: string;
  courseDurationFrom: string;
  courseDurationTo: string;
  batchYear: string;
  grade: string;
  percentage: string;
  resultStatus: "PASS" | "DISTINCTION";
  issueDate: string;
  validUntil: string;
  photo: string;
  qrCodeData: string;
  isVerified: boolean;
  instituteName: string;
  instituteCode: string;
  session: string;
}

export const certificates: CertificateData[] = [
  {
    certificateNo: "ZTCA/ADCA/2024/001",
    serialNo: "2023033",
    studentName: "Rahul Sharma",
    fatherName: "Raj Kumar Sharma",
    motherName: "Sunita Sharma",
    dob: "15-08-2001",
    rollNumber: "8031",
    enrollmentNo: "ZTCA/S/198030",
    courseName: "ADCA - Advanced Diploma in Computer Application",
    courseDuration: "12 Months",
    courseDurationFrom: "May 2024",
    courseDurationTo: "Apr 2025",
    batchYear: "2024-2025",
    grade: "A+",
    percentage: "86.00%",
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_1.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/ADCA/2024/001",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
  {
    certificateNo: "ZTCA/DCA/2024/002",
    serialNo: "2023034",
    studentName: "Priya Verma",
    fatherName: "Suresh Verma",
    motherName: "Kamla Verma",
    dob: "22-03-2002",
    rollNumber: "8032",
    enrollmentNo: "ZTCA/S/198031",
    courseName: "DCA - Diploma in Computer Application",
    courseDuration: "6 Months",
    courseDurationFrom: "May 2024",
    courseDurationTo: "Oct 2024",
    batchYear: "2024-2025",
    grade: "A",
    percentage: "86.80%",
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_1.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/DCA/2024/002",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
  {
    certificateNo: "ZTCA/TALLY/2024/003",
    serialNo: "2023035",
    studentName: "Amit Kumar",
    fatherName: "Harish Kumar",
    motherName: "Saroj Devi",
    dob: "10-11-2000",
    rollNumber: "8033",
    enrollmentNo: "ZTCA/S/198032",
    courseName: "Tally Prime - Accounting with Tally Prime",
    courseDuration: "3 Months",
    courseDurationFrom: "Aug 2024",
    courseDurationTo: "Oct 2024",
    batchYear: "2024-2025",
    grade: "B",
    percentage: "78.75%",
    resultStatus: "DISTINCTION",
    issueDate: "2025-02-20",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_2.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/TALLY/2024/003",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
  {
    certificateNo: "ZTCA/DM/2024/004",
    serialNo: "2023036",
    studentName: "Sneha Patil",
    fatherName: "Dinesh Patil",
    motherName: "Meera Patil",
    dob: "05-07-2003",
    rollNumber: "8034",
    enrollmentNo: "ZTCA/S/198033",
    courseName: "Digital Marketing",
    courseDuration: "6 Months",
    courseDurationFrom: "May 2024",
    courseDurationTo: "Oct 2024",
    batchYear: "2024-2025",
    grade: "A+",
    percentage: "89.67%",
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_2.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/DM/2024/004",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
  {
    certificateNo: "ZTCA/WD/2024/005",
    serialNo: "2023037",
    studentName: "Vikram Singh",
    fatherName: "Balwinder Singh",
    motherName: "Harpreet Kaur",
    dob: "18-12-2001",
    rollNumber: "8035",
    enrollmentNo: "ZTCA/S/198034",
    courseName: "Web Development",
    courseDuration: "6 Months",
    courseDurationFrom: "Jun 2024",
    courseDurationTo: "Nov 2024",
    batchYear: "2024-2025",
    grade: "B",
    percentage: "77.17%",
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_3.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/WD/2024/005",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
  {
    certificateNo: "ZTCA/GD/2024/006",
    serialNo: "2023038",
    studentName: "Anjali Gupta",
    fatherName: "Pradeep Gupta",
    motherName: "Rekha Gupta",
    dob: "30-01-2002",
    rollNumber: "8036",
    enrollmentNo: "ZTCA/S/198035",
    courseName: "Graphic Design",
    courseDuration: "6 Months",
    courseDurationFrom: "May 2024",
    courseDurationTo: "Oct 2024",
    batchYear: "2024-2025",
    grade: "A+",
    percentage: "89.80%",
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_3.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/GD/2024/006",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
  {
    certificateNo: "ZTCA/ADCA/2024/007",
    serialNo: "2023039",
    studentName: "Rohan Mehta",
    fatherName: "Sanjay Mehta",
    motherName: "Pooja Mehta",
    dob: "14-09-2001",
    rollNumber: "8037",
    enrollmentNo: "ZTCA/S/198036",
    courseName: "ADCA - Advanced Diploma in Computer Application",
    courseDuration: "12 Months",
    courseDurationFrom: "May 2024",
    courseDurationTo: "Apr 2025",
    batchYear: "2024-2025",
    grade: "C",
    percentage: "61.33%",
    resultStatus: "PASS",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_4.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/ADCA/2024/007",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
  {
    certificateNo: "ZTCA/TALLY/2024/009",
    serialNo: "2023040",
    studentName: "Deepak Yadav",
    fatherName: "Om Prakash Yadav",
    motherName: "Savitri Devi",
    dob: "25-04-2000",
    rollNumber: "8038",
    enrollmentNo: "ZTCA/S/198037",
    courseName: "Tally Prime - Accounting with Tally Prime",
    courseDuration: "3 Months",
    courseDurationFrom: "Nov 2024",
    courseDurationTo: "Jan 2025",
    batchYear: "2024-2025",
    grade: "A+",
    percentage: "91.25%",
    resultStatus: "DISTINCTION",
    issueDate: "2025-01-10",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_5.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/TALLY/2024/009",
    isVerified: true,
    instituteName: "Z-TECH CAREER ACADEMY",
    instituteCode: "ZTCA/ktl/001",
    session: "2024-2025",
  },
];

/**
 * Find a certificate by certificate number.
 * Supports case-insensitive partial match.
 */
export function findCertificateByNo(certNo: string): CertificateData | null {
  const normalized = certNo.trim().toUpperCase();
  return (
    certificates.find(
      (c) => c.certificateNo.toUpperCase() === normalized
    ) ?? null
  );
}
