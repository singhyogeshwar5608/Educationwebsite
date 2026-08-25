// ============================================================
// Student Results Data — Z-TECH CAREER ACADEMY
// ============================================================

export interface SubjectMark {
  subject: string;
  maxMarks: number;
  obtainedMarks: number;
}

export interface StudentResult {
  rollNumber: string;
  registrationNumber?: string;
  studentName: string;
  fatherName: string;
  motherName?: string;
  dob?: string;
  courseName: string;
  courseDuration: string;
  batchYear: string;
  photo: string;
  subjects: SubjectMark[];
  grade: string;
  percentage: number;
  totalMaxMarks: number;
  totalObtainedMarks: number;
  resultStatus: "PASS" | "FAIL" | "DISTINCTION";
  issueDate: string;
  certificateNo: string;
}

// Helper to compute totals, grade, percentage
function computeResult(
  rollNumber: string,
  studentName: string,
  fatherName: string,
  courseName: string,
  courseDuration: string,
  batchYear: string,
  photo: string,
  subjects: { subject: string; maxMarks: number; obtainedMarks: number }[],
  issueDate: string,
  certificateNo: string
): StudentResult {
  const totalMaxMarks = subjects.reduce((s, sub) => s + sub.maxMarks, 0);
  const totalObtainedMarks = subjects.reduce((s, sub) => s + sub.obtainedMarks, 0);
  const percentage = Math.round((totalObtainedMarks / totalMaxMarks) * 100 * 100) / 100;

  let grade: string;
  let resultStatus: "PASS" | "FAIL" | "DISTINCTION";

  if (percentage >= 75) {
    grade = "A+";
    resultStatus = "DISTINCTION";
  } else if (percentage >= 60) {
    grade = "A";
    resultStatus = "DISTINCTION";
  } else if (percentage >= 50) {
    grade = "B";
    resultStatus = "PASS";
  } else if (percentage >= 40) {
    grade = "C";
    resultStatus = "PASS";
  } else if (percentage >= 33) {
    grade = "D";
    resultStatus = "PASS";
  } else {
    grade = "F";
    resultStatus = "FAIL";
  }

  return {
    rollNumber,
    studentName,
    fatherName,
    courseName,
    courseDuration,
    batchYear,
    photo,
    subjects,
    grade,
    percentage,
    totalMaxMarks,
    totalObtainedMarks,
    resultStatus,
    issueDate,
    certificateNo,
  };
}

// ── Sample Student Data ──────────────────────────────────────

