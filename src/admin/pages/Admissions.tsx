import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  UserPlus, Plus, Eye, CheckCircle, XCircle, Search, Info, BookOpen,
  CalendarDays, Hash, User, Mail, Phone, MapPin, GraduationCap, AlertCircle, Loader2,
  Camera, UploadCloud, X, Trash2,
} from 'lucide-react'
import {
  getCourseDetails,
} from '@/admin/services/api'
import type { AdmissionRequest, Course, Student } from '@/admin/services/api'
import { admissionsService, studentsService } from '@/services/students.service'
import { uploadService } from '@/services/gallery.service'
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
  photo: string; aadhaarCard: string; aadhaarNumber: string; matricDmc: string
}

const initialFormData: ManualFormData = {
  studentName: '', fatherName: '', motherName: '', dob: '', gender: '',
  mobile: '', email: '', address: '', courseId: '', batch: '', admissionDate: '',
  photo: '', aadhaarCard: '', aadhaarNumber: '', matricDmc: '',
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

function HighlightText({ text, search }: { text: string; search: string }) {
  if (!search.trim()) return <>{text}</>
  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-gold/40 text-navy font-semibold rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
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
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [courseSearch, setCourseSearch] = useState('')
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false)
  const courseDropdownRef = useRef<HTMLDivElement>(null)
  const courseSearchRef = useRef<HTMLInputElement>(null)

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [photoUploading, setPhotoUploading] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null)
  const [aadhaarPreview, setAadhaarPreview] = useState<string>('')
  const [aadhaarUploading, setAadhaarUploading] = useState(false)
  const aadhaarInputRef = useRef<HTMLInputElement>(null)

  const [dmcFile, setDmcFile] = useState<File | null>(null)
  const [dmcPreview, setDmcPreview] = useState<string>('')
  const [dmcUploading, setDmcUploading] = useState(false)
  const dmcInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target as Node)) {
        setCourseDropdownOpen(false)
      }
    }
    if (courseDropdownOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [courseDropdownOpen])

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: admissions = [], isLoading, isError, refetch } = useQuery<AdmissionRequest[]>({
    queryKey: ['admissions'],
    queryFn: () => admissionsService.list() as Promise<AdmissionRequest[]>,
  })

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: () => studentsService.list() as Promise<Student[]>,
  })

  const coursesQuery = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => coursesService.list() as Promise<Course[]>,
  })
  const courses = coursesQuery.data ?? []

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courses
    const lower = courseSearch.toLowerCase()
    return courses.filter((c) => c.name.toLowerCase().includes(lower) || c.code.toLowerCase().includes(lower))
  }, [courses, courseSearch])

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

  const sessionShort = useMemo(() => {
    const batch = formData.batch.trim()
    const m4 = batch.match(/^(\d{4})-(\d{4})/)
    if (m4) return `${m4[1].slice(2)}-${m4[2].slice(2)}`
    const m42 = batch.match(/^(\d{4})-(\d{2})/)
    if (m42) return `${m42[1].slice(2)}-${m42[2]}`
    const m2 = batch.match(/^(\d{2})-(\d{2})/)
    if (m2) return `${m2[1]}-${m2[2]}`
    const year = new Date().getFullYear() % 100
    return `${String(year).padStart(2, '0')}-${String(year + 1).padStart(2, '0')}`
  }, [formData.batch])

  const regNo = useMemo(() => {
    const batch = formData.batch.trim()
    if (!batch || !selectedCourse) return '—'
    const sessionStudents = students.filter((s) => s.batch === batch).length
    const sessionPending = admissions.filter((a) => a.batch === batch).length
    const seq = sessionStudents + sessionPending + 1
    return `REG-${sessionShort}-${String(seq).padStart(3, '0')}`
  }, [selectedCourse, formData.batch, sessionShort, students, admissions])

  const rollNo = useMemo(() => {
    if (!selectedCourse) return '—'
    return `${selectedCourse.code}${String(admissions.length + 1).padStart(3, '0')}`
  }, [selectedCourse, admissions.length])

  const enrollmentPreviewFor = useCallback((batch: string) => {
    const b = batch.trim()
    if (!b) return '—'
    const m4 = b.match(/^(\d{4})-(\d{4})/)
    const short = m4
      ? `${m4[1].slice(2)}-${m4[2].slice(2)}`
      : (b.match(/^(\d{4})-(\d{2})/)
        ? `${b.match(/^(\d{4})-(\d{2})/)![1].slice(2)}-${b.match(/^(\d{4})-(\d{2})/)![2]}`
        : (b.match(/^(\d{2})-(\d{2})/)
          ? `${b.match(/^(\d{2})-(\d{2})/)![1]}-${b.match(/^(\d{2})-(\d{2})/)![2]}`
          : (() => {
            const year = new Date().getFullYear() % 100
            return `${String(year).padStart(2, '0')}-${String(year + 1).padStart(2, '0')}`
          })()
        )
      )
    const seq = students.filter((s) => s.batch === b).length + admissions.filter((a) => a.batch === b).length + 1
    return `ENR${short.replace('-', '')}-${String(seq).padStart(3, '0')}`
  }, [students, admissions])

  const enrollmentNo = useMemo(() => enrollmentPreviewFor(formData.batch), [enrollmentPreviewFor, formData.batch])

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

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      await admissionsService.delete(Number(id))
      toast('Admission deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
      setShowDeleteConfirm(null)
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to delete admission', 'error')
    } finally {
      setDeletingId(null)
    }
  }, [queryClient, toast])

  const openView = useCallback((admission: AdmissionRequest) => { setSelectedAdmission(admission); setShowModal(true) }, [])
  const closeModal = useCallback(() => { setShowModal(false); setSelectedAdmission(null) }, [])
  const updateField = useCallback((field: keyof ManualFormData, value: string) => { setFormData((prev) => ({ ...prev, [field]: value })) }, [])

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File | null) => void, setPreview: (p: string) => void) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast('Please select an image file', 'error'); return }
    setFile(file)
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function uploadFile(file: File | null, currentPath: string, setUploading: (v: boolean) => void): Promise<string> {
    if (!file) return currentPath
    setUploading(true)
    try {
      const res = await uploadService.upload(file, 'students')
      return res?.path || ''
    } finally {
      setUploading(false)
    }
  }

  function resetFileUploads() {
    setPhotoFile(null); setPhotoPreview('')
    setAadhaarFile(null); setAadhaarPreview('')
    setDmcFile(null); setDmcPreview('')
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...formData }
      if (photoFile) payload.photo = await uploadFile(photoFile, formData.photo, setPhotoUploading)
      if (aadhaarFile) payload.aadhaarCard = await uploadFile(aadhaarFile, formData.aadhaarCard, setAadhaarUploading)
      if (dmcFile) payload.matricDmc = await uploadFile(dmcFile, formData.matricDmc, setDmcUploading)
      await admissionsService.create({
        studentName: payload.studentName, fatherName: payload.fatherName, motherName: payload.motherName,
        dob: payload.dob, gender: payload.gender, mobile: payload.mobile, email: payload.email,
        address: payload.address, courseId: payload.courseId, batch: payload.batch,
        admissionDate: payload.admissionDate,
        photo: payload.photo, aadhaarCard: payload.aadhaarCard, aadhaarNumber: payload.aadhaarNumber, matricDmc: payload.matricDmc,
      })
      toast('Student enrolled successfully')
      queryClient.invalidateQueries({ queryKey: ['admissions'] })
      setFormData(initialFormData)
      setSelectedCourse(null)
      setShowSuccess(false)
      setActiveTab('online')
      resetFileUploads()
      setCourseSearch('')
      setCourseDropdownOpen(false)
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to enroll student', 'error')
    } finally {
      setSubmitting(false)
    }
  }, [formData, photoFile, aadhaarFile, dmcFile, queryClient, toast])

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
          <button onClick={() => setShowDeleteConfirm(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
                <div>
                  <label className={labelCls}>Aadhaar Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <FormInput icon={Hash} inputMode="numeric" placeholder="Enter 12-digit Aadhaar number" value={formData.aadhaarNumber} onChange={(e) => updateField('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelCls}>Address</label>
                  <FormTextarea icon={MapPin} placeholder="Enter full address" value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                </div>
              </div>

              {/* Student Photo */}
              <div className="mt-4 flex items-center gap-4">
                <div className="shrink-0">
                  {photoPreview ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-navy/20 shadow-sm">
                      <img src={photoPreview} alt="Student preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setPhotoPreview(''); setPhotoFile(null); updateField('photo', '') }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400"><Camera className="w-6 h-6" /><span className="text-[8px] mt-0.5">No Photo</span></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className={labelCls}>Student Photo <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input ref={photoInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e, setPhotoFile, setPhotoPreview)} className="hidden" />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => photoInputRef.current?.click()} disabled={photoUploading} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy/20 text-navy text-xs font-semibold hover:bg-navy/5 transition-colors disabled:opacity-50">
                      {photoUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                      {photoUploading ? 'Uploading...' : photoFile ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    {photoFile && <span className="text-[10px] text-gray-500 truncate">{photoFile.name}</span>}
                  </div>
                </div>
              </div>

              {/* Aadhaar Card */}
              <div className="mt-4 flex items-center gap-4">
                <div className="shrink-0">
                  {aadhaarPreview ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-navy/20 shadow-sm">
                      <img src={aadhaarPreview} alt="Aadhaar preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setAadhaarPreview(''); setAadhaarFile(null); updateField('aadhaarCard', '') }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400"><Camera className="w-6 h-6" /><span className="text-[8px] mt-0.5">No Card</span></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className={labelCls}>Aadhaar Card <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input ref={aadhaarInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e, setAadhaarFile, setAadhaarPreview)} className="hidden" />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => aadhaarInputRef.current?.click()} disabled={aadhaarUploading} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy/20 text-navy text-xs font-semibold hover:bg-navy/5 transition-colors disabled:opacity-50">
                      {aadhaarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                      {aadhaarUploading ? 'Uploading...' : aadhaarFile ? 'Change Card' : 'Upload Card'}
                    </button>
                    {aadhaarFile && <span className="text-[10px] text-gray-500 truncate">{aadhaarFile.name}</span>}
                  </div>
                </div>
              </div>

              {/* Matric / DMC */}
              <div className="mt-4 flex items-center gap-4">
                <div className="shrink-0">
                  {dmcPreview ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-navy/20 shadow-sm">
                      <img src={dmcPreview} alt="DMC preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setDmcPreview(''); setDmcFile(null); updateField('matricDmc', '') }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400"><Camera className="w-6 h-6" /><span className="text-[8px] mt-0.5">No DMC</span></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className={labelCls}>Matric / DMC <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input ref={dmcInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e, setDmcFile, setDmcPreview)} className="hidden" />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => dmcInputRef.current?.click()} disabled={dmcUploading} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy/20 text-navy text-xs font-semibold hover:bg-navy/5 transition-colors disabled:opacity-50">
                      {dmcUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                      {dmcUploading ? 'Uploading...' : dmcFile ? 'Change DMC' : 'Upload DMC'}
                    </button>
                    {dmcFile && <span className="text-[10px] text-gray-500 truncate">{dmcFile.name}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Course Information" hint="Select the course and batch" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className={labelCls}>Course <span className="text-red-500">*</span></label>
                  <div className="relative" ref={courseDropdownRef}>
                    <div
                      className="flex items-center w-full bg-white border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-navy/15 focus-within:border-navy transition-all cursor-text"
                      onClick={() => { setCourseDropdownOpen(true); setTimeout(() => courseSearchRef.current?.focus(), 0) }}
                    >
                      <BookOpen className="ml-3 w-4 h-4 text-gray-400 shrink-0" />
                      {formData.courseId ? (
                        <span className="flex-1 px-3 py-2 text-sm text-gray-900 truncate">
                          {courses.find((c) => String(c.id) === String(formData.courseId))?.name || 'Selected'}
                        </span>
                      ) : (
                        <span className="flex-1 px-3 py-2 text-sm text-gray-400 select-none">Select Course</span>
                      )}
                      <button
                        type="button"
                        className="px-2 py-2 text-gray-400 hover:text-gray-600"
                        onClick={(e) => { e.stopPropagation(); setCourseDropdownOpen((o) => !o); if (!courseDropdownOpen) setTimeout(() => courseSearchRef.current?.focus(), 0) }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {courseDropdownOpen && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              ref={courseSearchRef}
                              type="text"
                              placeholder="Search courses..."
                              value={courseSearch}
                              onChange={(e) => setCourseSearch(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {filteredCourses.length === 0 ? (
                            <div className="px-3 py-4 text-center text-sm text-gray-400">No courses found</div>
                          ) : (
                            filteredCourses.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-navy/5 transition-colors ${String(c.id) === String(formData.courseId) ? 'bg-navy/10 text-navy font-semibold' : 'text-gray-700'}`}
                                onClick={(e) => { e.stopPropagation(); handleCourseChange(String(c.id)); setCourseDropdownOpen(false); setCourseSearch('') }}
                              >
                                <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-50" />
                                <span className="truncate"><HighlightText text={c.name} search={courseSearch} /></span>
                                <span className="ml-auto text-[11px] text-gray-400 shrink-0"><HighlightText text={c.code} search={courseSearch} /></span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
                <div>
                  <label className={labelCls}>Enrollment No</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" className="w-full pl-10 pr-3 py-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed" value={enrollmentNo} readOnly />
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
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Aadhaar Number</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{selectedAdmission.aadhaarNumber || '—'}</p>
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
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Enrollment No</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{enrollmentPreviewFor(selectedAdmission.batch || '')}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Auto-generated on approval</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            {(selectedAdmission.photo || selectedAdmission.aadhaarCard || selectedAdmission.matricDmc) && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <SectionHeader icon={Eye} color="bg-purple-100 text-purple-600" title="Documents" hint="Uploaded student documents" />
                <div className="flex flex-wrap gap-3">
                  {selectedAdmission.photo && (
                    <button type="button" onClick={() => setLightbox(selectedAdmission.photo!)} className="group relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-navy transition-colors shadow-sm">
                      <img src={selectedAdmission.photo} alt="Student Photo" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-medium text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Photo</span>
                    </button>
                  )}
                  {selectedAdmission.aadhaarCard && (
                    <button type="button" onClick={() => setLightbox(selectedAdmission.aadhaarCard!)} className="group relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-navy transition-colors shadow-sm">
                      <img src={selectedAdmission.aadhaarCard} alt="Aadhaar Card" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-medium text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Aadhaar</span>
                    </button>
                  )}
                  {selectedAdmission.matricDmc && (
                    <button type="button" onClick={() => setLightbox(selectedAdmission.matricDmc!)} className="group relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-navy transition-colors shadow-sm">
                      <img src={selectedAdmission.matricDmc} alt="Matric DMC" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-medium text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">DMC</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-xl font-bold">&times;</button>
          <img src={lightbox} alt="Full view" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Modal open={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)} title="Delete Admission" subtitle="This action cannot be undone" size="sm" accent
          footer={
            <>
              <WinButton onClick={() => setShowDeleteConfirm(null)}>Cancel</WinButton>
              <WinButton variant="primary" onClick={() => handleDelete(showDeleteConfirm)} disabled={!!deletingId}>
                {deletingId ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
              </WinButton>
            </>
          }
        >
          <div className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm text-gray-600">Are you sure you want to delete this admission request? This will permanently remove it.</p>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default Admissions
