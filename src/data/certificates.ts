// ============================================================
// Certificate Data — Z-TECH CAREER ACADEMY
// ============================================================

export interface CertificateData {
  certificateNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  rollNumber: string;
  enrollmentNo: string;
  courseName: string;
  courseDuration: string;
  batchYear: string;
  startDate: string;
  endDate: string;
  grade: string;
  percentage: number;
  resultStatus: "PASS" | "DISTINCTION";
  issueDate: string;
  validUntil: string;
  photo: string;
  qrCodeData: string;
  isVerified: boolean;
  instituteName: string;
}

export const certificates: CertificateData[] = [
  {
    certificateNo: "ZTCA/ADCA/2024/001",
    studentName: "Rahul Sharma",
    fatherName: "Raj Kumar Sharma",
    motherName: "Sunita Sharma",
    dob: "15-08-2001",
    rollNumber: "8031",
    enrollmentNo: "ZTCA/S/2024001",
    courseName: "ADCA - Advanced Diploma in Computer Application",
    courseDuration: "12 Months",
    batchYear: "2024-2025",
    startDate: "May 2024",
    endDate: "Apr 2025",
    grade: "A+",
    percentage: 86,
    resultStatus: "DISTINCTION",
    issueDate: "Apr 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_1.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/ADCA/2024/001",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
  },
  {
    certificateNo: "ZTCA/DCA/2024/002",
    studentName: "Priya Verma",
    fatherName: "Suresh Verma",
    motherName: "Kamla Verma",
    dob: "22-03-2002",
    rollNumber: "8032",
    enrollmentNo: "ZTCA/S/2024002",
    courseName: "DCA - Diploma in Computer Application",
    courseDuration: "6 Months",
    batchYear: "2024-2025",
    startDate: "Nov 2024",
    endDate: "Apr 2025",
    grade: "A",
    percentage: 86.8,
    resultStatus: "DISTINCTION",
    issueDate: "Apr 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_1.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/DCA/2024/002",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
  },
  {
    certificateNo: "ZTCA/TALLY/2024/003",
    studentName: "Amit Kumar",
    fatherName: "Harish Kumar",
    motherName: "Saroj Devi",
    dob: "10-07-2000",
    rollNumber: "8033",
    enrollmentNo: "ZTCA/S/2024003",
    courseName: "Tally Prime - Accounting with Tally Prime",
    courseDuration: "3 Months",
    batchYear: "2024-2025",
    startDate: "Dec 2024",
    endDate: "Feb 2025",
    grade: "B",
    percentage: 78.75,
    resultStatus: "DISTINCTION",
    issueDate: "Feb 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_2.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/TALLY/2024/003",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
  },
  {
    certificateNo: "ZTCA/DM/2024/004",
    studentName: "Sneha Patil",
    fatherName: "Dinesh Patil",
    motherName: "Meena Patil",
    dob: "05-11-2001",
    rollNumber: "8034",
    enrollmentNo: "ZTCA/S/2024004",
    courseName: "Digital Marketing",
    courseDuration: "6 Months",
    batchYear: "2024-2025",
    startDate: "Nov 2024",
    endDate: "Apr 2025",
    grade: "A+",
    percentage: 89.67,
    resultStatus: "DISTINCTION",
    issueDate: "Apr 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_2.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/DM/2024/004",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
  },
  {
    certificateNo: "ZTCA/WD/2024/005",
    studentName: "Vikram Singh",
    fatherName: "Balwinder Singh",
    motherName: "Harpreet Kaur",
    dob: "18-01-2003",
    rollNumber: "8035",
    enrollmentNo: "ZTCA/S/2024005",
    courseName: "Web Development",
    courseDuration: "6 Months",
    batchYear: "2024-2025",
    startDate: "Nov 2024",
    endDate: "Apr 2025",
    grade: "B",
    percentage: 77.17,
    resultStatus: "DISTINCTION",
    issueDate: "Apr 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_3.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/WD/2024/005",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
  },
  {
    certificateNo: "ZTCA/GD/2024/006",
    studentName: "Anjali Gupta",
    fatherName: "Pradeep Gupta",
    motherName: "Rekha Gupta",
    dob: "29-06-2002",
    rollNumber: "8036",
    enrollmentNo: "ZTCA/S/2024006",
    courseName: "Graphic Design",
    courseDuration: "6 Months",
    batchYear: "2024-2025",
    startDate: "Nov 2024",
    endDate: "Apr 2025",
    grade: "A+",
    percentage: 89.8,
    resultStatus: "DISTINCTION",
    issueDate: "Apr 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_female_3.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/GD/2024/006",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
  },
  {
    certificateNo: "ZTCA/ADCA/2024/007",
    studentName: "Rohan Mehta",
    fatherName: "Sanjay Mehta",
    motherName: "Anita Mehta",
    dob: "12-09-2001",
    rollNumber: "8037",
    enrollmentNo: "ZTCA/S/2024007",
    courseName: "ADCA - Advanced Diploma in Computer Application",
    courseDuration: "12 Months",
    batchYear: "2024-2025",
    startDate: "May 2024",
    endDate: "Apr 2025",
    grade: "C",
    percentage: 61.33,
    resultStatus: "PASS",
    issueDate: "Apr 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_4.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/ADCA/2024/007",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
  },
  {
    certificateNo: "ZTCA/TALLY/2024/009",
    studentName: "Deepak Yadav",
    fatherName: "Om Prakash Yadav",
    motherName: "Geeta Devi",
    dob: "03-04-2000",
    rollNumber: "8039",
    enrollmentNo: "ZTCA/S/2024009",
    courseName: "Tally Prime - Accounting with Tally Prime",
    courseDuration: "3 Months",
    batchYear: "2024-2025",
    startDate: "Oct 2024",
    endDate: "Jan 2025",
    grade: "A+",
    percentage: 91.25,
    resultStatus: "DISTINCTION",
    issueDate: "Jan 2025",
    validUntil: "Lifetime",
    photo: "https://sfile.chatglm.cn/images-ppt/student_male_5.jpg",
    qrCodeData: "https://ztechacademy.in/verify/ZTCA/TALLY/2024/009",
    isVerified: true,
    instituteName: "Z-Tech Career Academy",
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