export const studentResults: StudentResult[] = [
  computeResult(
    "ZTCA-2024-001",
    "Rahul Sharma",
    "Raj Kumar Sharma",
    "ADCA - Advanced Diploma in Computer Application",
    "12 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_male_1.jpg",
    [
      { subject: "Computer Fundamentals", maxMarks: 100, obtainedMarks: 88 },
      { subject: "MS Office (Word, Excel, PowerPoint)", maxMarks: 100, obtainedMarks: 82 },
      { subject: "Tally Prime & Accounting", maxMarks: 100, obtainedMarks: 91 },
      { subject: "Internet & Email", maxMarks: 100, obtainedMarks: 78 },
      { subject: "HTML & Web Design", maxMarks: 100, obtainedMarks: 85 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 92 },
    ],
    "2025-03-15",
    "ZTCA/ADCA/2024/001"
  ),

  computeResult(
    "ZTCA-2024-002",
    "Priya Verma",
    "Suresh Verma",
    "DCA - Diploma in Computer Application",
    "6 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_female_1.jpg",
    [
      { subject: "Computer Fundamentals", maxMarks: 100, obtainedMarks: 92 },
      { subject: "MS Office (Word, Excel, PowerPoint)", maxMarks: 100, obtainedMarks: 88 },
      { subject: "Internet & Email", maxMarks: 100, obtainedMarks: 85 },
      { subject: "HTML Basics", maxMarks: 100, obtainedMarks: 79 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 90 },
    ],
    "2025-03-15",
    "ZTCA/DCA/2024/002"
  ),

  computeResult(
    "ZTCA-2024-003",
    "Amit Kumar",
    "Harish Kumar",
    "Tally Prime - Accounting with Tally Prime",
    "3 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_male_2.jpg",
    [
      { subject: "Accounting Fundamentals", maxMarks: 100, obtainedMarks: 78 },
      { subject: "Tally Prime - Inventory", maxMarks: 100, obtainedMarks: 82 },
      { subject: "Tally Prime - GST & TDS", maxMarks: 100, obtainedMarks: 75 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 80 },
    ],
    "2025-02-20",
    "ZTCA/TALLY/2024/003"
  ),

  computeResult(
    "ZTCA-2024-004",
    "Sneha Patil",
    "Dinesh Patil",
    "Digital Marketing",
    "6 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_female_2.jpg",
    [
      { subject: "SEO & SEM", maxMarks: 100, obtainedMarks: 94 },
      { subject: "Social Media Marketing", maxMarks: 100, obtainedMarks: 89 },
      { subject: "Google Ads & Analytics", maxMarks: 100, obtainedMarks: 91 },
      { subject: "Content Marketing", maxMarks: 100, obtainedMarks: 87 },
      { subject: "Email Marketing", maxMarks: 100, obtainedMarks: 82 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 95 },
    ],
    "2025-03-15",
    "ZTCA/DM/2024/004"
  ),

  computeResult(
    "ZTCA-2024-005",
    "Vikram Singh",
    "Balwinder Singh",
    "Web Development",
    "6 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_male_3.jpg",
    [
      { subject: "HTML & CSS", maxMarks: 100, obtainedMarks: 86 },
      { subject: "JavaScript", maxMarks: 100, obtainedMarks: 72 },
      { subject: "React.js Basics", maxMarks: 100, obtainedMarks: 78 },
      { subject: "Node.js & Express", maxMarks: 100, obtainedMarks: 70 },
      { subject: "Database (MongoDB)", maxMarks: 100, obtainedMarks: 75 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 82 },
    ],
    "2025-03-15",
    "ZTCA/WD/2024/005"
  ),

  computeResult(
    "ZTCA-2024-006",
    "Anjali Gupta",
    "Pradeep Gupta",
    "Graphic Design",
    "6 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_female_3.jpg",
    [
      { subject: "Adobe Photoshop", maxMarks: 100, obtainedMarks: 90 },
      { subject: "Adobe Illustrator", maxMarks: 100, obtainedMarks: 88 },
      { subject: "CorelDRAW", maxMarks: 100, obtainedMarks: 85 },
      { subject: "Canva & Figma", maxMarks: 100, obtainedMarks: 92 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 94 },
    ],
    "2025-03-15",
    "ZTCA/GD/2024/006"
  ),

  computeResult(
    "ZTCA-2024-007",
    "Rohan Mehta",
    "Sanjay Mehta",
    "ADCA - Advanced Diploma in Computer Application",
    "12 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_male_4.jpg",
    [
      { subject: "Computer Fundamentals", maxMarks: 100, obtainedMarks: 65 },
      { subject: "MS Office (Word, Excel, PowerPoint)", maxMarks: 100, obtainedMarks: 58 },
      { subject: "Tally Prime & Accounting", maxMarks: 100, obtainedMarks: 62 },
      { subject: "Internet & Email", maxMarks: 100, obtainedMarks: 55 },
      { subject: "HTML & Web Design", maxMarks: 100, obtainedMarks: 60 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 68 },
    ],
    "2025-03-15",
    "ZTCA/ADCA/2024/007"
  ),

  computeResult(
    "ZTCA-2024-008",
    "Kavita Rani",
    "Ramesh Kumar",
    "DCA - Diploma in Computer Application",
    "6 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_female_4.jpg",
    [
      { subject: "Computer Fundamentals", maxMarks: 100, obtainedMarks: 45 },
      { subject: "MS Office (Word, Excel, PowerPoint)", maxMarks: 100, obtainedMarks: 38 },
      { subject: "Internet & Email", maxMarks: 100, obtainedMarks: 42 },
      { subject: "HTML Basics", maxMarks: 100, obtainedMarks: 35 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 40 },
    ],
    "2025-02-20",
    "ZTCA/DCA/2024/008"
  ),

  computeResult(
    "ZTCA-2024-009",
    "Deepak Yadav",
    "Om Prakash Yadav",
    "Tally Prime - Accounting with Tally Prime",
    "3 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_male_5.jpg",
    [
      { subject: "Accounting Fundamentals", maxMarks: 100, obtainedMarks: 92 },
      { subject: "Tally Prime - Inventory", maxMarks: 100, obtainedMarks: 95 },
      { subject: "Tally Prime - GST & TDS", maxMarks: 100, obtainedMarks: 88 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 90 },
    ],
    "2025-01-10",
    "ZTCA/TALLY/2024/009"
  ),

  computeResult(
    "ZTCA-2024-010",
    "Neha Sharma",
    "Vijay Sharma",
    "Digital Marketing",
    "6 Months",
    "2024-25",
    "https://sfile.chatglm.cn/images-ppt/student_female_5.jpg",
    [
      { subject: "SEO & SEM", maxMarks: 100, obtainedMarks: 78 },
      { subject: "Social Media Marketing", maxMarks: 100, obtainedMarks: 82 },
      { subject: "Google Ads & Analytics", maxMarks: 100, obtainedMarks: 75 },
      { subject: "Content Marketing", maxMarks: 100, obtainedMarks: 80 },
      { subject: "Email Marketing", maxMarks: 100, obtainedMarks: 72 },
      { subject: "Practical Project", maxMarks: 100, obtainedMarks: 85 },
    ],
    "2025-03-15",
    "ZTCA/DM/2024/010"
  ),
];

/**
 * Find a student result by roll number.
 * Supports case-insensitive partial match.
 */
export function findResultByRoll(rollNumber: string): StudentResult | null {
  const normalized = rollNumber.trim().toUpperCase();
  return (
    studentResults.find(
      (r) => r.rollNumber.toUpperCase() === normalized
    ) ?? null
  );
}
