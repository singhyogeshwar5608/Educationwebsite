import { useRef, useState, useEffect, type CSSProperties } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'
import { studentsService } from '@/services/students.service'
import { settingsService } from '@/services/gallery.service'
import type { Result } from '@/admin/services/api'
import { RESULT_BG_BASE64 } from '@/admin/components/resultBgBase64'

interface ResultPreviewProps {
  result: Result
  onClose: () => void
}

const ARIAL = "Arial, 'Helvetica Neue', Helvetica, sans-serif"

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

// The background design (result.jpeg) is exactly 1024x1536. The capture
// element is rendered at this fixed size so the overlay text sits 1:1 on the
// design — no cqw units, no aspect-ratio stretching (RSS-style approach).
const DESIGN_W = 1131
const DESIGN_H = 1600

// Marks table geometry (matches the table overlay below).
const MARKS_TABLE_TOP = 760
const MARKS_ROW_H = 60
const MARKS_FONT = 18
// Subject code column — absolute overlay.
const SUBJECT_CODE_X = 53
const SUBJECT_CODE_W = 58

function shortYear(fullBatchOrDate: string | undefined | null): string {
  if (!fullBatchOrDate) return ''
  if (fullBatchOrDate.includes('-')) {
    const parts = fullBatchOrDate.split('-')
    if (parts.length === 2 && parts[0].length === 4 && parts[1].length === 4) {
      return `${parts[0]}-${parts[1].slice(2)}`
    }
  }
  const d = fullBatchOrDate.slice(0, 4)
  if (/^\d{4}$/.test(d)) {
    const n = parseInt(d, 10)
    return `${d}-${String(n + 1).slice(2)}`
  }
  return fullBatchOrDate
}

// Load an image for canvas use. Hostinger's CDN strips Access-Control-Allow-*
// headers from any URL ending in an image extension, which taints the canvas.
// So we fetch a base64 JSON payload from /api/storage-base64 (extension-free
// URL — treated as dynamic by the CDN, CORS survives) and draw a data: URL,
// which is always canvas-safe.
function loadImageCorsFallback(src: string): Promise<HTMLImageElement> {
  const load = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = url
    })

  // https://host/storage/students/x.jpg -> https://host/api/storage-base64?path=students/x.jpg
  const m = src.match(/\/storage\/(.+)$/)
  const origin = new URL(src, window.location.href).origin
  const proxySrc = `${origin}/api/storage-base64?path=${encodeURIComponent(m ? m[1] : '')}`

  return fetch(proxySrc)
    .then((r) => {
      if (!r.ok) throw new Error('proxy failed')
      return r.json()
    })
    .then((json) => {
      if (!json?.data) throw new Error('no data')
      return load(json.data as string)
    })
    .catch(() => load(src))
}

interface SubjectRow {
  code: string
  name: string
  maxMarks: number
  theoryMax: number
  theoryObt: number
  practicalMax: number
  practicalObt: number
  subjectTotal: number
  passingMarks: number
}

function buildSubjectRows(result: Result): SubjectRow[] {
  const subjects = result.subjects ?? []
  return subjects.map((sub, i) => {
    const code = (sub as any).code || (sub as any).subject_code || String(i + 1).padStart(2, '0')
    const name = sub.name || (sub as any).subject || ''
    const maxMarks = sub.maxMarks ?? (sub as any).maximum_marks ?? 100
    const theoryMax = (sub as any).theoryMaxMarks ?? (sub as any).theory_max_marks ?? maxMarks
    const theoryObt =
      (sub as any).theoryMarks ?? (sub as any).theory_obtained_marks ?? sub.marks ?? 0
    const practicalMax = (sub as any).practicalMaxMarks ?? (sub as any).practical_max_marks ?? 0
    const practicalObt = (sub as any).practicalMarks ?? (sub as any).practical_obtained_marks ?? 0
    const subjectTotal =
      (sub as any).totalMarks ??
      (sub as any).total_marks ??
      (sub as any).total ??
      theoryObt + practicalObt
    const passingMarks = sub.passingMarks ?? (sub as any).passing_marks ?? 33
    return {
      code,
      name,
      maxMarks,
      theoryMax,
      theoryObt,
      practicalMax,
      practicalObt,
      subjectTotal,
      passingMarks,
    }
  })
}

