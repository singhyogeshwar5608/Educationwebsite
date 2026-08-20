"use client";

import { Download } from "lucide-react";
import type { CertificateData } from "@/data/certificates";
import CertificateDocument, {
  downloadCertificateDoc,
  type CertificateDoc,
} from "@/components/shared/CertificateDocument";

interface VerificationCardProps {
  certificate: CertificateData;
}

// Map the public certificate payload into the shared document shape used by
// both the public page and the admin panel (exact same field coordinates).
function toCertificateDoc(c: CertificateData): CertificateDoc {
  return {
    certificateNo: c.certificateNo || "",
    enrollmentNo: c.enrollmentNo || "",
    studentName: c.studentName || "",
    fatherName: c.fatherName || "",
    course: c.courseName || "",
    duration: c.courseDuration || "",
    session: c.session || c.batchYear || "",
    percentage: c.percentage || "",
    grade: c.grade || "",
    date: c.issueDate || "",
    instituteName: c.instituteName || "Z-TECH CAREER ACADEMY",
  };
}

export default function VerificationCard({ certificate }: VerificationCardProps) {
  const doc = toCertificateDoc(certificate);

  return (
    <section className="py-5 sm:py-8 lg:py-12 bg-light-gray relative">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
        <CertificateDocument doc={doc} />

        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => downloadCertificateDoc(doc)}
            className="inline-flex items-center justify-center gap-2 bg-green hover:bg-green-light text-white font-semibold px-8 py-3 sm:py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>
        </div>
      </div>
    </section>
  );
}
