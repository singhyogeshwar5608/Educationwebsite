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

// The background design (result.jpeg) is exactly 1024x1536. The capture
// element is rendered at this fixed size so the overlay text sits 1:1 on the
// design — no cqw units, no aspect-ratio stretching (RSS-style approach).
const DESIGN_W = 1024
const DESIGN_H = 1536

// Marks table geometry (matches the table overlay below).
const MARKS_TABLE_TOP = 878
const MARKS_ROW_H = 47.5
const MARKS_FONT = 18
// Subject code column — absolute overlay, centered 100px right of original (~99px center).
const SUBJECT_CODE_X = 49
const SUBJECT_CODE_W = 100

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
const MARKS_COLS = [0.11003, 0.32902, 0.09709, 0.08954, 0.09924, 0.09169, 0.08954, 0.09385]
const MARKS_TABLE_LEFT = 48
const MARKS_TABLE_W = 927
const MARKS_TOTAL_TOP = 1259
const MARKS_TOTAL_ROW_H = 47

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
    clip = false,
  ) => {
    if (value === '' || value === undefined || value === null) return
    ctx.fillStyle = '#000'
    ctx.font = `700 18px ${font}`
    ctx.textAlign = align
    ctx.textBaseline = 'middle'
    let drawX = x
    if (align === 'center') drawX = x + w / 2
    if (align === 'right') drawX = x + w
    const str = String(value)
    if (!clip) {
      ctx.fillText(str, drawX, y + h / 2)
      return
    }
    // Clip long text to the cell width (matching the HTML <td> which uses
    // whiteSpace:nowrap + overflow:hidden + textOverflow:ellipsis).
    const textWidth = ctx.measureText(str).width
    if (textWidth <= w) {
      ctx.fillText(str, drawX, y + h / 2)
      return
    }
    const ellipsis = '…'
    const ellWidth = ctx.measureText(ellipsis).width
    let truncated = str
    while (truncated.length > 0 && ctx.measureText(truncated).width + ellWidth > w) {
      truncated = truncated.slice(0, -1)
    }
    ctx.fillText(truncated + ellipsis, drawX, y + h / 2)
  }

  // Header fields
  text(140, 49, 150, 21, 'left', true, result.rollNo || '—')
  text(755, 49, 170, 21, 'right', true, student?.registrationNo || '—')
  text(175, 470, 670, 27, 'center', true, result.course || '')
  text(275, 568, 330, 20, 'left', true, result.studentName || '')
  text(780, 568, 235, 20, 'left', true, student?.dob || '')
  text(275, 611, 330, 20, 'left', true, student?.fatherName || '')
  text(820, 611, 200, 20, 'left', true, student?.duration || (result as any)?.duration || '1 Year')
  text(275, 655, 330, 20, 'left', true, student?.motherName || '')
  text(785, 655, 235, 20, 'left', true, student?.batch || shortYear(result.publishedDate))
  text(275, 700, 540, 20, 'left', true, instituteName)

  // Student photo (if available)
  if (student?.photo) {
    const px = DESIGN_W * 0.78
    const py = DESIGN_H * 0.285
    const pw = DESIGN_W * 0.145
    const ph = DESIGN_H * 0.115
    ctx.fillStyle = '#fff'
    ctx.fillRect(px, py, pw, ph)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1.5
    ctx.strokeRect(px, py, pw, ph)
    try {
      const photo = new Image()
      photo.crossOrigin = 'anonymous'
      photo.src = student.photo
      await new Promise<void>((resolve, reject) => {
        photo.onload = () => resolve()
        photo.onerror = () => reject(new Error('Failed to load student photo'))
      })
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
    const cells: { align: 'left' | 'center'; value: string | number }[] = [
      { align: 'center', value: '' },
      { align: 'left', value: r.name },
      { align: 'center', value: r.maxMarks },
      { align: 'center', value: r.passingMarks },
      { align: 'center', value: r.theoryObt },
      { align: 'center', value: r.practicalMax },
      { align: 'center', value: r.practicalObt },
      { align: 'center', value: r.subjectTotal },
    ]
    cells.forEach((c, ci) => {
      const colW = MARKS_COLS[ci] * MARKS_TABLE_W
      if (ci !== 0 && c.value !== '') {
        cellText(colX, rowTop, colW, MARKS_ROW_H, c.align, c.value, ci === 1)
      }
      colX += colW
    })
    // Subject code overlay (drawn at its own absolute column)
    text(
      SUBJECT_CODE_X,
      rowTop + (MARKS_ROW_H - MARKS_FONT) / 2,
      SUBJECT_CODE_W,
      MARKS_FONT,
      'center',
      true,
      r.code,
    )
  })

  // TOTAL row
  {
    const rowTop = MARKS_TOTAL_TOP
    let colX = MARKS_TABLE_LEFT
    const cells: { align: 'left' | 'center'; value: string | number }[] = [
      { align: 'center', value: '' },
      { align: 'center', value: '' },
      { align: 'center', value: result.maxTotal ?? calcTotalMax },
      { align: 'center', value: calcTotalPassing },
      { align: 'center', value: result.total ?? calcTotalObt },
      { align: 'center', value: 0 },
      { align: 'center', value: 0 },
      { align: 'center', value: result.total ?? calcTotalObt },
    ]
    cells.forEach((c, ci) => {
      const colW = MARKS_COLS[ci] * MARKS_TABLE_W
      if (c.value !== '') {
        ctx.fillStyle = '#000'
        ctx.font = `700 19px ${font}`
        ctx.textAlign = c.align
        ctx.textBaseline = 'middle'
        let drawX = colX
        if (c.align === 'center') drawX = colX + colW / 2
        ctx.fillText(String(c.value), drawX, rowTop + MARKS_TOTAL_ROW_H / 2)
      }
      colX += colW
    })
  }

  // QR code
  if (qrCodeUrl) {
    try {
      const qr = new Image()
      qr.src = qrCodeUrl
      await new Promise<void>((resolve, reject) => {
        qr.onload = () => resolve()
        qr.onerror = () => reject(new Error('Failed to load QR code'))
      })
      ctx.fillStyle = '#fff'
      ctx.fillRect(480, 1399, 77, 77)
      ctx.drawImage(qr, 480, 1399, 77, 77)
    } catch {
      /* QR optional */
    }
  }

  return canvas
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
      <span style={abs(140,49, 150, 21, 'left')}>{result.rollNo || '—'}</span>
      <span style={abs(755, 49, 170, 21, 'right')}>{student?.registrationNo || '—'}</span>

      {/* Course Title */}
      <span style={abs(175, 470, 670, 27, 'center')}>{result.course || ''}</span>

      {/* Student Details */}
      <span style={abs(275, 568, 330, 20, 'left')}>{result.studentName || ''}</span>
      <span style={abs(780, 568, 235, 20, 'left')}>{student?.dob || ''}</span>

      <span style={abs(275, 611, 330, 20, 'left')}>{student?.fatherName || ''}</span>
      <span style={abs(820, 611, 200, 20, 'left')}>
        {student?.duration || (result as any)?.duration || '1 Year'}
      </span>

      <span style={abs(275, 655, 330, 20, 'left')}>{student?.motherName || ''}</span>
      <span style={abs(785, 655, 235, 20, 'left')}>
        {student?.batch || shortYear(result.publishedDate)}
      </span>

      <span style={abs(275, 700, 540, 20, 'left')}>{instituteName}</span>

      {/* Student Photo (if available) */}
      {student?.photo && (
        <div
          style={{
            position: 'absolute',
            left: '78%',
            top: '28.5%',
            width: '14.5%',
            height: '11.5%',
            border: '1.5px solid #000',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          <img
            src={student.photo}
            alt={result.studentName}
            crossOrigin="anonymous"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Marks Table Overlay */}
      <table
        style={{
          position: 'absolute',
          left: '48px',
          top: '878px',
          width: '927px',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          fontFamily: ARIAL,
          fontWeight: 700,
          fontSize: '18px',
          color: '#000',
        }}
      >
        <colgroup>
          <col style={{ width: '11.003%' }} />
          <col style={{ width: '32.902%' }} />
          <col style={{ width: '9.709%' }} />
          <col style={{ width: '8.954%' }} />
          <col style={{ width: '9.924%' }} />
          <col style={{ width: '9.169%' }} />
          <col style={{ width: '8.954%' }} />
          <col style={{ width: '9.385%' }} />
        </colgroup>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ height: '47.5px' }}>
              <td
                style={{
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  padding: '0 2px',
                }}
              ></td>
              <td
                style={{
                  textAlign: 'left',
                  verticalAlign: 'middle',
                  padding: '0 4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {r.name}
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
              <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '0 2px' }}>
                {r.subjectTotal}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Subject code overlay — absolute so it can be aligned independently of the table */}
      {rows.map((r, i) => (
        <span
          key={`code-${i}`}
          style={abs(
            SUBJECT_CODE_X,
            MARKS_TABLE_TOP + i * MARKS_ROW_H + (MARKS_ROW_H - MARKS_FONT) / 2,
            SUBJECT_CODE_W,
            MARKS_FONT,
            'center',
          )}
        >
          {r.code}
        </span>
      ))}

      {/* TOTAL Row Overlay */}
      <table
        style={{
          position: 'absolute',
          left: '48px',
          top: '1259px',
          width: '927px',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          fontFamily: ARIAL,
          fontWeight: 700,
          fontSize: '19px',
          color: '#000',
        }}
      >
        <colgroup>
          <col style={{ width: '11.003%' }} />
          <col style={{ width: '32.902%' }} />
          <col style={{ width: '9.709%' }} />
          <col style={{ width: '8.954%' }} />
          <col style={{ width: '9.924%' }} />
          <col style={{ width: '9.169%' }} />
          <col style={{ width: '8.954%' }} />
          <col style={{ width: '9.385%' }} />
        </colgroup>
        <tbody>
          <tr style={{ height: '47px' }}>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}></td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}></td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              {result.maxTotal ?? calcTotalMax}
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              {calcTotalPassing}
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              {result.total ?? calcTotalObt}
            </td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>0</td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>0</td>
            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              {result.total ?? calcTotalObt}
            </td>
          </tr>
        </tbody>
      </table>

      {/* QR Code Overlay (bottom right signature area) */}
      {qrCodeUrl && (
        <div
          style={{
            position: 'absolute',
            left: '480px',
            top: '1399px',
            width: '77px',
            aspectRatio: '1',
            background: '#fff',
            padding: '1px',
            border: '0.5px solid #ccc',
          }}
        >
          <img src={qrCodeUrl} alt="QR Code" style={{ width: '100%', height: '100%' }} />
        </div>
      )}
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
