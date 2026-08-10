import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  Award,
  Download,
  User,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Hash,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  Percent,
  TrendingUp,
  ClipboardList,
} from 'lucide-react'
import { getCourseDetails } from '@/admin/services/api'
import type { Student } from '@/admin/services/api'
import { studentsService } from '@/services/students.service'
import { coursesService } from '@/services/courses.service'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Modal, { WinButton } from '@/admin/components/ui/Modal'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function formatDate(value?: string): string {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function getErrorMessage(err: any, fallback: string): string {
  const data = err?.response?.data
  if (data?.errors) {
    const messages = Object.values(data.errors).flat()
    return (messages[0] as string) || fallback
  }
  return data?.message || data?.error || err?.message || fallback
}

function printDocument(title: string, body: string) {
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; padding: 40px; color: #0A2647; }
        .doc-header { text-align: center; border-bottom: 3px double #0A2647; padding-bottom: 16px; margin-bottom: 24px; }
        .doc-header h1 { font-size: 22px; font-weight: 800; letter-spacing: 1px; }
        .doc-header p { font-size: 12px; color: #666; margin-top: 4px; }
        .doc-title { font-size: 16px; font-weight: 700; margin-top: 10px; letter-spacing: 2px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 40px; margin-bottom: 24px; font-size: 13px; }
        .info-grid p { margin-bottom: 4px; }
        .info-grid strong { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #0A2647; color: white; padding: 10px 12px; font-size: 12px; text-align: left; }
        td { padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #e5e7eb; }
        tr:nth-child(even) td { background: #F8F9FA; }
        .total-row td { background: #0A2647 !important; color: white; font-weight: 700; }
        .summary { display: flex; justify-content: space-between; padding: 16px 20px; background: #F0F8FF; border-radius: 8px; margin-bottom: 24px; }
        .summary-item { text-align: center; }
        .summary-item .label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .summary-item .value { font-size: 18px; font-weight: 700; }
        .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
        .sig-box { text-align: center; width: 220px; }
        .sig-line { border-top: 1px solid #0A2647; margin-top: 50px; padding-top: 5px; font-size: 11px; font-weight: 600; }
        .footer { text-align: center; margin-top: 30px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
        .footer p { font-size: 10px; color: #999; }
        .cert-body { text-align: center; padding: 40px 30px; border: 3px solid #0A2647; }
        .cert-body h2 { font-size: 20px; letter-spacing: 2px; margin-bottom: 8px; }
        .cert-body .student-name { font-size: 28px; font-weight: 800; margin: 20px 0 6px; color: #0A2647; }
        .cert-body .line { font-size: 14px; color: #555; }
        .cert-meta { display: flex; justify-content: center; gap: 40px; margin-top: 24px; }
        .cert-meta p { font-size: 13px; }
        .cert-meta strong { font-weight: 700; }
      </style>
    </head>
    <body>
      ${body}
    </body>
    </html>
  `)
  win.document.close()
  win.focus()
  win.print()
}

const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-navy/15 focus:border-navy outline-none transition-shadow bg-white'
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

function SectionHeader({ icon: Icon, color, title, hint }: { icon: any; color: string; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </span>
      <div>
        <p className="text-sm font-bold text-text-dark">{title}</p>
        <p className="text-[11px] text-gray-400">{hint}</p>
      </div>
    </div>
  )
}

const RESULT_COLUMNS = [
  'S.No', 'Subject', 'Max Marks', 'Passing Marks', 'Obtained Marks', 'Percentage', 'Status',
]

function ExcelResultsTable({ result }: { result: NonNullable<Student['results']> }) {
  return (
    <div className="overflow-auto max-h-[420px] border border-gray-300 bg-white rounded-lg shadow-sm">
      <table className="w-full border-collapse text-[12px]">
        <thead className="sticky top-0 z-10">
          {/* Excel column letters */}
          <tr className="bg-[#3B3B3B]">
            {RESULT_COLUMNS.map((_, i) => (
              <th
                key={`letter-${i}`}
                className="border border-[#555555] px-2 py-0.5 text-center text-[10px] font-bold text-white/80 tracking-wider"
              >
                {String.fromCharCode(65 + i)}
              </th>
            ))}
          </tr>
          {/* Header row */}
          <tr className="bg-[#217346]">
            {RESULT_COLUMNS.map((h) => (
              <th
                key={h}
                className="border border-[#1B5E20] px-2.5 py-1.5 text-left text-[11px] font-bold text-white whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.subjects.map((sub: any, idx: number) => {
            const pct = sub.maxMarks > 0 ? Math.round((sub.marks / sub.maxMarks) * 100) : 0
            const pass = sub.marks >= sub.passingMarks
            return (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F1F6F2] hover:bg-[#E3F0E6]'}>
                <td className="border border-gray-300 px-2 py-1.5 text-center text-gray-500">{idx + 1}</td>
                <td className="border border-gray-300 px-2.5 py-1.5 font-medium text-gray-900">{sub.name}</td>
                <td className="border border-gray-300 px-2.5 py-1.5 text-center text-gray-700">{sub.maxMarks}</td>
                <td className="border border-gray-300 px-2.5 py-1.5 text-center text-gray-700">{sub.passingMarks}</td>
                <td className="border border-gray-300 px-2.5 py-1.5 text-center font-semibold text-gray-900">{sub.marks}</td>
                <td className="border border-gray-300 px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 min-w-[50px]">
                      <div
                        className={`h-1.5 rounded-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : pct >= 33 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 w-10 text-right">{pct}%</span>
                  </div>
                </td>
                <td className="border border-gray-300 px-2.5 py-1.5 text-center">
                  {pass ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      <XCircle className="w-3 h-3" /> Fail
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
          {/* Total row */}
          <tr className="bg-[#0A2647]">
            <td className="border border-[#0A2647] px-2.5 py-2 text-center text-white/70 font-bold" colSpan={2}>TOTAL</td>
            <td className="border border-[#0A2647] px-2.5 py-2 text-center font-bold text-white">{result.maxTotal}</td>
            <td className="border border-[#0A2647] px-2.5 py-2 text-center text-white/60" />
            <td className="border border-[#0A2647] px-2.5 py-2 text-center font-bold text-gold">{result.total}</td>
            <td className="border border-[#0A2647] px-2.5 py-2 text-center font-bold text-white">{result.percentage}%</td>
            <td className="border border-[#0A2647] px-2.5 py-2 text-center">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${result.pass ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
                {result.pass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {result.pass ? 'PASS' : 'FAIL'}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function StudentProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const resultsRef = useRef<HTMLDivElement>(null)
  const certificateRef = useRef<HTMLDivElement>(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState<string | null>(null)

  const emptyForm = {
    name: '', fatherName: '', motherName: '', dob: '', gender: '' as '' | 'Male' | 'Female' | 'Other',
    mobile: '', email: '', address: '', courseId: '', batch: '', admissionDate: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Graduated',
  }
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const REQUIRED_FIELDS: { key: keyof typeof emptyForm; label: string }[] = [
    { key: 'name', label: 'Student Name' },
    { key: 'fatherName', label: "Father's Name" },
    { key: 'motherName', label: "Mother's Name" },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'gender', label: 'Gender' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'address', label: 'Address' },
    { key: 'courseId', label: 'Course' },
    { key: 'batch', label: 'Batch' },
    { key: 'admissionDate', label: 'Admission Date' },
  ]

  const coursesQuery = useQuery<any[]>({
    queryKey: ['courses'],
    queryFn: () => coursesService.list() as Promise<any[]>,
  })
  const courses = coursesQuery.data ?? []

  const { data: student, isLoading, isError, refetch } = useQuery<Student>({
    queryKey: ['student', id],
    queryFn: () => studentsService.show(Number(id)),
    enabled: !!id,
  })

  const courseDetailsQuery = useQuery({
    queryKey: ['course-details', student?.courseId],
    queryFn: () => getCourseDetails(String(student?.courseId)),
    enabled: !!student?.courseId,
  })
  const courseDetails = courseDetailsQuery.data ?? null

  const studentResult = student?.results ?? null
  const studentCertificate = student?.certificate ?? null

  function handleFormChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => {
      if (!prev[field]) return prev
      const n = { ...prev }
      delete n[field]
      return n
    })
  }

  function openEditModal() {
    if (!student) return
    setEditingStudent(student)
    setForm({
      name: student.name, fatherName: student.fatherName || '', motherName: student.motherName || '', dob: student.dob || '',
      gender: (student.gender as any) || '', mobile: student.mobile || '', email: student.email || '', address: student.address || '',
      courseId: student.courseId || '', batch: student.batch || '', admissionDate: student.admissionDate || '',
      status: student.status,
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  async function handleSubmitStudent() {
    const errs: Record<string, string> = {}
    for (const f of REQUIRED_FIELDS) {
      if (!form[f.key]) errs[f.key] = `${f.label} is required`
    }
    if (form.mobile && !/^[0-9]{10,15}$/.test(form.mobile)) errs.mobile = 'Enter a valid mobile number (10-15 digits)'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      await studentsService.update(Number(id), { ...form, status: form.status })
      toast('Student updated successfully')
      queryClient.invalidateQueries({ queryKey: ['student', id] })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setShowEditModal(false)
      setEditingStudent(null)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to update student'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteStudent() {
    setDeleting(true)
    try {
      await studentsService.delete(Number(id))
      toast('Student deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['students'] })
      navigate('/admin/students')
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete student'), 'error')
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  function scrollToSection(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function buildMarksheetHtml(): string {
    const r = studentResult
    const subjects = r?.subjects ?? []
    const passStatus = r?.pass ? 'PASS' : 'FAIL'
    const subjectRows = subjects
      .map(
        (s: any, i: number) => `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td>${s.maxMarks}</td>
        <td><strong>${s.marks}</strong></td>
        <td style="color:${s.marks >= s.passingMarks ? '#28A745' : '#dc2626'}; font-weight:600;">${s.marks >= s.passingMarks ? 'PASS' : 'FAIL'}</td>
      </tr>`
      )
      .join('')

    return `
      <div class="doc-header">
        <h1>Z-TECH CAREER ACADEMY</h1>
        <p>Behind Jat School, Rishi Nagar, Gali No. 9, Kaithal, Haryana</p>
        <p class="doc-title">STATEMENT OF MARKS</p>
      </div>
      <div class="info-grid">
        <p><strong>Name:</strong> ${student?.name}</p>
        <p><strong>Father's Name:</strong> ${student?.fatherName || '—'}</p>
        <p><strong>Course:</strong> ${student?.course}</p>
        <p><strong>Roll No:</strong> ${student?.rollNo}</p>
        <p><strong>Batch:</strong> ${student?.batch}</p>
        <p><strong>Registration No:</strong> ${student?.registrationNo}</p>
      </div>
      <table>
        <thead>
          <tr><th>S.No.</th><th>Subject</th><th>Max Marks</th><th>Obtained Marks</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${subjectRows}
          <tr class="total-row">
            <td colspan="2">TOTAL</td>
            <td>${r?.maxTotal}</td>
            <td>${r?.total}</td>
            <td>${passStatus}</td>
          </tr>
        </tbody>
      </table>
      <div class="summary">
        <div class="summary-item"><div class="label">Percentage</div><div class="value">${r?.percentage}%</div></div>
        <div class="summary-item"><div class="label">Grade</div><div class="value">${r?.grade}</div></div>
        <div class="summary-item"><div class="label">Result</div><div class="value" style="color:${r?.pass ? '#28A745' : '#dc2626'}">${passStatus}</div></div>
      </div>
      <div class="signatures">
        <div class="sig-box"><div class="sig-line">Student Signature</div></div>
        <div class="sig-box"><div class="sig-line">Director Signature</div></div>
      </div>
      <div class="footer">
        <p>This is a computer-generated marksheet from Z-TECH CAREER ACADEMY.</p>
        <p>Issued on: ${r?.publishedDate ? formatDate(r.publishedDate) : formatDate(new Date().toISOString())}</p>
      </div>
    `
  }

  function buildCertificateHtml(): string {
    const c = studentCertificate
    return `
      <div class="doc-header">
        <h1>Z-TECH CAREER ACADEMY</h1>
        <p>Behind Jat School, Rishi Nagar, Gali No. 9, Kaithal, Haryana</p>
      </div>
      <div class="cert-body">
        <p class="line">CERTIFICATE OF COMPLETION</p>
        <p class="line" style="margin-top:20px;">This is to certify that</p>
        <div class="student-name">${student?.name}</div>
        <p class="line">has successfully completed the course</p>
        <p style="font-size:18px; font-weight:700; margin:10px 0;">${student?.course}</p>
        <p class="line">${courseDetails?.duration ? `Duration: ${courseDetails.duration} &nbsp;•&nbsp; ` : ''}Batch: ${student?.batch}</p>
        <div class="cert-meta">
          <p><strong>Certificate No:</strong> ${c?.certificateNo || '—'}</p>
          <p><strong>Issue Date:</strong> ${formatDate(c?.issueDate)}</p>
          <p><strong>Grade:</strong> ${c?.grade || studentResult?.grade || '—'}</p>
        </div>
        ${c?.verificationUrl ? `<p style="margin-top:20px; font-size:12px; color:#666;">Verify: ${c.verificationUrl}</p>` : ''}
      </div>
      <div class="signatures">
        <div class="sig-box"><div class="sig-line">Coordinator</div></div>
        <div class="sig-box"><div class="sig-line">Director</div></div>
      </div>
      <div class="footer">
        <p>This is a computer-generated certificate from Z-TECH CAREER ACADEMY.</p>
      </div>
    `
  }

  function handleDownload(kind: 'certificate' | 'marksheet') {
    setDownloading(kind)
    try {
      if (kind === 'marksheet') {
        if (!studentResult) {
          toast('No result available to download', 'warning')
          return
        }
        printDocument(`Marksheet - ${student?.name}`, buildMarksheetHtml())
      } else {
        if (!studentCertificate) {
          toast('No certificate available to download', 'warning')
          return
        }
        printDocument(`Certificate - ${student?.name}`, buildCertificateHtml())
      }
    } finally {
      setDownloading(null)
    }
  }

  function handleIssueCertificate() {
    navigate('/admin/certificates')
  }

  if (isLoading) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-navy animate-spin" />
        <p className="text-text-gray mt-4 text-sm">Loading student details...</p>
      </div>
    )
  }

  if (isError || !student) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Student Not Found</h2>
        <p className="text-text-gray mb-6">The student you are looking for does not exist.</p>
        <button className="btn-primary" onClick={() => navigate('/admin/students')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
      </div>
    )
  }

  function getStatusBadge(status: Student['status']) {
    switch (status) {
      case 'Active':
        return <span className="badge-success">Active</span>
      case 'Inactive':
        return <span className="badge-danger">Inactive</span>
      case 'Graduated':
        return <span className="badge-info">Graduated</span>
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 text-text-gray hover:text-navy transition-colors mb-6 group"
        onClick={() => navigate('/admin/students')}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Students</span>
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 ${getAvatarColor(student.name)}`}
          >
            {getInitials(student.name)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-navy">{student.name}</h1>
              <div className="flex items-center gap-2">
                <span className="badge-info">{student.course}</span>
                {getStatusBadge(student.status)}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-gray mt-1">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {student.rollNo}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {student.mobile}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {student.email}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button className="btn-outline text-xs py-1.5" onClick={openEditModal}>
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button className="btn-danger text-xs py-1.5" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
            <button className="btn-outline text-xs py-1.5" onClick={() => scrollToSection(resultsRef)}>
              <FileText className="w-3.5 h-3.5" />
              View Result
            </button>
            <button className="btn-outline text-xs py-1.5" onClick={() => scrollToSection(certificateRef)}>
              <Award className="w-3.5 h-3.5" />
              View Certificate
            </button>
            <button
              className="btn-outline text-xs py-1.5"
              onClick={() => handleDownload('certificate')}
              disabled={!studentCertificate || downloading === 'certificate'}
            >
              <Download className="w-3.5 h-3.5" />
              {downloading === 'certificate' ? 'Opening...' : 'Certificate'}
            </button>
            <button
              className="btn-outline text-xs py-1.5"
              onClick={() => handleDownload('marksheet')}
              disabled={!studentResult || downloading === 'marksheet'}
            >
              <Download className="w-3.5 h-3.5" />
              {downloading === 'marksheet' ? 'Opening...' : 'Marksheet'}
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={User} color="bg-navy/10 text-navy" title="Personal Information" hint="Student's personal details" />
          <div className="space-y-8">
            <DetailRow icon={User} label="Father Name" value={student.fatherName} />
            <DetailRow icon={User} label="Mother Name" value={student.motherName} />
            <DetailRow icon={Calendar} label="Date of Birth" value={formatDate(student.dob)} />
            <DetailRow icon={User} label="Gender" value={student.gender} />
            <DetailRow icon={Phone} label="Mobile" value={student.mobile} />
            <DetailRow icon={Mail} label="Email" value={student.email || '—'} />
            <DetailRow icon={MapPin} label="Address" value={student.address || '—'} />
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Academic Information" hint="Course and enrollment details" />
          <div className="space-y-8">
            <DetailRow icon={BookOpen} label="Course" value={student.course} />
            <DetailRow icon={Calendar} label="Batch" value={student.batch} />
            <DetailRow icon={Calendar} label="Admission Date" value={formatDate(student.admissionDate)} />
            <DetailRow icon={Hash} label="Registration No" value={student.registrationNo} />
            <DetailRow icon={Hash} label="Roll No" value={student.rollNo} />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-text-gray" />
              </div>
              <div>
                <p className="text-xs text-text-gray font-medium">Status</p>
                <div className="mt-0.5">{getStatusBadge(student.status)}</div>
              </div>
            </div>
            {courseDetails && (
              <>
                <div className="border-t border-gray-200 my-3" />
                <DetailRow icon={Calendar} label="Duration" value={courseDetails.duration} />
                <DetailRow icon={BookOpen} label="Eligibility" value={courseDetails.eligibility} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-6" ref={resultsRef}>
        {student.resultPublished && studentResult ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#217346] to-emerald-600 flex items-center justify-center shadow-sm">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-navy flex items-center gap-2">
                    Exam Results
                  </h3>
                  <p className="text-xs text-text-gray">Subject-wise marks &amp; performance summary</p>
                </div>
              </div>
              <button className="btn-gold text-sm" onClick={() => handleDownload('marksheet')} disabled={downloading === 'marksheet'}>
                <Download className="w-4 h-4" />
                {downloading === 'marksheet' ? 'Opening...' : 'Download Marksheet'}
              </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-navy" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-text-gray font-medium">Total Marks</p>
                  <p className="text-lg font-bold text-navy leading-tight">
                    {studentResult.total}<span className="text-sm font-semibold text-text-gray">/{studentResult.maxTotal}</span>
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Percent className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-text-gray font-medium">Percentage</p>
                  <p className={`text-lg font-bold leading-tight ${studentResult.percentage >= 75 ? 'text-emerald-600' : studentResult.percentage >= 50 ? 'text-blue-600' : studentResult.percentage >= 33 ? 'text-amber-600' : 'text-red-500'}`}>
                    {studentResult.percentage}%
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-text-gray font-medium">Grade</p>
                  <p className="text-lg font-bold text-navy leading-tight">{studentResult.grade}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-text-gray font-medium">Published</p>
                  <p className="text-sm font-bold text-navy leading-tight">{formatDate(studentResult.publishedDate)}</p>
                </div>
              </div>
            </div>

            {/* Excel-style marks table */}
            <ExcelResultsTable result={studentResult} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 p-6 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Result not yet published</p>
                <p className="text-amber-600 text-xs mt-0.5">
                  The examination results for this student have not been published yet. Please check back later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Section */}
      <div ref={certificateRef}>
        {student.certificateIssued && studentCertificate ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-navy mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              Certificate Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <p className="text-xs text-green-700 font-medium mb-1">Certificate No</p>
                <p className="text-sm font-bold text-green-800">{studentCertificate.certificateNo}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <p className="text-xs text-blue-700 font-medium mb-1">Issue Date</p>
                <p className="text-sm font-bold text-blue-800">{formatDate(studentCertificate.issueDate)}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <p className="text-xs text-purple-700 font-medium mb-1">Verification URL</p>
                {studentCertificate.verificationUrl ? (
                  <a
                    href={studentCertificate.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-purple-800 hover:text-purple-600 flex items-center gap-1 transition-colors"
                  >
                    Verify Certificate
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-sm font-bold text-purple-800">—</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn-gold text-sm" onClick={() => handleDownload('certificate')} disabled={downloading === 'certificate'}>
                <Download className="w-4 h-4" />
                {downloading === 'certificate' ? 'Opening...' : 'Download Certificate'}
              </button>
              <button className="btn-outline text-sm" onClick={() => handleDownload('marksheet')} disabled={downloading === 'marksheet'}>
                <Download className="w-4 h-4" />
                {downloading === 'marksheet' ? 'Opening...' : 'Download Marksheet'}
              </button>
            </div>
          </div>
        ) : student.resultPublished && studentResult && studentResult.pass && !student.certificateIssued ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-navy mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              Certificate
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm">Certificate not yet issued</p>
                  <p className="text-amber-600 text-xs mt-0.5">
                    Student has passed the examination. Certificate can be issued now.
                  </p>
                </div>
              </div>
              <button className="btn-gold text-sm shrink-0" onClick={handleIssueCertificate}>
                <Award className="w-4 h-4" />
                Issue Certificate
              </button>
            </div>
          </div>
        ) : student.resultPublished && studentResult && !studentResult.pass ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-base font-bold text-navy mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-gold" />
              Certificate
            </h3>
            <div className="flex items-center gap-3 p-6 bg-red-50 rounded-xl border border-red-200">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Certificate not available</p>
                <p className="text-red-600 text-xs mt-0.5">
                  Student did not pass the examination. Certificate cannot be issued.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Student"
        message="Are you sure you want to delete this student record? All associated data will be permanently removed."
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteStudent}
        loading={deleting}
      />

      {/* Edit Student Modal */}
      <Modal
        open={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingStudent(null) }}
        title="Edit Student"
        subtitle="Update the student details below"
        size="lg"
        scroll
        accent
        footer={
          <>
            <WinButton onClick={() => { setShowEditModal(false); setEditingStudent(null) }}>Cancel</WinButton>
            <WinButton variant="primary" onClick={handleSubmitStudent} disabled={submitting}>
              {submitting ? 'Saving...' : 'Update Student'}
            </WinButton>
          </>
        }
      >
        <div className="p-6 flex flex-col gap-5">
          {/* Personal Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionHeader icon={User} color="bg-navy/10 text-navy" title="Personal Details" hint="Basic identity information" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Student Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="Enter student name" value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} />
                {formErrors.name && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Father's Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="Enter father's name" value={form.fatherName} onChange={(e) => handleFormChange('fatherName', e.target.value)} />
                {formErrors.fatherName && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.fatherName}</p>}
              </div>
              <div>
                <label className={labelCls}>Mother's Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="Enter mother's name" value={form.motherName} onChange={(e) => handleFormChange('motherName', e.target.value)} />
                {formErrors.motherName && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.motherName}</p>}
              </div>
              <div>
                <label className={labelCls}>DOB <span className="text-red-500">*</span></label>
                <input type="date" className={inputCls} value={form.dob} onChange={(e) => handleFormChange('dob', e.target.value)} />
                {formErrors.dob && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.dob}</p>}
              </div>
              <div>
                <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                <select className={inputCls} value={form.gender} onChange={(e) => handleFormChange('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.gender}</p>}
              </div>
              <div>
                <label className={labelCls}>Mobile <span className="text-red-500">*</span></label>
                <input type="tel" className={inputCls} placeholder="Enter mobile" value={form.mobile} onChange={(e) => handleFormChange('mobile', e.target.value)} />
                {formErrors.mobile && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.mobile}</p>}
              </div>
            </div>
          </div>

          {/* Contact & Course */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Contact & Course" hint="Contact details and enrolled course" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} placeholder="Enter email" value={form.email} onChange={(e) => handleFormChange('email', e.target.value)} />
                {formErrors.email && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.email}</p>}
              </div>
              <div>
                <label className={labelCls}>Address <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="Enter address" value={form.address} onChange={(e) => handleFormChange('address', e.target.value)} />
                {formErrors.address && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.address}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Course <span className="text-red-500">*</span></label>
              <select className={inputCls} value={form.courseId} onChange={(e) => handleFormChange('courseId', e.target.value)}>
                <option value="">Select Course</option>
                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name} — {c.code}</option>)}
              </select>
              {formErrors.courseId && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.courseId}</p>}
            </div>
          </div>

          {/* Enrollment Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionHeader icon={Calendar} color="bg-gold/10 text-gold" title="Enrollment Details" hint="Batch, admission date and status" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Batch <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="e.g., 2024-2025" value={form.batch} onChange={(e) => handleFormChange('batch', e.target.value)} />
                {formErrors.batch && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.batch}</p>}
              </div>
              <div>
                <label className={labelCls}>Admission Date <span className="text-red-500">*</span></label>
                <input type="date" className={inputCls} value={form.admissionDate} onChange={(e) => handleFormChange('admissionDate', e.target.value)} />
                {formErrors.admissionDate && <p className="text-red-500 text-[10px] mt-0.5">{formErrors.admissionDate}</p>}
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={(e) => handleFormChange('status', e.target.value)}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-text-gray" />
      </div>
      <div>
        <p className="text-xs text-text-gray font-medium">{label}</p>
        <p className="text-sm font-semibold text-navy mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default StudentProfile
