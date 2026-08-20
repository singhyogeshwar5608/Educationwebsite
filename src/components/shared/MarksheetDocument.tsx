import { useRef, useState, useEffect, type CSSProperties } from "react";
import jsPDF from "jspdf";
import { RESULT_BG_BASE64 } from "@/admin/components/resultBgBase64";

// Shared marksheet document — renders the marksheet at its native 1024x1536
// (portrait) size with fields at the EXACT same coordinates used in the admin
// panel, so the public preview/download always matches.
const DESIGN_W = 1024;
const DESIGN_H = 1536;

const MARKS_TABLE_TOP = 878;
const MARKS_ROW_H = 47.5;
const MARKS_FONT = 18;
const SUBJECT_CODE_X = 49;
const SUBJECT_CODE_W = 100;
const MARKS_COLS = [0.11003, 0.32902, 0.09709, 0.08954, 0.09924, 0.09169, 0.08954, 0.09385];
const MARKS_TABLE_LEFT = 48;
const MARKS_TABLE_W = 927;
const MARKS_TOTAL_TOP = 1259;
const MARKS_TOTAL_ROW_H = 47;

export interface MarksheetRow {
  code: string;
  name: string;
  maxMarks: number;
  theoryObt: number;
  practicalMax: number;
  practicalObt: number;
  subjectTotal: number;
  passingMarks: number;
}

export interface MarksheetDoc {
  rollNo: string;
  registrationNo: string;
  course: string;
  studentName: string;
  dob: string;
  fatherName: string;
  duration: string;
  motherName: string;
  batch: string;
  instituteName: string;
  photo?: string;
  rows: MarksheetRow[];
  maxTotal: number;
  total: number;
  totalPassing: number;
}

