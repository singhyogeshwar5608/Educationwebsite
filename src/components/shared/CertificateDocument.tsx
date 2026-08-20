import { useRef, useState, useEffect, type CSSProperties } from "react";
import jsPDF from "jspdf";
import { CERT_BG_BASE64 } from "@/admin/components/certBgBase64";

// Shared certificate document — renders the certificate at its native
// 1536x1024 (landscape) size with fields at the EXACT same coordinates used
// everywhere in the admin panel, so the public preview/download always matches.
const DESIGN_W = 1536;
const DESIGN_H = 1024;

export interface CertificateDoc {
  certificateNo: string;
  enrollmentNo: string;
  studentName: string;
  fatherName: string;
  course: string;
  duration: string;
  session: string;
  percentage: string;
  grade: string;
  date: string;
  instituteName: string;
}

interface CertField {
  x: number;
  y: number;
  w: number;
  fontSize: number;
  align: "left" | "center" | "right";
  bold: boolean;
  text: string;
}

// Single source of truth for every field's position + value.
function buildFields(doc: CertificateDoc): CertField[] {
  return [
    { x: 170, y: 40, w: 420, fontSize: 24, align: "left", bold: true, text: doc.certificateNo || "" },
    { x: 1140, y: 40, w: 250, fontSize: 24, align: "right", bold: true, text: doc.enrollmentNo || "" },
    { x: 500, y: 507, w: 560, fontSize: 32, align: "center", bold: true, text: doc.studentName || "" },
    { x: 350, y: 552, w: 560, fontSize: 30, align: "center", bold: true, text: doc.fatherName || "" },
    { x: 455, y: 598, w: 250, fontSize: 28, align: "right", bold: true, text: doc.enrollmentNo || "" },
    { x: 450, y: 682, w: 600, fontSize: 32, align: "center", bold: true, text: doc.course || "" },
    { x: 260, y: 739, w: 290, fontSize: 28, align: "center", bold: true, text: doc.duration || "" },
    { x: 600, y: 739, w: 290, fontSize: 28, align: "center", bold: true, text: doc.session || "" },
    { x: 1020, y: 739, w: 280, fontSize: 28, align: "right", bold: true, text: doc.percentage || "" },
    { x: 1000, y: 739, w: 240, fontSize: 28, align: "left", bold: true, text: doc.grade || "" },
    { x: 310, y: 891, w: 220, fontSize: 24, align: "center", bold: true, text: doc.date || "" },
    { x: 90, y: 960, w: 500, fontSize: 16, align: "left", bold: false, text: doc.instituteName },
  ];
}

export async function renderCertificateDoc(doc: CertificateDoc): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = DESIGN_W;
  canvas.height = DESIGN_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const bg = new Image();
  bg.src = CERT_BG_BASE64;
  await new Promise<void>((resolve, reject) => {
    bg.onload = () => resolve();
    bg.onerror = () => reject(new Error("Failed to load certificate background"));
  });
  ctx.drawImage(bg, 0, 0, DESIGN_W, DESIGN_H);

  ctx.fillStyle = "#000000";
  ctx.textBaseline = "top";
  for (const f of buildFields(doc)) {
    if (!f.text) continue;
    ctx.font = `${f.bold ? "600" : "400"} ${f.fontSize}px 'Times New Roman', Georgia, serif`;
    ctx.textAlign = f.align;
    let drawX = f.x;
    if (f.align === "center") drawX = f.x + f.w / 2;
    if (f.align === "right") drawX = f.x + f.w;
    ctx.fillText(f.text, drawX, f.y);
  }

  return canvas;
}

export async function downloadCertificateDoc(doc: CertificateDoc): Promise<void> {
  const canvas = await renderCertificateDoc(doc);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [DESIGN_W, DESIGN_H],
    hotfixes: ["px_scaling"],
  });
  pdf.addImage(imgData, "JPEG", 0, 0, DESIGN_W, DESIGN_H);
  pdf.save(`Certificate_${doc.certificateNo || doc.studentName || "Student"}.pdf`);
}

export default function CertificateDocument({
  doc,
  className = "",
}: {
  doc: CertificateDoc;
  className?: string;
}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const fields = buildFields(doc);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const abs = (
    x: number,
    y: number,
    w: number,
    fontSize: number,
    align: "left" | "center" | "right",
    bold: boolean,
  ): CSSProperties => ({
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    fontSize: `${fontSize}px`,
    fontWeight: bold ? 600 : 400,
    textAlign: align,
    lineHeight: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#000",
  });

  return (
    <div className={className}>
      <div ref={measureRef} className="w-full overflow-hidden relative">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: DESIGN_W,
            height: DESIGN_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div
            style={{
              width: DESIGN_W,
              height: DESIGN_H,
              position: "relative",
              overflow: "hidden",
              fontFamily: "'Times New Roman', Georgia, serif",
              backgroundImage: `url(${CERT_BG_BASE64})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {fields.map((f, i) => (
              <span key={i} style={abs(f.x, f.y, f.w, f.fontSize, f.align, f.bold)}>
                {f.text}
              </span>
            ))}
          </div>
        </div>
        <div style={{ height: DESIGN_H * scale, width: "100%" }} />
      </div>
    </div>
  );
}
