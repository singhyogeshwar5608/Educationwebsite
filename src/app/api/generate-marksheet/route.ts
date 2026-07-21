// ============================================================
// Marksheet PDF Generation API Route
// POST /api/generate-marksheet
// Generates a pixel-perfect marksheet PDF matching the original template
// Uses SVG <text> for all dynamic text — guarantees transparent background in PDF
// HTML <div>/<span> elements have an implicit white bounding box in Playwright page.pdf()
// SVG <text> elements have NO bounding box — pure text with transparent background
// All positions extracted from original PDF via PyMuPDF for exact alignment
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import QRCode from "qrcode";

const MARKSHEET_BG_PATH = path.join(
  process.cwd(),
  "public",
  "cert-assets",
  "marksheet-bg.jpg"
);

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const MAX_SUBJECT_ROWS = 5;

// Positions from original PDF extraction (PyMuPDF)
// These are y_top values from original PDF text bboxes
// SVG <text> y attribute = baseline position = y_top + font_size
const INFO_Y_TOP = 225.2;
const STUDENT_Y_TOPS = [255.9, 272.4, 289.2, 304.8, 320.4, 336.4, 351.5];
const ROW_Y_TOPS = [413.4, 430.7, 448.0, 465.3, 482.6];
const TOTAL_Y_TOP = 500.7;
const PERCENT_Y_TOP = 621.8;
const EXAM_Y_TOP = 650.4;

// Baseline offsets: SVG <text> y = top + font_size (approx baseline for most fonts)
const BL9 = 9;
const BL96 = 9.6;

interface SubjectMarkEntry {
  name: string;
  maxTheory: number;
  maxPractical: number;
  minTheory: number;
  minPractical: number;
  obtainedTheory: number;
  obtainedPractical: number;
  obtainedTotal: number;
}

interface MarksheetData {
  centreCode: string;
  session: string;
  enrollmentNo: string;
  rollNo: string;
  serialNo: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  courseName: string;
  instituteName: string;
  year: string;
  subjects: SubjectMarkEntry[];
  totalMaxTheory: number;
  totalMaxPractical: number;
  totalMinTheory: number;
  totalMinPractical: number;
  grandTotal: number;
  percentage: string;
  grade: string;
  examSession: string;
  examDate: string;
  photoUrl?: string;
  qrCodeUrl?: string;
}

function buildMarksheetHTML(
  data: MarksheetData,
  bgDataUrl: string,
  qrDataUrl: string,
  photoDataUrl?: string
): string {
  const photoHTML = photoDataUrl
    ? `<img src="${photoDataUrl}" class="photo" alt="Photo" onerror="this.style.display='none'" />`
    : data.photoUrl
    ? `<img src="${esc(data.photoUrl)}" class="photo" alt="Photo" onerror="this.style.display='none'" />`
    : "";

  // Build subject rows as SVG <text> elements — exact positions from original PDF
  let subjectRowsSVG = "";
  for (let i = 0; i < MAX_SUBJECT_ROWS; i++) {
    const sub = data.subjects[i];
    const yTop = ROW_Y_TOPS[i];
    if (sub) {
      const yBase = yTop + BL96;
      subjectRowsSVG += `
      <text x="32.0" y="${yBase}" class="s96">${esc(sub.name)}</text>
      <text x="310.0" y="${yBase}" class="s96">${sub.maxTheory}</text>
      <text x="352.0" y="${yBase}" class="s96">${sub.maxPractical}</text>
      <text x="393.9" y="${yBase}" class="s96">${sub.minTheory}</text>
      <text x="438.6" y="${yBase}" class="s96">${sub.minPractical}</text>
      <text x="473.7" y="${yBase}" class="s96b">${sub.obtainedTheory}</text>
      <text x="501.3" y="${yBase}" class="s96b">${sub.obtainedPractical}</text>
      <text x="536.9" y="${yBase}" class="s96b">${sub.obtainedTotal}</text>`;
    }
  }

  // Compute baseline Y values for each section
  const infoBaseY = INFO_Y_TOP + BL9;
  const studentBaseYs = STUDENT_Y_TOPS.map(v => v + BL9);
  const totalBaseY = TOTAL_Y_TOP + BL96;
  const percentBaseY = PERCENT_Y_TOP + BL9;
  const examBaseY = EXAM_Y_TOP + BL9;

  // Grade may have suffix like "A+" — split into main and suffix
  const gradeChar = data.grade.charAt(0);
  const gradeSuffix = data.grade.length > 1 ? data.grade.substring(1) : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: 595.28pt 841.89pt; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 595.28pt; height: 841.89pt; }
  .cp { position: relative; width: 595.28pt; height: 841.89pt; overflow: hidden; }
  .bg { position: absolute; top: 0; left: 0; width: 595.28pt; height: 841.89pt; z-index: 0; }

  /* SVG overlay — covers entire page, transparent by default
     SVG <text> has NO bounding box background — renders as pure text strokes
     This is the key fix: HTML <div>/<span> elements have white bounding boxes in PDF,
     but SVG <text> elements render with fully transparent background */
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 595.28pt;
    height: 841.89pt;
    z-index: 10;
    pointer-events: none;
  }
  .overlay text {
    fill: #000000;
    font-family: 'DejaVu Sans', 'DejaVu Sans Condensed', Arial, sans-serif;
  }
  .s9 { font-size: 9pt; font-weight: bold; }
  .s96 { font-size: 9.6pt; font-weight: normal; }
  .s96b { font-size: 9.6pt; font-weight: bold; }

  /* Photo & QR — these need white background so they remain as HTML <img> */
  .photo {
    position: absolute;
    z-index: 10;
    left: 487.5pt;
    top: 255.5pt;
    width: 82.2pt;
    height: 105.8pt;
    object-fit: cover;
    border: 1pt solid #0056A0;
    background: #fff;
  }
  .qr {
    position: absolute;
    z-index: 10;
    left: 261.0pt;
    top: 678.1pt;
    width: 71.3pt;
    height: 71.3pt;
    border: 0.5pt solid #000;
    background: #fff;
  }