// Marks table column widths (same percentages as the HTML <table>), as fractions
// of the table width, so both the preview and the canvas export share them.
const MARKS_COLS = [0.05957, 0.43300, 0.07333, 0.06849, 0.06365, 0.06849, 0.06655, 0.16692]
const MARKS_TABLE_LEFT = 88
const MARKS_TABLE_W = 1033
const MARKS_TOTAL_TOP = 1207
const MARKS_TOTAL_ROW_H = 46

function getGrade(obtained: number, max: number): string {
  const p = max > 0 ? (obtained / max) * 100 : 0
  if (p >= 90) return 'A+'
  if (p >= 80) return 'A'
  if (p >= 70) return 'B+'
  if (p >= 60) return 'B'
  if (p >= 50) return 'C'
  if (p >= 40) return 'D'
  return 'F'
}

// Draw the marksheet onto a canvas: background + every field/table cell at exact
// coordinates. Used by the PDF export — html2canvas is unreliable with absolute
// positioned text and caused fields to shift/hide on download.
async function renderMarksheetToCanvas(
  result: Result,
  student: any,
  instituteName: string,
  qrCodeUrl: string,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = DESIGN_W
  canvas.height = DESIGN_H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const bg = new Image()
  bg.src = RESULT_BG_BASE64
  await new Promise<void>((resolve, reject) => {
    bg.onload = () => resolve()
    bg.onerror = () => reject(new Error('Failed to load marksheet background'))
  })
  ctx.drawImage(bg, 0, 0, DESIGN_W, DESIGN_H)

  const rows = buildSubjectRows(result)
  const calcTotalMax = rows.reduce((sum, r) => sum + r.maxMarks, 0)
  const calcTotalObt = rows.reduce((sum, r) => sum + r.subjectTotal, 0)
  const calcTotalPassing = rows.reduce((sum, r) => sum + r.passingMarks, 0)

  const font = "Arial, 'Helvetica Neue', Helvetica, sans-serif"
  const text = (
    x: number,
    y: number,
    w: number,
    fontSize: number,
    align: 'left' | 'center' | 'right',
    bold: boolean,
    value: string | number,
  ) => {
    if (value === '' || value === undefined || value === null) return
    ctx.fillStyle = '#000'
    ctx.font = `${bold ? 700 : 400} ${fontSize}px ${font}`
    ctx.textAlign = align
    ctx.textBaseline = 'top'
    let drawX = x
    if (align === 'center') drawX = x + w / 2
    if (align === 'right') drawX = x + w
    ctx.fillText(String(value), drawX, y)
  }

  const cellText = (
    x: number,
    y: number,
    w: number,
    h: number,
    align: 'left' | 'center' | 'right',
    value: string | number,
    wrap = false,
    offsetX = 0,
    vAlign: 'middle' | 'top' = 'middle',
    fontSize = 18,
  ) => {
    if (value === '' || value === undefined || value === null) return
    ctx.fillStyle = '#000'
    ctx.font = `700 ${fontSize}px ${font}`
    ctx.textAlign = align
    ctx.textBaseline = vAlign === 'top' ? 'top' : 'middle'
    let drawX = x + offsetX
    if (align === 'center') drawX = x + offsetX + w / 2
    if (align === 'right') drawX = x + offsetX + w
    const str = String(value)
    if (!wrap) {
      ctx.fillText(str, drawX, vAlign === 'top' ? y : y + h / 2)
      return
    }
    // Wrap long text into up to 2 lines that always fit inside the cell width.
    const words = str.split(/\s+/)
    const lines: string[] = []
    let cur = ''
    const fit = (s: string) => ctx.measureText(s).width <= w
    const hardBreak = (s: string) => {
      if (fit(s)) return s
      let end = s.length
      while (end > 0 && ctx.measureText(s.slice(0, end)).width > w) end--
      return s.slice(0, Math.max(end, 1))
    }
    for (const word of words) {
      const candidate = cur ? `${cur} ${word}` : word
      if (!cur || fit(candidate)) {
        cur = candidate
      } else {
        lines.push(hardBreak(cur))
        cur = word
      }
      if (lines.length > 2) break
    }
    if (cur) lines.push(hardBreak(cur))
    const line1 = lines[0]
    const line2 = lines[1]
    const lineH = 22
    // Single line → center it in the cell (matches the non-wrapped code/marks
    // cells). Two lines → center the pair as a block.
    if (line1) ctx.fillText(line1, drawX, vAlign === 'top' ? y : y + h / 2 - (line2 ? lineH / 2 : 0))
    if (line2) ctx.fillText(line2, drawX, vAlign === 'top' ? y + lineH : y + h / 2 + lineH / 2)
  }

  // Header fields
  text(184, 96, 165, 18, 'left', true, result.rollNo || '—')
  text(837, 97, 188, 18, 'right', true, student?.registrationNo || '—')
  text(193, 390, 740, 26, 'center', true, result.course || '')
  text(365, 467, 364, 17, 'left', true, result.studentName || '')
  text(890, 467, 260, 18, 'left', true, fmtDate(student?.dob))
  text(365, 506, 364, 17, 'left', true, student?.fatherName || '')
  text(890, 506, 221, 18, 'left', true, (result.year ?? 1) + ' Year')
  text(365, 545, 364, 17, 'left', true, student?.motherName || '')
  text(890, 545, 260, 18, 'left', true, student?.batch || shortYear(result.publishedDate))
  text(365, 584, 596, 17, 'left', true, instituteName)
  text(200, 1286, 596, 20, 'left', true, 'Pass')
  text(500, 1288, 596, 18, 'left', true, ': ' + getGrade(calcTotalObt, calcTotalMax))

  // Student photo (if available)
  if (student?.photo) {
    const px = DESIGN_W * 0.80
    const py = DESIGN_H * 0.091
    const pw = DESIGN_W * 0.127
    const ph = DESIGN_H * 0.126
    ctx.fillStyle = '#fff'
    ctx.fillRect(px, py, pw, ph)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1.5
    ctx.strokeRect(px, py, pw, ph)
    try {
      const photo = await loadImageCorsFallback(student.photo)
      ctx.save()
      ctx.beginPath()
      ctx.rect(px, py, pw, ph)
      ctx.clip()
      ctx.drawImage(photo, px, py, pw, ph)
      ctx.restore()
    } catch {
      /* photo optional — skip on error */
    }
  }

  // Marks table rows
  rows.forEach((r, i) => {
    const rowTop = MARKS_TABLE_TOP + i * MARKS_ROW_H
    let colX = MARKS_TABLE_LEFT
    const cells: { align: 'left' | 'center' | 'right'; value: string | number }[] = [
      { align: 'right', value: r.code },
      { align: 'left', value: r.name },
      { align: 'center', value: r.maxMarks },
      { align: 'center', value: r.passingMarks },
      { align: 'center', value: r.theoryObt },
      { align: 'center', value: r.practicalMax },
      { align: 'center', value: r.practicalObt },
      { align: 'left', value: r.subjectTotal },
    ]
    cells.forEach((c, ci) => {
      const colW = MARKS_COLS[ci] * MARKS_TABLE_W
      if (c.value !== '') {
        cellText(
          colX,
          rowTop,
          colW - (ci === 1 ? 20 : 0),
          MARKS_ROW_H,
          c.align,
          c.value,
          ci === 1,
          ci === 0 ? -8 : ci === 1 ? 30 : ci === 7 ? 19 : 0,
          'middle',
          18,
        )
      }
      colX += colW
    })
  })

  // TOTAL row
  {
    const rowTop = MARKS_TOTAL_TOP
    let colX = MARKS_TABLE_LEFT
    const totalTheoryObt = rows.reduce((s, r) => s + r.theoryObt, 0)
    const totalPracticalObt = rows.reduce((s, r) => s + r.practicalObt, 0)
    const totalPracticalMax = rows.reduce((s, r) => s + r.practicalMax, 0)
    const cells: { align: 'left' | 'center'; value: string | number }[] = [
      { align: 'center', value: '' },
      { align: 'center', value: '' },
      { align: 'center', value: result.maxTotal ?? calcTotalMax },
      { align: 'center', value: calcTotalPassing },
      { align: 'center', value: totalTheoryObt },
      { align: 'center', value: totalPracticalMax },
      { align: 'center', value: totalPracticalObt },
      { align: 'left', value: result.total ?? calcTotalObt },
    ]
    cells.forEach((c, ci) => {
      const colW = MARKS_COLS[ci] * MARKS_TABLE_W
      if (c.value !== '') {
        ctx.fillStyle = '#000'
        ctx.font = `700 19px ${font}`
        ctx.textAlign = c.align
        ctx.textBaseline = 'middle'
        let drawX = colX + (ci === 7 ? 19 : 0)
        if (c.align === 'center') drawX = colX + (ci === 7 ? 19 : 0) + colW / 2
        ctx.fillText(String(c.value), drawX, rowTop + MARKS_TOTAL_ROW_H / 2 + 6)
      }
      colX += colW
    })
  }

  return canvas
}

