import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Search, Plus, Eye, Download, Trash2, ClipboardList, ChevronRight, ChevronLeft, CheckCircle2,
  User, BookOpen, Calculator, AlertCircle, GraduationCap, FileText, Loader2,
} from 'lucide-react'
import {
  getCourseSubjects, getCourseDetails, calculateGrade,
} from '@/admin/services/api'
import type { Result, Course } from '@/admin/services/api'
import { resultsService } from '@/services/results.service'
import { coursesService } from '@/services/courses.service'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Panel from '@/admin/components/ui/Panel'
import Card from '@/admin/components/ui/Card'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'
import ResultPreview, { downloadResultPdf } from '@/admin/components/ResultPreview'

const ITEMS_PER_PAGE = 8

interface AvailableStudent {
  id: string; name: string; course: string | null; courseId: string | null;
  rollNo: string | null; registrationNo: string | null; batch: string | null;
  courseYears?: number | null; pendingYear?: number | null;
}

function getGradeBadgeClass(grade: string): string {
  if (grade === 'A+' || grade === 'A') return 'badge-success'
  if (grade === 'B+' || grade === 'B') return 'badge-info'
  if (grade === 'C' || grade === 'D') return 'badge-warning'
  if (grade === 'F') return 'badge-danger'
  return 'badge-info'
}

function resultGrade(r: Result): string {
  let total = 0
  let max = 0
  for (const sub of r.subjects ?? []) {
    total += (sub as any).marks ?? 0
    max += sub.maxMarks ?? 100
  }
  const p = max > 0 ? (total / max) * 100 : 0
  if (p >= 90) return 'A+'
  if (p >= 80) return 'A'
  if (p >= 70) return 'B+'
  if (p >= 60) return 'B'
  if (p >= 50) return 'C'
  if (p >= 40) return 'D'
  return 'F'
}

function StepIndicator({ currentStep }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { label: 'Select Student', icon: User },
    { label: 'Enter Marks', icon: BookOpen },
    { label: 'Review & Publish', icon: CheckCircle2 },
  ]
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {steps.map((step, idx) => {
        const num = idx + 1; const isActive = num === currentStep; const isDone = num < currentStep; const Icon = step.icon
        return (
          <div key={num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold border ${isDone ? 'bg-[#2E7D32] text-white border-[#1B5E20]' : isActive ? 'bg-[#0078D7] text-white border-[#005A9E]' : 'bg-gray-100 text-gray-500 border-gray-300'}`}>
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-[9px] mt-1 font-medium whitespace-nowrap ${isActive ? 'text-[#0078D7]' : isDone ? 'text-[#2E7D32]' : 'text-gray-500'}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-1 mt-[-1.25rem] ${num < currentStep ? 'bg-[#2E7D32]' : 'bg-gray-300'}`} />}
          </div>
        )
      })}
    </div>
  )
}

