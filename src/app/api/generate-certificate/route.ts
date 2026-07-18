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
  qrDataUrl: string
): string {
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
  .f { position: absolute; z-index: 10; color: #000000; font-weight: bold; line-height: 1.2; white-space: nowrap; }
  .s9 { font-size: 9pt; }
  .s11 { font-size: 11pt; }
  .c1 { left: 60.7px; top: 243.7px; width: 120px; }
  .c2 { left: 168.8px; top: 243.7px; width: 80px; }
  .c3 { left: 261.7px; top: 243.7px; width: 120px; }
  .c4 { left: 388.9px; top: 243.7px; width: 60px; }
  .c5 { left: 484.1px; top: 243.7px; width: 80px; }
  .ph { position: absolute; z-index: 10; left: 248.8px; top: 281.7px; width: 96px; height: 124.5px; object-fit: cover; }
  .c6 { left: 290px; top: 472px; width: 200px; }
  .c7 { left: 488px; top: 472px; width: 120px; }
  .c8 { left: 167.8px; top: 497.3px; width: 180px; }
  .c9 { left: 438.4px; top: 497.3px; width: 180px; }
  .c10 { left: 246.3px; top: 522.5px; width: 250px; text-align: center; }
  .c11 { left: 201.1px; top: 545.2px; width: 80px; }
  .c12 { left: 375.1px; top: 545.2px; width: 100px; }
  .c13 { left: 491.4px; top: 545.2px; width: 100px; }
  .c14 { left: 470.7px; top: 569.7px; width: 100px; }
  .c15 { left: 298.1px; top: 594.1px; width: 260px; text-align: center; }
  .c16 { left: 327.4px; top: 617.7px; width: 100px; text-align: center; }
  .c17 { left: 535.8px; top: 617.7px; width: 40px; }
  .qr { position: absolute; z-index: 10; left: 261.9px; top: 649.1px; width: 70.1px; height: 70.1px; }
</style>
</head>
<body>
<div class="cp">
  <img src="${bgDataUrl}" class="bg" alt="" />
  <span class="f s9 c1">${esc(data.certNo)}</span>
  <span class="f s9 c2">${esc(data.session)}</span>
  <span class="f s9 c3">${esc(data.enrollmentNo)}</span>
  <span class="f s9 c4">${esc(data.rollNo)}</span>
  <span class="f s9 c5">${esc(data.regCode)}</span>
  <img src="${esc(data.photoUrl)}" class="ph" alt="Photo" onerror="this.style.display='none'" />
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
  <span class="f s11 c16">${esc(data.percentage)}%</span>
  <span class="f s11 c17">${esc(data.grade)}</span>
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
      color: { dark: "#000000", light: "#ffffff" },
    });
  } catch {
    return "";
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

    const html = buildCertificateHTML(data, bgDataUrl, qrDataUrl);

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
