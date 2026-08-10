import { useState, useMemo, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  UserPlus, Plus, Eye, CheckCircle, XCircle, Search, Info, BookOpen,
  CalendarDays, Hash, User, Mail, Phone, MapPin, GraduationCap, AlertCircle, Loader2,
} from 'lucide-react'
import {
  getCourseDetails,
} from '@/admin/services/api'
import type { AdmissionRequest, Course } from '@/admin/services/api'
import { admissionsService } from '@/services/students.service'
import { coursesService } from '@/services/courses.service'
import { useToast } from '@/admin/components/Toast'
import Modal, { WinButton } from '@/admin/components/ui/Modal'
import Panel from '@/admin/components/ui/Panel'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'
import type { ExcelColumn } from '@/admin/components/ExcelSpreadsheet'

function StatusBadge({ label, variant }: { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${styles[variant]}`}>
      {label}
    </span>
  )
}

function AdmissionStatusBadge({ status }: { status: AdmissionRequest['status'] }) {
  if (status === 'Pending') return <StatusBadge label="Pending" variant="warning" />
  if (status === 'Approved') return <StatusBadge label="Approved" variant="success" />
  return <StatusBadge label="Rejected" variant="danger" />
}

interface ManualFormData {
  studentName: string; fatherName: string; motherName: string; dob: string
  gender: string; mobile: string; email: string; address: string
  courseId: string; batch: string; admissionDate: string
}

const initialFormData: ManualFormData = {
  studentName: '', fatherName: '', motherName: '', dob: '', gender: '',
  mobile: '', email: '', address: '', courseId: '', batch: '', admissionDate: '',
}

function FormInput({ icon: Icon, ...props }: { icon?: React.ComponentType<{ className?: string }> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        className={`w-full text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy transition-all ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2`}
        {...props}
      />
    </div>
  )
}

function FormSelect({ icon: Icon, children, ...props }: { icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
      <select
        className={`w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy transition-all appearance-none ${Icon ? 'pl-10' : 'pl-3'} pr-8 py-2`}
        {...props}
      >
        {children}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

function FormTextarea({ icon: Icon, ...props }: { icon?: React.ComponentType<{ className?: string }> } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />}
      <textarea
        className={`w-full text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy transition-all resize-y min-h-[80px] ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2`}
        {...props}
      />
    </div>
  )
}

const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5'

function SectionHeader({ icon: Icon, color, title, hint }: { icon: any; color: string; title: string; hint: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
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

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
}

const avatarColors = ['#E3F2FD', '#E8F5E9', '#F3E5F5', '#FFF8E1', '#FFEBEE', '#E0F7FA', '#E8EAF6', '#E0F2F1', '#FFF3E0', '#FCE4EC']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function Admissions() {
  const [activeTab, setActiveTab] = useState<'online' | 'manual'>('online')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<ManualFormData>(initialFormData)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: admissions = [], isLoading, isError, refetch } = useQuery<AdmissionRequest[]>({
    queryKey: ['admissions'],
    queryFn: () => admissionsService.list() as Promise<AdmissionRequest[]>,
  })

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => coursesService.list() as Promise<Course[]>,
  })
  const courses = coursesQuery.data ?? []

  const filteredAdmissions = useMemo(() => {
    // Approved requests "move" to the Students page — don't show them here anymore.
    const active = admissions.filter((a) => a.status !== 'Approved')
    if (!searchTerm.trim()) return active
    const lower = searchTerm.toLowerCase()
    return active.filter((a) =>
      a.studentName.toLowerCase().includes(lower) || a.email.toLowerCase().includes(lower) ||
      a.mobile.includes(searchTerm) || a.course.toLowerCase().includes(lower))
  }, [admissions, searchTerm])

  const pendingCount = useMemo(() => admissions.filter((a) => a.status === 'Pending').length, [admissions])

  const regNo = useMemo(() => {
    if (!selectedCourse || !formData.admissionDate) return '—'
    const year = new Date(formData.admissionDate).getFullYear()
    return `REG${year}${String(admissions.length + 1).padStart(3, '0')}`
  }, [selectedCourse, formData.admissionDate, admissions.length])

  const rollNo = useMemo(() => {
    if (!selectedCourse) return '—'
    return `${selectedCourse.code}${String(admissions.length + 1).padStart(3, '0')}`
  }, [selectedCourse, admissions.length])

  const handleCourseChange = useCallback(async (courseId: string) => {
    try {
      const course = await getCourseDetails(courseId)
      setSelectedCourse(course || null)
    } catch {
      setSelectedCourse(null)
    }
    setFormData((prev) => ({ ...prev, courseId }))
  }, [])

  const handleStatusChange = useCallback(async (id: string, newStatus: 'Approved' | 'Rejected') => {
    try {
      await admissionsService.updateStatus(Number(id), newStatus)
      toast(`Admission ${newStatus.toLowerCase()}`)
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to update status', 'error')
    }
  }, [queryClient, toast])

  const openView = useCallback((admission: AdmissionRequest) => { setSelectedAdmission(admission); setShowModal(true) }, [])
  const closeModal = useCallback(() => { setShowModal(false); setSelectedAdmission(null) }, [])
  const updateField = useCallback((field: keyof ManualFormData, value: string) => { setFormData((prev) => ({ ...prev, [field]: value })) }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await admissionsService.create({
        studentName: formData.studentName, fatherName: formData.fatherName, motherName: formData.motherName,
        dob: formData.dob, gender: formData.gender, mobile: formData.mobile, email: formData.email,
        address: formData.address, courseId: formData.courseId, batch: formData.batch,
        admissionDate: formData.admissionDate,
      })
      toast('Student enrolled successfully')
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
      // Reset the manual form and jump to the Admission Requests list.
      setFormData(initialFormData)
      setSelectedCourse(null)
      setShowSuccess(false)
      setActiveTab('online')
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to enroll student', 'error')
    } finally {
      setSubmitting(false)
    }
  }, [formData, queryClient, toast])

  const columns: ExcelColumn<AdmissionRequest>[] = [
    { key: 'name', header: 'Student Name', render: (a) => <span className="text-sm font-medium text-gray-900">{a.studentName}</span> },
    { key: 'email', header: 'Email', render: (a) => <span className="text-sm text-gray-500">{a.email}</span> },
    { key: 'mobile', header: 'Mobile', render: (a) => <span className="text-sm text-gray-500">{a.mobile}</span> },
    { key: 'course', header: 'Course', render: (a) => <span className="text-sm text-gray-500">{a.course}</span> },
    { key: 'date', header: 'Applied Date', render: (a) => <span className="text-sm text-gray-400">{new Date(a.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span> },
    { key: 'status', header: 'Status', render: (a) => <AdmissionStatusBadge status={a.status} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openView(a)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button>
          {a.status === 'Pending' && (
            <>
              <button onClick={() => handleStatusChange(a.id, 'Approved')} className="p-1.5 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve"><CheckCircle className="w-4 h-4" /></button>
              <button onClick={() => handleStatusChange(a.id, 'Rejected')} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject"><XCircle className="w-4 h-4" /></button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#222222]">Admissions</h1>
          <p className="text-[11px] text-gray-500">Manage admission requests and enroll new students</p>
        </div>
        <button
          onClick={() => setActiveTab('manual')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]"
        >
          <Plus className="w-3.5 h-3.5" /> Add Admission
        </button>
      </div>

      {/* Admissions */}
      <Panel title={activeTab === 'online' ? `Admissions (${filteredAdmissions.length})` : 'Manual Admission'}>
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, mobile, or course..."
            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="inline-flex items-center gap-1 bg-navy/5 rounded-xl p-1 w-full sm:w-auto mb-4">
          <button onClick={() => setActiveTab('online')}
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'online' ? 'bg-navy text-white shadow-md shadow-navy/25' : 'text-gray-500 hover:text-navy hover:bg-white'}`}>
            <UserPlus className="w-4 h-4" />
            Online Requests
            {pendingCount > 0 && <span className={`inline-flex items-center justify-center min-w-[20px] h-5 text-xs font-bold px-1.5 rounded-full ${activeTab === 'online' ? 'bg-gold text-navy' : 'bg-amber-100 text-amber-700'}`}>{pendingCount}</span>}
          </button>
          <button onClick={() => setActiveTab('manual')}
            className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'manual' ? 'bg-navy text-white shadow-md shadow-navy/25' : 'text-gray-500 hover:text-navy hover:bg-white'}`}>
            <GraduationCap className="w-4 h-4" />
            Manual Admission
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'online' ? (
          <>
            {isLoading ? (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <Loader2 className="w-8 h-8 mb-3 animate-spin" />
              <p className="text-sm font-medium text-gray-500">Loading admissions...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center py-12 text-red-400">
              <AlertCircle className="w-10 h-10 mb-3" />
              <p className="text-sm font-medium text-red-500">Failed to load admissions</p>
              <button onClick={() => refetch()} className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]">Retry</button>
            </div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-gray-400">
              <AlertCircle className="w-10 h-10 mb-3" />
              <p className="text-sm font-medium text-gray-500">No admission requests found</p>
            </div>
          ) : (
            <ExcelSpreadsheet data={filteredAdmissions} columns={columns} />
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={User} color="bg-navy/10 text-navy" title="Personal Information" hint="Student's basic identity details" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Student Name <span className="text-red-500">*</span></label>
                  <FormInput icon={User} type="text" placeholder="Enter student name" value={formData.studentName} onChange={(e) => updateField('studentName', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Father's Name <span className="text-red-500">*</span></label>
                  <FormInput type="text" placeholder="Enter father's name" value={formData.fatherName} onChange={(e) => updateField('fatherName', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Mother's Name</label>
                  <FormInput type="text" placeholder="Enter mother's name" value={formData.motherName} onChange={(e) => updateField('motherName', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                  <FormInput icon={CalendarDays} type="date" value={formData.dob} onChange={(e) => updateField('dob', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                  <FormSelect value={formData.gender} onChange={(e) => updateField('gender', e.target.value)} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </FormSelect>
                </div>
                <div>
                  <label className={labelCls}>Mobile <span className="text-red-500">*</span></label>
                  <FormInput icon={Phone} type="tel" placeholder="Enter mobile number" value={formData.mobile} onChange={(e) => updateField('mobile', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <FormInput icon={Mail} type="email" placeholder="Enter email address" value={formData.email} onChange={(e) => updateField('email', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Address</label>
                  <FormTextarea icon={MapPin} placeholder="Enter full address" value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Course Information" hint="Select the course and batch" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Course <span className="text-red-500">*</span></label>
                  <FormSelect icon={BookOpen} value={formData.courseId} onChange={(e) => handleCourseChange(e.target.value)} required>
                    <option value="">Select Course</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                  </FormSelect>
                </div>
                <div>
                  <label className={labelCls}>Batch <span className="text-red-500">*</span></label>
                  <FormInput type="text" placeholder="e.g. 2024-2025" value={formData.batch} onChange={(e) => updateField('batch', e.target.value)} required />
                </div>
              </div>

              {selectedCourse && (
                <div className="mt-4 bg-navy/[0.03] border border-navy/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-navy" />
                    <h4 className="text-sm font-semibold text-navy">Course Details: {selectedCourse.name}</h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                      <p className="text-xs text-gray-500 font-medium">Duration</p>
                      <p className="text-sm font-semibold text-text-dark">{selectedCourse.duration}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                      <p className="text-xs text-gray-500 font-medium">Fee</p>
                      <p className="text-sm font-semibold text-green">₹{selectedCourse.courseFee.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                      <p className="text-xs text-gray-500 font-medium">Reg. Fee</p>
                      <p className="text-sm font-semibold text-text-dark">₹{selectedCourse.registrationFee.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-100 px-3 py-2">
                      <p className="text-xs text-gray-500 font-medium">Eligibility</p>
                      <p className="text-sm font-semibold text-text-dark">{selectedCourse.eligibility}</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Subjects:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCourse.subjects.map((sub) => <span key={sub.id} className="text-xs px-2 py-1 bg-white rounded-md border border-gray-100 text-gray-700">{sub.name}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Admission Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={CalendarDays} color="bg-gold/10 text-gold" title="Admission Details" hint="Admission date and auto-generated IDs" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Admission Date <span className="text-red-500">*</span></label>
                  <FormInput icon={CalendarDays} type="date" value={formData.admissionDate} onChange={(e) => updateField('admissionDate', e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Registration No</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" className="w-full pl-10 pr-3 py-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed" value={regNo} readOnly />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Auto-generated</p>
                </div>
                <div>
                  <label className={labelCls}>Roll No</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" className="w-full pl-10 pr-3 py-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed" value={rollNo} readOnly />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Auto-generated</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-navy bg-gold hover:bg-[#FFD54F] rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-60">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                {submitting ? "Enrolling..." : "Enroll Student"}
              </button>
            </div>

            {showSuccess && (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Student Enrolled Successfully!</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formData.studentName} has been enrolled in {selectedCourse?.name || 'the selected course'}</p>
                </div>
              </div>
            )}
          </form>
        )}
      </Panel>

      {/* View Details Modal */}
      {selectedAdmission && (
        <Modal
          open={showModal}
          onClose={closeModal}
          title="Admission Request Details"
          subtitle="Full details of this admission request"
          size="md"
          accent
          footer={
            selectedAdmission.status === 'Pending' ? (
              <>
                <WinButton onClick={() => { handleStatusChange(selectedAdmission.id, 'Rejected'); closeModal() }}>
                  <XCircle className="w-3 h-3" /> Reject
                </WinButton>
                <WinButton variant="primary" onClick={() => { handleStatusChange(selectedAdmission.id, 'Approved'); closeModal() }}>
                  <CheckCircle className="w-3 h-3" /> Approve
                </WinButton>
              </>
            ) : (
              <WinButton onClick={closeModal}>Close</WinButton>
            )
          }
        >
          <div className="p-6 flex flex-col gap-5">
            {/* Student header */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-navy shrink-0"
                style={{ background: getAvatarColor(selectedAdmission.studentName) }}
              >
                {getInitials(selectedAdmission.studentName)}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-text-dark truncate">{selectedAdmission.studentName}</p>
                <p className="text-xs text-gray-400 truncate">{selectedAdmission.course}</p>
              </div>
              <div className="ml-auto shrink-0"><AdmissionStatusBadge status={selectedAdmission.status} /></div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={User} color="bg-navy/10 text-navy" title="Personal Information" hint="Student's basic details" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Father's Name</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.fatherName || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Mother's Name</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.motherName || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Date of Birth</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{new Date(selectedAdmission.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Gender</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.gender || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Email</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5 break-all">{selectedAdmission.email || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Mobile</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.mobile}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[11px] text-gray-500 font-medium">Address</p>
                <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.address || '—'}</p>
              </div>
            </div>

            {/* Admission Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Admission Details" hint="Course and applied date" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Course</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.course}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Batch</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.batch || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Applied Date</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{new Date(selectedAdmission.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Admissions
