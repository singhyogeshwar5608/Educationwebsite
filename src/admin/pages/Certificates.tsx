import { useState, useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Search, Award, Eye, Download, ExternalLink, X, ChevronRight, ChevronLeft, CheckCircle2,
  User, FileCheck, Shield, Calendar, Hash, BookOpen, QrCode, Link2, Printer, GraduationCap,
  Trash2, Loader2, AlertCircle,
} from 'lucide-react'
import { getCourseDetails } from '@/admin/services/api'
import type { Certificate } from '@/admin/services/api'
import { certificatesService } from '@/services/results.service'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Panel from '@/admin/components/ui/Panel'
import Card from '@/admin/components/ui/Card'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'
import type { ExcelColumn } from '@/admin/components/ExcelSpreadsheet'

const ITEMS_PER_PAGE = 8

interface EligibleStudent {
  id: string; name: string; course: string | null; courseId: string | null;
  rollNo: string | null; registrationNo: string | null; batch: string | null;
  fatherName: string | null; motherName: string | null; dob: string | null;
  percentage: number | null; grade: string | null;
}

function generateCertificateNo(existing: Certificate[]): string {
  const y = new Date().getFullYear()
  const nums = existing.filter((c) => c.certificateNo.startsWith(`ZTECH-${y}-`)).map((c) => parseInt(c.certificateNo.split('-')[2], 10) || 0)
  return `ZTECH-${y}-${String(nums.length > 0 ? Math.max(...nums) + 1 : 1).padStart(3, '0')}`
}

function CertStepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [{ label: 'Select Student', icon: User }, { label: 'Review Details', icon: FileCheck }, { label: 'Generate & Issue', icon: Award }]
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((step, idx) => {
        const n = idx + 1; const a = n === currentStep; const d = n < currentStep; const Icon = step.icon
        return (
          <div key={n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold border ${d ? 'bg-[#2E7D32] text-white border-[#1B5E20]' : a ? 'bg-[#0078D7] text-white border-[#005A9E]' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
                {d ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-[9px] mt-1 font-medium ${a ? 'text-[#0078D7]' : d ? 'text-[#2E7D32]' : 'text-gray-500'}`}>{step.label}</span>
            </div>
            {idx < 2 && <div className={`w-12 sm:w-20 h-0.5 mx-1 mt-[-1.25rem] ${n < currentStep ? 'bg-[#2E7D32]' : 'bg-gray-300'}`} />}
          </div>
        )
      })}
    </div>
  )
}

function getGradeBadgeClass(g: string) { if (g === 'A+' || g === 'A') return 'badge-success'; if (g === 'B+' || g === 'B') return 'badge-info'; if (g === 'C' || g === 'D') return 'badge-warning'; if (g === 'F') return 'badge-danger'; return 'badge-info' }

function Certificates() {
  const [activeTab, setActiveTab] = useState<'issued' | 'issue'>('issued')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Issued' | 'Pending'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewCert, setViewCert] = useState<Certificate | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [issueStep, setIssueStep] = useState(1)
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<EligibleStudent | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const certificatesQuery = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: () => certificatesService.list() as Promise<Certificate[]>,
  })
  const certs = certificatesQuery.data ?? []

  const eligibleQuery = useQuery<EligibleStudent[]>({
    queryKey: ['eligible-certificate-students'],
    queryFn: () => certificatesService.eligibleStudents() as Promise<EligibleStudent[]>,
  })
  const eligibleData = eligibleQuery.data ?? []

  const filteredCerts = useMemo(() => {
    const q = search.toLowerCase()
    return certs.filter((c) => (!q || c.studentName.toLowerCase().includes(q) || c.certificateNo.toLowerCase().includes(q) || c.course.toLowerCase().includes(q)) && (statusFilter === 'all' || (statusFilter === 'Issued' && c.issueDate) || (statusFilter === 'Pending' && !c.issueDate)))
  }, [search, statusFilter, certs])
  const totalPages = Math.max(1, Math.ceil(filteredCerts.length / ITEMS_PER_PAGE))
  const paginatedCerts = filteredCerts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const eligibleStudents = useMemo(() => {
    const q = studentSearch.toLowerCase()
    return eligibleData.filter((s) => !q || s.name.toLowerCase().includes(q) || (s.rollNo || '').toLowerCase().includes(q) || (s.course || '').toLowerCase().includes(q))
  }, [eligibleData, studentSearch])

  const [autoCertData, setAutoCertData] = useState<any>(null)

  useEffect(() => {
    if (!selectedStudent) { setAutoCertData(null); return }
    getCourseDetails(String(selectedStudent.courseId)).then((cd) => {
      const cn = generateCertificateNo(certs)
      setAutoCertData({
        studentName: selectedStudent.name, fatherName: selectedStudent.fatherName, motherName: selectedStudent.motherName,
        dob: selectedStudent.dob, course: selectedStudent.course, duration: cd?.duration || '',
        session: selectedStudent.batch, enrollmentNo: selectedStudent.registrationNo, rollNo: selectedStudent.rollNo,
        certificateNo: cn, issueDate: new Date().toISOString().split('T')[0],
        percentage: selectedStudent.percentage ?? 0, grade: selectedStudent.grade || '—',
        qrCode: `QR-${cn}`, verificationUrl: `https://ztech.edu/verify/${cn}`,
      })
    }).catch(() => setAutoCertData(null))
  }, [selectedStudent, certs])

  function getErrorMessage(err: any, fallback: string): string {
    const data = err?.response?.data
    if (data?.errors) {
      const messages = Object.values(data.errors).flat()
      return (messages[0] as string) || fallback
    }
    return data?.message || data?.error || err?.message || fallback
  }

  async function handleIssueCert() {
    if (!selectedStudent || !autoCertData) return
    setSubmitting(true)
    try {
      await certificatesService.issue({
        studentId: Number(selectedStudent.id),
        certificateNo: autoCertData.certificateNo,
        session: autoCertData.session,
        issueDate: autoCertData.issueDate,
        serialNo: null,
        validUntil: 'Lifetime',
        verificationUrl: autoCertData.verificationUrl,
      })
      toast(`Certificate ${autoCertData.certificateNo} issued for ${autoCertData.studentName}!`)
      queryClient.invalidateQueries({ queryKey: ['certificates'] })
      queryClient.invalidateQueries({ queryKey: ['eligible-certificate-students'] })
      setSelectedStudent(null); setStudentSearch(''); setAutoCertData(null); setIssueStep(1); setActiveTab('issued'); setCurrentPage(1)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to issue certificate'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteCert() {
    if (!deleteConfirm) return
    setDeleting(true)
    try {
      await certificatesService.delete(Number(deleteConfirm))
      toast('Certificate deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['certificates'] })
      queryClient.invalidateQueries({ queryKey: ['eligible-certificate-students'] })
      setDeleteConfirm(null)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete certificate'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  function handleSelectStudent(s: EligibleStudent) { setSelectedStudent(s) }
  function handleIssueClick() { setSelectedStudent(null); setStudentSearch(''); setAutoCertData(null); setIssueStep(1); setActiveTab('issue') }

  const certColumns: ExcelColumn<Certificate>[] = [
    { key: 'certNo', header: 'Cert No', render: (c) => <span className="text-[10px] font-mono font-semibold text-[#222222] bg-gray-100 border border-gray-200 px-1.5 py-0.5">{c.certificateNo}</span> },
    { key: 'name', header: 'Student', render: (c) => <span className="text-xs font-semibold text-[#222222]">{c.studentName}</span> },
    { key: 'course', header: 'Course', render: (c) => <span className="badge-info text-[10px]">{c.course}</span> },
    { key: 'date', header: 'Issue Date', render: (c) => <span className="text-xs text-gray-500">{c.issueDate}</span> },
    { key: 'pct', header: '%', render: (c) => <span className="text-xs font-bold text-[#222222]">{c.percentage != null ? c.percentage.toFixed(1) : '—'}%</span> },
    { key: 'grade', header: 'Grade', render: (c) => <span className={getGradeBadgeClass(c.grade)}>{c.grade}</span> },
    { key: 'actions', header: 'Actions', align: 'right', render: (c) => (
      <div className="flex items-center justify-end gap-1">
        <button onClick={() => setViewCert(c)} className="p-0.5 text-gray-400 hover:text-[#0078D7]"><Eye className="w-3 h-3" /></button>
        <button className="p-0.5 text-gray-400 hover:text-[#2E7D32]"><Download className="w-3 h-3" /></button>
        <a href={c.verificationUrl} target="_blank" rel="noopener noreferrer" className="p-0.5 text-gray-400 hover:text-amber-600"><ExternalLink className="w-3 h-3" /></a>
        <button onClick={() => setDeleteConfirm(c.id)} className="p-0.5 text-gray-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-base font-bold text-[#222222]">Certificates</h1><p className="text-[11px] text-gray-500">Issue and manage student certificates</p></div>
        <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5" onClick={handleIssueClick}><Award className="w-3.5 h-3.5" /> Issue Certificate</button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3"><div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFF8E1] border border-[#FFE082] shrink-0"><Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F57F17]" /></div><div><p className="text-sm sm:text-base font-bold text-[#222222]">{certs.length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Issued</p></div></Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3"><div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] shrink-0"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" /></div><div><p className="text-sm sm:text-base font-bold text-[#222222]">{certs.filter((c) => c.grade === 'A+' || c.grade === 'A').length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Distinction</p></div></Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3"><div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 border border-gray-200 shrink-0"><GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" /></div><div><p className="text-sm sm:text-base font-bold text-[#222222]">{eligibleData.length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Pending Issue</p></div></Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <button onClick={() => setActiveTab('issued')} className={`px-3 py-1.5 text-[11px] font-medium border ${activeTab === 'issued' ? 'bg-[#0078D7] text-white border-[#005A9E]' : 'bg-[#E1E1E1] text-[#222222] border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5]'}`}>Issued Certificates</button>
        <button onClick={handleIssueClick} className={`px-3 py-1.5 text-[11px] font-medium border ${activeTab === 'issue' ? 'bg-[#0078D7] text-white border-[#005A9E]' : 'bg-[#E1E1E1] text-[#222222] border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5]'}`}>Issue Certificate</button>
      </div>

      {/* Tab 1: Issued */}
      {activeTab === 'issued' && (
        <Panel title={`Issued Certificates (${filteredCerts.length})`}>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="relative flex-1"><Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search by name, certificate no, course..." className="form-input pl-8" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} /></div>
              <select className="form-select w-36" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1) }}><option value="all">All Status</option><option value="Issued">Issued</option><option value="Pending">Pending</option></select>
            </div>
            {certificatesQuery.isLoading ? (
              <div className="flex flex-col items-center py-8 text-gray-400"><Loader2 className="w-8 h-8 mb-2 animate-spin" /><p className="text-sm font-medium">Loading certificates...</p></div>
            ) : certificatesQuery.isError ? (
              <div className="flex flex-col items-center py-8 text-red-400"><AlertCircle className="w-8 h-8 mb-2" /><p className="text-sm font-medium">Failed to load certificates</p><button onClick={() => certificatesQuery.refetch()} className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]">Retry</button></div>
            ) : paginatedCerts.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-400"><Award className="w-8 h-8 mb-2" /><p className="text-sm font-medium">No certificates found</p></div>
            ) : (
              <>
                <ExcelSpreadsheet data={paginatedCerts} columns={certColumns} />
                {filteredCerts.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-gray-500">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredCerts.length)} of {filteredCerts.length}</p>
                    <div className="flex items-center gap-2">
                      <button className="px-2.5 py-1 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] disabled:opacity-50 text-[#222222]" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
                      <span className="text-[11px] text-[#222222]">Page {currentPage} of {totalPages}</span>
                      <button className="px-2.5 py-1 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] disabled:opacity-50 text-[#222222]" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Panel>
      )}

      {/* Tab 2: Issue */}
      {activeTab === 'issue' && (
        <div className="flex flex-col gap-4">
          <CertStepIndicator currentStep={issueStep} />

          {issueStep === 1 && (
            <Panel title="Select Eligible Student">
              <div className="flex flex-col gap-3">
                <p className="text-[11px] text-gray-500">Only students with published & passed results and no certificate yet</p>
                <div className="relative"><Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search by name, roll no, course..." className="form-input pl-8" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} /></div>
                <div className="border border-[#FFE082] bg-[#FFF8E1] px-2.5 py-1.5 flex items-start gap-1.5"><Shield className="w-3.5 h-3.5 text-[#F57F17] mt-0.5 shrink-0" /><p className="text-[10px] text-[#E65100]">Eligibility: Result Published ✓ | Passed ✓ | No Certificate ✓</p></div>
                <div className="max-h-72 overflow-y-auto flex flex-col gap-1.5">
                  {eligibleQuery.isLoading ? (
                    <div className="text-center py-6 text-gray-400"><Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" /><p className="text-xs font-medium">Loading eligible students...</p></div>
                  ) : eligibleQuery.isError ? (
                    <div className="text-center py-6 text-red-400"><AlertCircle className="w-6 h-6 mx-auto mb-1" /><p className="text-xs font-medium">Failed to load eligible students</p></div>
                  ) : eligibleStudents.length === 0 ? (
                    <div className="text-center py-6 text-gray-400"><User className="w-6 h-6 mx-auto mb-1" /><p className="text-xs font-medium">No eligible students</p></div>
                  ) : eligibleStudents.map((s) => {
                    const sel = selectedStudent?.id === s.id
                    return (
                      <button key={s.id} className={`w-full text-left flex items-center gap-2.5 px-3 py-2 border ${sel ? 'bg-[#E3F2FD] border-[#0078D7]' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => handleSelectStudent(s)}>
                        <div className="w-8 h-8 flex items-center justify-center border border-gray-300 text-[10px] font-bold text-[#222222] bg-gray-100 shrink-0">{s.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}</div>
                        <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-[#222222]">{s.name}</p><p className="text-[10px] text-gray-500">{s.course} • Roll: {s.rollNo}</p></div>
                        {s.percentage != null && <div className="text-right text-[10px] shrink-0"><span className="font-semibold text-[#222222]">{s.percentage.toFixed(1)}%</span><span className={`ml-1 ${getGradeBadgeClass(s.grade || '')}`}>{s.grade}</span></div>}
                        {sel && <CheckCircle2 className="w-4 h-4 text-[#0078D7]" />}
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-end">
                  <button className="px-3 py-1.5 text-[11px] text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5 disabled:opacity-50" disabled={!selectedStudent} onClick={() => setIssueStep(2)}>Next: Review <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </Panel>
          )}

          {issueStep === 2 && selectedStudent && autoCertData && (
            <Panel title="Certificate Details">
              <div className="flex flex-col gap-3">
                <div className="border border-gray-300 bg-white">
                  <div className="bg-[#F0F0F0] border-b border-gray-300 px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-0.5"><GraduationCap className="w-4 h-4 text-[#0078D7]" /><h2 className="text-xs font-bold text-[#222222]">ZTech Institute of Technology</h2></div>
                    <p className="text-[10px] font-semibold text-[#0078D7]">CERTIFICATE OF COMPLETION</p>
                  </div>
                  <div className="p-3 flex flex-col gap-3">
                    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-2.5 py-1.5"><span className="text-[10px] text-gray-500">Certificate No</span><span className="text-[11px] font-mono font-bold text-[#222222]">{autoCertData.certificateNo}</span></div>
                    <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-3">
                      <div className="flex justify-center"><div className="w-24 h-28 border border-gray-200 bg-gray-50 flex flex-col items-center justify-center"><User className="w-6 h-6 text-gray-300" /><span className="text-[8px] text-gray-400 mt-1">Photo</span></div></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                        <div><span className="text-gray-500">Student:</span> <span className="font-semibold text-[#222222]">{autoCertData.studentName}</span></div>
                        <div><span className="text-gray-500">Father:</span> <span className="font-semibold text-[#222222]">{autoCertData.fatherName || '—'}</span></div>
                        <div><span className="text-gray-500">Mother:</span> <span className="font-semibold text-[#222222]">{autoCertData.motherName || '—'}</span></div>
                        <div><span className="text-gray-500">DOB:</span> <span className="font-semibold text-[#222222]">{autoCertData.dob || '—'}</span></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-[11px]">
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Course</span><p className="font-semibold text-[#222222]">{autoCertData.course}</p></div>
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Duration</span><p className="font-semibold text-[#222222]">{autoCertData.duration}</p></div>
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Session</span><p className="font-semibold text-[#222222]">{autoCertData.session}</p></div>
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Enrollment</span><p className="font-semibold text-[#222222]">{autoCertData.enrollmentNo}</p></div>
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Roll</span><p className="font-semibold text-[#222222]">{autoCertData.rollNo}</p></div>
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Issue Date</span><p className="font-semibold text-[#222222]">{autoCertData.issueDate}</p></div>
                      <div className="border border-gray-200 px-2 py-1.5 bg-[#E8F5E9]"><span className="text-gray-500 text-[10px]">Percentage</span><p className="font-bold text-[#222222]">{autoCertData.percentage.toFixed(1)}%</p></div>
                      <div className="border border-gray-200 px-2 py-1.5 bg-[#E8F5E9]"><span className="text-gray-500 text-[10px]">Grade</span><p className="font-bold">{autoCertData.grade}</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 border border-gray-200 px-3 py-2"><QrCode className="w-6 h-6 text-gray-400 shrink-0" /><div><p className="text-[10px] font-semibold text-[#222222]">QR Code</p><p className="text-[8px] text-gray-500">{autoCertData.qrCode}</p></div></div>
                      <div className="flex items-center gap-2 border border-gray-200 px-3 py-2"><Link2 className="w-4 h-4 text-gray-400 shrink-0" /><div className="min-w-0"><p className="text-[10px] font-semibold text-[#222222]">Verification URL</p><p className="text-[8px] text-blue-600 truncate">{autoCertData.verificationUrl}</p></div></div>
                    </div>
                  </div>
                </div>
                <div className="border border-[#A5D6A7] bg-[#E8F5E9] px-2.5 py-1.5 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" /><p className="text-[10px] text-[#1B5E20] font-medium">All fields auto-populated. No manual entry required.</p></div>
                <div className="flex justify-between">
                  <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222] flex items-center gap-1" onClick={() => setIssueStep(1)}><ChevronLeft className="w-3 h-3" /> Previous</button>
                  <button className="px-3 py-1.5 text-[11px] text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5" onClick={() => setIssueStep(3)}>Next: Generate <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </Panel>
          )}

          {issueStep === 3 && selectedStudent && autoCertData && (
            <Panel title="Generate & Issue Certificate">
              <div className="flex flex-col gap-3">
                <div className="border border-gray-300 bg-white">
                  <div className="bg-[#F0F0F0] border-b border-gray-300 px-3 py-2 text-center"><GraduationCap className="w-4 h-4 text-[#0078D7] inline mr-1" /><span className="text-xs font-bold text-[#222222]">ZTech Institute of Technology</span><p className="text-[10px] text-[#0078D7] font-semibold">CERTIFICATE OF COMPLETION</p></div>
                  <div className="p-3 text-center">
                    <p className="text-xs text-[#222222] mb-2">This is to certify that <strong>{autoCertData.studentName}</strong></p>
                    <p className="text-[11px] text-gray-600">has completed <strong>{autoCertData.course}</strong> ({autoCertData.duration}) session {autoCertData.session}</p>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-[9px] text-gray-500">%</span><p className="text-xs font-bold text-[#222222]">{autoCertData.percentage.toFixed(1)}%</p></div>
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-[9px] text-gray-500">Grade</span><p className="text-xs font-bold">{autoCertData.grade}</p></div>
                      <div className="border border-gray-200 px-2 py-1.5"><span className="text-[9px] text-gray-500">Cert No</span><p className="text-[9px] font-mono font-bold text-[#222222]">{autoCertData.certificateNo}</p></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => toast('Certificate preview generated!')} className="px-3 py-1.5 text-[11px] text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5"><FileCheck className="w-3 h-3" /> Preview</button>
                  <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222] flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
                  <button onClick={handleIssueCert} disabled={submitting} className="px-3 py-1.5 text-[11px] text-white bg-[#28A745] border border-[#1E7E34] hover:bg-[#239B3F] flex items-center gap-1.5 disabled:opacity-60"><Award className="w-3 h-3" /> {submitting ? 'Issuing...' : 'Issue Certificate'}</button>
                </div>
                <div className="flex">
                  <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222] flex items-center gap-1" onClick={() => setIssueStep(2)}><ChevronLeft className="w-3 h-3" /> Previous</button>
                </div>
              </div>
            </Panel>
          )}
        </div>
      )}

      {/* View Modal */}
      {viewCert && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto" onClick={() => setViewCert(null)}>
          <div className="bg-white border border-gray-300 w-full max-w-3xl my-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-3 py-2 bg-[#F0F0F0] border-b border-gray-300">
              <h2 className="text-xs font-bold text-[#222222]">Certificate Details</h2>
              <button className="p-0.5 text-gray-500 hover:text-red-600" onClick={() => setViewCert(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="border border-gray-300 bg-white">
                <div className="bg-[#F0F0F0] border-b border-gray-300 px-3 py-2 text-center"><GraduationCap className="w-4 h-4 text-[#0078D7] inline mr-1" /><span className="text-xs font-bold text-[#222222]">ZTech Institute of Technology</span><p className="text-[10px] text-[#0078D7] font-semibold">CERTIFICATE OF COMPLETION</p></div>
                <div className="p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-2.5 py-1.5"><span className="text-[10px] text-gray-500">Certificate No</span><span className="text-[11px] font-mono font-bold text-[#222222]">{viewCert.certificateNo}</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-3">
                    <div className="flex justify-center"><div className="w-24 h-28 border border-gray-200 bg-gray-50 flex flex-col items-center justify-center"><User className="w-6 h-6 text-gray-300" /><span className="text-[8px] text-gray-400 mt-1">Photo</span></div></div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                      <div><span className="text-gray-500">Name:</span> <span className="font-semibold text-[#222222]">{viewCert.studentName}</span></div>
                      <div><span className="text-gray-500">Course:</span> <span className="font-semibold text-[#222222]">{viewCert.course}</span></div>
                      <div><span className="text-gray-500">Enrollment:</span> <span className="font-semibold text-[#222222]">{viewCert.enrollmentNo}</span></div>
                      <div><span className="text-gray-500">Roll:</span> <span className="font-semibold text-[#222222]">{viewCert.rollNo}</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[11px]">
                    <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Duration</span><p className="font-semibold text-[#222222]">{viewCert.duration}</p></div>
                    <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Session</span><p className="font-semibold text-[#222222]">{viewCert.session}</p></div>
                    <div className="border border-gray-200 px-2 py-1.5"><span className="text-gray-500 text-[10px]">Issued</span><p className="font-semibold text-[#222222]">{viewCert.issueDate}</p></div>
                    <div className="border border-gray-200 px-2 py-1.5 bg-[#E8F5E9]"><span className="text-gray-500 text-[10px]">%</span><p className="font-bold text-[#222222]">{viewCert.percentage != null ? viewCert.percentage.toFixed(1) : '—'}%</p></div>
                    <div className="border border-gray-200 px-2 py-1.5 bg-[#E8F5E9]"><span className="text-gray-500 text-[10px]">Grade</span><p className="font-bold">{viewCert.grade}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 border border-gray-200 px-3 py-2"><QrCode className="w-6 h-6 text-gray-400 shrink-0" /><div><p className="text-[10px] font-semibold text-[#222222]">QR Code</p><p className="text-[8px] text-gray-500">{viewCert.qrCode}</p></div></div>
                    <div className="flex items-center gap-2 border border-gray-200 px-3 py-2"><ExternalLink className="w-4 h-4 text-gray-400 shrink-0" /><div className="min-w-0"><p className="text-[10px] font-semibold text-[#222222]">Verify</p><a href={viewCert.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-[8px] text-blue-600 truncate block">{viewCert.verificationUrl}</a></div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-3 py-2 bg-[#F0F0F0] border-t border-gray-300">
              <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222]" onClick={() => setViewCert(null)}>Close</button>
              <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222] flex items-center gap-1"><Download className="w-3 h-3" /> Download</button>
              <a href={viewCert.verificationUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222] flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Verify</a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Certificate"
        message="Are you sure you want to delete this certificate? This action cannot be undone."
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteCert}
        loading={deleting}
      />
    </div>
  )
}

export default Certificates
