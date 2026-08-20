import { useRef, useState, useEffect, type CSSProperties } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import { studentsService } from '@/services/students.service'
import { settingsService } from '@/services/gallery.service'
import { coursesService } from '@/services/courses.service'
import { CERT_BG_BASE64 } from '@/admin/components/certBgBase64'

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

const ARIAL = "'Times New Roman', Georgia, serif"

// The background certificate.jpeg is exactly 1536x1024 (landscape). The capture
// element is rendered at this fixed size so the overlay text sits 1:1 on the
// design.
const DESIGN_W = 1536
const DESIGN_H = 1024

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
  fontSize: number
  align: 'left' | 'center' | 'right'
  bold: boolean
  text: string
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
  return [
    { x: 170, y: 40, w: 420, fontSize: 24, align: 'left', bold: true, text: data.certificateNo || data.rollNo || '' },
    { x: 1140, y: 40, w: 250, fontSize: 24, align: 'right', bold: true, text: data.enrollmentNo || student?.registrationNo || '' },
    { x: 500, y: 507, w: 560, fontSize: 32, align: 'center', bold: true, text: data.studentName || '' },
    { x: 350, y: 552, w: 560, fontSize: 30, align: 'center', bold: true, text: student?.fatherName || '' },
    { x: 455, y: 598, w: 250, fontSize: 28, align: 'right', bold: true, text: data.enrollmentNo || student?.registrationNo || '' },
    { x: 450, y: 682, w: 600, fontSize: 32, align: 'center', bold: true, text: data.course || '' },
    { x: 260, y: 739, w: 290, fontSize: 28, align: 'center', bold: true, text: data.duration || course?.duration || student?.duration || '' },
    { x: 600, y: 739, w: 290, fontSize: 28, align: 'center', bold: true, text: data.session || student?.batch || shortYear(data.issueDate || data.publishedDate) },
    { x: 1020, y: 739, w: 280, fontSize: 28, align: 'right', bold: true, text: data.percentage != null ? `${data.percentage}%` : '' },
    { x: 1000, y: 739, w: 240, fontSize: 28, align: 'left', bold: true, text: data.grade || '' },
    { x: 310, y: 891, w: 220, fontSize: 24, align: 'center', bold: true, text: data.issueDate || data.publishedDate || '' },
    { x: 90, y: 960, w: 500, fontSize: 16, align: 'left', bold: false, text: instituteName },
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
      {fields.map((f, i) => (
        <span
          key={i}
          style={abs(f.x, f.y, f.w, f.fontSize, f.align, f.bold)}
        >
          {f.text}
        </span>
      ))}
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
