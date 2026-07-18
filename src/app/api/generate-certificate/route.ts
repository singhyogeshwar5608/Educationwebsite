// ============================================================
// Certificate PDF Generation API Route
// POST /api/generate-certificate
// Generates a pixel-perfect certificate PDF matching the original template
// Uses Playwright to render HTML → vector PDF
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import QRCode from "qrcode";

const CERT_BG_PATH = path.join(process.cwd(), "public", "cert-assets", "certificate-bg.jpg");

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildCertificateHTML(
  data: Record<string, string>,
  bgDataUrl: string,
  qrDataUrl: string,
  photoDataUrl?: string
): string {
  const photoSrc = photoDataUrl
    ? `<img src="${photoDataUrl}" class="ph" alt="Photo" onerror="this.style.display='none'" />`
    : `<img src="${esc(data.photoUrl || "")}" class="ph" alt="Photo" onerror="this.style.display='none'" />`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { size: 595.28pt 841.89pt; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 595.28pt; height: 841.89pt; }
  .cp { position: relative; width: 595.28pt; height: 841.89pt; overflow: hidden; font-family: 'DejaVu Serif', Georgia, 'Times New Roman', serif; }
  .bg { position: absolute; top: 0; left: 0; width: 595.28pt; height: 841.89pt; z-index: 0; }

  /* Watermark overlay */
  .wm { position: absolute; top: 0; left: 0; width: 595.28pt; height: 841.89pt; z-index: 1; pointer-events: none; overflow: hidden; }
  .wm-text {
    position: absolute;
    left: -60pt;
    width: 750pt;
    font-size: 40pt;
    font-weight: 800;
    color: rgba(10, 38, 71, 0.035);
    transform: rotate(-35deg);
    transform-origin: center center;
    white-space: nowrap;
    letter-spacing: 8pt;
    text-align: center;
    line-height: 80pt;
    font-family: 'DejaVu Serif', Georgia, serif;
  }

  /* Dynamic text fields — exact positions from PDF extraction (PyMuPDF)
     Using PT units so Playwright's pdf() renders them at the exact same coordinates.
     Original PDF uses DejaVu Serif Condensed Bold at 9pt/11pt. */
  .f { position: absolute; z-index: 10; color: #000000; font-weight: bold; line-height: 1.2; white-space: nowrap; }
  .s9 { font-size: 9pt; }
  .s11 { font-size: 11pt; }

  /* Row 1: Info table fields — y=243.7pt */
  .c1 { left: 60.7pt; top: 243.7pt; }   /* Centre Code */
  .c2 { left: 168.8pt; top: 243.7pt; }  /* Session */
  .c3 { left: 261.7pt; top: 243.7pt; }  /* Enrollment No */
  .c4 { left: 388.9pt; top: 243.7pt; }  /* Roll No */
  .c5 { left: 484.1pt; top: 243.7pt; }  /* Serial No */

  /* Student Photo — left=248.8pt, top=281.7pt, 96×124.5pt */
  .ph { position: absolute; z-index: 10; left: 248.8pt; top: 281.7pt; width: 96pt; height: 124.5pt; object-fit: cover; border: 1.5pt solid #0056A0; border-radius: 1pt; background: #fff; }

  /* Row 2: Student Name | DOB — y=472pt */
  .c6 { left: 290pt; top: 472pt; }       /* Student Name */
  .c7 { left: 488pt; top: 472pt; }       /* DOB */

  /* Row 3: Father's Name | Mother's Name — y=497.3pt */
  .c8 { left: 167.8pt; top: 497.3pt; }  /* Father's Name */
  .c9 { left: 438.4pt; top: 497.3pt; }  /* Mother's Name */

  /* Row 4: Course Name — y=522.5pt — left-aligned like original */
  .c10 { left: 246.3pt; top: 522.5pt; } /* Course Name */

  /* Row 5: Duration | From | To — y=545.2pt */
  .c11 { left: 201.1pt; top: 545.2pt; } /* Duration */
  .c12 { left: 375.1pt; top: 545.2pt; } /* From */
  .c13 { left: 491.4pt; top: 545.2pt; } /* To */

  /* Row 6: Completion/Exam Date — y=569.7pt */
  .c14 { left: 470.7pt; top: 569.7pt; } /* Exam Date */

  /* Row 7: Institute/Study Centre — y=594.1pt — left-aligned, no text-align center */
  .c15 { left: 298.1pt; top: 594.1pt; } /* Institute Name */

  /* Row 8: Percentage | Grade — y=617.7pt — left-aligned */
  .c16 { left: 327.4pt; top: 617.7pt; } /* Percentage */
  .c17 { left: 535.8pt; top: 617.7pt; } /* Grade */

  /* QR Code — left=261.9pt, top=649.1pt, 70.1×70.1pt */
  .qr { position: absolute; z-index: 10; left: 261.9pt; top: 649.1pt; width: 70.1pt; height: 70.1pt; border: 0.5pt solid #000; background: #fff; }
</style>
</head>
<body>
<div class="cp">
  <img src="${bgDataUrl}" class="bg" alt="" />

  <!-- Watermark -->
  <div class="wm">
    ${Array.from({ length: 12 }, (_, i) =>
      `<div class="wm-text" style="top: ${-80 + i * 80}pt;">${esc(data.instituteName || 'Z-TECH CAREER ACADEMY')}</div>`
    ).join('\n    ')}
  </div>

  <!-- Row 1: Info Table -->
  <span class="f s9 c1">${esc(data.certNo)}</span>
  <span class="f s9 c2">${esc(data.session)}</span>
  <span class="f s9 c3">${esc(data.enrollmentNo)}</span>
  <span class="f s9 c4">${esc(data.rollNo)}</span>
  <span class="f s9 c5">${esc(data.regCode)}</span>

  <!-- Student Photo -->
  ${photoSrc}

  <!-- Row 2-8: Student Details -->
  <span class="f s11 c6">${esc(data.studentName)}</span>
  <span class="f s11 c7">${esc(data.dob)}</span>
  <span class="f s11 c8">${esc(data.fatherName)}</span>
  <span class="f s11 c9">${esc(data.motherName)}</span>
  <span class="f s11 c10">${esc(data.courseName)}</span>
  <span class="f s11 c11">${esc(data.duration)}</span>
  <span class="f s11 c12">${esc(data.startDate)}</span>
  <span class="f s11 c13">${esc(data.endDate)}</span>
  <span class="f s11 c14">${esc(data.issueDate)}</span>
  <span class="f s11 c15">${esc(data.instituteName)}</span>
  <span class="f s11 c16">${esc(data.percentage)}</span>
  <span class="f s11 c17">${esc(data.grade)}</span>

  <!-- QR Code -->
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

/**
 * Fetch a photo URL and convert to base64 data URL for embedding in Playwright HTML
 */
async function fetchPhotoAsDataUrl(url: string): Promise<string | undefined> {
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
    const data = await request.json();

    const required = ["certNo", "studentName", "courseName", "grade", "percentage"];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    if (!fs.existsSync(CERT_BG_PATH)) {
      return NextResponse.json({ error: "Certificate template not found" }, { status: 500 });
    }

    const bgBuffer = fs.readFileSync(CERT_BG_PATH);
    const bgDataUrl = `data:image/jpeg;base64,${bgBuffer.toString("base64")}`;

    const qrDataUrl = await generateQRDataURL(
      data.qrCodeUrl || `https://ztechacademy.in/verify/${data.certNo}`
    );

    // Try to embed the photo as base64 for reliable rendering in Playwright
    const photoDataUrl = data.photoUrl
      ? await fetchPhotoAsDataUrl(data.photoUrl)
      : undefined;

    const html = buildCertificateHTML(data, bgDataUrl, qrDataUrl, photoDataUrl);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    // Use deviceScaleFactor=2 for crisp rendering
    // Viewport 595×842 at 96dpi = A4 page in screen pixels
    await page.setViewportSize({ width: 595, height: 842 });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);

    // Generate PDF with exact A4 dimensions using mm units
    // 210mm × 297mm = A4 = 595.28pt × 841.89pt
    const pdfBuffer = await page.pdf({
      width: "210mm",
      height: "297mm",
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      printBackground: true,
    });

    await browser.close();

    const filename = `${(data.certNo || "certificate").replace(/\//g, "-")}-certificate.pdf`;
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate PDF" },
      { status: 500 }
    );
  }
}
