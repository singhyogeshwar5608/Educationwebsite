import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Eye,
  Download,
  Trash2,
  X,
  ClipboardList,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  User,
  BookOpen,
  Calculator,
  AlertCircle,
  GraduationCap,
  FileText,
} from 'lucide-react'
import {
  mockStudents,
  mockCourses,
  mockResults,
  getCourseSubjects,
  getCourseDetails,
  calculateGrade,
} from '@/data/mockData'
import type { Student, Result, Subject } from '@/data/mockData'

const ITEMS_PER_PAGE = 8

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

// ─── Step indicator ─────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { label: 'Select Student', icon: User },
    { label: 'Enter Marks', icon: BookOpen },
    { label: 'Review & Publish', icon: CheckCircle2 },
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

// ─── Results Component ──────────────────────────────────────
function Results() {
  const [activeTab, setActiveTab] = useState<'published' | 'generate'>('published')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Published results state
  const [results, setResults] = useState<Result[]>([...mockResults])
  const [viewResult, setViewResult] = useState<Result | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState('')

  // Generate Result workflow state
  const [genStep, setGenStep] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentSearch, setStudentSearch] = useState('')
  const [subjectMarks, setSubjectMarks] = useState<Record<string, number>>({})

  // ─── Published Results filtering ─────────────────────────
  const filteredResults = useMemo(() => {
    const q = search.toLowerCase()
    return results.filter(
      (r) =>
        !q ||
        r.studentName.toLowerCase().includes(q) ||
        r.course.toLowerCase().includes(q) ||
        r.grade.toLowerCase().includes(q)
    )
  }, [search, results])

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / ITEMS_PER_PAGE))
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ─── Generate: available students (no result published yet) ──
  const availableStudents = useMemo(() => {
    const q = studentSearch.toLowerCase()
    return mockStudents.filter((s) => {
      const hasResult = results.some((r) => r.studentId === s.id)
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q)
      return !hasResult && matchesSearch
    })
  }, [studentSearch, results])

  // ─── Auto-load subjects when student selected ────────────
  const courseSubjects = useMemo(() => {
    if (!selectedStudent) return []
    return getCourseSubjects(selectedStudent.courseId)
  }, [selectedStudent])

  const courseDetails = useMemo(() => {
    if (!selectedStudent) return undefined
    return getCourseDetails(selectedStudent.courseId)
  }, [selectedStudent])

  // ─── Auto-calculate results in real-time ─────────────────
  const calculations = useMemo(() => {
    if (!courseSubjects.length) return null

    const marksEntries = courseSubjects.map((sub) => ({
      name: sub.name,
      marks: subjectMarks[sub.id] ?? 0,
      maxMarks: sub.maxMarks,
      passingMarks: sub.passingMarks,
    }))

    const total = marksEntries.reduce((sum, e) => sum + e.marks, 0)
    const maxTotal = marksEntries.reduce((sum, e) => sum + e.maxMarks, 0)
    const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0
    const { grade, pass: overallPass } = calculateGrade(percentage)

    // Check each subject pass/fail
    const subjectResults = marksEntries.map((e) => ({
      ...e,
      passed: e.marks >= e.passingMarks,
    }))

    // Overall pass: all subjects passed AND overall >= 35%
    const allSubjectsPassed = subjectResults.every((s) => s.passed)
    const pass = overallPass && allSubjectsPassed

    return { total, maxTotal, percentage, grade, pass, subjectResults, marksEntries }
  }, [courseSubjects, subjectMarks])

  // ─── Marks input validation ──────────────────────────────
  function handleMarksChange(subjectId: string, value: string, maxMarks: number) {
    let num = parseInt(value, 10)
    if (isNaN(num)) num = 0
    if (num < 0) num = 0
    if (num > maxMarks) num = maxMarks
    setSubjectMarks((prev) => ({ ...prev, [subjectId]: num }))
  }

  // ─── Save & Publish Result ───────────────────────────────
  function handleSaveAndPublish() {
    if (!selectedStudent || !calculations) return

    const newResult: Result = {
      id: `RES${String(results.length + 1).padStart(3, '0')}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      course: selectedStudent.course,
      subjects: calculations.marksEntries,
      total: calculations.total,
      maxTotal: calculations.maxTotal,
      percentage: parseFloat(calculations.percentage.toFixed(2)),
      grade: calculations.grade,
      pass: calculations.pass,
      publishedDate: new Date().toISOString().split('T')[0],
    }

    setResults((prev) => [newResult, ...prev])
    setSuccessMsg(`Result for ${selectedStudent.name} published successfully!`)
    setTimeout(() => setSuccessMsg(''), 4000)

    // Reset workflow
    setSelectedStudent(null)
    setStudentSearch('')
    setSubjectMarks({})
    setGenStep(1)
    setActiveTab('published')
    setCurrentPage(1)
  }

  // ─── Delete result ───────────────────────────────────────
  function handleDeleteResult(id: string) {
    setResults((prev) => prev.filter((r) => r.id !== id))
    setDeleteConfirm(null)
  }

  // ─── Reset workflow when switching to generate tab ──────
  function handleGenerateClick() {
    setSelectedStudent(null)
    setStudentSearch('')
    setSubjectMarks({})
    setGenStep(1)
    setActiveTab('generate')
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
              <ClipboardList className="w-7 h-7" />
              Results
              <span className="text-sm font-medium text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full ml-1">
                {results.length}
              </span>
            </h1>
            <p className="text-text-gray text-sm mt-1">Manage and publish student results</p>
          </div>
          <button className="btn-gold" onClick={handleGenerateClick}>
            <Plus className="w-4 h-4" />
            Generate Result
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-5">
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{results.length}</p>
              <p className="text-xs text-text-gray font-medium">Total Results</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green">{results.filter((r) => r.pass).length}</p>
              <p className="text-xs text-text-gray font-medium">Passed</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{results.filter((r) => !r.pass).length}</p>
              <p className="text-xs text-text-gray font-medium">Failed</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {results.length > 0
                  ? (results.filter((r) => r.pass).length / results.length * 100).toFixed(1)
                  : 0}%
              </p>
              <p className="text-xs text-text-gray font-medium">Pass Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-light-gray p-1 rounded-xl w-fit">
        <button
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'published'
              ? 'bg-white text-navy shadow-sm'
              : 'text-text-gray hover:text-navy'
          }`}
          onClick={() => setActiveTab('published')}
        >
          Published Results
        </button>
        <button
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'generate'
              ? 'bg-white text-navy shadow-sm'
              : 'text-text-gray hover:text-navy'
          }`}
          onClick={handleGenerateClick}
        >
          Generate Result
        </button>
      </div>

      {/* ═══════════ TAB 1: Published Results ═══════════ */}
      {activeTab === 'published' && (
        <div className="animate-fade-in">
          {/* Search */}
          <div className="page-card p-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
              <input
                type="text"
                placeholder="Search by student name, course, grade..."
                className="form-input pl-10"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div className="page-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Total</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Pass/Fail</th>
                    <th>Published Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <ClipboardList className="w-12 h-12 text-text-gray/30 mb-3" />
                          <p className="text-text-gray font-medium">No results found</p>
                          <p className="text-text-gray/60 text-sm mt-1">
                            Generate new results using the workflow
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedResults.map((result) => (
                      <tr key={result.id}>
                        <td>
                          <p className="font-semibold text-navy text-sm">{result.studentName}</p>
                        </td>
                        <td>
                          <span className="badge-info text-xs">{result.course}</span>
                        </td>
                        <td>
                          <span className="text-sm font-semibold">
                            {result.total}/{result.maxTotal}
                          </span>
                        </td>
                        <td>
                          <span className="text-sm font-bold">{result.percentage.toFixed(1)}%</span>
                        </td>
                        <td>
                          <span className={getGradeBadgeClass(result.grade)}>{result.grade}</span>
                        </td>
                        <td>
                          {result.pass ? (
                            <span className="badge-success">Pass</span>
                          ) : (
                            <span className="badge-danger">Fail</span>
                          )}
                        </td>
                        <td>
                          <span className="text-sm text-text-gray">{result.publishedDate}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                              title="View Details"
                              onClick={() => setViewResult(result)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                              title="Download Marksheet"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                              title="Delete"
                              onClick={() => setDeleteConfirm(result.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredResults.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
                <p className="text-sm text-text-gray">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredResults.length)} of{' '}
                  {filteredResults.length}
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

      {/* ═══════════ TAB 2: Generate Result Workflow ═══════════ */}
      {activeTab === 'generate' && (
        <div className="animate-fade-in">
          <StepIndicator currentStep={genStep} totalSteps={3} />

          {/* ─── Step 1: Select Student ─── */}
          {genStep === 1 && (
            <div className="page-card p-6 animate-fade-in">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" />
                  Select Student
                </h3>
                <p className="text-sm text-text-gray mt-1">
                  Search and select a student whose result you want to generate
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

              {/* Student List */}
              <div className="max-h-80 overflow-y-auto space-y-2 mb-6" style={{ scrollbarWidth: 'thin' }}>
                {availableStudents.length === 0 ? (
                  <div className="text-center py-10">
                    <User className="w-10 h-10 text-text-gray/30 mx-auto mb-2" />
                    <p className="text-text-gray font-medium text-sm">No students available</p>
                    <p className="text-text-gray/60 text-xs mt-1">
                      All students already have results published
                    </p>
                  </div>
                ) : (
                  availableStudents.map((student) => {
                    const isSelected = selectedStudent?.id === student.id
                    return (
                      <button
                        key={student.id}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                          isSelected
                            ? 'border-gold bg-gold/5 shadow-sm'
                            : 'border-gray-100 hover:border-navy/20 hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setSelectedStudent(student)
                          setSubjectMarks({})
                        }}
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
                            <span className="text-xs text-text-gray">
                              Reg: {student.registrationNo}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-6 h-6 text-gold flex-shrink-0" />
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {/* Selected Student Info */}
              {selectedStudent && (
                <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 mb-6 animate-fade-in">
                  <h4 className="text-sm font-bold text-navy mb-2">Selected Student</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-text-gray">Name</p>
                      <p className="text-sm font-semibold text-navy">{selectedStudent.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray">Course</p>
                      <p className="text-sm font-semibold text-navy">{selectedStudent.course}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray">Roll No</p>
                      <p className="text-sm font-semibold text-navy">{selectedStudent.rollNo}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-end">
                <button
                  className="btn-gold"
                  disabled={!selectedStudent}
                  onClick={() => setGenStep(2)}
                >
                  Next: Enter Marks
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Auto-loaded Course & Subjects ─── */}
          {genStep === 2 && selectedStudent && (
            <div className="page-card p-6 animate-fade-in">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold" />
                  Course & Subjects
                  <span className="badge-success text-xs ml-2">Auto-loaded</span>
                </h3>
                <p className="text-sm text-text-gray mt-1">
                  Subjects are automatically loaded from the student's course. Enter marks for each
                  subject.
                </p>
              </div>

              {/* Course Info Card - Auto-populated */}
              {courseDetails && (
                <div className="bg-navy/5 border border-navy/10 rounded-xl p-5 mb-6 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-5 h-5 text-navy" />
                    <h4 className="text-sm font-bold text-navy">Course Information (Auto-detected)</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-text-gray">Course Name</p>
                      <p className="text-sm font-semibold text-navy">{courseDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray">Duration</p>
                      <p className="text-sm font-semibold text-navy">{courseDetails.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray">Total Subjects</p>
                      <p className="text-sm font-semibold text-navy">{courseSubjects.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Subjects Table with Marks Input */}
              <div className="overflow-x-auto mb-6">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subject Name</th>
                      <th>Max Marks</th>
                      <th>Passing Marks</th>
                      <th>Marks Obtained</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseSubjects.map((sub, idx) => {
                      const marks = subjectMarks[sub.id] ?? 0
                      const isPass = marks >= sub.passingMarks
                      const hasInput = sub.id in subjectMarks
                      return (
                        <tr key={sub.id}>
                          <td>
                            <span className="text-xs text-text-gray font-medium">{idx + 1}</span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                              <span className="font-semibold text-navy text-sm">{sub.name}</span>
                            </div>
                            <span className="text-[10px] text-text-gray ml-4">Auto-populated</span>
                          </td>
                          <td>
                            <span className="text-sm font-semibold text-text-gray">
                              {sub.maxMarks}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-text-gray">{sub.passingMarks}</span>
                          </td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              max={sub.maxMarks}
                              className="form-input w-24 text-center font-semibold"
                              placeholder="0"
                              value={hasInput ? marks : ''}
                              onChange={(e) =>
                                handleMarksChange(sub.id, e.target.value, sub.maxMarks)
                              }
                            />
                          </td>
                          <td>
                            {hasInput ? (
                              isPass ? (
                                <span className="badge-success text-xs">Pass</span>
                              ) : (
                                <span className="badge-danger text-xs">Fail</span>
                              )
                            ) : (
                              <span className="text-xs text-text-gray/50">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Quick Stats (live) */}
              {calculations && Object.keys(subjectMarks).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-navy" />
                    <span className="text-xs font-bold text-navy">LIVE CALCULATION</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Total</p>
                      <p className="text-lg font-bold text-navy">
                        {calculations.total}/{calculations.maxTotal}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Percentage</p>
                      <p className="text-lg font-bold text-navy">
                        {calculations.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Grade</p>
                      <p className={`text-lg ${getGradeColor(calculations.grade)}`}>
                        {calculations.grade}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Status</p>
                      {calculations.pass ? (
                        <span className="badge-success text-xs">Pass</span>
                      ) : (
                        <span className="badge-danger text-xs">Fail</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-text-gray uppercase">Subjects Passed</p>
                      <p className="text-lg font-bold text-navy">
                        {calculations.subjectResults.filter((s) => s.passed).length}/
                        {courseSubjects.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  className="btn-outline"
                  onClick={() => setGenStep(1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  className="btn-gold"
                  disabled={Object.keys(subjectMarks).length < courseSubjects.length}
                  onClick={() => setGenStep(3)}
                >
                  Next: Review & Publish
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Auto-Calculated Results Review ─── */}
          {genStep === 3 && selectedStudent && calculations && (
            <div className="animate-fade-in">
              {/* Summary Card */}
              <div className="page-card p-6 mb-6">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gold" />
                    Review & Publish Result
                  </h3>
                  <p className="text-sm text-text-gray mt-1">
                    All values are auto-calculated. Review and publish the result.
                  </p>
                </div>

                {/* Student & Course Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-navy/5 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-navy mb-3 uppercase">Student Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs text-text-gray">Name</span>
                        <span className="text-xs font-semibold text-navy">
                          {selectedStudent.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-text-gray">Course</span>
                        <span className="text-xs font-semibold text-navy">
                          {selectedStudent.course}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-text-gray">Roll No</span>
                        <span className="text-xs font-semibold text-navy">
                          {selectedStudent.rollNo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-text-gray">Registration No</span>
                        <span className="text-xs font-semibold text-navy">
                          {selectedStudent.registrationNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Result Summary - Large */}
                  <div
                    className={`rounded-xl p-4 ${
                      calculations.pass
                        ? 'bg-green-50 border border-green/20'
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <h4 className="text-xs font-bold text-navy mb-3 uppercase">Result Summary</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-navy">
                          {calculations.percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-text-gray mt-1">Percentage</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-3xl ${getGradeColor(calculations.grade)}`}>
                          {calculations.grade}
                        </p>
                        <p className="text-xs text-text-gray mt-1">Grade</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-navy">
                          {calculations.total}/{calculations.maxTotal}
                        </p>
                        <p className="text-xs text-text-gray">Total Marks</p>
                      </div>
                      <div className="text-center">
                        {calculations.pass ? (
                          <span className="badge-success text-base px-4 py-1">PASS</span>
                        ) : (
                          <span className="badge-danger text-base px-4 py-1">FAIL</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject-wise Results */}
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subject</th>
                        <th>Max Marks</th>
                        <th>Passing Marks</th>
                        <th>Marks Obtained</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculations.subjectResults.map((sub, idx) => (
                        <tr key={idx}>
                          <td>
                            <span className="text-xs text-text-gray">{idx + 1}</span>
                          </td>
                          <td>
                            <span className="font-semibold text-navy text-sm">{sub.name}</span>
                          </td>
                          <td>
                            <span className="text-sm">{sub.maxMarks}</span>
                          </td>
                          <td>
                            <span className="text-sm text-text-gray">{sub.passingMarks}</span>
                          </td>
                          <td>
                            <span
                              className={`text-sm font-bold ${
                                sub.passed ? 'text-green' : 'text-red-600'
                              }`}
                            >
                              {sub.marks}
                            </span>
                          </td>
                          <td>
                            {sub.passed ? (
                              <span className="badge-success text-xs">Pass</span>
                            ) : (
                              <span className="badge-danger text-xs">Fail</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-navy/5">
                        <td colSpan={2} className="font-bold text-navy text-sm">
                          Total
                        </td>
                        <td className="font-bold text-navy text-sm">{calculations.maxTotal}</td>
                        <td />
                        <td className="font-bold text-navy text-sm">{calculations.total}</td>
                        <td>
                          {calculations.pass ? (
                            <span className="badge-success text-xs">Pass</span>
                          ) : (
                            <span className="badge-danger text-xs">Fail</span>
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button className="btn-outline" onClick={() => setGenStep(2)}>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button className="btn-gold" onClick={handleSaveAndPublish}>
                  <CheckCircle2 className="w-4 h-4" />
                  Save & Publish Result
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ View Result Modal ═══════════ */}
      {viewResult && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-navy text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                <h2 className="text-lg font-bold">Result Details</h2>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => setViewResult(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Student Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-text-gray">Student Name</p>
                  <p className="text-sm font-bold text-navy">{viewResult.studentName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray">Course</p>
                  <p className="text-sm font-bold text-navy">{viewResult.course}</p>
                </div>
                <div>
                  <p className="text-xs text-text-gray">Published Date</p>
                  <p className="text-sm font-bold text-navy">{viewResult.publishedDate}</p>
                </div>
              </div>

              {/* Result Summary */}
              <div
                className={`rounded-xl p-5 mb-6 ${
                  viewResult.pass
                    ? 'bg-green-50 border border-green/20'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-navy">
                      {viewResult.total}/{viewResult.maxTotal}
                    </p>
                    <p className="text-xs text-text-gray mt-1">Total Marks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">
                      {viewResult.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-text-gray mt-1">Percentage</p>
                  </div>
                  <div>
                    <p className={`text-2xl ${getGradeColor(viewResult.grade)}`}>
                      {viewResult.grade}
                    </p>
                    <p className="text-xs text-text-gray mt-1">Grade</p>
                  </div>
                  <div>
                    {viewResult.pass ? (
                      <span className="badge-success text-base px-4 py-1">PASS</span>
                    ) : (
                      <span className="badge-danger text-base px-4 py-1">FAIL</span>
                    )}
                    <p className="text-xs text-text-gray mt-1">Status</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-navy">
                      {viewResult.subjects.filter((s) => s.marks >= s.passingMarks).length}/
                      {viewResult.subjects.length}
                    </p>
                    <p className="text-xs text-text-gray mt-1">Subjects Passed</p>
                  </div>
                </div>
              </div>

              {/* Subject-wise Marks */}
              <h4 className="text-sm font-bold text-navy mb-3">Subject-wise Marks</h4>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Subject</th>
                      <th>Max Marks</th>
                      <th>Passing Marks</th>
                      <th>Marks Obtained</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewResult.subjects.map((sub, idx) => {
                      const passed = sub.marks >= sub.passingMarks
                      return (
                        <tr key={idx}>
                          <td className="text-xs text-text-gray">{idx + 1}</td>
                          <td className="font-semibold text-navy text-sm">{sub.name}</td>
                          <td className="text-sm">{sub.maxMarks}</td>
                          <td className="text-sm text-text-gray">{sub.passingMarks}</td>
                          <td>
                            <span
                              className={`text-sm font-bold ${
                                passed ? 'text-green' : 'text-red-600'
                              }`}
                            >
                              {sub.marks}
                            </span>
                          </td>
                          <td>
                            {passed ? (
                              <span className="badge-success text-xs">Pass</span>
                            ) : (
                              <span className="badge-danger text-xs">Fail</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-primary" onClick={() => setViewResult(null)}>
                <Download className="w-4 h-4" />
                Download Marksheet
              </button>
              <button className="btn-outline" onClick={() => setViewResult(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ Delete Confirmation Modal ═══════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Delete Result</h3>
                <p className="text-sm text-text-gray">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-text-gray mb-6">
              Are you sure you want to delete this result? All associated data will be permanently
              removed.
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn-outline text-sm" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn-danger text-sm"
                onClick={() => handleDeleteResult(deleteConfirm)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Results