// Standalone PDF download (used by row download buttons outside the modal).
export async function downloadResultPdf(
  result: Result,
  student?: any,
  instituteName?: string,
): Promise<void> {
  const resolvedStudent = student ?? (result.studentId ? await studentsService.show(Number(result.studentId)) : null)
  let resolvedInstitute = instituteName ?? 'Z-TECH CAREER ACADEMY'
  if (!resolvedInstitute) {
    try {
      const settings = await settingsService.get()
      resolvedInstitute = (settings as any)?.institute?.instituteName || 'Z-TECH CAREER ACADEMY'
    } catch {
      resolvedInstitute = 'Z-TECH CAREER ACADEMY'
    }
  }
  // Results don't have QR codes like certificates; pass empty string
  const canvas = await renderMarksheetToCanvas(result, resolvedStudent, resolvedInstitute, '')
  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [DESIGN_W, DESIGN_H],
    hotfixes: ['px_scaling'],
  })
  pdf.addImage(imgData, 'JPEG', 0, 0, DESIGN_W, DESIGN_H)
  pdf.save(`Result_${result.rollNo || result.studentName || 'Student'}.pdf`)
}

// ── The actual marksheet content ──────────────────────────────────────────
// Fixed px coordinates mapped 1:1 to the 1024x1536 background design.
function MarksheetContent({
  result,
  student,
  instituteName,
  qrCodeUrl,
}: {
  result: Result
  student: any
  instituteName: string
  qrCodeUrl: string
}) {
  const subjects = result.subjects ?? []
  const rows = buildSubjectRows(result)

  const abs = (
    x: number,
    y: number,
    w: number,
    fontSize = 19,
    align: 'left' | 'center' | 'right' = 'center',
    bold = true,
  ): CSSProperties => ({
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: `${w}px`,
    fontSize: `${fontSize}px`,
    fontWeight: bold ? 700 : 400,
    textAlign: align,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#000',
  })

  const calcTotalMax = subjects.reduce(
    (sum, sub) => sum + (sub.maxMarks ?? (sub as any).maximum_marks ?? 100),
    0,
  )
  const calcTotalObt = subjects.reduce(
    (sum, sub) =>
      sum +
      ((sub as any).totalMarks ??
        (sub as any).total_marks ??
        (sub as any).total ??
        (sub as any).theoryMarks ??
        (sub as any).theory_obtained_marks ??
        sub.marks ??
        0),
    0,
  )
  const calcTotalPassing = subjects.reduce(
    (sum, sub) => sum + (sub.passingMarks ?? (sub as any).passing_marks ?? 33),
    0,
  )

  return (
    <div
      style={{
        width: DESIGN_W,
        height: DESIGN_H,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: ARIAL,
        backgroundImage: `url(${RESULT_BG_BASE64})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Roll No & Reg No */}
      <span style={abs(184, 96, 165, 18, 'left')}>{result.rollNo || '—'}</span>
      <span style={abs(837, 97, 188, 18, 'right')}>{student?.registrationNo || '—'}</span>

      {/* Course Title */}
      <span style={abs(193, 390, 740, 26, 'center')}>{result.course || ''}</span>

      {/* Student Details */}
      <span style={abs(365, 467, 364, 19, 'left')}>{result.studentName || ''}</span>
      <span style={abs(890, 467, 260, 20, 'left')}>{fmtDate(student?.dob)}</span>

      <span style={abs(365, 506, 364, 19, 'left')}>{student?.fatherName || ''}</span>
      <span style={abs(890, 506, 221, 20, 'left')}>
        {(result.year ?? 1) + ' Year'}
      </span>

      <span style={abs(365, 545, 364, 19, 'left')}>{student?.motherName || ''}</span>
      <span style={abs(890, 545, 260, 20, 'left')}>
        {student?.batch || shortYear(result.publishedDate)}
      </span>

      <span style={abs(365, 584, 596, 19, 'left')}>{instituteName}</span>
      <span style={abs(200, 1286, 596, 20, 'left')}>Pass</span>
      <span style={abs(500 , 1288, 596, 18, 'left')}>
        {': ' +
          getGrade(
            rows.reduce((s, r) => s + r.subjectTotal, 0),
            rows.reduce((s, r) => s + r.maxMarks, 0),
          )}
      </span>


      {/* Student Photo (if available) */}
      {student?.photo && (
        <div
          style={{
            position: 'absolute',
            left: '80%',
            top: '9.1%',
            width: '12.7%',
            height: '12.6%',
            border: '1.5px solid #000',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <img
            src={student.photo}
            alt={result.studentName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Marks Table Overlay */}
      <table
        style={{
          position: 'absolute',
          left: `${MARKS_TABLE_LEFT}px`,
          top: `${MARKS_TABLE_TOP}px`,
          width: `${MARKS_TABLE_W}px`,
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          fontFamily: ARIAL,
          fontWeight: 700,
          fontSize: '18px',
          color: '#000',
        }}
      >
        <colgroup>
          {MARKS_COLS.map((w, i) => (
            <col key={i} style={{ width: `${(w * 100).toFixed(3)}%` }} />
          ))}
        </colgroup>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ height: `${MARKS_ROW_H}px` }}>
              <td
                style={{
                  textAlign: 'right',
                  verticalAlign: 'middle',
                  padding: '0 8px',
                }}
              >
                {r.code}
              </td>
              <td
                style={{
                  textAlign: 'left',
                  verticalAlign: 'middle',
                  padding: '0 20px 0 30px',
                  lineHeight: 1.1,
                  fontSize: '20px',
                  height: `${MARKS_ROW_H}px`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    height: '100%',
                    lineHeight: 1.1,
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    whiteSpace: 'normal',
                  }}
                >
                  {r.name}
                </div>
              </td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0 2px' }}>
                {r.maxMarks}
              </td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0 2px' }}>
                {r.passingMarks}
              </td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0 2px' }}>
                {r.theoryObt}
              </td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0 2px' }}>
                {r.practicalMax}
              </td>
              <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0 2px' }}>
                {r.practicalObt}
              </td>
              <td style={{ textAlign: 'left', verticalAlign: 'middle', padding: '0 2px', paddingLeft: '19px' }}>
                {r.subjectTotal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTAL Row Overlay */}
      <table
        style={{
          position: 'absolute',
          left: `${MARKS_TABLE_LEFT}px`,
          top: `${MARKS_TOTAL_TOP}px`,
          width: `${MARKS_TABLE_W}px`,
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          fontFamily: ARIAL,
          fontWeight: 700,
          fontSize: '19px',
          color: '#000',
        }}
      >
        <colgroup>
          {MARKS_COLS.map((w, i) => (
            <col key={i} style={{ width: `${(w * 100).toFixed(3)}%` }} />
          ))}
        </colgroup>
        <tbody>
          <tr style={{ height: `${MARKS_TOTAL_ROW_H}px` }}>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingTop: '6px' }}></td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingTop: '6px' }}></td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingTop: '6px' }}>
              {result.maxTotal ?? calcTotalMax}
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingTop: '6px' }}>
              {calcTotalPassing}
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingTop: '6px' }}>
              {rows.reduce((s, r) => s + r.theoryObt, 0)}
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingTop: '6px' }}>
              {rows.reduce((s, r) => s + r.practicalMax, 0)}
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle', paddingTop: '6px' }}>
              {rows.reduce((s, r) => s + r.practicalObt, 0)}
            </td>
            <td style={{ textAlign: 'left', verticalAlign: 'middle', paddingTop: '6px', paddingLeft: '19px' }}>
              {result.total ?? calcTotalObt}
            </td>
          </tr>
        </tbody>
      </table>

      {/* QR Code Overlay (bottom right signature area) */}
      {/* {qrCodeUrl && (
        <div
          style={{
            position: 'absolute',
            left: '530px',
            top: '1457px',
            width: '85px',
            aspectRatio: '1',
            background: '#fff',
            padding: '1px',
            border: '0.5px solid #ccc',
          }}
        >
          <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%' }} />
        </div>
      )} */}
    </div>
  )
}

export default function ResultPreview({ result, onClose }: ResultPreviewProps) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [scale, setScale] = useState(0.5)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  const studentQuery = useQuery({
    queryKey: ['student-for-result', result.studentId],
    queryFn: () => studentsService.show(Number(result.studentId)),
    enabled: !!result.studentId,
  })

  const settingsQuery = useQuery({
    queryKey: ['settings-result-preview'],
    queryFn: () => settingsService.get(),
  })

  const student = studentQuery.data as any
  const instituteName =
    (settingsQuery.data as any)?.institute?.instituteName || 'Z-TECH CAREER ACADEMY'

  useEffect(() => {
    const verificationUrl = `${window.location.origin}/verification?roll=${encodeURIComponent(
      result.rollNo || '',
    )}`
    QRCode.toDataURL(verificationUrl, { margin: 1, width: 100 })
      .then((url: string) => setQrCodeUrl(url))
      .catch(() => {})
  }, [result.rollNo])

  // Scale the 1024px design down to fit the preview column.
  useEffect(() => {
    const el = measureRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / DESIGN_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleDownloadPDF = async () => {
    setIsExporting(true)
    try {
      const canvas = await renderMarksheetToCanvas(
        result,
        student,
        instituteName,
        qrCodeUrl,
      )
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      // RSS-style: jsPDF page size = element size (1024x1536), so the image is
      // placed 1:1 with zero stretching.
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [DESIGN_W, DESIGN_H],
        hotfixes: ['px_scaling'],
      })
      pdf.addImage(imgData, 'JPEG', 0, 0, DESIGN_W, DESIGN_H)
      pdf.save(`Result_${result.rollNo || result.studentName || 'Student'}.pdf`)
    } catch (err) {
      console.error('Failed to export PDF:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-5 bg-black/60 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-300 w-full max-w-2xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-[#F0F0F0] border-b border-gray-300">
          <h2 className="text-xs font-bold text-[#222222]">Result Preview</h2>
          <button
            className="p-0.5 text-gray-500 hover:text-red-600"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {/* Preview (scaled copy for display) */}
          <div ref={measureRef} className="w-full overflow-hidden relative">
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: DESIGN_W,
                height: DESIGN_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <MarksheetContent
                result={result}
                student={student}
                instituteName={instituteName}
                qrCodeUrl={qrCodeUrl}
              />
            </div>
            {/* Spacer reserves only the scaled height */}
            <div style={{ height: DESIGN_H * scale, width: '100%' }} />
          </div>

          {studentQuery.isLoading && (
            <p className="text-center text-[11px] text-gray-400 mt-2">
              Loading student details...
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-3 py-2 bg-[#F0F0F0] border-t border-gray-300">
          <button
            className="px-3 py-1.5 text-[11px] font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5 disabled:opacity-50"
            onClick={handleDownloadPDF}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> Download PDF
              </>
            )}
          </button>
          <button
            className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
