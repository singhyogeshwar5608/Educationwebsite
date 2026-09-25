import { useRef, useState, useEffect, type CSSProperties } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import { studentsService } from '@/services/students.service'
import { settingsService } from '@/services/gallery.service'
import { coursesService } from '@/services/courses.service'
import { CERT_BG_BASE64 } from '@/admin/components/certBgBase64'

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

// Normalized certificate data. Both a `Result` (results page) and a `Certificate`
// (certificates page) can be mapped to this shape.
export interface CertificateData {
  id?: string
  certificateNo?: string
  rollNo?: string
  studentId?: string
  studentName?: string
  course?: string
  percentage?: number | null
  grade?: string | null
  issueDate?: string
  publishedDate?: string
  duration?: string
  session?: string
  enrollmentNo?: string
}

interface CertificatePreviewProps {
  data: CertificateData
  onClose: () => void
}

// Base host for storage files (VITE_API_URL without /api suffix)
const STORAGE_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '')

const ARIAL = "'Times New Roman', Georgia, serif"

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

// The background certificate.jpeg is exactly 1600x1066 (landscape). The capture
// element is rendered at this fixed size so the overlay text sits 1:1 on the
// design.
const DESIGN_W = 1600
const DESIGN_H = 1066

// Scale factor from old design (1536x1024) to new (1600x1066).
const SCALE_X = DESIGN_W / 1536
const SCALE_Y = DESIGN_H / 1024

function sX(x: number): number { return Math.round(x * SCALE_X) }
function sY(y: number): number { return Math.round(y * SCALE_Y) }
function sW(w: number): number { return Math.round(w * SCALE_X) }
function sH(h: number): number { return Math.round(h * SCALE_Y) }
function sF(f: number): number { return Math.round(f * SCALE_X) }

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

interface CertField {
  x: number
  y: number
  w: number
  h?: number
  fontSize: number
  align: 'left' | 'center' | 'right'
  bold: boolean
  text: string
  photoUrl?: string
}

// Single source of truth for every field's position + value. Used by BOTH the
// on-screen preview (abs spans) and the canvas-based PDF export, so the download
// always matches the preview exactly.
function buildCertFields(
  data: CertificateData,
  student: any,
  course: any,
  instituteName: string,
): CertField[] {
  // Build absolute photo URL from whatever format the API returns
  const rawPhoto = student?.photo
  const photoUrl = rawPhoto
    ? rawPhoto.startsWith('http')
      ? rawPhoto
      : rawPhoto.startsWith('/storage/')
        ? `${STORAGE_BASE}${rawPhoto}`
        : rawPhoto.startsWith('storage/')
          ? `${STORAGE_BASE}/${rawPhoto}`
          : `${STORAGE_BASE}/storage/${rawPhoto}`
    : null

  return [
    { x: sX(170), y: sY(40), w: sW(420), fontSize: sF(24), align: 'left', bold: true, text: data.certificateNo || data.rollNo || '' },
    { x: sX(1140), y: sY(40), w: sW(250), fontSize: sF(24), align: 'right', bold: true, text: data.enrollmentNo || student?.registrationNo || '' },
    { x: sX(500), y: sY(509), w: sW(560), fontSize: sF(28), align: 'center', bold: true, text: data.studentName || '' },
    { x: sX(630), y: sY(554), w: sW(1200), fontSize: sF(28), align: 'left', bold: true, text: student?.fatherName || '' },
    { x: sX(455), y: sY(598), w: sW(250), fontSize: sF(28), align: 'right', bold: true, text: data.enrollmentNo || student?.registrationNo || '' },
    { x: sX(450), y: sY(682), w: sW(600), fontSize: sF(32), align: 'center', bold: true, text: data.course || '' },
    { x: sX(260), y: sY(739), w: sW(290), fontSize: sF(28), align: 'center', bold: true, text: data.duration || course?.duration || student?.duration || '' },
    { x: sX(600), y: sY(739), w: sW(290), fontSize: sF(28), align: 'center', bold: true, text: data.session || student?.batch || shortYear(data.issueDate || data.publishedDate) },
    { x: sX(1020), y: sY(739), w: sW(280), fontSize: sF(28), align: 'right', bold: true, text: data.percentage != null ? `${data.percentage}%` : '' },
    { x: sX(1000), y: sY(739), w: sW(240), fontSize: sF(28), align: 'left', bold: true, text: data.grade || '' },
    // { x: sX(310), y: sY(891), w: sW(220), fontSize: sF(24), align: 'center', bold: true, text: fmtDate(data.issueDate || data.publishedDate) },
    // { x: sX(90), y: sY(960), w: sW(500), fontSize: sF(16), align: 'left', bold: false, text: instituteName },
    // Student photo (positioned like marksheet: right side, near top)
    ...(photoUrl ? [{ x: sX(1280), y: sY(298), w: sW(180), h: sH(235), fontSize: 0, align: 'left', bold: false, text: '__PHOTO__', photoUrl } as CertField & { photoUrl: string }] : []),
  ]
}

