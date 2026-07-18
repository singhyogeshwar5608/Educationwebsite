// ============================================================
// Certificate Data — Z-TECH CAREER ACADEMY
// ============================================================

export interface CertificateData {
  certificateNo: string;
  studentName: string;
  fatherName: string;
  rollNumber: string;
  courseName: string;
  courseDuration: string;
  batchYear: string;
  grade: string;
  percentage: number;
  resultStatus: "PASS" | "DISTINCTION";
  issueDate: string;
  validUntil: string;
  photo: string;
  qrCodeData: string;
  isVerified: boolean;
}

export const certificates: CertificateData[] = [
  {
    certificateNo: "ZTCA/ADCA/2024/001",
    studentName: "Rahul Sharma",
    fatherName: "Raj Kumar Sharma",
    rollNumber: "ZTCA-2024-001",
    courseName: "ADCA - Advanced Diploma in Computer Application",
    courseDuration: "12 Months",
    batchYear: "2024-25",
    grade: "A+",
    percentage: 86,
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_1.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/ADCA/2024/001",
    isVerified: true,
  },
  {
    certificateNo: "ZTCA/DCA/2024/002",
    studentName: "Priya Verma",
    fatherName: "Suresh Verma",
    rollNumber: "ZTCA-2024-002",
    courseName: "DCA - Diploma in Computer Application",
    courseDuration: "6 Months",
    batchYear: "2024-25",
    grade: "A",
    percentage: 86.8,
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_1.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/DCA/2024/002",
    isVerified: true,
  },
  {
    certificateNo: "ZTCA/TALLY/2024/003",
    studentName: "Amit Kumar",
    fatherName: "Harish Kumar",
    rollNumber: "ZTCA-2024-003",
    courseName: "Tally Prime - Accounting with Tally Prime",
    courseDuration: "3 Months",
    batchYear: "2024-25",
    grade: "B",
    percentage: 78.75,
    resultStatus: "DISTINCTION",
    issueDate: "2025-02-20",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_2.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/TALLY/2024/003",
    isVerified: true,
  },
  {
    certificateNo: "ZTCA/DM/2024/004",
    studentName: "Sneha Patil",
    fatherName: "Dinesh Patil",
    rollNumber: "ZTCA-2024-004",
    courseName: "Digital Marketing",
    courseDuration: "6 Months",
    batchYear: "2024-25",
    grade: "A+",
    percentage: 89.67,
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_2.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/DM/2024/004",
    isVerified: true,
  },
  {
    certificateNo: "ZTCA/WD/2024/005",
    studentName: "Vikram Singh",
    fatherName: "Balwinder Singh",
    rollNumber: "ZTCA-2024-005",
    courseName: "Web Development",
    courseDuration: "6 Months",
    batchYear: "2024-25",
    grade: "B",
    percentage: 77.17,
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_3.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/WD/2024/005",
    isVerified: true,
  },
  {
    certificateNo: "ZTCA/GD/2024/006",
    studentName: "Anjali Gupta",
    fatherName: "Pradeep Gupta",
    rollNumber: "ZTCA-2024-006",
    courseName: "Graphic Design",
    courseDuration: "6 Months",
    batchYear: "2024-25",
    grade: "A+",
    percentage: 89.8,
    resultStatus: "DISTINCTION",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_3.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/GD/2024/006",
    isVerified: true,
  },
  {
    certificateNo: "ZTCA/ADCA/2024/007",
    studentName: "Rohan Mehta",
    fatherName: "Sanjay Mehta",
    rollNumber: "ZTCA-2024-007",
    courseName: "ADCA - Advanced Diploma in Computer Application",
    courseDuration: "12 Months",
    batchYear: "2024-25",
    grade: "C",
    percentage: 61.33,
    resultStatus: "PASS",
    issueDate: "2025-03-15",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_4.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/ADCA/2024/007",
    isVerified: true,
  },
  {
    certificateNo: "ZTCA/TALLY/2024/009",
    studentName: "Deepak Yadav",
    fatherName: "Om Prakash Yadav",
    rollNumber: "ZTCA-2024-009",
    courseName: "Tally Prime - Accounting with Tally Prime",
    courseDuration: "3 Months",
    batchYear: "2024-25",
    grade: "A+",
    percentage: 91.25,
    resultStatus: "DISTINCTION",
    issueDate: "2025-01-10",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_5.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/TALLY/2024/009",
    isVerified: true,
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