function Results() {
  const [activeTab, setActiveTab] = useState<'published' | 'generate'>('published')
  const [search, setSearch] = useState('')
  const [pubCourseFilter, setPubCourseFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewResult, setViewResult] = useState<Result | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [genStep, setGenStep] = useState(1)
  const [selectedStudent, setSelectedStudent] = useState<AvailableStudent | null>(null)
  const [resultYear, setResultYear] = useState(1)
  const [studentSearch, setStudentSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [subjectMarks, setSubjectMarks] = useState<Record<string, { theory: number; practical: number; practicalMax: number }>>({})
  const [submitting, setSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const resultsQuery = useQuery<Result[]>({
    queryKey: ['results'],
    queryFn: () => resultsService.list() as Promise<Result[]>,
  })
  const results = resultsQuery.data ?? []

  const availableStudentsQuery = useQuery<AvailableStudent[]>({
    queryKey: ['available-students', courseFilter || 'all'],
    queryFn: () => resultsService.availableStudents(courseFilter ? { course_id: courseFilter } : undefined) as Promise<AvailableStudent[]>,
  })
  const availableStudentsData = availableStudentsQuery.data ?? []

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => coursesService.list() as Promise<Course[]>,
  })
  const courseOptions = (coursesQuery.data ?? []).map((c) => ({ id: c.id, name: c.name }))

  const courseSubjectsQuery = useQuery({
    queryKey: ['course-subjects', selectedStudent?.courseId],
    queryFn: () => getCourseSubjects(Number(selectedStudent?.courseId)),
    enabled: !!selectedStudent?.courseId,
  })
  const courseSubjects = Array.isArray(courseSubjectsQuery.data) ? courseSubjectsQuery.data : []

  // Only the selected study-year's subjects count toward that year's result.
  const yearSubjects = useMemo(() =>
    courseSubjects.filter((s) => Number(s.year ?? 1) === resultYear),
    [courseSubjects, resultYear]
  )

  // Year-wise overview of every subject in the course (read-only grouping).
  const yearGroups = useMemo(() => {
    const map = new Map<number, typeof courseSubjects>()
    courseSubjects.forEach((s) => {
      const y = Number(s.year ?? 1)
      if (!map.has(y)) map.set(y, [])
      map.get(y)!.push(s)
    })
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0])
  }, [courseSubjects])

  const courseDetailsQuery = useQuery({
    queryKey: ['course-details', selectedStudent?.courseId],
    queryFn: () => getCourseDetails(String(selectedStudent?.courseId)),
    enabled: !!selectedStudent?.courseId,
  })
  const courseDetails = courseDetailsQuery.data

  const filteredResults = useMemo(() => {
    const q = search.toLowerCase()
    return results.filter((r) =>
      (!q || r.studentName.toLowerCase().includes(q) || r.course.toLowerCase().includes(q) || resultGrade(r).toLowerCase().includes(q)) &&
      (!pubCourseFilter || r.course === pubCourseFilter)
    )
  }, [search, results, pubCourseFilter])
  const totalPages = Math.max(1, Math.ceil(filteredResults.length / ITEMS_PER_PAGE))
  const paginatedResults = filteredResults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const availableStudents = useMemo(() => {
    const q = studentSearch.toLowerCase()
    return availableStudentsData.filter((s) =>
      !q || s.name.toLowerCase().includes(q) || (s.rollNo || '').toLowerCase().includes(q) || (s.course || '').toLowerCase().includes(q))
  }, [availableStudentsData, studentSearch])

  const calculations = useMemo(() => {
    if (!yearSubjects.length) return null
    const entries = yearSubjects.map((sub) => {
      const m = subjectMarks[sub.id] ?? { theory: 0, practical: 0, practicalMax: 0 }
      const theoryObt = m.theory
      const practicalObt = m.practical
      const practicalMax = m.practicalMax
      const theoryMax = sub.maxMarks - practicalMax
      const subjectTotal = theoryObt + practicalObt
      return { name: sub.name, marks: subjectTotal, maxMarks: sub.maxMarks, passingMarks: sub.passingMarks, theoryMax, theoryObt, practicalMax, practicalObt, subjectTotal }
    })
    const total = entries.reduce((s, e) => s + e.subjectTotal, 0); const max = entries.reduce((s, e) => s + e.maxMarks, 0)
    const pct = max > 0 ? (total / max) * 100 : 0; const { grade } = calculateGrade(pct)
    const subRes = entries.map((e) => ({ ...e, passed: e.subjectTotal >= e.passingMarks }))
    const failedCount = subRes.filter((s) => !s.passed).length
    const pass = failedCount < 3
    return { total, maxTotal: max, percentage: pct, grade, pass, failedCount, subjectResults: subRes, marksEntries: entries }
  }, [yearSubjects, subjectMarks])

  function handleMarksChange(id: string, field: 'theory' | 'practical' | 'practicalMax', value: string, maxM: number) {
    let n = parseInt(value, 10); if (isNaN(n)) n = 0; if (n < 0) n = 0; if (n > maxM) n = maxM
    setSubjectMarks((p) => {
      const prev = p[id] ?? { theory: 0, practical: 0, practicalMax: 0 }
      return { ...p, [id]: { ...prev, [field]: n } }
    })
  }

  function getErrorMessage(err: any, fallback: string): string {
    const data = err?.response?.data
    if (data?.errors) {
      const messages = Object.values(data.errors).flat()
      return (messages[0] as string) || fallback
    }
    return data?.message || data?.error || err?.message || fallback
  }

  async function handleSaveAndPublish() {
    if (!selectedStudent || !calculations) return
    setSubmitting(true)
    const payload = {
      studentId: Number(selectedStudent.id),
      year: resultYear,
      subjects: calculations.marksEntries.map((e) => ({
        name: e.name, marks: e.subjectTotal, maxMarks: e.maxMarks, passingMarks: e.passingMarks,
        theoryMaxMarks: e.theoryMax, theoryMarks: e.theoryObt,
        practicalMaxMarks: e.practicalMax, practicalMarks: e.practicalObt,
      })),
      total: calculations.total,
      maxTotal: calculations.maxTotal,
      percentage: parseFloat(calculations.percentage.toFixed(2)),
      grade: calculations.grade,
      pass: calculations.pass,
      publishedDate: new Date().toISOString().split('T')[0],
    }
    try {
      await resultsService.create(payload)
      toast(`Result for ${selectedStudent.name} published successfully!`)
      queryClient.invalidateQueries({ queryKey: ['results'] })
      queryClient.invalidateQueries({ queryKey: ['available-students'] })
      setSelectedStudent(null); setStudentSearch(''); setSubjectMarks({}); setGenStep(1); setCourseFilter(''); setActiveTab('published'); setCurrentPage(1)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to publish result'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteResult() {
    if (!deleteConfirm) return
    setDeleting(true)
    try {
      await resultsService.delete(Number(deleteConfirm))
      toast('Result deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['results'] })
      queryClient.invalidateQueries({ queryKey: ['available-students'] })
      setDeleteConfirm(null)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete result'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  function handleGenerateClick() { setSelectedStudent(null); setStudentSearch(''); setSubjectMarks({}); setGenStep(1); setCourseFilter(''); setActiveTab('generate') }

  async function handleDownloadResult(r: Result) {
    try {
      await downloadResultPdf(r)
    } catch (err) {
      console.error('Failed to download result:', err)
      toast('Failed to download result', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div><h1 className="text-base font-bold text-[#222222]">Results</h1><p className="text-[11px] text-gray-500">Manage and publish student results</p></div>
        <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5" onClick={handleGenerateClick}><Plus className="w-3.5 h-3.5" /> Generate Result</button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3"><div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9] shrink-0"><FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1565C0]" /></div><div><p className="text-sm sm:text-base font-bold text-[#222222]">{results.length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Results</p></div></Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3"><div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] shrink-0"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" /></div><div><p className="text-sm sm:text-base font-bold text-[#222222]">{results.filter((r) => r.pass).length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Passed</p></div></Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3"><div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFEBEE] border border-[#EF9A9A] shrink-0"><AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C62828]" /></div><div><p className="text-sm sm:text-base font-bold text-[#222222]">{results.filter((r) => !r.pass).length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Failed</p></div></Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3"><div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFF8E1] border border-[#FFE082] shrink-0"><GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F57F17]" /></div><div><p className="text-sm sm:text-base font-bold text-[#222222]">{results.length > 0 ? (results.filter((r) => r.pass).length / results.length * 100).toFixed(1) : 0}%</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Pass Rate</p></div></Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <button onClick={() => setActiveTab('published')} className={`px-3 py-1.5 text-[11px] font-medium border ${activeTab === 'published' ? 'bg-[#0078D7] text-white border-[#005A9E]' : 'bg-[#E1E1E1] text-[#222222] border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5]'}`}>Published Results</button>
        <button onClick={handleGenerateClick} className={`px-3 py-1.5 text-[11px] font-medium border ${activeTab === 'generate' ? 'bg-[#0078D7] text-white border-[#005A9E]' : 'bg-[#E1E1E1] text-[#222222] border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5]'}`}>Generate Result</button>
      </div>

      {/* Tab 1: Published */}
      {activeTab === 'published' && (
        <Panel title={`Results (${filteredResults.length})`}>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-2 mb-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder="Search by student name, course, grade..." className="form-input pl-8" value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
            </div>
            <select className="form-select lg:w-48" value={pubCourseFilter}
              onChange={(e) => { setPubCourseFilter(e.target.value); setCurrentPage(1) }}>
              <option value="">All Courses</option>
              {courseOptions.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          {resultsQuery.isLoading ? (
              <div className="flex flex-col items-center py-8 text-gray-400"><Loader2 className="w-8 h-8 mb-2 animate-spin" /><p className="text-sm font-medium">Loading results...</p></div>
            ) : resultsQuery.isError ? (
              <div className="flex flex-col items-center py-8 text-red-400"><AlertCircle className="w-8 h-8 mb-2" /><p className="text-sm font-medium">Failed to load results</p><button onClick={() => resultsQuery.refetch()} className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]">Retry</button></div>
            ) : paginatedResults.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-gray-400"><ClipboardList className="w-8 h-8 mb-2" /><p className="text-sm font-medium">No results found</p></div>
            ) : (
              <>
                <ExcelSpreadsheet
                  data={paginatedResults}
                  columns={[
                    { key: 'name', header: 'Student Name', render: (r) => <span className="text-[12px] font-semibold text-gray-900">{r.studentName}</span> },
                    { key: 'course', header: 'Course', render: (r) => <span className="text-gray-700">{r.course}</span> },
                    { key: 'year', header: 'Year', render: (r) => <span className="text-gray-600">Year {r.year ?? 1}</span> },
                    { key: 'total', header: 'Total', render: (r) => <span className="text-gray-700">{r.total}/{r.maxTotal}</span> },
                    { key: 'pct', header: '%', render: (r) => <span className="text-gray-700">{r.percentage.toFixed(1)}%</span> },
                    { key: 'grade', header: 'Grade', render: (r) => <span className={getGradeBadgeClass(resultGrade(r))}>{resultGrade(r)}</span> },
                    { key: 'pass', header: 'Pass/Fail', render: (r) => r.pass ? <span className="badge-success">Pass</span> : <span className="badge-danger">Fail</span> },
                    { key: 'date', header: 'Date', render: (r) => <span className="text-gray-600">{r.publishedDate}</span> },
                    {
                      key: 'actions', header: 'Actions', align: 'center',
                      render: (r) => (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setViewResult(r)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View Result"><Eye className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDownloadResult(r)} className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Download"><Download className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteConfirm(r.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ),
                    },
                  ]}
                />
                {filteredResults.length > ITEMS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-gray-500">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredResults.length)} of {filteredResults.length}</p>
                    <div className="flex items-center gap-2">
                      <button className="px-2.5 py-1 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] disabled:opacity-50 text-[#222222]" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Previous</button>
                      <span className="text-[11px] text-[#222222]">Page {currentPage} of {totalPages}</span>
                      <button className="px-2.5 py-1 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] disabled:opacity-50 text-[#222222]" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </Panel>
      )}

      {/* Tab 2: Generate */}
      {activeTab === 'generate' && (
        <div className="flex flex-col gap-4">
          <StepIndicator currentStep={genStep} totalSteps={3} />

          {genStep === 1 && (
            <Panel title="Select Student">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1"><Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" /><input type="text" placeholder="Search by name, roll no, course..." className="form-input pl-8" value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} /></div>
                  <select className="form-select sm:w-56" value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setStudentSearch('') }}>
                    <option value="">All Courses</option>
                    {courseOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="max-h-72 overflow-y-auto flex flex-col gap-1.5">
                  {availableStudentsQuery.isLoading ? (
                    <div className="text-center py-6 text-gray-400"><Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" /><p className="text-xs font-medium">Loading students...</p></div>
                  ) : availableStudentsQuery.isError ? (
                    <div className="text-center py-6 text-red-400"><AlertCircle className="w-6 h-6 mx-auto mb-1" /><p className="text-xs font-medium">Failed to load students</p></div>
                  ) : availableStudents.length === 0 ? (
                    <div className="text-center py-6 text-gray-400"><User className="w-6 h-6 mx-auto mb-1" /><p className="text-xs font-medium">No students available</p></div>
                  ) : availableStudents.map((s) => {
                    const sel = selectedStudent?.id === s.id
                    return (
                      <button key={s.id} className={`w-full text-left flex items-center gap-2.5 px-3 py-2 border ${sel ? 'bg-[#E3F2FD] border-[#0078D7]' : 'border-gray-200 hover:bg-gray-50'}`} onClick={() => { setSelectedStudent(s); setResultYear(s.pendingYear ?? 1); setSubjectMarks({}) }}>
                        <div className="w-8 h-8 flex items-center justify-center border border-gray-300 text-[10px] font-bold text-[#222222] bg-gray-100 shrink-0">{s.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}</div>
                        <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-[#222222]">{s.name}</p><p className="text-[10px] text-gray-500">{s.course} • Roll: {s.rollNo}</p></div>
                        <span className="shrink-0 text-[10px] font-bold text-[#0078D7] bg-[#E3F2FD] border border-[#90CAF9] px-2 py-0.5">Year {s.pendingYear ?? 1}</span>
                        {sel && <CheckCircle2 className="w-4 h-4 text-[#0078D7]" />}
                      </button>
                    )
                  })}
                </div>
                {selectedStudent && (
                  <Card padding="sm" className="border border-gray-300"><p className="text-[10px] font-bold text-[#222222] mb-1">Selected Student</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]"><div><span className="text-gray-500">Name:</span> {selectedStudent.name}</div><div><span className="text-gray-500">Course:</span> {selectedStudent.course}</div><div><span className="text-gray-500">Roll:</span> {selectedStudent.rollNo}</div><div><span className="text-gray-500">Result Year:</span> Year {resultYear}</div></div></Card>
                )}
                <div className="flex justify-end">
                  <button className="px-3 py-1.5 text-[11px] text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5 disabled:opacity-50" disabled={!selectedStudent} onClick={() => setGenStep(2)}>Next: Enter Marks <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </Panel>
          )}

          {genStep === 2 && selectedStudent && (
            <Panel title="Course & Subjects">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-gray-600 shrink-0">Result for Year:</label>
                  <select
                    className="form-select w-44"
                    value={resultYear}
                    onChange={(e) => { setResultYear(Number(e.target.value)); setSubjectMarks({}) }}
                  >
                    {selectedStudent.courseYears && Array.from({ length: selectedStudent.courseYears }, (_, i) => i + 1)
                      .filter((y) => y === (selectedStudent.pendingYear ?? 1))
                      .map((y) => <option key={y} value={y}>Year {y}</option>)}
                    {!selectedStudent.courseYears && <option value={resultYear}>Year {resultYear}</option>}
                  </select>
                  <span className="text-[10px] text-gray-400">Years are generated in order — Year {selectedStudent.pendingYear ?? 1} is next.</span>
                </div>
                {courseDetails && (
                  <Card padding="sm" className="border border-gray-300"><p className="text-[10px] font-bold text-[#222222] mb-1">Course Information</p><div className="grid grid-cols-3 gap-2 text-[11px]"><div><span className="text-gray-500">Course:</span> {courseDetails.name}</div><div><span className="text-gray-500">Duration:</span> {courseDetails.duration}</div><div><span className="text-gray-500">Subjects:</span> {yearSubjects.length} in Year {resultYear} (of {courseSubjects.length})</div></div></Card>
                )}
                {yearGroups.length > 0 && (
                  <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                    {yearGroups.map(([y, subs]) => (
                      <div key={y} className="text-[11px] text-gray-700">
                        <span className={`font-bold mr-1.5 ${y === resultYear ? 'text-[#0078D7]' : 'text-gray-400'}`}>Year {y}:</span>
                        {subs.map((s) => s.name).join(', ')}
                        {y === resultYear && <span className="ml-1.5 text-[9px] font-bold text-[#0078D7] bg-[#E3F2FD] border border-[#90CAF9] px-1.5 py-0.5 rounded">ENTERING MARKS</span>}
                      </div>
                    ))}
                  </div>
                )}
                {courseSubjectsQuery.isLoading ? (
                  <div className="flex flex-col items-center py-8 text-gray-400"><Loader2 className="w-6 h-6 mb-2 animate-spin" /><p className="text-xs font-medium">Loading subjects...</p></div>
                ) : courseSubjectsQuery.isError ? (
                  <div className="text-center py-6 text-red-400"><AlertCircle className="w-6 h-6 mx-auto mb-1" /><p className="text-xs font-medium">Failed to load subjects</p></div>
                ) : (
                <div className="overflow-x-auto border border-gray-300">
                  <table className="w-full border-collapse">
                    <thead><tr className="bg-[#0078D7] text-white text-[11px]">
                      <th className="px-2 py-1.5 text-left font-bold border-r border-[#005A9E]">#</th>
                      <th className="px-2 py-1.5 text-left font-bold border-r border-[#005A9E]">Subject</th>
                      <th className="px-2 py-1.5 text-center font-bold border-r border-[#005A9E]">Max</th>
                      <th className="px-2 py-1.5 text-center font-bold border-r border-[#005A9E]">Pass</th>
                      <th className="px-2 py-1.5 text-center font-bold border-r border-[#005A9E]">Prac Max</th>
                      <th className="px-2 py-1.5 text-center font-bold border-r border-[#005A9E]">Theory</th>
                      <th className="px-2 py-1.5 text-center font-bold border-r border-[#005A9E]">Practical</th>
                      <th className="px-2 py-1.5 text-center font-bold border-r border-[#005A9E]">Total</th>
                      <th className="px-2 py-1.5 text-center font-bold">Status</th>
                    </tr></thead>
                    <tbody>
                      {yearSubjects.map((sub, idx) => {
                        const m = subjectMarks[sub.id] ?? { theory: 0, practical: 0, practicalMax: 0 }
                        const has = sub.id in subjectMarks
                        const total = m.theory + m.practical
                        return (
                          <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                            <td className="px-2 py-1.5 text-[11px] text-gray-500 border-b border-gray-300 border-r border-gray-300">{idx + 1}</td>
                            <td className="px-2 py-1.5 text-[11px] font-semibold text-[#222222] border-b border-gray-300 border-r border-gray-300">{sub.name}</td>
                            <td className="px-2 py-1.5 text-[11px] text-center text-gray-600 border-b border-gray-300 border-r border-gray-300">{sub.maxMarks}</td>
                            <td className="px-2 py-1.5 text-[11px] text-center text-gray-600 border-b border-gray-300 border-r border-gray-300">{sub.passingMarks}</td>
                            <td className="px-2 py-1.5 text-center border-b border-gray-300 border-r border-gray-300"><input type="number" min={0} max={sub.maxMarks} className="w-14 text-center text-[11px] border border-gray-300 px-1 py-0.5" placeholder="0" value={m.practicalMax || ''} onChange={(e) => handleMarksChange(sub.id, 'practicalMax', e.target.value, sub.maxMarks)} /></td>
                            <td className="px-2 py-1.5 text-center border-b border-gray-300 border-r border-gray-300"><input type="number" min={0} max={sub.maxMarks - m.practicalMax} className="w-14 text-center text-[11px] border border-gray-300 px-1 py-0.5" placeholder="0" value={has ? m.theory : ''} onChange={(e) => handleMarksChange(sub.id, 'theory', e.target.value, sub.maxMarks - m.practicalMax)} /></td>
                            <td className="px-2 py-1.5 text-center border-b border-gray-300 border-r border-gray-300"><input type="number" min={0} max={m.practicalMax} className="w-14 text-center text-[11px] border border-gray-300 px-1 py-0.5" placeholder="0" value={has ? m.practical : ''} onChange={(e) => handleMarksChange(sub.id, 'practical', e.target.value, m.practicalMax)} /></td>
                            <td className="px-2 py-1.5 text-[11px] text-center font-bold text-[#222222] border-b border-gray-300 border-r border-gray-300">{has ? total : '—'}</td>
                            <td className="px-2 py-1.5 text-center border-b border-gray-300">{has ? (total >= sub.passingMarks ? <span className="text-[10px] text-[#2E7D32] font-medium">Pass</span> : <span className="text-[10px] text-[#C62828] font-medium">Fail</span>) : <span className="text-[10px] text-gray-300">—</span>}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                )}
                {calculations && Object.keys(subjectMarks).length > 0 && (
                  <Card padding="sm" className="border border-gray-300 bg-gray-50">
                    <p className="text-[10px] font-bold text-[#222222] mb-1 flex items-center gap-1"><Calculator className="w-3 h-3" /> LIVE CALCULATION</p>
                    <div className="grid grid-cols-5 gap-2 text-[11px]">
                      <div><span className="text-gray-500">Total:</span> <strong>{calculations.total}/{calculations.maxTotal}</strong></div>
                      <div><span className="text-gray-500">%:</span> <strong>{calculations.percentage.toFixed(1)}%</strong></div>
                      <div><span className="text-gray-500">Grade:</span> <strong>{calculations.grade}</strong></div>
                      <div><span className="text-gray-500">Status:</span> {calculations.pass ? <span className="badge-success">Pass</span> : <span className="badge-danger">Fail</span>}</div>
                      <div><span className="text-gray-500">Subjects:</span> <strong>{calculations.subjectResults.filter(s => s.passed).length}/{yearSubjects.length}</strong> <span className={`ml-1 ${calculations.failedCount > 0 ? 'text-[#C62828]' : 'text-gray-400'}`}>({calculations.failedCount} fail)</span></div>
                    </div>
                  </Card>
                )}
                <div className="flex justify-between">
                  <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222] flex items-center gap-1" onClick={() => setGenStep(1)}><ChevronLeft className="w-3 h-3" /> Previous</button>
                  <button className="px-3 py-1.5 text-[11px] text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5 disabled:opacity-50" disabled={Object.keys(subjectMarks).length < yearSubjects.length} onClick={() => setGenStep(3)}>Next: Review <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </Panel>
          )}

          {genStep === 3 && selectedStudent && calculations && (
            <Panel title="Review & Publish Result">
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card padding="sm" className="border border-gray-300"><p className="text-[10px] font-bold text-[#222222] mb-1 uppercase">Student Details</p>
                    <div className="flex flex-col gap-1 text-[11px]">
                      <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-semibold text-[#222222]">{selectedStudent.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Course</span><span className="font-semibold text-[#222222]">{selectedStudent.course}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Roll</span><span className="font-semibold text-[#222222]">{selectedStudent.rollNo}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Reg No</span><span className="font-semibold text-[#222222]">{selectedStudent.registrationNo}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Result Year</span><span className="font-semibold text-[#0078D7]">Year {resultYear}</span></div>
                    </div>
                  </Card>
                  <Card padding="sm" className={`border ${calculations.pass ? 'border-[#A5D6A7] bg-[#E8F5E9]' : 'border-[#EF9A9A] bg-[#FFEBEE]'}`}>
                    <p className="text-[10px] font-bold text-[#222222] mb-1 uppercase">Result Summary</p>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div><p className="text-lg font-bold text-[#222222]">{calculations.percentage.toFixed(1)}%</p><p className="text-[10px] text-gray-500">Percentage</p></div>
                      <div><p className="text-lg font-bold">{calculations.grade}</p><p className="text-[10px] text-gray-500">Grade</p></div>
                      <div><p className="text-sm font-bold text-[#222222]">{calculations.total}/{calculations.maxTotal}</p><p className="text-[10px] text-gray-500">Total Marks</p></div>
                      <div>{calculations.pass ? <span className="badge-success text-xs">PASS</span> : <span className="badge-danger text-xs">FAIL</span>}</div>
                    </div>
                  </Card>
                </div>
                <div className="overflow-x-auto border border-gray-300">
                  <table className="w-full border-collapse">
                    <thead><tr className="bg-[#0078D7] text-white text-[11px]"><th className="px-3 py-1.5 text-left font-bold border-r border-[#005A9E]">#</th><th className="px-3 py-1.5 text-left font-bold border-r border-[#005A9E]">Subject</th><th className="px-3 py-1.5 text-center font-bold border-r border-[#005A9E]">Max</th><th className="px-3 py-1.5 text-center font-bold border-r border-[#005A9E]">Pass</th><th className="px-3 py-1.5 text-center font-bold border-r border-[#005A9E]">Obtained</th><th className="px-3 py-1.5 text-center font-bold">Result</th></tr></thead>
                    <tbody>
                      {calculations.subjectResults.map((sub, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#F5F5F5]'}>
                          <td className="px-3 py-1.5 text-[11px] text-gray-500 border-b border-gray-300 border-r border-gray-300">{idx + 1}</td>
                          <td className="px-3 py-1.5 text-[11px] font-semibold text-[#222222] border-b border-gray-300 border-r border-gray-300">{sub.name}</td>
                          <td className="px-3 py-1.5 text-[11px] text-center text-gray-600 border-b border-gray-300 border-r border-gray-300">{sub.maxMarks}</td>
                          <td className="px-3 py-1.5 text-[11px] text-center text-gray-600 border-b border-gray-300 border-r border-gray-300">{sub.passingMarks}</td>
                          <td className={`px-3 py-1.5 text-[11px] text-center font-bold border-b border-gray-300 border-r border-gray-300 ${sub.passed ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>{sub.marks}</td>
                          <td className="px-3 py-1.5 text-center border-b border-gray-300">{sub.passed ? <span className="badge-success">Pass</span> : <span className="badge-danger">Fail</span>}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 font-bold text-[11px]"><td colSpan={2} className="px-3 py-1.5 text-[#222222] border-b border-gray-300 border-r border-gray-300">Total</td><td className="px-3 py-1.5 text-center text-[#222222] border-b border-gray-300 border-r border-gray-300">{calculations.maxTotal}</td><td className="px-3 py-1.5 border-b border-gray-300 border-r border-gray-300"></td><td className="px-3 py-1.5 text-center text-[#222222] border-b border-gray-300 border-r border-gray-300">{calculations.total}</td><td className="px-3 py-1.5 text-center border-b border-gray-300">{calculations.pass ? <span className="badge-success">Pass</span> : <span className="badge-danger">Fail</span>}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between">
                  <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222] flex items-center gap-1" onClick={() => setGenStep(2)}><ChevronLeft className="w-3 h-3" /> Previous</button>
                  <button className="px-3 py-1.5 text-[11px] text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5 disabled:opacity-50" onClick={handleSaveAndPublish} disabled={submitting}><CheckCircle2 className="w-3 h-3" /> {submitting ? 'Publishing...' : 'Save & Publish'}</button>
                </div>
              </div>
            </Panel>
          )}
        </div>
      )}

      {/* View Result Preview */}
      {viewResult && (
        <ResultPreview result={viewResult} onClose={() => setViewResult(null)} />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Result"
        message="Are you sure you want to delete this result? This action cannot be undone."
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteResult}
        loading={deleting}
      />
    </div>
  )
}

export default Results