// Draw the certificate onto a canvas: background image + every text field at its
// exact coordinate. This is what the PDF export uses (html2canvas is unreliable
// with absolutely positioned text, which caused fields to shift/hide on download).
async function renderCertificateToCanvas(
  data: CertificateData,
  student: any,
  course: any,
  instituteName: string,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = DESIGN_W
  canvas.height = DESIGN_H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const bg = new Image()
  bg.src = CERT_BG_BASE64
  await new Promise<void>((resolve, reject) => {
    bg.onload = () => resolve()
    bg.onerror = () => reject(new Error('Failed to load certificate background'))
  })
  ctx.drawImage(bg, 0, 0, DESIGN_W, DESIGN_H)

  ctx.fillStyle = '#000000'
  ctx.textBaseline = 'top'
  for (const f of buildCertFields(data, student, course, instituteName)) {
    if (!f.text) continue
    if (f.text === '__PHOTO__' && f.photoUrl) {
      const img = await loadImageCorsFallback(f.photoUrl)
      ctx.drawImage(img, f.x, f.y, f.w, f.h ?? (f.w * img.height) / img.width)
      continue
    }
    ctx.font = `${f.bold ? '600' : '400'} ${f.fontSize}px 'Times New Roman', Georgia, serif`
    ctx.textAlign = f.align
    let drawX = f.x
    if (f.align === 'center') drawX = f.x + f.w / 2
    if (f.align === 'right') drawX = f.x + f.w
    ctx.fillText(f.text, drawX, f.y)
  }

  return canvas
}

// Standalone PDF download (used by row download buttons outside the modal).
export async function downloadCertificatePdf(
  data: CertificateData,
  student?: any,
  course?: any,
  instituteName?: string,
): Promise<void> {
  const resolvedStudent = student ?? (data.studentId ? await studentsService.show(Number(data.studentId)) : null)
  const resolvedCourse =
    course ??
    (resolvedStudent?.courseId ? await coursesService.show(Number(resolvedStudent.courseId)) : null)
  let resolvedInstitute = instituteName ?? 'Z-TECH CAREER ACADEMY'
  if (!resolvedInstitute) {
    try {
      const settings = await settingsService.get()
      resolvedInstitute = (settings as any)?.institute?.instituteName || 'Z-TECH CAREER ACADEMY'
    } catch {
      resolvedInstitute = 'Z-TECH CAREER ACADEMY'
    }
  }
  const canvas = await renderCertificateToCanvas(
    data,
    resolvedStudent,
    resolvedCourse,
    resolvedInstitute,
  )
  const imgData = canvas.toDataURL('image/jpeg', 0.95)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [DESIGN_W, DESIGN_H],
    hotfixes: ['px_scaling'],
  })
  pdf.addImage(imgData, 'JPEG', 0, 0, DESIGN_W, DESIGN_H)
  pdf.save(`Certificate_${data.certificateNo || data.rollNo || data.studentName || 'Student'}.pdf`)
}

function CertificateContent({
  data,
  student,
  course,
  instituteName,
}: {
  data: CertificateData
  student: any
  course: any
  instituteName: string
}) {
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
    fontWeight: bold ? 400 : 300,
    textAlign: align,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#000',
  })

  const fields = buildCertFields(data, student, course, instituteName)

  return (
    <div
      style={{
        width: DESIGN_W,
        height: DESIGN_H,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: ARIAL,
        backgroundImage: `url(${CERT_BG_BASE64})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {fields.map((f, i) => {
        if (f.text === '__PHOTO__' && f.photoUrl) {
          return (
            <img
              key={i}
              src={f.photoUrl}
              alt="Student"
              style={{
                position: 'absolute',
                left: `${f.x}px`,
                top: `${f.y}px`,
                width: `${f.w}px`,
                height: f.h ? `${f.h}px` : 'auto',
                objectFit: 'cover',
                border: '1px solid #ccc',
              }}
            />
          )
        }
        return (
          <span key={i} style={abs(f.x, f.y, f.w, f.fontSize, f.align, f.bold)}>
            {f.text}
          </span>
        )
      })}
    </div>
  )
}

export default function CertificatePreview({ data, onClose }: CertificatePreviewProps) {
  const measureRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [scale, setScale] = useState(0.5)

  const studentQuery = useQuery({
    queryKey: ['student-for-certificate', data.studentId],
    queryFn: () => studentsService.show(Number(data.studentId)),
    enabled: !!data.studentId,
  })

  const student = studentQuery.data as any

  const courseQuery = useQuery({
    queryKey: ['course-for-certificate', student?.courseId],
    queryFn: () => coursesService.show(Number(student.courseId)),
    enabled: !!student?.courseId,
  })

  const course = courseQuery.data as any

  const settingsQuery = useQuery({
    queryKey: ['settings-certificate-preview'],
    queryFn: () => settingsService.get(),
  })
  const instituteName =
    (settingsQuery.data as any)?.institute?.instituteName || 'Z-TECH CAREER ACADEMY'

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
      const canvas = await renderCertificateToCanvas(data, student, course, instituteName)
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [DESIGN_W, DESIGN_H],
        hotfixes: ['px_scaling'],
      })
      pdf.addImage(imgData, 'JPEG', 0, 0, DESIGN_W, DESIGN_H)
      pdf.save(`Certificate_${data.certificateNo || data.rollNo || data.studentName || 'Student'}.pdf`)
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
        className="bg-white border border-gray-300 w-full max-w-4xl my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-[#F0F0F0] border-b border-gray-300">
          <h2 className="text-xs font-bold text-[#222222]">Certificate Preview</h2>
          <button
            className="p-0.5 text-gray-500 hover:text-red-600"
            onClick={onClose}
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
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
              <CertificateContent
                data={data}
                student={student}
                course={course}
                instituteName={instituteName}
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
