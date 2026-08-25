import { useRef, useState, useEffect, type CSSProperties } from "react";
import jsPDF from "jspdf";
import { CERT_BG_BASE64 } from "@/admin/components/certBgBase64";

// Base host for storage files (VITE_API_URL without /api suffix)
const STORAGE_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')

// Load an image for canvas use. Hostinger's CDN strips Access-Control-Allow-*
// headers from any URL ending in an image extension, which taints the canvas.
// So we fetch a base64 JSON payload from /api/storage-base64 (extension-free
// URL — treated as dynamic by the CDN, CORS survives) and draw a data: URL,
// which is always canvas-safe.
function loadImageCorsFallback(src: string): Promise<HTMLImageElement> {
  const load = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });

  // https://host/storage/students/x.jpg -> https://host/api/storage-base64?path=students/x.jpg
  const m = src.match(/\/storage\/(.+)$/);
  const proxySrc = `${STORAGE_BASE}/api/storage-base64?path=${encodeURIComponent(m ? m[1] : "")}`;

  return fetch(proxySrc)
    .then((r) => {
      if (!r.ok) throw new Error("proxy failed");
      return r.json();
    })
    .then((json) => {
      if (!json?.data) throw new Error("no data");
      return load(json.data as string);
    })
    .catch(() => load(src));
}

/** Format any date string to Indian standard DD-MM-YYYY */
function fmtDate(v?: string | null): string {
  if (!v) return "";
  if (/^\d{2}-\d{2}-\d{4}$/.test(v)) return v;
  const d = new Date(v);
  if (isNaN(d.getTime())) return v;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

// Shared certificate document — renders the certificate at its native
// 1600x1066 (landscape) size with fields at the EXACT same coordinates used
// everywhere in the admin panel, so the public preview/download always matches.
const DESIGN_W = 1600;
const DESIGN_H = 1066;

// Scale factor from old design (1536x1024) to new (1600x1066).
const SCALE_X = DESIGN_W / 1536;
const SCALE_Y = DESIGN_H / 1024;

function sX(x: number): number { return Math.round(x * SCALE_X) }
function sY(y: number): number { return Math.round(y * SCALE_Y) }
function sW(w: number): number { return Math.round(w * SCALE_X) }
function sH(h: number): number { return Math.round(h * SCALE_Y) }
function sF(f: number): number { return Math.round(f * SCALE_X) }

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
  photo?: string;
}

interface CertField {
  x: number;
  y: number;
  w: number;
  h?: number;
  fontSize: number;
  align: "left" | "center" | "right";
  bold: boolean;
  text: string;
  photoUrl?: string;
}

// Single source of truth for every field's position + value.
function buildFields(doc: CertificateDoc): CertField[] {
  const fields: CertField[] = [
    { x: sX(170), y: sY(40), w: sW(420), fontSize: sF(24), align: "left", bold: true, text: doc.certificateNo || "" },
    { x: sX(1140), y: sY(40), w: sW(250), fontSize: sF(24), align: "right", bold: true, text: doc.enrollmentNo || "" },
    { x: sX(500), y: sY(507), w: sW(560), fontSize: sF(32), align: "center", bold: true, text: doc.studentName || "" },
    { x: sX(350), y: sY(552), w: sW(560), fontSize: sF(30), align: "center", bold: true, text: doc.fatherName || "" },
    { x: sX(455), y: sY(598), w: sW(250), fontSize: sF(28), align: "right", bold: true, text: doc.enrollmentNo || "" },
    { x: sX(450), y: sY(682), w: sW(600), fontSize: sF(32), align: "center", bold: true, text: doc.course || "" },
    { x: sX(260), y: sY(739), w: sW(290), fontSize: sF(28), align: "center", bold: true, text: doc.duration || "" },
    { x: sX(600), y: sY(739), w: sW(290), fontSize: sF(28), align: "center", bold: true, text: doc.session || "" },
    { x: sX(1020), y: sY(739), w: sW(280), fontSize: sF(28), align: "right", bold: true, text: doc.percentage || "" },
    { x: sX(1000), y: sY(739), w: sW(240), fontSize: sF(28), align: "left", bold: true, text: doc.grade || "" },
    { x: sX(310), y: sY(891), w: sW(220), fontSize: sF(24), align: "center", bold: true, text: fmtDate(doc.date) },
    { x: sX(90), y: sY(960), w: sW(500), fontSize: sF(16), align: "left", bold: false, text: doc.instituteName },
  ];

  // Student photo (positioned like marksheet: right side, near top)
  // Note: CertificateDoc doesn't have photoUrl — caller should pass it via a prop or we skip here.
  // For now, photo is only rendered on admin preview where student object is available.
  // Public verify page uses CertificateDocument with CertificateDoc (no photo).
  return fields;
}

export async function renderCertificateDoc(doc: CertificateDoc, photoUrl?: string): Promise<HTMLCanvasElement> {
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
  const fields = buildFields(doc);
  if (photoUrl) {
    fields.push({
      x: sX(1280),
      y: sY(298),
      w: sW(180),
      h: sH(235),
      fontSize: 0,
      align: "left",
      bold: false,
      text: "__PHOTO__",
      photoUrl,
    });
  }
  for (const f of fields) {
    if (!f.text) continue;
    if (f.text === "__PHOTO__" && f.photoUrl) {
      const img = await loadImageCorsFallback(f.photoUrl);
      ctx.drawImage(img, f.x, f.y, f.w, f.h ?? (f.w * img.height) / img.width);
      continue;
    }
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
  const canvas = await renderCertificateDoc(doc, doc.photo || undefined);
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
            {doc.photo && (
              <img
                src={doc.photo}
                alt=""
                style={{
                  position: "absolute",
                  left: sX(1280),
                  top: sY(298),
                  width: sW(180),
                  height: sH(235),
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        </div>
        <div style={{ height: DESIGN_H * scale, width: "100%" }} />
      </div>
    </div>
  );
}