</style>
</head>
<body>
<div class="cp">
  <img src="${bgDataUrl}" class="bg" alt="" />

  <!-- Student Photo — HTML <img> with intentional white background -->
  ${photoHTML}

  <!-- ═══════════════════════════════════════════════════════════
       SVG overlay for ALL dynamic text fields
       SVG <text> = NO white bounding box = transparent background in PDF
       This is the fix: every dynamic text field uses SVG <text> instead of HTML <div>
       ═══════════════════════════════════════════════════════════ -->
  <svg class="overlay" viewBox="0 0 595.28 841.89" xmlns="http://www.w3.org/2000/svg">

    <!-- Row 1: Info Table — positions from original PDF -->
    <text x="61.7" y="${infoBaseY}" class="s9">${esc(data.centreCode)}</text>
    <text x="168.8" y="${infoBaseY}" class="s9">${esc(data.session)}</text>
    <text x="263.4" y="${infoBaseY}" class="s9">${esc(data.enrollmentNo)}</text>
    <text x="388.9" y="${infoBaseY}" class="s9">${esc(data.rollNo)}</text>
    <text x="492.5" y="${infoBaseY}" class="s9">${esc(data.serialNo)}</text>

    <!-- Row 2-7: Student Details -->
    <text x="220.3" y="${studentBaseYs[0]}" class="s9">${esc(data.studentName)}</text>
    <text x="220.3" y="${studentBaseYs[1]}" class="s9">${esc(data.fatherName)}</text>
    <text x="220.3" y="${studentBaseYs[2]}" class="s9">${esc(data.motherName)}</text>
    <text x="220.3" y="${studentBaseYs[3]}" class="s9">${esc(data.dob)}</text>
    <text x="220.3" y="${studentBaseYs[4]}" class="s9">${esc(data.courseName)}</text>
    <text x="220.3" y="${studentBaseYs[5]}" class="s9">${esc(data.instituteName)}</text>
    <text x="220.3" y="${studentBaseYs[6]}" class="s9">${esc(data.year)}</text>

    <!-- Subject Rows -->
    ${subjectRowsSVG}

    <!-- Total Row -->
    <text x="306.7" y="${totalBaseY}" class="s96b">${data.totalMaxTheory}</text>
    <text x="348.3" y="${totalBaseY}" class="s96b">${data.totalMaxPractical}</text>
    <text x="390.6" y="${totalBaseY}" class="s96b">${data.totalMinTheory}</text>
    <text x="435.1" y="${totalBaseY}" class="s96b">${data.totalMinPractical}</text>
    <text x="533.9" y="${totalBaseY}" class="s96b">${data.grandTotal}</text>

    <!-- Bottom Section -->
    <text x="357.2" y="${percentBaseY}" class="s9">${esc(data.percentage)}</text>
    <text x="458.9" y="${percentBaseY}" class="s9">${esc(gradeChar)}</text>
    ${gradeSuffix ? `<text x="458.9" y="${percentBaseY + 12}" class="s9">${esc(gradeSuffix)}</text>` : ""}
    <text x="297.6" y="${examBaseY}" class="s9">${esc(data.examSession)}</text>
    <text x="482.2" y="${examBaseY}" class="s9">${esc(data.examDate)}</text>

  </svg>

  <!-- QR Code — HTML <img> with intentional white background -->
  <img src="${qrDataUrl}" class="qr" alt="QR" />
</div>
</body>
</html>`;
}

async function generateQRDataURL(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 225,
      margin: 1,
      color: { dark: "#0A2647", light: "#ffffff" },
    });
  } catch {
    return "";
  }
}

async function fetchPhotoAsDataUrl(
  url: string
): Promise<string | undefined> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return undefined;
    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: MarksheetData = await request.json();

    const required: (keyof MarksheetData)[] = [
      "studentName", "courseName", "year", "subjects", "percentage", "grade",
    ];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!data.subjects || data.subjects.length === 0) {
      return NextResponse.json(
        { error: "At least one subject is required" },
        { status: 400 }
      );
    }
    if (data.subjects.length > MAX_SUBJECT_ROWS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_SUBJECT_ROWS} subjects allowed` },
        { status: 400 }
      );
    }

    if (!fs.existsSync(MARKSHEET_BG_PATH)) {
      return NextResponse.json(
        { error: "Marksheet template not found" },
        { status: 500 }
      );
    }

    const bgBuffer = fs.readFileSync(MARKSHEET_BG_PATH);
    const bgDataUrl = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

    const qrDataUrl = await generateQRDataURL(
      data.qrCodeUrl ||
        `https://ztechacademy.in/verify/${data.rollNo || data.enrollmentNo}`
    );

    const photoDataUrl = data.photoUrl
      ? await fetchPhotoAsDataUrl(data.photoUrl)
      : undefined;

    const html = buildMarksheetHTML(data, bgDataUrl, qrDataUrl, photoDataUrl);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 595, height: 842 });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    const pdfBuffer = await page.pdf({
      width: "210mm",
      height: "297mm",
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      printBackground: true,
    });

    await browser.close();

    const rollNo = data.rollNo || data.enrollmentNo || "marksheet";
    const yearSuffix = data.year === "2nd Year" ? "2nd-year" : "1st-year";
    const filename = `${rollNo.replace(/\//g, "-")}-marksheet-${yearSuffix}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Marksheet generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate marksheet PDF" },
      { status: 500 }
    );
  }
}
