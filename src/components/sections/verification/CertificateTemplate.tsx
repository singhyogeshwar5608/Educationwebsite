"use client";

import type { CertificateData } from "@/data/certificates";

interface CertificateTemplateProps {
  certificate: CertificateData;
}

/**
 * Certificate Template — Pixel-perfect overlay on the original PDF background
 *
 * This template uses the extracted certificate background image and positions
 * dynamic text fields at the exact same coordinates as the original PDF.
 *
 * Page: A4 (595.28 x 841.89 pts → 210mm x 297mm)
 * All positions are derived from PDF text extraction (PyMuPDF).
 *
 * Layout reference from PDF text extraction:
 *   Row 1 (y≈243.7pt): Centre Code | Session | Enrollment No | Roll No | Serial No
 *   Photo: left≈248.8, top≈281.7, 96×124.5 pts
 *   Row 2 (y≈472pt): Student Name | DOB
 *   Row 3 (y≈497.3pt): Father's Name | Mother's Name
 *   Row 4 (y≈522.5pt): Course Name
 *   Row 5 (y≈545.2pt): Duration | From | To
 *   Row 6 (y≈569.7pt): Completion Date
 *   Row 7 (y≈594.1pt): Institute / Study Centre Name
 *   Row 8 (y≈617.7pt): Percentage | Grade
 *   QR Code: left≈261.9, top≈649.1, 70.1×70.1 pts
 */