export async function renderMarksheetDoc(doc: MarksheetDoc): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = DESIGN_W;
  canvas.height = DESIGN_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const bg = new Image();
  bg.src = RESULT_BG_BASE64;
  await new Promise<void>((resolve, reject) => {
    bg.onload = () => resolve();
    bg.onerror = () => reject(new Error("Failed to load marksheet background"));
  });
  ctx.drawImage(bg, 0, 0, DESIGN_W, DESIGN_H);

  const font = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

  const text = (
    x: number,
    y: number,
    w: number,
    fontSize: number,
    align: "left" | "center" | "right",
    bold: boolean,
    value: string | number,
  ) => {
    if (value === "" || value === undefined || value === null) return;
    ctx.fillStyle = "#000";
    ctx.font = `${bold ? 700 : 400} ${fontSize}px ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    let drawX = x;
    if (align === "center") drawX = x + w / 2;
    if (align === "right") drawX = x + w;
    ctx.fillText(String(value), drawX, y);
  };

  const cellText = (
    x: number,
    y: number,
    w: number,
    h: number,
    align: "left" | "center" | "right",
    value: string | number,
    clip = false,
  ) => {
    if (value === "" || value === undefined || value === null) return;
    ctx.fillStyle = "#000";
    ctx.font = `700 18px ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    let drawX = x;
    if (align === "center") drawX = x + w / 2;
    if (align === "right") drawX = x + w;
    const str = String(value);
    if (!clip) {
      ctx.fillText(str, drawX, y + h / 2);
      return;
    }
    const textWidth = ctx.measureText(str).width;
    if (textWidth <= w) {
      ctx.fillText(str, drawX, y + h / 2);
      return;
    }
    const ellipsis = "…";
    const ellWidth = ctx.measureText(ellipsis).width;
    let truncated = str;
    while (truncated.length > 0 && ctx.measureText(truncated).width + ellWidth > w) {
      truncated = truncated.slice(0, -1);
    }
    ctx.fillText(truncated + ellipsis, drawX, y + h / 2);
  };

  // Header fields
  text(140, 49, 150, 21, "left", true, doc.rollNo || "—");
  text(755, 49, 170, 21, "right", true, doc.registrationNo || "—");
  text(175, 470, 670, 27, "center", true, doc.course || "");
  text(275, 568, 330, 20, "left", true, doc.studentName || "");
  text(780, 568, 235, 20, "left", true, doc.dob || "");
  text(275, 611, 330, 20, "left", true, doc.fatherName || "");
  text(820, 611, 200, 20, "left", true, doc.duration || "1 Year");
  text(275, 655, 330, 20, "left", true, doc.motherName || "");
  text(785, 655, 235, 20, "left", true, doc.batch || "");
  text(275, 700, 540, 20, "left", true, doc.instituteName);

  // Student photo
  if (doc.photo) {
    const px = DESIGN_W * 0.78;
    const py = DESIGN_H * 0.285;
    const pw = DESIGN_W * 0.145;
    const ph = DESIGN_H * 0.115;
    ctx.fillStyle = "#fff";
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pw, ph);
    try {
      const photo = new Image();
      photo.crossOrigin = "anonymous";
      photo.src = doc.photo;
      await new Promise<void>((resolve, reject) => {
        photo.onload = () => resolve();
        photo.onerror = () => reject(new Error("Failed to load student photo"));
      });
      ctx.save();
      ctx.beginPath();
      ctx.rect(px, py, pw, ph);
      ctx.clip();
      ctx.drawImage(photo, px, py, pw, ph);
      ctx.restore();
    } catch {
      /* photo optional */
    }
  }

  // Marks table rows
  doc.rows.forEach((r, i) => {
    const rowTop = MARKS_TABLE_TOP + i * MARKS_ROW_H;
    let colX = MARKS_TABLE_LEFT;
    const cells: { align: "left" | "center"; value: string | number }[] = [
      { align: "center", value: "" },
      { align: "left", value: r.name },
      { align: "center", value: r.maxMarks },
      { align: "center", value: r.passingMarks },
      { align: "center", value: r.theoryObt },
      { align: "center", value: r.practicalMax },
      { align: "center", value: r.practicalObt },
      { align: "center", value: r.subjectTotal },
    ];
    cells.forEach((c, ci) => {
      const colW = MARKS_COLS[ci] * MARKS_TABLE_W;
      if (ci !== 0 && c.value !== "") {
        cellText(colX, rowTop, colW, MARKS_ROW_H, c.align, c.value, ci === 1);
      }
      colX += colW;
    });
    text(
      SUBJECT_CODE_X,
      rowTop + (MARKS_ROW_H - MARKS_FONT) / 2,
      SUBJECT_CODE_W,
      MARKS_FONT,
      "center",
      true,
      r.code,
    );
  });

  // TOTAL row
  {
    const rowTop = MARKS_TOTAL_TOP;
    let colX = MARKS_TABLE_LEFT;
    const cells: { align: "left" | "center"; value: string | number }[] = [
      { align: "center", value: "" },
      { align: "center", value: "" },
      { align: "center", value: doc.maxTotal },
      { align: "center", value: doc.totalPassing },
      { align: "center", value: doc.total },
      { align: "center", value: 0 },
      { align: "center", value: 0 },
      { align: "center", value: doc.total },
    ];
    cells.forEach((c, ci) => {
      const colW = MARKS_COLS[ci] * MARKS_TABLE_W;
      if (c.value !== "") {
        ctx.fillStyle = "#000";
        ctx.font = `700 19px ${font}`;
        ctx.textAlign = c.align;
        ctx.textBaseline = "middle";
        let drawX = colX;
        if (c.align === "center") drawX = colX + colW / 2;
        ctx.fillText(String(c.value), drawX, rowTop + MARKS_TOTAL_ROW_H / 2);
      }
      colX += colW;
    });
  }

  return canvas;
}

export async function downloadMarksheetDoc(doc: MarksheetDoc): Promise<void> {
  const canvas = await renderMarksheetDoc(doc);
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [DESIGN_W, DESIGN_H],
    hotfixes: ["px_scaling"],
  });
  pdf.addImage(imgData, "JPEG", 0, 0, DESIGN_W, DESIGN_H);
  pdf.save(`Result_${doc.rollNo || doc.studentName || "Student"}.pdf`);
}

