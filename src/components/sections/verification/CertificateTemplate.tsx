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
 * All positions are in mm relative to the A4 page.
 *
 * Layout reference from PDF text extraction:
 *   Row 1 (y≈86mm): Centre Code | Session | Enrollment No | Roll No | Serial No
 *   Student Photo: centered ~100-143mm from top, 88-121mm from left
 *   Row 2 (y≈166mm): Student Name | DOB
 *   Row 3 (y≈175mm): Father's Name | Mother's Name
 *   Row 4 (y≈184mm): Course Name
 *   Row 5 (y≈192mm): Duration | From | To
 *   Row 6 (y≈200mm): To (completion date)
 *   Row 7 (y≈210mm): Institute/Study Centre Name
 *   Row 8 (y≈218mm): Percentage | Grade
 *   QR Code: centered ~229-254mm from top
 *   Signatures: ~240mm from bottom area
 */

export default function CertificateTemplate({ certificate }: CertificateTemplateProps) {
  return (
    <div
      style={{
        width: "210mm",
        height: "297mm",
        position: "relative",
        fontFamily: "'DejaVu Serif', 'Noto Serif', Georgia, serif",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* ── Background Image (the certificate design) ── */}
      <img
        src="/cert/certificate_bg.jpg"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "210mm",
          height: "297mm",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* ── Watermark overlay (diagonal repeated text) ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "210mm",
          height: "297mm",
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
              top: `${-30 + i * 30}mm`,
              left: "-20mm",
              width: "260mm",
              fontSize: "14mm",
              fontWeight: 800,
              color: "rgba(10, 38, 71, 0.04)",
              transform: "rotate(-35deg)",
              transformOrigin: "center center",
              whiteSpace: "nowrap",
              letterSpacing: "3mm",
              textAlign: "center",
              lineHeight: "28mm",
              fontFamily: "'DejaVu Serif', Georgia, serif",
            }}
          >
            {certificate.instituteName}
          </div>
        ))}
      </div>

      {/* ── Dynamic Text Fields ── */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "210mm", height: "297mm", zIndex: 2 }}>

        {/* ═══ Row 1: Centre Code | Session | Enrollment No | Roll No | Serial No ═══ */}
        {/* Centre Code — x≈21mm, y≈86mm */}
        <div style={{
          position: "absolute",
          top: "86mm",
          left: "21mm",
          width: "25mm",
          fontSize: "3.2mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.instituteCode}
        </div>

        {/* Session — x≈59mm, y≈86mm */}
        <div style={{
          position: "absolute",
          top: "86mm",
          left: "59mm",
          width: "25mm",
          fontSize: "3.2mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.session}
        </div>

        {/* Enrollment No — x≈92mm, y≈86mm */}
        <div style={{
          position: "absolute",
          top: "86mm",
          left: "90mm",
          width: "35mm",
          fontSize: "3.2mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.enrollmentNo}
        </div>

        {/* Roll No — x≈137mm, y≈86mm */}
        <div style={{
          position: "absolute",
          top: "86mm",
          left: "135mm",
          width: "20mm",
          fontSize: "3.2mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.rollNumber}
        </div>

        {/* Serial No — x≈170mm, y≈86mm */}
        <div style={{
          position: "absolute",
          top: "86mm",
          left: "168mm",
          width: "22mm",
          fontSize: "3.2mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.serialNo}
        </div>

        {/* ═══ Student Photo ═══ */}
        <div style={{
          position: "absolute",
          top: "100mm",
          left: "88mm",
          width: "33mm",
          height: "44mm",
          border: "0.8mm solid #0056A0",
          borderRadius: "0.5mm",
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
        {/* Student Name — x≈102mm, y≈166mm */}
        <div style={{
          position: "absolute",
          top: "166mm",
          left: "30mm",
          width: "110mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
        }}>
          {certificate.studentName}
        </div>

        {/* DOB — x≈172mm, y≈166mm */}
        <div style={{
          position: "absolute",
          top: "166mm",
          left: "155mm",
          width: "40mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.dob}
        </div>

        {/* ═══ Row 3: Father's Name | Mother's Name ═══ */}
        {/* Father's Name — x≈59mm, y≈175mm */}
        <div style={{
          position: "absolute",
          top: "175mm",
          left: "30mm",
          width: "110mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
        }}>
          {certificate.fatherName}
        </div>

        {/* Mother's Name — x≈155mm, y≈175mm */}
        <div style={{
          position: "absolute",
          top: "175mm",
          left: "140mm",
          width: "55mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
        }}>
          {certificate.motherName}
        </div>

        {/* ═══ Row 4: Course Name ═══ */}
        <div style={{
          position: "absolute",
          top: "184mm",
          left: "30mm",
          width: "150mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
        }}>
          {certificate.courseName}
        </div>

        {/* ═══ Row 5: Duration | From | To ═══ */}
        {/* Duration — x≈71mm, y≈192mm */}
        <div style={{
          position: "absolute",
          top: "192mm",
          left: "50mm",
          width: "30mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.courseDuration}
        </div>

        {/* From — x≈132mm, y≈192mm */}
        <div style={{
          position: "absolute",
          top: "192mm",
          left: "115mm",
          width: "30mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.courseDurationFrom}
        </div>

        {/* To — x≈173mm, y≈192mm */}
        <div style={{
          position: "absolute",
          top: "192mm",
          left: "155mm",
          width: "30mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.courseDurationTo}
        </div>

        {/* ═══ Row 6: Completion Date (same "To" field repeated) ═══ */}
        <div style={{
          position: "absolute",
          top: "200mm",
          left: "155mm",
          width: "30mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.courseDurationTo}
        </div>

        {/* ═══ Row 7: Institute / Study Centre Name ═══ */}
        <div style={{
          position: "absolute",
          top: "210mm",
          left: "30mm",
          width: "150mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
        }}>
          {certificate.instituteName}
        </div>

        {/* ═══ Row 8: Percentage | Grade ═══ */}
        {/* Percentage — x≈115mm, y≈218mm */}
        <div style={{
          position: "absolute",
          top: "218mm",
          left: "100mm",
          width: "35mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.percentage}
        </div>

        {/* Grade — x≈189mm, y≈218mm */}
        <div style={{
          position: "absolute",
          top: "218mm",
          left: "180mm",
          width: "20mm",
          fontSize: "3.9mm",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        }}>
          {certificate.grade}
        </div>

        {/* ═══ QR Code ═══ */}
        <div style={{
          position: "absolute",
          top: "229mm",
          left: "92mm",
          width: "25mm",
          height: "25mm",
          border: "0.3mm solid #000",
          background: "#fff",
          zIndex: 3,
        }}>
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
            <rect width="100" height="100" fill="white" />
            {/* Position detection patterns */}
            <rect x="5" y="5" width="25" height="25" fill="#0A2647" />
            <rect x="8" y="8" width="19" height="19" fill="white" />
            <rect x="11" y="11" width="13" height="13" fill="#0A2647" />
            <rect x="70" y="5" width="25" height="25" fill="#0A2647" />
            <rect x="73" y="8" width="19" height="19" fill="white" />
            <rect x="76" y="11" width="13" height="13" fill="#0A2647" />
            <rect x="5" y="70" width="25" height="25" fill="#0A2647" />
            <rect x="8" y="73" width="19" height="19" fill="white" />
            <rect x="11" y="76" width="13" height="13" fill="#0A2647" />
            {/* Data modules */}
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