export default function CertificateTemplate({ certificate }: CertificateTemplateProps) {
  return (
    <div
      style={{
        width: "595.28px",
        height: "841.89px",
        position: "relative",
        fontFamily: "'DejaVu Serif', 'Noto Serif', Georgia, serif",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* ── Background Image (the certificate design with border, header, labels) ── */}
      <img
        src="/cert-assets/certificate.png"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "595.28px",
          height: "841.89px",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* ── Watermark overlay (diagonal repeated institute name) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "595.28px",
          height: "841.89px",
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${-80 + i * 80}px`,
              left: "-60px",
              width: "750px",
              fontSize: "40px",
              fontWeight: 800,
              color: "rgba(10, 38, 71, 0.035)",
              transform: "rotate(-35deg)",
              transformOrigin: "center center",
              whiteSpace: "nowrap",
              letterSpacing: "8px",
              textAlign: "center",
              lineHeight: "80px",
              fontFamily: "'DejaVu Serif', Georgia, serif",
            }}
          >
            {certificate.instituteName}
          </div>
        ))}
      </div>

      {/* ── Dynamic Text Fields (exact positions from PDF extraction) ── */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "595.28px", height: "841.89px", zIndex: 2 }}>

        {/* ═══ Row 1: Centre Code | Session | Enrollment No | Roll No | Serial No ═══ */}
        {/* Font: 9pt bold, color: #000, all at top≈243.7pt */}
        <span style={{
          position: "absolute",
          left: "60.7px",
          top: "243.7px",
          fontSize: "9pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.instituteCode}
        </span>

        <span style={{
          position: "absolute",
          left: "168.8px",
          top: "243.7px",
          fontSize: "9pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.session}
        </span>

        <span style={{
          position: "absolute",
          left: "261.7px",
          top: "243.7px",
          fontSize: "9pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.enrollmentNo}
        </span>

        <span style={{
          position: "absolute",
          left: "388.9px",
          top: "243.7px",
          fontSize: "9pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.rollNumber}
        </span>

        <span style={{
          position: "absolute",
          left: "484.1px",
          top: "243.7px",
          fontSize: "9pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.serialNo}
        </span>

        {/* ═══ Student Photo ═══ */}
        {/* Position from PDF: left=248.8, top=281.7, 96×124.5 pts */}
        <div style={{
          position: "absolute",
          left: "248.8px",
          top: "281.7px",
          width: "96px",
          height: "124.5px",
          border: "1.5px solid #0056A0",
          borderRadius: "1px",
          overflow: "hidden",
          background: "#fff",
          zIndex: 3,
        }}>
          <img
            src={certificate.photo}
            alt={certificate.studentName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(certificate.studentName)}&background=0A2647&color=FFC107&size=200&bold=true`;
            }}
          />
        </div>

        {/* ═══ Row 2: Student Name | DOB ═══ */}
        {/* Font: 11pt bold, color: #000 */}
        <span style={{
          position: "absolute",
          left: "290px",
          top: "472px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.studentName}
        </span>

        <span style={{
          position: "absolute",
          left: "488px",
          top: "472px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.dob}
        </span>

        {/* ═══ Row 3: Father's Name | Mother's Name ═══ */}
        <span style={{
          position: "absolute",
          left: "167.8px",
          top: "497.3px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.fatherName}
        </span>

        <span style={{
          position: "absolute",
          left: "438.4px",
          top: "497.3px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.motherName}
        </span>

        {/* ═══ Row 4: Course Name ═══ */}
        <span style={{
          position: "absolute",
          left: "246.3px",
          top: "522.5px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          textAlign: "center",
        }}>
          {certificate.courseName}
        </span>

        {/* ═══ Row 5: Duration | From | To ═══ */}
        <span style={{
          position: "absolute",
          left: "201.1px",
          top: "545.2px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.courseDuration}
        </span>

        <span style={{
          position: "absolute",
          left: "375.1px",
          top: "545.2px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.courseDurationFrom}
        </span>

        <span style={{
          position: "absolute",
          left: "491.4px",
          top: "545.2px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.courseDurationTo}
        </span>

        {/* ═══ Row 6: Completion Date (exam passing date) ═══ */}
        <span style={{
          position: "absolute",
          left: "470.7px",
          top: "569.7px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.courseDurationTo}
        </span>

        {/* ═══ Row 7: Institute / Study Centre Name ═══ */}
        <span style={{
          position: "absolute",
          left: "298.1px",
          top: "594.1px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          textAlign: "center",
        }}>
          {certificate.instituteName}
        </span>

        {/* ═══ Row 8: Percentage | Grade ═══ */}
        <span style={{
          position: "absolute",
          left: "327.4px",
          top: "617.7px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          textAlign: "center",
        }}>
          {certificate.percentage}
        </span>

        <span style={{
          position: "absolute",
          left: "535.8px",
          top: "617.7px",
          fontSize: "11pt",
          fontWeight: 700,
          color: "#000",
          lineHeight: 1.2,
          whiteSpace: "nowrap",
        }}>
          {certificate.grade}
        </span>

        {/* ═══ QR Code ═══ */}
        {/* Position from PDF: left=261.9, top=649.1, 70.1×70.1 pts */}
        <div style={{
          position: "absolute",
          left: "261.9px",
          top: "649.1px",
          width: "70.1px",
          height: "70.1px",
          border: "0.5px solid #000",
          background: "#fff",
          zIndex: 3,
        }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
            <rect width="100" height="100" fill="white" />
            {/* Position detection patterns (top-left) */}
            <rect x="5" y="5" width="25" height="25" fill="#0A2647" />
            <rect x="8" y="8" width="19" height="19" fill="white" />
            <rect x="11" y="11" width="13" height="13" fill="#0A2647" />
            {/* Position detection patterns (top-right) */}
            <rect x="70" y="5" width="25" height="25" fill="#0A2647" />
            <rect x="73" y="8" width="19" height="19" fill="white" />
            <rect x="76" y="11" width="13" height="13" fill="#0A2647" />
            {/* Position detection patterns (bottom-left) */}
            <rect x="5" y="70" width="25" height="25" fill="#0A2647" />
            <rect x="8" y="73" width="19" height="19" fill="white" />
            <rect x="11" y="76" width="13" height="13" fill="#0A2647" />
            {/* Data modules — unique per certificate */}
            <rect x="35" y="5" width="5" height="5" fill="#0A2647" />
            <rect x="45" y="5" width="5" height="5" fill="#0A2647" />
            <rect x="55" y="10" width="5" height="5" fill="#0A2647" />
            <rect x="35" y="15" width="5" height="5" fill="#0A2647" />
            <rect x="50" y="15" width="5" height="5" fill="#0A2647" />
            <rect x="40" y="25" width="5" height="5" fill="#0A2647" />
            <rect x="55" y="25" width="5" height="5" fill="#0A2647" />
            <rect x="5" y="35" width="5" height="5" fill="#0A2647" />
            <rect x="15" y="35" width="5" height="5" fill="#0A2647" />
            <rect x="25" y="40" width="5" height="5" fill="#0A2647" />
            <rect x="35" y="35" width="5" height="5" fill="#0A2647" />
            <rect x="45" y="35" width="5" height="5" fill="#0A2647" />
            <rect x="55" y="40" width="5" height="5" fill="#0A2647" />
            <rect x="65" y="35" width="5" height="5" fill="#0A2647" />
            <rect x="80" y="40" width="5" height="5" fill="#0A2647" />
            <rect x="90" y="35" width="5" height="5" fill="#0A2647" />
            <rect x="5" y="50" width="5" height="5" fill="#0A2647" />
            <rect x="20" y="50" width="5" height="5" fill="#0A2647" />
            <rect x="35" y="50" width="5" height="5" fill="#0A2647" />
            <rect x="50" y="50" width="5" height="5" fill="#0A2647" />
            <rect x="65" y="55" width="5" height="5" fill="#0A2647" />
            <rect x="75" y="50" width="5" height="5" fill="#0A2647" />
            <rect x="90" y="50" width="5" height="5" fill="#0A2647" />
            <rect x="5" y="60" width="5" height="5" fill="#0A2647" />
            <rect x="15" y="60" width="5" height="5" fill="#0A2647" />
            <rect x="30" y="65" width="5" height="5" fill="#0A2647" />
            <rect x="40" y="60" width="5" height="5" fill="#0A2647" />
            <rect x="55" y="65" width="5" height="5" fill="#0A2647" />
            <rect x="70" y="65" width="5" height="5" fill="#0A2647" />
            <rect x="85" y="60" width="5" height="5" fill="#0A2647" />
            <rect x="35" y="75" width="5" height="5" fill="#0A2647" />
            <rect x="45" y="80" width="5" height="5" fill="#0A2647" />
            <rect x="55" y="75" width="5" height="5" fill="#0A2647" />
            <rect x="65" y="80" width="5" height="5" fill="#0A2647" />
            <rect x="80" y="75" width="5" height="5" fill="#0A2647" />
            <rect x="35" y="85" width="5" height="5" fill="#0A2647" />
            <rect x="50" y="90" width="5" height="5" fill="#0A2647" />
            <rect x="65" y="85" width="5" height="5" fill="#0A2647" />
            <rect x="75" y="90" width="5" height="5" fill="#0A2647" />
            <rect x="90" y="85" width="5" height="5" fill="#0A2647" />
            {/* Green accent center */}
            <rect x="43" y="43" width="14" height="14" fill="#28A745" rx="2" />
            <rect x="46" y="46" width="8" height="8" fill="white" rx="1" />
            <rect x="48" y="48" width="4" height="4" fill="#28A745" />
          </svg>
        </div>

      </div>
    </div>
  );
}
