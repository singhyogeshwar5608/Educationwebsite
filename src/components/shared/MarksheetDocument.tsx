import { useRef, useState, useEffect, type CSSProperties } from "react";
import jsPDF from "jspdf";
import { RESULT_BG_BASE64 } from "@/admin/components/resultBgBase64";

// Shared marksheet document — renders the marksheet at its native 1024x1536
// (portrait) size with fields at the EXACT same coordinates used in the admin
// panel, so the public preview/download always matches.
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
  const origin = new URL(src, window.location.href).origin;
  const proxySrc = `${origin}/api/storage-base64?path=${encodeURIComponent(m ? m[1] : "")}`;

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

const DESIGN_W = 1131;
const DESIGN_H = 1600;

const MARKS_TABLE_TOP = 915;
const MARKS_ROW_H = 49.5;
const MARKS_FONT = 18;
const SUBJECT_CODE_X = 54;
const SUBJECT_CODE_W = 110;
const MARKS_COLS = [0.11003, 0.32902, 0.09709, 0.08954, 0.09924, 0.09169, 0.08954, 0.09385];
const MARKS_TABLE_LEFT = 53;
const MARKS_TABLE_W = 1024;
const MARKS_TOTAL_TOP = 1311;
const MARKS_TOTAL_ROW_H = 49;

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
    wrap = false,
    offsetX = 0,
  ) => {
    if (value === "" || value === undefined || value === null) return;
    ctx.fillStyle = "#000";
    ctx.font = `700 18px ${font}`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    let drawX = x + offsetX;
    if (align === "center") drawX = x + offsetX + w / 2;
    if (align === "right") drawX = x + offsetX + w;
    const str = String(value);
    if (!wrap) {
      ctx.fillText(str, drawX, y + h / 2);
      return;
    }
    // Wrap long text into up to 2 centered lines so it stays inside its cell.
    const words = str.split(/\s+/);
    let line1 = "";
    let line2 = "";
    if (words.length === 1) {
      // No spaces: hard-break the long word.
      let mid = Math.floor(str.length / 2);
      while (mid > 0 && ctx.measureText(str.slice(0, mid)).width > w) mid--;
      line1 = str.slice(0, mid);
      line2 = str.slice(mid);
    } else {
      for (const word of words) {
        const candidate = line2 ? line2 + " " + word : word;
        if (ctx.measureText(candidate).width <= w) {
          line2 = candidate;
        } else if (!line1) {
          line1 = line2;
          line2 = word;
        } else {
          line2 += " " + word;
        }
      }
    }
    const lineH = 20;
    if (line1) ctx.fillText(line1, drawX, y + h / 2 - lineH / 2);
    if (line2) ctx.fillText(line2, drawX, y + h / 2 + lineH / 2);
  };

  // Header fields (synced with admin ResultPreview)
  text(170, 66, 165, 21, "left", true, doc.rollNo || "—");
  text(805, 66, 188, 21, "right", true, doc.registrationNo || "—");
  text(193, 503, 740, 27, "center", true, doc.course || "");
  text(315, 603, 364, 20, "left", true, doc.studentName || "");
  text(861, 603, 260, 20, "left", true, fmtDate(doc.dob));
  text(315, 647, 364, 20, "left", true, doc.fatherName || "");
  text(906, 649, 221, 20, "left", true, doc.duration || "1 Year");
  text(315, 693, 364, 20, "left", true, doc.motherName || "");
  text(890, 695, 260, 20, "left", true, doc.batch || "");
  text(315, 742, 596, 20, "left", true, doc.instituteName);

  // Student photo (match admin ResultPreview: 77%, 8.3%, 14.7%, 13.6%)
  if (doc.photo) {
    const px = DESIGN_W * 0.77;
    const py = DESIGN_H * 0.083;
    const pw = DESIGN_W * 0.147;
    const ph = DESIGN_H * 0.136;
    ctx.fillStyle = "#fff";
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px, py, pw, ph);
    try {
      const photo = await loadImageCorsFallback(doc.photo);
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
      { align: "center", value: r.name },
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
        cellText(colX, rowTop, colW, MARKS_ROW_H, c.align, c.value, ci === 1, ci === 7 ? -18 : 0);
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
    const totalTheoryObt = doc.rows.reduce((s, r) => s + r.theoryObt, 0);
    const totalPracticalObt = doc.rows.reduce((s, r) => s + r.practicalObt, 0);
    const totalPracticalMax = doc.rows.reduce((s, r) => s + r.practicalMax, 0);
    const cells: { align: "left" | "center"; value: string | number }[] = [
      { align: "center", value: "" },
      { align: "center", value: "" },
      { align: "center", value: doc.maxTotal },
      { align: "center", value: doc.totalPassing },
      { align: "center", value: totalTheoryObt },
      { align: "center", value: totalPracticalMax },
      { align: "center", value: totalPracticalObt },
      { align: "center", value: doc.total },
    ];
    cells.forEach((c, ci) => {
      const colW = MARKS_COLS[ci] * MARKS_TABLE_W;
      if (c.value !== "") {
        ctx.fillStyle = "#000";
        ctx.font = `700 19px ${font}`;
        ctx.textAlign = c.align;
        ctx.textBaseline = "middle";
        let drawX = colX + (ci === 7 ? -18 : 0);
        if (c.align === "center") drawX = colX + (ci === 7 ? -18 : 0) + colW / 2;
        ctx.fillText(String(c.value), drawX, rowTop + MARKS_TOTAL_ROW_H / 2 + 6);
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
            <span style={abs(170, 66, 165, 21, "left", true)}>{doc.rollNo || "—"}</span>
            <span style={abs(805, 66, 188, 21, "right", true)}>{doc.registrationNo || "—"}</span>
            <span style={abs(193, 503, 740, 27, "center", true)}>{doc.course || ""}</span>
            <span style={abs(315, 603, 364, 20, "left", true)}>{doc.studentName || ""}</span>
            <span style={abs(861, 603, 260, 20, "left", true)}>{fmtDate(doc.dob)}</span>
            <span style={abs(315, 647, 364, 20, "left", true)}>{doc.fatherName || ""}</span>
            <span style={abs(906, 649, 221, 20, "left", true)}>{doc.duration || "1 Year"}</span>
            <span style={abs(315, 693, 364, 20, "left", true)}>{doc.motherName || ""}</span>
            <span style={abs(890, 695, 260, 20, "left", true)}>{doc.batch || ""}</span>
            <span style={abs(315, 742, 596, 20, "left", true)}>{doc.instituteName}</span>

            {doc.photo && (
              <div
                style={{
                  position: "absolute",
                  left: "77%",
                  top: "8.3%",
                  width: "14.7%",
                  height: "13.6%",
                  border: "1.5px solid #000",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <img
                  src={doc.photo}
                  alt={doc.studentName}
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
                        textAlign: "center",
                        verticalAlign: "middle",
                        padding: "0 4px",
                        lineHeight: 1.1,
                        height: `${MARKS_ROW_H}px`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          lineHeight: 1.1,
                        }}
                      >
                        {r.name}
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.maxMarks}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.passingMarks}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.theoryObt}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.practicalMax}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px" }}>{r.practicalObt}</td>
                    <td style={{ textAlign: "center", verticalAlign: "middle", padding: "0 2px", position: "relative", left: "-18px" }}>{r.subjectTotal}</td>
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
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px" }}></td>
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px" }}></td>
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px" }}>{doc.maxTotal}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px" }}>{doc.totalPassing}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px" }}>{doc.rows.reduce((s, r) => s + r.theoryObt, 0)}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px" }}>{doc.rows.reduce((s, r) => s + r.practicalMax, 0)}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px" }}>{doc.rows.reduce((s, r) => s + r.practicalObt, 0)}</td>
                  <td style={{ textAlign: "center", verticalAlign: "middle", paddingTop: "6px", position: "relative", left: "-18px" }}>{doc.total}</td>
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
