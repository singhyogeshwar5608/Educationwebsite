"use client";

import { Download } from "lucide-react";
import type { StudentResult } from "@/data/results";
import MarksheetDocument, {
  downloadMarksheetDoc,
  type MarksheetDoc,
} from "@/components/shared/MarksheetDocument";

interface ResultCardProps {
  result: StudentResult;
}

// Map the public result payload into the shared marksheet document shape used by
// both the public page and the admin panel (exact same coordinates).
function toMarksheetDoc(result: StudentResult): MarksheetDoc {
  const rows = result.subjects.map((s, i) => ({
    code: String(i + 1).padStart(2, "0"),
    name: s.subject,
    maxMarks: s.maxMarks,
    theoryObt: s.obtainedMarks,
    practicalMax: 0,
    practicalObt: 0,
    subjectTotal: s.obtainedMarks,
    passingMarks: Math.round(s.maxMarks * 0.33),
  }));
  return {
    rollNo: result.rollNumber || "",
    registrationNo: result.registrationNumber || result.rollNumber || "",
    course: result.courseName || "",
    studentName: result.studentName || "",
    dob: "",
    fatherName: result.fatherName || "",
    duration: result.courseDuration || "1 Year",
    motherName: "",
    batch: result.batchYear || "",
    instituteName: "Z-TECH CAREER ACADEMY",
    photo: result.photo || undefined,
    rows,
    maxTotal: result.totalMaxMarks,
    total: result.totalObtainedMarks,
    totalPassing: rows.reduce((sum, r) => sum + r.passingMarks, 0),
  };
}

export default function ResultCard({ result }: ResultCardProps) {
  const doc = toMarksheetDoc(result);

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-light-gray relative">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        <MarksheetDocument doc={doc} />

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => downloadMarksheetDoc(doc)}
            className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 sm:py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Download className="w-5 h-5" />
            Download Marksheet
          </button>
        </div>
      </div>
    </section>
  );
}
