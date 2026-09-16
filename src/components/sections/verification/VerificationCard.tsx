"use client";

import { Download } from "lucide-react";
import type { CertificateData } from "@/data/certificates";
import SummaryDocument, {
  downloadSummaryDoc,
  type SummaryDoc,
} from "@/components/shared/SummaryDocument";

interface VerificationCardProps {
  certificate: CertificateData;
}

function toSummaryDoc(c: CertificateData): SummaryDoc {
  return {
    studentName: c.studentName || "",
    fatherName: c.fatherName || "",
    motherName: c.motherName || "",
    registrationNo: c.enrollmentNo || c.rollNumber || "",
    dob: c.dob || "",
    course: c.courseName || "",
    duration: c.courseDuration || "",
    grade: c.grade || "-",
    batch: c.batchYear || "-",
    instituteName: c.instituteName || "Z-TECH CAREER ACADEMY",
  };
}

export default function VerificationCard({ certificate }: VerificationCardProps) {
  const doc = toSummaryDoc(certificate);

  return (
    <section className="py-5 sm:py-8 lg:py-12 bg-light-gray relative">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        <SummaryDocument doc={doc} />

        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => downloadSummaryDoc(doc, `Certificate_${doc.registrationNo || doc.studentName || "Student"}.pdf`)}
            className="inline-flex items-center justify-center gap-2 bg-green hover:bg-green-light text-white font-semibold px-8 py-3 sm:py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Download className="w-5 h-5" />
            Download Summary
          </button>
        </div>
      </div>
    </section>
  );
}