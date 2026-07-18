"use client";

import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Printer,
  QrCode,
  Calendar,
  BookOpen,
  Award,
  User,
  Hash,
  Stamp,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import type { CertificateData } from "@/data/certificates";

interface VerificationCardProps {
  certificate: CertificateData;
}

export default function VerificationCard({ certificate }: VerificationCardProps) {
  const handleDownload = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.studentName}</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Poppins', sans-serif; background: #f5f5f5; display: flex; justify-content: center; padding: 20px; }
          .cert-page { width: 800px; min-height: 600px; background: #fff; border: 3px solid #0A2647; position: relative; padding: 50px; }
          .cert-inner-border { position: absolute; inset: 8px; border: 2px solid #FFC107; pointer-events: none; }
          .cert-corner { position: absolute; width: 40px; height: 40px; border: 3px solid #0A2647; }
          .cert-corner.tl { top: 15px; left: 15px; border-right: none; border-bottom: none; }
          .cert-corner.tr { top: 15px; right: 15px; border-left: none; border-bottom: none; }
          .cert-corner.bl { bottom: 15px; left: 15px; border-right: none; border-top: none; }
          .cert-corner.br { bottom: 15px; right: 15px; border-left: none; border-top: none; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { font-family: 'Playfair Display', serif; font-size: 28px; color: #0A2647; letter-spacing: 2px; }
          .header .subtitle { font-size: 11px; color: #666; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px; }
          .header .cert-title { font-size: 36px; font-weight: 800; color: #0A2647; margin: 20px 0 10px; letter-spacing: 4px; text-transform: uppercase; }
          .body-text { text-align: center; line-height: 2; font-size: 14px; color: #0A2647; }
          .body-text .name { font-size: 24px; font-weight: 700; color: #0A2647; margin: 10px 0; border-bottom: 2px solid #FFC107; display: inline-block; padding-bottom: 2px; }
          .body-text .course { font-weight: 600; color: #144272; }
          .details-grid { display: flex; justify-content: space-around; margin: 25px 0; text-align: center; }
          .detail-item .label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
          .detail-item .value { font-size: 14px; font-weight: 700; color: #0A2647; }
          .stamp-section { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; }
          .stamp-box { text-align: center; }
          .stamp-circle { width: 80px; height: 80px; border: 3px solid #0A2647; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; font-size: 9px; font-weight: 700; color: #0A2647; text-align: center; line-height: 1.3; }
          .sig-line { border-top: 1px solid #0A2647; width: 160px; margin-top: 40px; padding-top: 5px; font-size: 10px; color: #0A2647; font-weight: 600; }
          .footer { text-align: center; margin-top: 20px; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
          .qr-placeholder { width: 70px; height: 70px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #aaa; }
        </style>
      </head>
      <body>
        <div class="cert-page">
          <div class="cert-inner-border"></div>
          <div class="cert-corner tl"></div>
          <div class="cert-corner tr"></div>
          <div class="cert-corner bl"></div>
          <div class="cert-corner br"></div>
          <div class="header">
            <h1>Z-TECH CAREER ACADEMY</h1>
            <div class="subtitle">Behind Jat School, Rishi Nagar, Gali No. 9, Kaithal, Haryana</div>
            <div class="cert-title">Certificate of Completion</div>
          </div>
          <div class="body-text">
            This is to certify that<br/>
            <div class="name">${certificate.studentName}</div><br/>
            S/o D/o <strong>${certificate.fatherName}</strong><br/>
            has successfully completed the course<br/>
            <span class="course">${certificate.courseName}</span><br/>
            with <strong>${certificate.grade} Grade</strong> securing <strong>${certificate.percentage}%</strong> marks.
          </div>
          <div class="details-grid">
            <div class="detail-item"><div class="label">Roll No</div><div class="value">${certificate.rollNumber}</div></div>
            <div class="detail-item"><div class="label">Duration</div><div class="value">${certificate.courseDuration}</div></div>
            <div class="detail-item"><div class="label">Batch</div><div class="value">${certificate.batchYear}</div></div>
            <div class="detail-item"><div class="label">Certificate No</div><div class="value">${certificate.certificateNo}</div></div>
          </div>
          <div class="stamp-section">
            <div class="stamp-box">
              <div class="sig-line">Student Signature</div>
            </div>
            <div class="stamp-box">
              <div class="stamp-circle">Z-TECH<br/>CAREER<br/>ACADEMY</div>
              <div style="font-size:9px;color:#666;">Official Seal</div>
            </div>
            <div class="stamp-box">
              <div class="sig-line">Director</div>
            </div>
          </div>
          <div class="footer">
            Certificate No: ${certificate.certificateNo} | Issued: ${certificate.issueDate} | Verify at: ztechacademy.in/verification<br/>
            Owner: Vijay Kumar Singla (M.Com, MBA) | Email: ztca2012@gmail.com
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handlePrint = () => window.print();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "text-gold";
      case "A": return "text-green";
      case "B": return "text-blue-600";
      case "C": return "text-orange-500";
      default: return "text-navy";
    }
  };

  return (
    <section className="py-5 sm:py-8 lg:py-12 bg-light-gray relative">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-8">

        {/* ══════════════════════════════════════════
            VERIFICATION STATUS BANNER
        ══════════════════════════════════════════ */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green via-green-light to-green rounded-xl sm:rounded-2xl opacity-30 blur-sm" />
          <div className="relative bg-green/5 backdrop-blur-xl border-2 border-green/20 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center">
            {/* Verified Badge — Large animated */}
            <div className="relative inline-block mb-4 sm:mb-5">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-green rounded-full flex items-center justify-center mx-auto shadow-2xl relative">
                <ShieldCheck className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-full border-4 border-green/30 animate-ping-slow" />
                {/* Checkmark overlay */}
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gold rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-navy" />
                </div>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-green mb-1.5 sm:mb-2">
              Certificate Verified!
            </h2>
            <p className="text-text-gray text-xs sm:text-sm lg:text-base max-w-lg mx-auto">
              This certificate is authentic and has been issued by
              Z-TECH CAREER ACADEMY. The details below match our official records.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            CERTIFICATE DETAILS CARD — Premium Glass
        ══════════════════════════════════════════ */}
        <div className="relative">
          <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-navy via-green to-navy-light rounded-xl sm:rounded-3xl opacity-20 blur-sm" />
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl sm:rounded-3xl shadow-2xl overflow-hidden">

            {/* ── Card Header — Green Accent ── */}
            <div className="bg-gradient-to-r from-green to-green-light relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDR2LTJtMC0xNmgtMnY0aDJ2LTRtLTQgMGgtMnYyaDJ2LTJtMiA0aDJ2LTJoLTJ2Mm0tNCAyaC0ydjJoMnYtMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 relative z-10">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                  {/* Student Photo */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-white/50 shadow-xl bg-white/10">
                      <img
                        src={certificate.photo}
                        alt={certificate.studentName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(certificate.studentName)}&background=28A745&color=ffffff&size=112&bold=true`;
                        }}
                      />
                    </div>
                    {/* Grade badge */}
                    <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 bg-gold text-navy font-extrabold text-sm sm:text-lg w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                      {certificate.grade}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                      {certificate.studentName}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm mb-2 sm:mb-3">
                      Father: {certificate.fatherName}
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg">
                        <Hash className="w-3 h-3 shrink-0" />
                        <span className="truncate">{certificate.certificateNo}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg">
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span className="truncate max-w-[180px] sm:max-w-none">{certificate.courseName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Verified Badge Compact */}
                  <div className="shrink-0">
                    <div className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      VERIFIED
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Card Body ── */}
            <div className="p-4 sm:p-6 lg:p-10">

              {/* Quick Info Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-5 sm:mb-8">
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Duration</p>
                  <p className="text-xs sm:text-sm font-bold text-navy">{certificate.courseDuration}</p>
                </div>
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Batch</p>
                  <p className="text-xs sm:text-sm font-bold text-navy">{certificate.batchYear}</p>
                </div>
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Grade</p>
                  <p className={`text-xs sm:text-sm font-bold ${getGradeColor(certificate.grade)}`}>{certificate.grade}</p>
                </div>
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Percentage</p>
                  <p className={`text-xs sm:text-sm font-bold ${getGradeColor(certificate.grade)}`}>{certificate.percentage}%</p>
                </div>
              </div>

              {/* ── Certificate Preview ── */}
              <div className="mb-5 sm:mb-8">
                <h4 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green" />
                  Certificate Preview
                </h4>

                {/* Certificate Visual — Looks like a real certificate */}
                <div className="relative bg-cream-gradient rounded-lg sm:rounded-xl overflow-hidden border-2 border-navy/10 shadow-lg">
                  <div className="absolute inset-1 sm:inset-2 border-2 border-gold/40 rounded-md sm:rounded-lg pointer-events-none" />
                  {/* Corner decorations */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-l-2 border-navy/30" />
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-r-2 border-navy/30" />
                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-l-2 border-navy/30" />
                  <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-r-2 border-navy/30" />

                  <div className="p-4 sm:p-8 lg:p-12 relative z-10">
                    {/* Institute Name */}
                    <div className="text-center mb-3 sm:mb-6">
                      <h5 className="text-base sm:text-xl lg:text-2xl font-extrabold text-navy tracking-wide">
                        Z-TECH CAREER ACADEMY
                      </h5>
                      <p className="text-[8px] sm:text-[10px] lg:text-xs text-text-gray tracking-widest uppercase mt-0.5 sm:mt-1">
                        Behind Jat School, Rishi Nagar, Gali No. 9, Kaithal, Haryana
                      </p>
                      <div className="mt-2 sm:mt-4 mb-2 sm:mb-4">
                        <p className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-navy/80 tracking-[0.15em] sm:tracking-[0.2em]">
                          CERTIFICATE
                        </p>
                        <p className="text-[9px] sm:text-xs lg:text-sm text-text-gray tracking-[0.1em] uppercase">
                          of Completion
                        </p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="text-center space-y-1.5 sm:space-y-3 text-xs sm:text-sm lg:text-base text-navy/80 leading-relaxed">
                      <p>This is to certify that</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-navy border-b-2 border-gold/60 inline-block pb-0.5 sm:pb-1">
                        {certificate.studentName}
                      </p>
                      <p className="text-[10px] sm:text-xs lg:text-sm">
                        S/o D/o <strong>{certificate.fatherName}</strong>
                      </p>
                      <p>has successfully completed the course</p>
                      <p className="font-semibold text-navy text-sm sm:text-base lg:text-lg">
                        {certificate.courseName}
                      </p>
                      <p className="text-xs sm:text-sm">
                        with <span className={`font-bold ${getGradeColor(certificate.grade)}`}>{certificate.grade} Grade</span> securing <span className="font-bold text-navy">{certificate.percentage}%</span> marks
                      </p>
                    </div>

                    {/* Details Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-8 text-center">
                      <div>
                        <p className="text-[8px] sm:text-[9px] text-text-gray uppercase tracking-wider">Roll No</p>
                        <p className="text-[10px] sm:text-xs font-bold text-navy">{certificate.rollNumber}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] text-text-gray uppercase tracking-wider">Duration</p>
                        <p className="text-[10px] sm:text-xs font-bold text-navy">{certificate.courseDuration}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] text-text-gray uppercase tracking-wider">Batch</p>
                        <p className="text-[10px] sm:text-xs font-bold text-navy">{certificate.batchYear}</p>
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[9px] text-text-gray uppercase tracking-wider">Cert No</p>
                        <p className="text-[10px] sm:text-xs font-bold text-navy truncate">{certificate.certificateNo}</p>
                      </div>
                    </div>

                    {/* Stamp Section */}
                    <div className="flex items-end justify-between mt-4 sm:mt-8">
                      {/* Student Signature */}
                      <div className="text-center">
                        <div className="border-t border-navy/30 w-20 sm:w-32 mt-6 sm:mt-10 pt-1">
                          <p className="text-[8px] sm:text-[10px] text-text-gray">Student Signature</p>
                        </div>
                      </div>

                      {/* Institute Stamp — Circular */}
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border-3 sm:border-4 border-navy/40 rounded-full flex items-center justify-center mx-auto">
                          <div className="text-center">
                            <p className="text-[6px] sm:text-[7px] font-bold text-navy/70 leading-tight">Z-TECH</p>
                            <p className="text-[5px] sm:text-[6px] text-navy/50 leading-tight">CAREER</p>
                            <p className="text-[5px] sm:text-[6px] text-navy/50 leading-tight">ACADEMY</p>
                          </div>
                        </div>
                        <p className="text-[7px] sm:text-[8px] text-text-gray mt-0.5 sm:mt-1">Official Seal</p>
                      </div>

                      {/* Director Signature */}
                      <div className="text-center">
                        <div className="border-t border-navy/30 w-20 sm:w-32 mt-6 sm:mt-10 pt-1">
                          <p className="text-[8px] sm:text-[10px] text-text-gray">Director</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── QR Code & Institute Stamp Section ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-5 sm:mb-8">
                {/* QR Code */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm text-center">
                  <h5 className="text-sm sm:text-base font-bold text-navy mb-3 sm:mb-4 flex items-center justify-center gap-2">
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-green" />
                    QR Code
                  </h5>
                  {/* QR Code Placeholder — SVG generated */}
                  <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto bg-white border-2 border-navy/10 rounded-lg p-2 sm:p-3 shadow-inner">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* QR Code pattern — simplified visual representation */}
                      <rect width="100" height="100" fill="white" />
                      {/* Position detection patterns (corners) */}
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
                      {/* Green center accent */}
                      <rect x="43" y="43" width="14" height="14" fill="#28A745" rx="2" />
                      <rect x="46" y="46" width="8" height="8" fill="white" rx="1" />
                      <rect x="48" y="48" width="4" height="4" fill="#28A745" />
                    </svg>
                  </div>
                  <p className="text-[10px] sm:text-xs text-text-gray mt-2 sm:mt-3 max-w-[200px] sm:max-w-none mx-auto leading-relaxed">
                    Scan this QR code to verify certificate online
                  </p>
                  <a
                    href={certificate.qrCodeData}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green text-[10px] sm:text-xs font-semibold mt-1.5 sm:mt-2 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open Verification Link
                  </a>
                </div>

                {/* Institute Stamp & Details */}
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                  <h5 className="text-sm sm:text-base font-bold text-navy mb-3 sm:mb-4 flex items-center justify-center sm:justify-start gap-2">
                    <Stamp className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                    Institute Stamp & Details
                  </h5>

                  {/* Stamp Visual */}
                  <div className="flex justify-center sm:justify-start mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 border-3 sm:border-4 border-navy/30 rounded-full flex items-center justify-center relative">
                        {/* Outer ring text */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
                            <defs>
                              <path id="top-arc" d="M 20,50 A 30,30 0 0,1 80,50" fill="none" />
                              <path id="bottom-arc" d="M 80,50 A 30,30 0 0,1 20,50" fill="none" />
                            </defs>
                            <text font-size="7" fill="#0A2647" font-weight="600" letter-spacing="2">
                              <textPath href="#top-arc" startOffset="50%" text-anchor="middle">Z-TECH CAREER ACADEMY</textPath>
                            </text>
                            <text font-size="5.5" fill="#0A2647" font-weight="500" letter-spacing="1.5">
                              <textPath href="#bottom-arc" startOffset="50%" text-anchor="middle">KAITHAL, HARYANA</textPath>
                            </text>
                          </svg>
                        </div>
                        {/* Center emblem */}
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-navy/5 rounded-full flex items-center justify-center z-10">
                          <div className="text-center">
                            <p className="text-[8px] sm:text-[9px] font-extrabold text-navy leading-none">ZTCA</p>
                            <p className="text-[5px] sm:text-[6px] text-navy/60 leading-none mt-0.5">EST. 2012</p>
                          </div>
                        </div>
                      </div>
                      {/* Stamp date overlay */}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gold text-navy text-[7px] sm:text-[8px] font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">
                        {certificate.issueDate}
                      </div>
                    </div>
                  </div>

                  {/* Institute Contact Details */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 sm:gap-2.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0 mt-0.5" />
                      <p className="text-[10px] sm:text-xs text-text-gray leading-relaxed">Behind Jat School, Rishi Nagar, Gali No. 9, Kaithal, Haryana</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" />
                      <p className="text-[10px] sm:text-xs text-text-gray">92150-52018 / 86858-25071</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" />
                      <p className="text-[10px] sm:text-xs text-text-gray">ztca2012@gmail.com</p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold shrink-0" />
                      <p className="text-[10px] sm:text-xs text-text-gray">Owner: Vijay Kumar Singla (M.Com, MBA)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Certificate Validity Info ── */}
              <div className="bg-green/5 rounded-lg sm:rounded-xl p-3 sm:p-5 mb-5 sm:mb-8 border border-green/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-green shrink-0" />
                    <div>
                      <p className="text-[10px] sm:text-xs text-text-gray">Verification Status</p>
                      <p className="text-sm sm:text-base font-bold text-green">Authentic & Verified</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-navy shrink-0" />
                    <div>
                      <p className="text-[10px] sm:text-xs text-text-gray">Date of Issue</p>
                      <p className="text-sm sm:text-base font-bold text-navy">{certificate.issueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green shrink-0" />
                    <div>
                      <p className="text-[10px] sm:text-xs text-text-gray">Validity</p>
                      <p className="text-sm sm:text-base font-bold text-navy">{certificate.validUntil}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-green hover:bg-green-light text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Certificate
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-navy font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slow ping animation for verified badge */}
      <style jsx>{`
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
