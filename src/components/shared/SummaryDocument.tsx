import { useRef, useState, useEffect } from "react";
import jsPDF from "jspdf";

export interface SummaryDoc {
  studentName: string;
  fatherName: string;
  motherName: string;
  registrationNo: string;
  dob: string;
  course: string;
  duration: string;
  grade: string;
  batch: string;
  instituteName: string;
}

const DESIGN_W = 1131;
const DESIGN_H = 1600;

const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

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

function ellipsize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 1 && ctx.measureText(truncated + "…").width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + "…";
}

function fieldRows(doc: SummaryDoc): { label: string; value: string }[] {
  return [
    { label: "Student Name", value: doc.studentName || "" },
    { label: "Father's Name", value: doc.fatherName || "" },
    { label: "Mother's Name", value: doc.motherName || "" },
    { label: "Registration Number", value: doc.registrationNo || "" },
    { label: "Date of Birth", value: fmtDate(doc.dob) || "" },
    { label: "Course", value: doc.course || "" },
    { label: "Duration", value: doc.duration || "" },
    { label: "Grade", value: doc.grade || "" },
    { label: "Period (Batch)", value: doc.batch || "" },
  ];
}

export async function renderSummaryCanvas(doc: SummaryDoc): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = DESIGN_W;
  canvas.height = DESIGN_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  // Plain white page
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, DESIGN_W, DESIGN_H);

  // Full-page border (all four sides)
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, DESIGN_W - 80, DESIGN_H - 80);

  // Simple centered header text
  const institute = doc.instituteName || "Z-TECH CAREER ACADEMY";
  ctx.fillStyle = "#000000";
  ctx.font = `700 42px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(ellipsize(ctx, institute, DESIGN_W - 200), DESIGN_W / 2, 90);

  ctx.font = `400 20px ${FONT}`;
  ctx.fillText("Student Details", DESIGN_W / 2, 150);

  // Plain field rows
  const rows = fieldRows(doc);
  const rowStart = 280;
  const rowH = 90;
  const labelX = 90;
  const valueX = 470;
  const valueMax = DESIGN_W - valueX - 90;

  rows.forEach((r, i) => {
    const y = rowStart + i * rowH;

    ctx.fillStyle = "#000000";
    ctx.font = `700 24px ${FONT}`;
    ctx.textAlign = "left";
    ctx.fillText(r.label + " :", labelX, y);
  });

  // Values aligned on one vertical line
  rows.forEach((r, i) => {
    const y = rowStart + i * rowH;
    ctx.fillStyle = "#000000";
    ctx.font = `400 24px ${FONT}`;
    ctx.textAlign = "left";
    const value = ellipsize(ctx, r.value, valueMax);
    ctx.fillText(value, valueX, y);
  });

  return canvas;
}

export async function downloadSummaryDoc(doc: SummaryDoc, fileName: string): Promise<void> {
  const canvas = await renderSummaryCanvas(doc);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [DESIGN_W, DESIGN_H],
    hotfixes: ["px_scaling"],
  });
  pdf.addImage(imgData, "JPEG", 0, 0, DESIGN_W, DESIGN_H);
  pdf.save(fileName);
}

export default function SummaryDocument({
  doc,
  className = "",
}: {
  doc: SummaryDoc;
  className?: string;
}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    renderSummaryCanvas(doc)
      .then((c) => {
        if (!cancelled) setImageSrc(c.toDataURL("image/jpeg", 0.92));
      })
      .catch(() => {
        /* preview stays blank on error */
      });
    return () => {
      cancelled = true;
    };
  }, [doc]);

  return (
    <div className={className}>
      <div ref={measureRef} className="w-full overflow-hidden relative">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Student Summary"
            style={{
              width: DESIGN_W * scale,
              height: DESIGN_H * scale,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: DESIGN_H * 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#9ca3af",
            }}
          >
            Loading summary preview…
          </div>
        )}
      </div>
    </div>
  );
}