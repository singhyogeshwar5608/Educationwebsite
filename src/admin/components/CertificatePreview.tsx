import { useRef, useState, useEffect, type CSSProperties } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Download, Loader2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { studentsService } from '@/services/students.service'
import { settingsService } from '@/services/gallery.service'
import { coursesService } from '@/services/courses.service'
import type { Result } from '@/admin/services/api'
import { CERT_BG_BASE64 } from '@/admin/components/certBgBase64'

interface CertificatePreviewProps {
  result: Result
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

function CertificateContent({
  result,
  student,
  course,
  instituteName,
}: {
  result: Result
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
      {/* Certificate No */}
      <span style={abs(170, 40, 420, 24, 'left')}>{result.rollNo || ''}</span>

      {/* Enrollment / Registration No (top right) */}
      <span style={abs(1140, 40, 250, 24, 'right')}>
        {student?.registrationNo || ''}
      </span>

      {/* Student Name */}
      <span style={abs(500, 507, 560, 32, 'center')}>{result.studentName || ''}</span>

      {/* Father's Name */}
      <span style={abs(350, 552, 560,30, 'center')}>{student?.fatherName || ''}</span>

      {/* Enrollment / Registration No (top right) */}
      <span style={abs(455,598, 250, 28, 'right')}>
        {student?.registrationNo || ''}
      </span>

      {/* Course */}
      <span style={abs(450, 682, 600, 32, 'center')}>{result.course || ''}</span>

      {/* Duration */}
      <span style={abs(260, 739, 290, 28, 'center')}>
        {course?.duration || student?.duration || (result as any)?.duration || ''}
      </span>

      {/* Session */}
      <span style={abs(600, 739, 290, 28, 'center')}>
        {student?.batch || shortYear(result.publishedDate)}
      </span>

      {/* Percentage / Grade */}
      <span style={abs(1020, 739, 280, 28, 'right')}>
        {result.percentage ? `${result.percentage}%` : ''}
      </span>
      <span style={abs(1000, 739, 240, 28, 'left')}>{result.grade || ''}</span>

      {/* Date */}
      <span style={abs(310, 891, 220, 24, 'center')}>
        {result.publishedDate || ''}
      </span>

      {/* Institute Name */}
      <span style={abs(90, 960, 500, 16, 'left', false)}>{instituteName}</span>
    </div>
  )
}

export default function CertificatePreview({ result, onClose }: CertificatePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [scale, setScale] = useState(0.5)

  const studentQuery = useQuery({
    queryKey: ['student-for-certificate', result.studentId],
    queryFn: () => studentsService.show(Number(result.studentId)),
    enabled: !!result.studentId,
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
    if (!previewRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [DESIGN_W, DESIGN_H],
        hotfixes: ['px_scaling'],
      })
      pdf.addImage(imgData, 'JPEG', 0, 0, DESIGN_W, DESIGN_H)
      pdf.save(`Certificate_${result.rollNo || result.studentName || 'Student'}.pdf`)
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
          <div ref={measureRef} className="w-full overflow-hidden">
            <div
              style={{
                width: DESIGN_W,
                height: DESIGN_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <CertificateContent
                result={result}
                student={student}
                course={course}
                instituteName={instituteName}
              />
            </div>
            <div style={{ height: DESIGN_H * scale }} />
          </div>

          <div
            style={{
              position: 'fixed',
              left: '-10000px',
              top: 0,
              width: DESIGN_W,
              height: DESIGN_H,
              zIndex: -1,
              pointerEvents: 'none',
            }}
          >
            <div ref={previewRef}>
              <CertificateContent
                result={result}
                student={student}
                course={course}
                instituteName={instituteName}
              />
            </div>
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