export default function MarksheetDocument({
  doc,
  className = "",
}: {
  doc: MarksheetDoc;
  className?: string;
}) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

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
    fontWeight: bold ? 700 : 400,
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
              fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
              backgroundImage: `url(${RESULT_BG_BASE64})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <span style={abs(140, 49, 150, 21, "left", true)}>{doc.rollNo || "—"}</span>
            <span style={abs(755, 49, 170, 21, "right", true)}>{doc.registrationNo || "—"}</span>
            <span style={abs(175, 470, 670, 27, "center", true)}>{doc.course || ""}</span>
            <span style={abs(275, 568, 330, 20, "left", true)}>{doc.studentName || ""}</span>
            <span style={abs(780, 568, 235, 20, "left", true)}>{doc.dob || ""}</span>
            <span style={abs(275, 611, 330, 20, "left", true)}>{doc.fatherName || ""}</span>
            <span style={abs(820, 611, 200, 20, "left", true)}>{doc.duration || "1 Year"}</span>
            <span style={abs(275, 655, 330, 20, "left", true)}>{doc.motherName || ""}</span>
            <span style={abs(785, 655, 235, 20, "left", true)}>{doc.batch || ""}</span>
            <span style={abs(275, 700, 540, 20, "left", true)}>{doc.instituteName}</span>

            {doc.photo && (
              <div
                style={{
                  position: "absolute",
                  left: "78%",
                  top: "28.5%",
                  width: "14.5%",
                  height: "11.5%",
                  border: "1.5px solid #000",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <img
                  src={doc.photo}
                  alt={doc.studentName}
                  crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <table
              style={{
                position: "absolute",
                left: `${MARKS_TABLE_LEFT}px`,
                top: `${MARKS_TABLE_TOP}px`,
                width: `${MARKS_TABLE_W}px`,
                tableLayout: "fixed",
                borderCollapse: "collapse",
                fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                color: "#000",
              }}
            >
              <colgroup>
                <col style={{ width: "11.003%" }} />
                <col style={{ width: "32.902%" }} />
                <col style={{ width: "9.709%" }} />
                <col style={{ width: "8.954%" }} />
                <col style={{ width: "9.924%" }} />
                <col style={{ width: "9.169%" }} />
                <col style={{ width: "8.954%" }} />
                <col style={{ width: "9.385%" }} />
              </colgroup>
              <tbody>
                {doc.rows.map((r, i) => (
                  <tr key={i} style={{ height: `${MARKS_ROW_H}px` }}>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}></td>
                    <td
                      style={{
                        textAlign: "left",
                        verticalAlign: "middle",
                        padding: "0 4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.name}
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.maxMarks}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.passingMarks}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.theoryObt}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.practicalMax}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.practicalObt}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.subjectTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {doc.rows.map((r, i) => (
              <span
                key={`code-${i}`}
                style={abs(
                  SUBJECT_CODE_X,
                  MARKS_TABLE_TOP + i * MARKS_ROW_H + (MARKS_ROW_H - MARKS_FONT) / 2,
                  SUBJECT_CODE_W,
                  MARKS_FONT,
                  "center",
                  true,
                )}
              >
                {r.code}
              </span>
            ))}

            <table
              style={{
                position: "absolute",
                left: `${MARKS_TABLE_LEFT}px`,
                top: `${MARKS_TOTAL_TOP}px`,
                width: `${MARKS_TABLE_W}px`,
                tableLayout: "fixed",
                borderCollapse: "collapse",
                fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: "19px",
                color: "#000",
              }}
            >
              <colgroup>
                <col style={{ width: "11.003%" }} />
                <col style={{ width: "32.902%" }} />
                <col style={{ width: "9.709%" }} />
                <col style={{ width: "8.954%" }} />
                <col style={{ width: "9.924%" }} />
                <col style={{ width: "9.169%" }} />
                <col style={{ width: "8.954%" }} />
                <col style={{ width: "9.385%" }} />
              </colgroup>
              <tbody>
                <tr style={{ height: `${MARKS_TOTAL_ROW_H}px` }}>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}></td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}></td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>{doc.maxTotal}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>{doc.totalPassing}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>{doc.total}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>0</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>0</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>{doc.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ height: DESIGN_H * scale, width: "100%" }} />
      </div>
    </div>
  );
}
