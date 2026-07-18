"use client";

import { useRef } from "react";
import {
  Download,
  Award,
  User,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Star,
  Printer,
  Calendar,
  Hash,
} from "lucide-react";
import type { StudentResult } from "@/data/results";

interface ResultCardProps {
  result: StudentResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const printContent = cardRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Marksheet - ${result.studentName} - ${result.rollNumber}</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Poppins', sans-serif; padding: 40px; color: #0A2647; }
          .header { text-align: center; border-bottom: 3px double #0A2647; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { font-size: 22px; font-weight: 800; color: #0A2647; letter-spacing: 1px; }
          .header p { font-size: 12px; color: #666; margin-top: 4px; }
          .student-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .student-left { flex: 1; }
          .student-left p { font-size: 13px; margin-bottom: 6px; }
          .student-left strong { font-weight: 600; }
          .student-right { text-align: right; }
          .student-right p { font-size: 13px; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background: #0A2647; color: white; padding: 10px 12px; font-size: 12px; text-align: left; }
          td { padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #e5e7eb; }
          tr:nth-child(even) td { background: #F8F9FA; }
          .summary { display: flex; justify-content: space-between; margin-top: 20px; padding: 15px 20px; background: #F0F8FF; border-radius: 8px; }
          .summary-item { text-align: center; }
          .summary-item .label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .summary-item .value { font-size: 18px; font-weight: 700; color: #0A2647; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .footer p { font-size: 10px; color: #999; }
          .signatures { display: flex; justify-content: space-between; margin-top: 40px; }
          .sig-box { text-align: center; width: 200px; }
          .sig-line { border-top: 1px solid #0A2647; margin-top: 50px; padding-top: 5px; font-size: 11px; color: #0A2647; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Z-TECH CAREER ACADEMY</h1>
          <p>Behind Jat School, Rishi Nagar, Gali No. 9, Kaithal, Haryana</p>
          <p style="margin-top:8px; font-weight:600; font-size:14px; color:#0A2647;">STATEMENT OF MARKS</p>
        </div>
        <div class="student-info">
          <div class="student-left">
            <p><strong>Name:</strong> ${result.studentName}</p>
            <p><strong>Father's Name:</strong> ${result.fatherName}</p>
            <p><strong>Course:</strong> ${result.courseName}</p>
            <p><strong>Duration:</strong> ${result.courseDuration}</p>
          </div>
          <div class="student-right">
            <p><strong>Roll No:</strong> ${result.rollNumber}</p>
            <p><strong>Batch:</strong> ${result.batchYear}</p>
            <p><strong>Certificate No:</strong> ${result.certificateNo}</p>
            <p><strong>Date of Issue:</strong> ${result.issueDate}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Subject</th>
              <th>Max Marks</th>
              <th>Obtained Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${result.subjects
              .map(
                (s, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${s.subject}</td>
                <td>${s.maxMarks}</td>
                <td><strong>${s.obtainedMarks}</strong></td>
                <td style="color: ${s.obtainedMarks >= s.maxMarks * 0.33 ? "#28A745" : "#dc2626"}">${s.obtainedMarks >= s.maxMarks * 0.33 ? "PASS" : "FAIL"}</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background:#0A2647 !important;">
              <td colspan="2" style="color:white; font-weight:700;">TOTAL</td>
              <td style="color:white; font-weight:700;">${result.totalMaxMarks}</td>
              <td style="color:#FFC107; font-weight:700;">${result.totalObtainedMarks}</td>
              <td style="color:${result.resultStatus === "FAIL" ? "#f87171" : "#34d058"}; font-weight:700;">${result.resultStatus}</td>
            </tr>
          </tbody>
        </table>
        <div class="summary">
          <div class="summary-item">
            <div class="label">Percentage</div>
            <div class="value">${result.percentage}%</div>
          </div>
          <div class="summary-item">
            <div class="label">Grade</div>
            <div class="value">${result.grade}</div>
          </div>
          <div class="summary-item">
            <div class="label">Result</div>
            <div class="value" style="color:${result.resultStatus === "FAIL" ? "#dc2626" : result.resultStatus === "DISTINCTION" ? "#FFC107" : "#28A745"}">${result.resultStatus}</div>
          </div>
        </div>
        <div class="signatures">
          <div class="sig-box"><div class="sig-line">Student Signature</div></div>
          <div class="sig-box"><div class="sig-line">Director Signature</div></div>
        </div>
        <div class="footer">
          <p>This is a computer-generated marksheet from Z-TECH CAREER ACADEMY.</p>
          <p>Owner: Vijay Kumar Singla (M.Com, MBA) | Email: ztca2012@gmail.com</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "text-gold";
      case "A":
        return "text-green";
      case "B":
        return "text-blue-600";
      case "C":
        return "text-orange-500";
      case "D":
        return "text-yellow-600";
      case "F":
        return "text-red-500";
      default:
        return "text-navy";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DISTINCTION":
        return "bg-gold/20 text-navy border-gold/30";
      case "PASS":
        return "bg-green/20 text-green border-green/30";
      case "FAIL":
        return "bg-red-100 text-red-600 border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return "bg-gold";
    if (percentage >= 60) return "bg-green";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 33) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <section className="py-5 sm:py-8 lg:py-12 bg-light-gray relative">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Premium Glass Card */}
        <div className="relative" ref={cardRef}>
          {/* Gradient border glow */}
          <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-navy via-gold to-navy-light rounded-xl sm:rounded-3xl opacity-25 blur-sm" />

          <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl sm:rounded-3xl shadow-2xl overflow-hidden">
            {/* ══════════════════════════════════════════
                Card Header — Navy Banner
            ══════════════════════════════════════════ */}
            <div className="bg-navy relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDR2LTJtMC0xNmgtMnY0aDJ2LTRtLTQgMGgtMnYyaDJ2LTJtMiA0aDJ2LTJoLTJ2Mm0tNCAyaC0ydjJoMnYtMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 relative z-10">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                  {/* Student Photo */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-gold/50 shadow-xl bg-white/10">
                      <img
                        src={result.photo}
                        alt={result.studentName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(result.studentName)}&background=0A2647&color=FFC107&size=112&bold=true`;
                        }}
                      />
                    </div>
                    {/* Grade Badge on photo */}
                    <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 bg-gold text-navy font-extrabold text-sm sm:text-lg w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                      {result.grade}
                    </div>
                  </div>

                  {/* Student Info */}
                  <div className="text-center sm:text-left flex-1 min-w-0">
                    <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 truncate">
                      {result.studentName}
                    </h3>
                    <p className="text-blue-200/80 text-xs sm:text-sm mb-2 sm:mb-3">
                      Father: {result.fatherName}
                    </p>
                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg truncate max-w-full">
                        <Hash className="w-3 h-3 shrink-0" />
                        <span className="truncate">{result.rollNumber}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg truncate max-w-full">
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span className="truncate">{result.courseName}</span>
                      </span>
                    </div>
                  </div>

                  {/* Result Status Badge */}
                  <div className="shrink-0">
                    <div
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border ${getStatusBadge(
                        result.resultStatus
                      )}`}
                    >
                      {result.resultStatus === "FAIL" ? (
                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                      {result.resultStatus}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════
                Card Body
            ══════════════════════════════════════════ */}
            <div className="p-4 sm:p-6 lg:p-10">
              {/* Quick Info Row — 2x2 on mobile, 4-col on sm+ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-5 sm:mb-8">
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Batch</p>
                  <p className="text-xs sm:text-sm font-bold text-navy">{result.batchYear}</p>
                </div>
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Duration</p>
                  <p className="text-xs sm:text-sm font-bold text-navy">{result.courseDuration}</p>
                </div>
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Grade</p>
                  <p className={`text-xs sm:text-sm font-bold ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </p>
                </div>
                <div className="bg-light-blue rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-center border border-navy/5">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-navy mx-auto mb-0.5 sm:mb-1" />
                  <p className="text-[10px] sm:text-xs text-text-gray">Percentage</p>
                  <p className={`text-xs sm:text-sm font-bold ${getGradeColor(result.grade)}`}>
                    {result.percentage}%
                  </p>
                </div>
              </div>

              {/* ── Subject-wise Marks Table ── */}
              <div className="mb-5 sm:mb-8">
                <h4 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  Subject-wise Marks
                </h4>

                {/* Mobile: Card layout for each subject */}
                <div className="sm:hidden space-y-2">
                  {result.subjects.map((subject, index) => {
                    const isPass = subject.obtainedMarks >= subject.maxMarks * 0.33;
                    const pct = Math.round((subject.obtainedMarks / subject.maxMarks) * 100);
                    return (
                      <div
                        key={index}
                        className={`rounded-lg border p-3 ${
                          index % 2 === 0 ? "bg-white border-gray-100" : "bg-light-gray border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-navy flex-1 min-w-0 mr-2 truncate">
                            <span className="text-text-gray font-normal text-xs mr-1">{index + 1}.</span>
                            {subject.subject}
                          </p>
                          <span
                            className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isPass ? "bg-green/10 text-green" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {isPass ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                            {isPass ? "PASS" : "FAIL"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`${getProgressBarColor(pct)} h-1.5 rounded-full transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-navy shrink-0">
                            {subject.obtainedMarks}/{subject.maxMarks}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {/* Total Row Mobile */}
                  <div className="bg-navy text-white rounded-lg p-3 flex items-center justify-between">
                    <span className="font-bold text-sm">TOTAL</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gold font-bold text-sm">{result.totalObtainedMarks}/{result.totalMaxMarks}</span>
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(result.resultStatus)}`}>
                        {result.resultStatus === "FAIL" ? <XCircle className="w-2.5 h-2.5" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
                        {result.resultStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop: Table layout */}
                <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="text-left px-4 py-3 text-sm font-semibold">S.No.</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold">Subject</th>
                        <th className="text-center px-4 py-3 text-sm font-semibold">Max Marks</th>
                        <th className="text-center px-4 py-3 text-sm font-semibold">Obtained</th>
                        <th className="text-center px-4 py-3 text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.subjects.map((subject, index) => {
                        const isPass = subject.obtainedMarks >= subject.maxMarks * 0.33;
                        return (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-light-gray"
                            } hover:bg-light-blue transition-colors`}
                          >
                            <td className="px-4 py-3 text-sm text-text-gray">{index + 1}</td>
                            <td className="px-4 py-3 text-sm font-medium text-navy">{subject.subject}</td>
                            <td className="px-4 py-3 text-sm text-center text-text-gray">{subject.maxMarks}</td>
                            <td className="px-4 py-3 text-sm text-center font-bold text-navy">{subject.obtainedMarks}</td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                  isPass
                                    ? "bg-green/10 text-green"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {isPass ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <XCircle className="w-3 h-3" />
                                )}
                                {isPass ? "PASS" : "FAIL"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {/* Total Row */}
                      <tr className="bg-navy text-white">
                        <td className="px-4 py-3 text-sm font-bold" colSpan={2}>TOTAL</td>
                        <td className="px-4 py-3 text-sm text-center font-bold">{result.totalMaxMarks}</td>
                        <td className="px-4 py-3 text-sm text-center font-bold text-gold">{result.totalObtainedMarks}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadge(
                              result.resultStatus
                            )}`}
                          >
                            {result.resultStatus === "FAIL" ? (
                              <XCircle className="w-3 h-3" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {result.resultStatus}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Performance Visual ── */}
              <div className="mb-5 sm:mb-8">
                <h4 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                  Performance Overview
                </h4>

                <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 bg-light-blue rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-navy/5">
                  {/* Circular Progress */}
                  <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke={result.percentage >= 75 ? "#FFC107" : result.percentage >= 50 ? "#28A745" : result.percentage >= 33 ? "#f97316" : "#ef4444"}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={`${(result.percentage / 100) * 314} 314`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-xl sm:text-3xl font-extrabold ${getGradeColor(result.grade)}`}>
                        {result.percentage}%
                      </span>
                      <span className="text-[10px] sm:text-xs text-text-gray font-medium">Overall</span>
                    </div>
                  </div>

                  {/* Subject Progress Bars */}
                  <div className="flex-1 w-full space-y-2 sm:space-y-3">
                    {result.subjects.map((subject, index) => {
                      const pct = Math.round((subject.obtainedMarks / subject.maxMarks) * 100);
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                            <span className="text-[10px] sm:text-xs font-medium text-navy truncate max-w-[120px] sm:max-w-[180px]">
                              {subject.subject}
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold text-text-gray ml-2 shrink-0">
                              {subject.obtainedMarks}/{subject.maxMarks}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2.5">
                            <div
                              className={`${getProgressBarColor(pct)} h-1.5 sm:h-2.5 rounded-full transition-all duration-700 ease-out`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── Summary Stats ── */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-8">
                <div className="text-center p-3 sm:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20">
                  <Star className="w-4 h-4 sm:w-6 sm:h-6 text-gold mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-extrabold text-navy">{result.grade}</p>
                  <p className="text-[9px] sm:text-xs text-text-gray font-medium">Grade</p>
                </div>
                <div className="text-center p-3 sm:p-5 rounded-lg sm:rounded-xl bg-gradient-to-br from-green/10 to-green/5 border border-green/20">
                  <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-green mx-auto mb-1 sm:mb-2" />
                  <p className="text-lg sm:text-2xl font-extrabold text-navy">{result.percentage}%</p>
                  <p className="text-[9px] sm:text-xs text-text-gray font-medium">Percentage</p>
                </div>
                <div
                  className={`text-center p-3 sm:p-5 rounded-lg sm:rounded-xl ${
                    result.resultStatus === "FAIL"
                      ? "bg-gradient-to-br from-red-100 to-red-50 border border-red-200"
                      : result.resultStatus === "DISTINCTION"
                      ? "bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20"
                      : "bg-gradient-to-br from-green/10 to-green/5 border border-green/20"
                  }`}
                >
                  {result.resultStatus === "FAIL" ? (
                    <XCircle className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 mx-auto mb-1 sm:mb-2" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-green mx-auto mb-1 sm:mb-2" />
                  )}
                  <p className="text-sm sm:text-2xl font-extrabold text-navy">{result.resultStatus}</p>
                  <p className="text-[9px] sm:text-xs text-text-gray font-medium">Result</p>
                </div>
              </div>

              {/* ── Certificate Info ── */}
              <div className="bg-light-blue rounded-lg sm:rounded-xl p-3 sm:p-4 mb-5 sm:mb-8 border border-navy/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-text-gray">
                    <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-navy shrink-0" />
                    <span>Certificate No: <strong className="text-navy">{result.certificateNo}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-text-gray">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-navy shrink-0" />
                    <span>Issued: <strong className="text-navy">{result.issueDate}</strong></span>
                  </div>
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download Marksheet
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
    </section>
  );
}
