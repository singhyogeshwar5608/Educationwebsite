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
  @page { size: 595.28px 841.89px; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 595.28px; height: 841.89px; }
  .cp { position: relative; width: 595.28px; height: 841.89px; overflow: hidden; font-family: 'DejaVu Serif', Georgia, 'Times New Roman', serif; }
  .bg { position: absolute; top: 0; left: 0; width: 595.28px; height: 841.89px; z-index: 0; }

  /* Watermark overlay */
  .wm { position: absolute; top: 0; left: 0; width: 595.28px; height: 841.89px; z-index: 1; pointer-events: none; overflow: hidden; }
  .wm-text {
    position: absolute;
    left: -60px;
    width: 750px;
    font-size: 40px;
    font-weight: 800;
    color: rgba(10, 38, 71, 0.035);
    transform: rotate(-35deg);
    transform-origin: center center;
    white-space: nowrap;
    letter-spacing: 8px;
    text-align: center;
    line-height: 80px;
    font-family: 'DejaVu Serif', Georgia, serif;
  }

  /* Dynamic text fields — exact positions from PDF extraction (PyMuPDF) */
  .f { position: absolute; z-index: 10; color: #000000; font-weight: bold; line-height: 1.2; white-space: nowrap; }
  .s9 { font-size: 9pt; }
  .s11 { font-size: 11pt; }

  /* Row 1: Info table fields — y≈243.7pt */
  .c1 { left: 60.7px; top: 243.7px; }   /* Centre Code */
  .c2 { left: 168.8px; top: 243.7px; }  /* Session */
  .c3 { left: 261.7px; top: 243.7px; }  /* Enrollment No */
  .c4 { left: 388.9px; top: 243.7px; }  /* Roll No */
  .c5 { left: 484.1px; top: 243.7px; }  /* Serial No */

  /* Student Photo — left=248.8, top=281.7, 96×124.5 pts */
  .ph { position: absolute; z-index: 10; left: 248.8px; top: 281.7px; width: 96px; height: 124.5px; object-fit: cover; border: 1.5px solid #0056A0; border-radius: 1px; background: #fff; }

  /* Row 2: Student Name | DOB — y≈472pt */
  .c6 { left: 290px; top: 472px; }       /* Student Name */
  .c7 { left: 488px; top: 472px; }       /* DOB */

  /* Row 3: Father's Name | Mother's Name — y≈497.3pt */
  .c8 { left: 167.8px; top: 497.3px; }  /* Father's Name */
  .c9 { left: 438.4px; top: 497.3px; }  /* Mother's Name */

  /* Row 4: Course Name — y≈522.5pt */
  .c10 { left: 246.3px; top: 522.5px; text-align: center; } /* Course Name */

  /* Row 5: Duration | From | To — y≈545.2pt */
  .c11 { left: 201.1px; top: 545.2px; } /* Duration */
  .c12 { left: 375.1px; top: 545.2px; } /* From */
  .c13 { left: 491.4px; top: 545.2px; } /* To */

  /* Row 6: Completion/Exam Date — y≈569.7pt */
  .c14 { left: 470.7px; top: 569.7px; } /* Exam Date */

  /* Row 7: Institute/Study Centre — y≈594.1pt */
  .c15 { left: 298.1px; top: 594.1px; text-align: center; width: 260px; } /* Institute Name */

  /* Row 8: Percentage | Grade — y≈617.7pt */
  .c16 { left: 327.4px; top: 617.7px; text-align: center; width: 100px; } /* Percentage */
  .c17 { left: 535.8px; top: 617.7px; } /* Grade */

  /* QR Code — left=261.9, top=649.1, 70.1×70.1 pts */
  .qr { position: absolute; z-index: 10; left: 261.9px; top: 649.1px; width: 70.1px; height: 70.1px; border: 0.5px solid #000; background: #fff; }
</style>
</head>
<body>
<div class="cp">
  <img src="${bgDataUrl}" class="bg" alt="" />

  <!-- Watermark -->
  <div class="wm">
    ${Array.from({ length: 12 }, (_, i) =>
      `<div class="wm-text" style="top: ${-80 + i * 80}px;">${esc(data.instituteName || 'Z-TECH CAREER ACADEMY')}</div>`
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
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);

    const pdfBuffer = await page.pdf({
      width: "595.28px",
      height: "841.89px",
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
