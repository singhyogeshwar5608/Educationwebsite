"use client";

import { Download } from "lucide-react";
import type { StudentResult } from "@/data/results";
import SummaryDocument, {
  downloadSummaryDoc,
  type SummaryDoc,
} from "@/components/shared/SummaryDocument";

interface ResultCardProps {
  result: StudentResult;
}

function toSummaryDoc(result: StudentResult): SummaryDoc {
  return {
    studentName: result.studentName || "",
    fatherName: result.fatherName || "",
    motherName: result.motherName || "",
    registrationNo: result.registrationNumber || result.rollNumber || "",
    dob: result.dob || "",
    course: result.courseName || "",
    duration: result.courseDuration || "-",
    grade: result.grade || "-",
    batch: result.batchYear || "-",
    instituteName: "Z-TECH CAREER ACADEMY",
  };
}

export default function ResultCard({ result }: ResultCardProps) {
  const doc = toSummaryDoc(result);

  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-light-gray relative">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        <SummaryDocument doc={doc} />

        <div className="mt-4 flex justify-center">
          <button
            onClick={() => downloadSummaryDoc(doc, `Result_${doc.registrationNo || doc.studentName || "Student"}.pdf`)}
            className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-3 sm:py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Download className="w-5 h-5" />
            Download Summary
          </button>
        </div>
      </div>
    </section>
  );
}