import { useState, useMemo } from 'react'
import {
  Search,
  Award,
  Eye,
  Download,
  ExternalLink,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  User,
  FileCheck,
  Shield,
  Calendar,
  Hash,
  BookOpen,
  QrCode,
  Link2,
  Printer,
  GraduationCap,
} from 'lucide-react'
import {
  mockStudents,
  mockResults,
  mockCertificates,
  getCourseDetails,
  calculateGrade,
} from '@/data/mockData'
import type { Student, Certificate, Result } from '@/data/mockData'

const ITEMS_PER_PAGE = 8

// ─── Generate Certificate Number ────────────────────────────
function generateCertificateNo(existingCerts: Certificate[]): string {
  const year = new Date().getFullYear()
  const existingNums = existingCerts
    .filter((c) => c.certificateNo.startsWith(`ZTECH-${year}-`))
    .map((c) => {
      const parts = c.certificateNo.split('-')
      return parseInt(parts[2], 10) || 0
    })
  const nextSeq = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1
  return `ZTECH-${year}-${String(nextSeq).padStart(3, '0')}`
}

// ─── Step indicator ─────────────────────────────────────────
function CertStepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { label: 'Select Student', icon: User },
    { label: 'Review Details', icon: FileCheck },
    { label: 'Generate & Issue', icon: Award },
  ]
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => {
        const stepNum = idx + 1
        const isActive = stepNum === currentStep
        const isCompleted = stepNum < currentStep
        const Icon = step.icon
        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green text-white shadow-lg shadow-green/25'
                    : isActive
                    ? 'bg-gold text-navy shadow-lg shadow-gold/30'
                    : 'bg-gray-200 text-text-gray'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span
                className={`text-xs mt-2 font-semibold whitespace-nowrap ${
                  isActive ? 'text-gold' : isCompleted ? 'text-green' : 'text-text-gray'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-0.5 mx-2 mt-[-1.25rem] transition-all duration-300 ${
                  stepNum < currentStep ? 'bg-green' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Grade color helper ─────────────────────────────────────
function getGradeColor(grade: string): string {
  if (grade === 'A+' || grade === 'A') return 'text-green font-bold'
  if (grade === 'B+' || grade === 'B') return 'text-blue-600 font-bold'
  if (grade === 'C' || grade === 'D') return 'text-amber-600 font-bold'
  if (grade === 'F') return 'text-red-600 font-bold'
  return 'text-navy font-bold'
}

function getGradeBadgeClass(grade: string): string {
  if (grade === 'A+' || grade === 'A') return 'badge-success'
  if (grade === 'B+' || grade === 'B') return 'badge-info'
  if (grade === 'C' || grade === 'D') return 'badge-warning'
  if (grade === 'F') return 'badge-danger'
  return 'badge-info'
}

// ─── Certificates Component ─────────────────────────────────
function Certificates() {
  const [activeTab, setActiveTab] = useState<'issued' | 'issue'>('issued')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Issued' | 'Pending'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Issued certificates state
  const [certificates, setCertificates] = useState<Certificate[]>([...mockCertificates])
  const [viewCert, setViewCert] = useState<Certificate | null>(null)
  const [previewCert, setPreviewCert] = useState(false)

  // Success message
  const [successMsg, setSuccessMsg] = useState('')

  // Issue Certificate workflow state
  const [issueStep, setIssueStep] = useState(1)
  const [studentSearch, setStudentSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)

  // ─── Issued certificates filtering ───────────────────────
  const filteredCertificates = useMemo(() => {
    const q = search.toLowerCase()
    return certificates.filter((c) => {
      const matchesSearch =
        !q ||
        c.studentName.toLowerCase().includes(q) ||
        c.certificateNo.toLowerCase().includes(q) ||
        c.course.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'Issued' && c.issueDate) ||
        (statusFilter === 'Pending' && !c.issueDate)
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, certificates])

  const totalPages = Math.max(1, Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE))
  const paginatedCerts = filteredCertificates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ─── Eligible students: Result Published + Passed + No Certificate ──
  const eligibleStudents = useMemo(() => {
    const q = studentSearch.toLowerCase()
    return mockStudents.filter((s) => {
      const hasPassedResult = mockResults.some(
        (r) => r.studentId === s.id && r.pass
      )
      const hasCert = certificates.some((c) => c.studentId === s.id)
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
      return hasPassedResult && !hasCert && matchesSearch
    })
  }, [studentSearch, certificates])

  // ─── Auto-populate certificate data ──────────────────────
  const autoCertData = useMemo(() => {
    if (!selectedStudent || !selectedResult) return null

    const courseDetails = getCourseDetails(selectedStudent.courseId)
    const certNo = generateCertificateNo(certificates)
    const today = new Date().toISOString().split('T')[0]
    const verificationUrl = `https://ztech.edu/verify/${certNo}`

    return {
      studentName: selectedStudent.name,
      fatherName: selectedStudent.fatherName,
      motherName: selectedStudent.motherName,
      dob: selectedStudent.dob,
      course: selectedStudent.course,
      duration: courseDetails?.duration || '',
      session: selectedStudent.batch,
      enrollmentNo: selectedStudent.registrationNo,
      rollNo: selectedStudent.rollNo,
      certificateNo: certNo,
      issueDate: today,
      percentage: selectedResult.percentage,
      grade: selectedResult.grade,
      qrCode: `QR-${certNo}`,
      verificationUrl,
    }
  }, [selectedStudent, selectedResult, certificates])

  // ─── Issue Certificate ───────────────────────────────────
  function handleIssueCertificate() {
    if (!selectedStudent || !autoCertData) return

    const newCert: Certificate = {
      id: `CRT${String(certificates.length + 1).padStart(3, '0')}`,
      certificateNo: autoCertData.certificateNo,
      studentId: selectedStudent.id,
      studentName: autoCertData.studentName,
      course: autoCertData.course,
      duration: autoCertData.duration,
      session: autoCertData.session,
      enrollmentNo: autoCertData.enrollmentNo,
      rollNo: autoCertData.rollNo,
      issueDate: autoCertData.issueDate,
      percentage: autoCertData.percentage,
      grade: autoCertData.grade,
      qrCode: autoCertData.qrCode,
      verificationUrl: autoCertData.verificationUrl,
    }

    setCertificates((prev) => [newCert, ...prev])
    setSuccessMsg(
      `Certificate ${autoCertData.certificateNo} issued successfully for ${autoCertData.studentName}!`
    )
    setTimeout(() => setSuccessMsg(''), 5000)

    // Reset workflow
    setSelectedStudent(null)
    setSelectedResult(null)
    setStudentSearch('')
    setIssueStep(1)
    setActiveTab('issued')
    setCurrentPage(1)
  }

  // ─── Handle student selection ────────────────────────────
  function handleSelectStudent(student: Student) {
    setSelectedStudent(student)
    // Auto-find their result
    const result = mockResults.find((r) => r.studentId === student.id && r.pass)
    setSelectedResult(result || null)
  }

  // ─── Handle Issue Certificate click ──────────────────────
  function handleIssueClick() {
    setSelectedStudent(null)
    setSelectedResult(null)
    setStudentSearch('')
    setIssueStep(1)
    setActiveTab('issue')
  }

  return (
    <div className="animate-fade-in">
      {/* Success Message */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-[100] bg-green text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <Award className="w-7 h-7" />
              Certificates
              <span className="text-sm font-medium text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full ml-1">
                {certificates.length}
              </span>
            </h1>
            <p className="text-text-gray text-sm mt-1">Issue and manage student certificates</p>
          </div>
          <button className="btn-gold" onClick={handleIssueClick}>
            <Award className="w-4 h-4" />
            Issue Certificate
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{certificates.length}</p>
              <p className="text-xs text-text-gray font-medium">Total Issued</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green">
                {certificates.filter((c) => c.grade === 'A+' || c.grade === 'A').length}
              </p>
              <p className="text-xs text-text-gray font-medium">Distinction</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">
                {mockStudents.filter((s) => {
                  const hasPassedResult = mockResults.some((r) => r.studentId === s.id && r.pass)
                  const hasCert = certificates.some((c) => c.studentId === s.id)
                  return hasPassedResult && !hasCert
                }).length}
              </p>
              <p className="text-xs text-text-gray font-medium">Pending Issue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-light-gray p-1 rounded-xl w-fit">
        <button
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'issued'
              ? 'bg-white text-navy shadow-sm'
              : 'text-text-gray hover:text-navy'
          }`}
          onClick={() => setActiveTab('issued')}
        >
          Issued Certificates
        </button>
        <button
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'issue'
              ? 'bg-white text-navy shadow-sm'
              : 'text-text-gray hover:text-navy'
          }`}
          onClick={handleIssueClick}
        >
          Issue Certificate
        </button>
      </div>

      {/* ═══════════ TAB 1: Issued Certificates ═══════════ */}
      {activeTab === 'issued' && (
        <div className="animate-fade-in">
          {/* Search & Filter */}
          <div className="page-card p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                <input
                  type="text"
                  placeholder="Search by name, certificate no, course..."
                  className="form-input pl-10"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <select
                className="form-select sm:w-40"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as 'all' | 'Issued' | 'Pending')
                  setCurrentPage(1)
                }}
              >
                <option value="all">All Status</option>
                <option value="Issued">Issued</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="page-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Certificate No</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Issue Date</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCerts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <Award className="w-12 h-12 text-text-gray/30 mb-3" />
                          <p className="text-text-gray font-medium">No certificates found</p>
                          <p className="text-text-gray/60 text-sm mt-1">
                            Issue new certificates using the workflow
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCerts.map((cert) => (
                      <tr key={cert.id}>
                        <td>
                          <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded">
                            {cert.certificateNo}
                          </span>
                        </td>
                        <td>
                          <p className="font-semibold text-navy text-sm">{cert.studentName}</p>
                        </td>
                        <td>
                          <span className="badge-info text-xs">{cert.course}</span>
                        </td>
                        <td>
                          <span className="text-sm text-text-gray">{cert.issueDate}</span>
                        </td>
                        <td>
                          <span className="text-sm font-bold">{cert.percentage.toFixed(1)}%</span>
                        </td>
                        <td>
                          <span className={getGradeBadgeClass(cert.grade)}>{cert.grade}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="View Details"
                              onClick={() => setViewCert(cert)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <a
                              href={cert.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                              title="Verify Certificate"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCertificates.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
                <p className="text-sm text-text-gray">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredCertificates.length)} of{' '}
                  {filteredCertificates.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="btn-outline py-1.5 px-3 text-xs"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-navy">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn-outline py-1.5 px-3 text-xs"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════ TAB 2: Issue Certificate Workflow ═══════════ */}
      {activeTab === 'issue' && (
        <div className="animate-fade-in">
          <CertStepIndicator currentStep={issueStep} />

          {/* ─── Step 1: Select Student ─── */}
          {issueStep === 1 && (
            <div className="page-card p-6 animate-fade-in">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  Select Eligible Student
                </h3>
                <p className="text-sm text-text-gray mt-1">
                  Only students with published & passed results and no certificate issued yet are
                  shown
                </p>
              </div>

              {/* Student Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                <input
                  type="text"
                  placeholder="Search by name, roll no, course..."
                  className="form-input pl-10"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>

              {/* Eligibility Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-amber-800">Eligibility Criteria</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Only students who have: Result Published ✓ | Passed ✓ | Certificate Not Yet
                    Issued ✓
                  </p>
                </div>
              </div>

              {/* Student List */}
              <div className="max-h-80 overflow-y-auto space-y-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
                {eligibleStudents.length === 0 ? (
                  <div className="text-center py-10">
                    <User className="w-10 h-10 text-text-gray/30 mx-auto mb-2" />
                    <p className="text-text-gray font-medium text-sm">No eligible students</p>
                    <p className="text-text-gray/60 text-xs mt-1">
                      All students with passed results already have certificates
                    </p>
                  </div>
                ) : (
                  eligibleStudents.map((student) => {
                    const isSelected = selectedStudent?.id === student.id
                    const studentResult = mockResults.find(
                      (r) => r.studentId === student.id && r.pass
                    )
                    return (
                      <button
                        key={student.id}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                          isSelected
                            ? 'border-gold bg-gold/5 shadow-sm'
                            : 'border-gray-100 hover:border-navy/20 hover:bg-gray-50'
                        }`}
                        onClick={() => handleSelectStudent(student)}
                      >
                        <div
                          className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                            isSelected ? 'bg-gold' : 'bg-navy-light'
                          }`}
                        >
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-navy text-sm">{student.name}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="text-xs text-text-gray flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {student.course}
                            </span>
                            <span className="text-xs text-text-gray">
                              Roll: {student.rollNo}
                            </span>
                          </div>
                        </div>
                        {studentResult && (
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="text-sm font-bold text-navy">
                              {studentResult.percentage.toFixed(1)}%
                            </span>
                            <span className={getGradeBadgeClass(studentResult.grade)}>
                              {studentResult.grade}
                            </span>
                            <span className="badge-success text-[10px]">Result: Pass</span>
                          </div>
                        )}
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-end">
                <button
                  className="btn-gold"
                  disabled={!selectedStudent}
                  onClick={() => setIssueStep(2)}
                >
                  Next: Review Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Certificate Auto-Population ─── */}
          {issueStep === 2 && selectedStudent && autoCertData && (
            <div className="page-card p-6 animate-fade-in">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-gold" />
                  Certificate Details
                  <span className="badge-success text-xs ml-2">Auto-populated</span>
                </h3>
                <p className="text-sm text-text-gray mt-1">
                  All fields are automatically loaded from student data. Review and proceed.
                </p>
              </div>

              {/* Certificate Preview Card */}
              <div className="border-2 border-navy/10 rounded-2xl overflow-hidden mb-6">
                {/* Certificate Header */}
                <div className="bg-navy text-white p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <GraduationCap className="w-8 h-8 text-gold" />
                    <h2 className="text-xl font-bold">ZTech Institute of Technology</h2>
                  </div>
                  <p className="text-gold text-sm font-semibold">CERTIFICATE OF COMPLETION</p>
                  <div className="w-24 h-0.5 bg-gold mx-auto mt-2" />
                </div>

                {/* Certificate Body */}
                <div className="p-6 bg-white">
                  {/* Certificate No Banner */}
                  <div className="flex items-center justify-between bg-navy/5 rounded-lg p-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-navy" />
                      <span className="text-xs text-text-gray">Certificate No</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-navy">
                      {autoCertData.certificateNo}
                    </span>
                  </div>

                  {/* Student Photo + Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 mb-6">
                    {/* Photo Placeholder */}
                    <div className="flex justify-center md:justify-start">
                      <div className="w-28 h-36 border-2 border-dashed border-navy/20 rounded-lg bg-light-gray flex flex-col items-center justify-center">
                        <User className="w-8 h-8 text-text-gray/40" />
                        <span className="text-[10px] text-text-gray mt-1">Photo</span>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Student Name
                        </p>
                        <p className="text-sm font-bold text-navy">{autoCertData.studentName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Father's Name
                        </p>
                        <p className="text-sm font-semibold text-navy">{autoCertData.fatherName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Mother's Name
                        </p>
                        <p className="text-sm font-semibold text-navy">{autoCertData.motherName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Date of Birth
                        </p>
                        <p className="text-sm font-semibold text-navy">{autoCertData.dob}</p>
                      </div>
                    </div>
                  </div>

                  {/* Course & Academic Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">Course</p>
                      <p className="text-sm font-bold text-navy">{autoCertData.course}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Duration
                      </p>
                      <p className="text-sm font-bold text-navy">{autoCertData.duration}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">Session</p>
                      <p className="text-sm font-bold text-navy">{autoCertData.session}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Enrollment No
                      </p>
                      <p className="text-sm font-bold text-navy">{autoCertData.enrollmentNo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Roll Number
                      </p>
                      <p className="text-sm font-bold text-navy">{autoCertData.rollNo}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Issue Date
                      </p>
                      <p className="text-sm font-bold text-navy">{autoCertData.issueDate}</p>
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        autoCertData.percentage >= 80
                          ? 'bg-green-50'
                          : autoCertData.percentage >= 60
                          ? 'bg-amber-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Percentage
                      </p>
                      <p className="text-lg font-bold text-navy">
                        {autoCertData.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        autoCertData.percentage >= 80
                          ? 'bg-green-50'
                          : autoCertData.percentage >= 60
                          ? 'bg-amber-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <p className="text-[10px] text-text-gray uppercase font-semibold">Grade</p>
                      <p className={`text-lg ${getGradeColor(autoCertData.grade)}`}>
                        {autoCertData.grade}
                      </p>
                    </div>
                  </div>

                  {/* QR Code & Verification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-light-gray rounded-lg p-4">
                      <div className="w-20 h-20 border-2 border-navy/20 rounded-lg bg-white flex flex-col items-center justify-center flex-shrink-0">
                        <QrCode className="w-8 h-8 text-navy/40" />
                        <span className="text-[8px] text-text-gray mt-1">QR Code</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-navy">QR Code</p>
                        <p className="text-[10px] text-text-gray">
                          Auto-generated for verification
                        </p>
                        <p className="text-[10px] font-mono text-navy mt-1">
                          {autoCertData.qrCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light-gray rounded-lg p-4">
                      <Link2 className="w-6 h-6 text-navy flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-navy">Verification URL</p>
                        <a
                          href={autoCertData.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 hover:underline break-all"
                        >
                          {autoCertData.verificationUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Footer */}
                <div className="bg-navy/5 p-4 text-center">
                  <p className="text-[10px] text-text-gray">
                    This is a computer-generated certificate. Verify online at the verification URL
                    above.
                  </p>
                </div>
              </div>

              {/* All Fields are READ-ONLY notice */}
              <div className="bg-green-50 border border-green/20 rounded-lg p-3 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" />
                <p className="text-xs text-green-800 font-medium">
                  All fields are auto-populated from student and result records. No manual entry
                  required.
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button className="btn-outline" onClick={() => setIssueStep(1)}>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button className="btn-gold" onClick={() => setIssueStep(3)}>
                  Next: Generate & Issue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Generate & Issue ─── */}
          {issueStep === 3 && selectedStudent && autoCertData && (
            <div className="animate-fade-in">
              {/* Preview Certificate */}
              <div className="page-card p-6 mb-6">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                    <Award className="w-5 h-5 text-gold" />
                    Generate & Issue Certificate
                  </h3>
                  <p className="text-sm text-text-gray mt-1">
                    Preview the certificate and issue it to the student
                  </p>
                </div>

                {/* Compact Certificate Preview */}
                <div className="border-2 border-gold/30 rounded-xl overflow-hidden mb-6">
                  <div className="bg-navy text-white p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <GraduationCap className="w-6 h-6 text-gold" />
                      <h3 className="text-lg font-bold">ZTech Institute of Technology</h3>
                    </div>
                    <p className="text-gold text-xs font-semibold mt-1">
                      CERTIFICATE OF COMPLETION
                    </p>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-center text-sm text-navy mb-3">
                      This is to certify that{' '}
                      <span className="font-bold text-lg">{autoCertData.studentName}</span>
                    </p>
                    <p className="text-center text-sm text-text-gray">
                      has successfully completed the course{' '}
                      <span className="font-bold text-navy">{autoCertData.course}</span> (
                      {autoCertData.duration}) during session{' '}
                      <span className="font-bold text-navy">{autoCertData.session}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                      <div className="bg-light-gray rounded-lg p-2">
                        <p className="text-[10px] text-text-gray">Percentage</p>
                        <p className="text-lg font-bold text-navy">
                          {autoCertData.percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="bg-light-gray rounded-lg p-2">
                        <p className="text-[10px] text-text-gray">Grade</p>
                        <p className={`text-lg ${getGradeColor(autoCertData.grade)}`}>
                          {autoCertData.grade}
                        </p>
                      </div>
                      <div className="bg-light-gray rounded-lg p-2">
                        <p className="text-[10px] text-text-gray">Certificate No</p>
                        <p className="text-xs font-mono font-bold text-navy">
                          {autoCertData.certificateNo}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="w-16 h-16 border border-navy/10 rounded bg-light-gray flex flex-col items-center justify-center">
                        <QrCode className="w-6 h-6 text-navy/30" />
                        <span className="text-[7px] text-text-gray">QR</span>
                      </div>
                      <div className="text-center">
                        <div className="w-32 h-0.5 bg-navy/20 mb-1" />
                        <p className="text-[10px] text-text-gray">Authorized Signatory</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    className="btn-gold"
                    onClick={() => {
                      // Simulate generate - just show a brief feedback
                      setSuccessMsg('Certificate preview generated!')
                      setTimeout(() => setSuccessMsg(''), 2000)
                    }}
                  >
                    <FileCheck className="w-4 h-4" />
                    Generate Certificate
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => setPreviewCert(true)}
                  >
                    <Eye className="w-4 h-4" />
                    Preview Certificate
                  </button>
                  <button
                    className="btn-primary"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button className="btn-gold" onClick={handleIssueCertificate}>
                    <Award className="w-4 h-4" />
                    Issue Certificate
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-start">
                <button className="btn-outline" onClick={() => setIssueStep(2)}>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ View Certificate Modal ═══════════ */}
      {viewCert && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-navy text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-bold">Certificate Details</h2>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setViewCert(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Certificate Template */}
              <div className="border-2 border-navy/10 rounded-2xl overflow-hidden mb-6">
                {/* Header */}
                <div className="bg-navy text-white p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <GraduationCap className="w-8 h-8 text-gold" />
                    <h2 className="text-xl font-bold">ZTech Institute of Technology</h2>
                  </div>
                  <p className="text-gold text-sm font-semibold">CERTIFICATE OF COMPLETION</p>
                  <div className="w-24 h-0.5 bg-gold mx-auto mt-2" />
                </div>

                {/* Body */}
                <div className="p-6 bg-white">
                  {/* Certificate No */}
                  <div className="flex items-center justify-between bg-navy/5 rounded-lg p-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-navy" />
                      <span className="text-xs text-text-gray">Certificate No</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-navy">
                      {viewCert.certificateNo}
                    </span>
                  </div>

                  {/* Photo + Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 mb-6">
                    <div className="flex justify-center md:justify-start">
                      <div className="w-28 h-36 border-2 border-dashed border-navy/20 rounded-lg bg-light-gray flex flex-col items-center justify-center">
                        <User className="w-8 h-8 text-text-gray/40" />
                        <span className="text-[10px] text-text-gray mt-1">Student Photo</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Student Name
                        </p>
                        <p className="text-sm font-bold text-navy">{viewCert.studentName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Father's Name
                        </p>
                        <p className="text-sm font-semibold text-navy">
                          {mockStudents.find((s) => s.id === viewCert.studentId)?.fatherName || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Mother's Name
                        </p>
                        <p className="text-sm font-semibold text-navy">
                          {mockStudents.find((s) => s.id === viewCert.studentId)?.motherName || '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-gray uppercase font-semibold">
                          Date of Birth
                        </p>
                        <p className="text-sm font-semibold text-navy">
                          {mockStudents.find((s) => s.id === viewCert.studentId)?.dob || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">Course</p>
                      <p className="text-sm font-bold text-navy">{viewCert.course}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">Duration</p>
                      <p className="text-sm font-bold text-navy">{viewCert.duration}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">Session</p>
                      <p className="text-sm font-bold text-navy">{viewCert.session}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Enrollment No
                      </p>
                      <p className="text-sm font-bold text-navy">{viewCert.enrollmentNo}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Roll Number
                      </p>
                      <p className="text-sm font-bold text-navy">{viewCert.rollNo}</p>
                    </div>
                    <div className="bg-light-gray rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Issue Date
                      </p>
                      <p className="text-sm font-bold text-navy">{viewCert.issueDate}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">
                        Percentage
                      </p>
                      <p className="text-lg font-bold text-navy">
                        {viewCert.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-[10px] text-text-gray uppercase font-semibold">Grade</p>
                      <p className={`text-lg ${getGradeColor(viewCert.grade)}`}>
                        {viewCert.grade}
                      </p>
                    </div>
                  </div>

                  {/* QR & Verification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 bg-light-gray rounded-lg p-4">
                      <div className="w-24 h-24 border-2 border-navy/15 rounded-lg bg-white flex flex-col items-center justify-center flex-shrink-0">
                        <QrCode className="w-10 h-10 text-navy/40" />
                        <span className="text-[9px] text-text-gray mt-1 font-semibold">
                          QR Code
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-navy">QR Code</p>
                        <p className="text-[10px] text-text-gray">
                          Scan to verify certificate authenticity
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-light-gray rounded-lg p-4">
                      <ExternalLink className="w-6 h-6 text-navy flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-navy">Verification URL</p>
                        <a
                          href={viewCert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline break-all"
                        >
                          {viewCert.verificationUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-navy/5 p-4 text-center">
                  <p className="text-[10px] text-text-gray">
                    This is a computer-generated certificate. Verify online at the URL above.
                  </p>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button className="btn-primary">
                  <Download className="w-4 h-4" />
                  Download Certificate PDF
                </button>
                <button className="btn-outline">
                  <Printer className="w-4 h-4" />
                  Download Marksheet PDF
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => setViewCert(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Full Preview Certificate Modal ═══════════ */}
      {previewCert && autoCertData && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-navy text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-bold">Certificate Preview</h2>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setPreviewCert(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Body */}
            <div className="p-6">
              <div className="border-2 border-gold/30 rounded-2xl overflow-hidden">
                <div className="bg-navy text-white p-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <GraduationCap className="w-10 h-10 text-gold" />
                    <h2 className="text-2xl font-bold">ZTech Institute of Technology</h2>
                  </div>
                  <p className="text-gold text-base font-semibold tracking-wider">
                    CERTIFICATE OF COMPLETION
                  </p>
                  <div className="w-32 h-0.5 bg-gold mx-auto mt-3" />
                </div>

                <div className="p-8 bg-white">
                  <div className="flex items-center justify-between bg-navy/5 rounded-lg p-3 mb-8">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-navy" />
                      <span className="text-xs text-text-gray">Certificate No</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-navy">
                      {autoCertData.certificateNo}
                    </span>
                  </div>

                  <p className="text-center text-lg text-navy mb-2">
                    This is to certify that
                  </p>
                  <p className="text-center text-3xl font-bold text-navy mb-2">
                    {autoCertData.studentName}
                  </p>
                  <p className="text-center text-sm text-text-gray mb-6">
                    S/o | D/o{' '}
                    <span className="font-semibold text-navy">{autoCertData.fatherName}</span>
                  </p>

                  <p className="text-center text-base text-text-gray mb-6">
                    has successfully completed the course{' '}
                    <span className="font-bold text-navy text-lg">{autoCertData.course}</span> (
                    {autoCertData.duration}) during the session{' '}
                    <span className="font-bold text-navy">{autoCertData.session}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center bg-light-gray rounded-xl p-4">
                      <p className="text-[10px] text-text-gray uppercase font-semibold mb-1">
                        Percentage
                      </p>
                      <p className="text-3xl font-bold text-navy">
                        {autoCertData.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-center bg-light-gray rounded-xl p-4">
                      <p className="text-[10px] text-text-gray uppercase font-semibold mb-1">
                        Grade
                      </p>
                      <p className={`text-3xl ${getGradeColor(autoCertData.grade)}`}>
                        {autoCertData.grade}
                      </p>
                    </div>
                    <div className="text-center bg-light-gray rounded-xl p-4">
                      <p className="text-[10px] text-text-gray uppercase font-semibold mb-1">
                        Status
                      </p>
                      <span className="badge-success text-base px-4 py-1">PASSED</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-sm mb-8">
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Enrollment No</p>
                      <p className="font-semibold text-navy">{autoCertData.enrollmentNo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Roll No</p>
                      <p className="font-semibold text-navy">{autoCertData.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Issue Date</p>
                      <p className="font-semibold text-navy">{autoCertData.issueDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div className="w-24 h-24 border-2 border-navy/15 rounded-lg bg-light-gray flex flex-col items-center justify-center">
                      <QrCode className="w-12 h-12 text-navy/30" />
                      <span className="text-[9px] text-text-gray mt-1 font-semibold">QR Code</span>
                    </div>
                    <div className="text-center">
                      <div className="w-40 h-0.5 bg-navy/20 mb-2" />
                      <p className="text-xs text-text-gray">Authorized Signatory</p>
                      <p className="text-xs font-semibold text-navy">Director</p>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-text-gray">
                      Verify online:{' '}
                      <a
                        href={autoCertData.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {autoCertData.verificationUrl}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-navy/5 p-4 text-center">
                  <p className="text-[10px] text-text-gray">
                    This is a computer-generated certificate and does not require a physical seal.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => setPreviewCert(false)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => setPreviewCert(false)}>
                <Printer className="w-4 h-4" />
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Certificates
