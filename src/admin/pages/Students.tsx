import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Search, Eye, Pencil, Trash2, Users, GraduationCap, UserCheck, Loader2, AlertCircle, User, BookOpen, Clock, Mail, FileText, Award, ChevronDown, Layers, Check, Camera, UploadCloud, X } from 'lucide-react'
import { getCourseDetails, getCourses } from '@/admin/services/api'
import type { Student, Course } from '@/admin/services/api'
import { studentsService } from '@/services/students.service'
import { uploadService } from '@/services/gallery.service'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Card from '@/admin/components/ui/Card'
import Panel from '@/admin/components/ui/Panel'
import Modal, { WinButton } from '@/admin/components/ui/Modal'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'

const ITEMS_PER_PAGE = 10

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
}

const avatarColors = [
  '#E3F2FD', '#E8F5E9', '#F3E5F5', '#FFF8E1', '#FFEBEE',
  '#E0F7FA', '#E8EAF6', '#E0F2F1', '#FFF3E0', '#FCE4EC',
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-[10px] mt-0.5">{message}</p>
}

const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-navy/15 focus:border-navy outline-none transition-shadow bg-white'
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

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

function getStatusBadge(status: Student['status']) {
  switch (status) {
    case 'Active': return <span className="badge-success">Active</span>
    case 'Inactive': return <span className="badge-danger">Inactive</span>
    case 'Graduated': return <span className="badge-info">Graduated</span>
  }
}

function SearchableCourseSelect({
  courses,
  value,
  onChange,
  placeholder = 'All Courses',
  showCode = false,
  className = '',
}: {
  courses: Course[]
  value: string
  onChange: (id: string) => void
  placeholder?: string
  showCode?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const selected = courses.find((c) => c.id === value)
  const query = q.trim().toLowerCase()
  const filtered = query
    ? courses.filter((c) => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query))
    : courses

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setQ('') }}
        className={`w-full rounded-lg pl-2 pr-2 py-2 text-sm text-left flex items-center justify-between gap-1.5 bg-white outline-none transition-all border shadow-sm hover:shadow-md ${open
          ? 'border-navy ring-2 ring-navy/15'
          : 'border-gray-200 hover:border-navy/40'} ${value ? 'text-navy font-semibold' : 'text-gray-400'}`}
      >
        <span className="truncate flex items-center gap-1.5 min-w-0">
          <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${value ? 'bg-gold/20 text-gold' : 'bg-navy/5 text-navy/40'}`}>
            <GraduationCap className="w-3 h-3" />
          </span>
          <span className="truncate">{selected ? (showCode ? `${selected.name} — ${selected.code}` : selected.name) : placeholder}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? 'rotate-180 text-navy' : 'text-gray-400'}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full min-w-60 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-slide-in">
          <div className="p-2.5 border-b border-gray-100 bg-light-blue">
            <p className="text-[10px] font-bold uppercase tracking-wide text-navy/50 mb-1.5 px-1">Filter by course</p>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                placeholder="Search course..."
                className="w-full rounded-lg border border-gray-200 pl-8 pr-2 py-1.5 text-xs bg-white outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-navy/10 placeholder:text-gray-400"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${!value ? 'font-bold text-navy bg-gold/10' : 'text-gray-600 hover:bg-navy/5'}`}
            >
              <Layers className="w-3.5 h-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{placeholder}</span>
            </button>
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => { onChange(c.id); setOpen(false) }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 transition-colors ${value === c.id ? 'font-bold text-navy bg-gold/10' : 'text-gray-600 hover:bg-navy/5'}`}
              >
                <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                  {value === c.id ? <Check className="w-3.5 h-3.5 text-gold" /> : <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />}
                </span>
                <span className="truncate flex-1">{c.name}</span>
                <span className="text-[10px] text-gray-400 shrink-0 font-mono">{c.code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center">
                <Search className="w-5 h-5 text-gray-200 mx-auto mb-1.5" />
                <p className="text-[11px] text-gray-400">No courses found for "{q}"</p>
              </div>
            )}
          </div>
          <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50 text-[10px] text-gray-400">
            {filtered.length} course{filtered.length === 1 ? '' : 's'} found
          </div>
        </div>
      )}
    </div>
  )
}

function Students() {
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [viewStudent, setViewStudent] = useState<Student | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  const emptyForm = {
    name: '', fatherName: '', motherName: '', dob: '', gender: '' as '' | 'Male' | 'Female',
    mobile: '', email: '', address: '', courseId: '', batch: '', admissionDate: '', photo: '', aadhaarCard: '', aadhaarNumber: '', matricDmc: '', enrollmentNumber: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
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

  const [selectedCourseDetails, setSelectedCourseDetails] = useState<any>(null)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: students = [], isLoading, isError, refetch } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: () => studentsService.list() as Promise<Student[]>,
  })

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['admin-courses'],
    queryFn: () => getCourses() as Promise<Course[]>,
  })

  useEffect(() => {
    if (form.courseId) {
      getCourseDetails(form.courseId).then(setSelectedCourseDetails).catch(() => setSelectedCourseDetails(null))
    } else {
      setSelectedCourseDetails(null)
    }
  }, [form.courseId])

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase()
      return (
        (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.course.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)) &&
        (!courseFilter || s.courseId === courseFilter) &&
        (!statusFilter || s.status === statusFilter) &&
        (!genderFilter || s.gender === genderFilter)
      )
    })
  }, [students, search, courseFilter, statusFilter, genderFilter])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE))
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const activeCount = students.filter((s) => s.status === 'Active').length
  const graduatedCount = students.filter((s) => s.status === 'Graduated').length

  function handleFormChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => {
      if (!prev[field]) return prev
      const n = { ...prev }
      delete n[field]
      return n
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

  function openEditModal(s: Student) {
    setEditingStudent(s)
    setForm({
      name: s.name, fatherName: s.fatherName || '', motherName: s.motherName || '', dob: s.dob || '',
      gender: s.gender || '', mobile: s.mobile || '', email: s.email || '', address: s.address || '',
      courseId: s.courseId || '', batch: s.batch || '', admissionDate: s.admissionDate || '',
      photo: s.photo || '', aadhaarCard: s.aadhaarCard || '', aadhaarNumber: s.aadhaarNumber || '', matricDmc: s.matricDmc || '', enrollmentNumber: s.enrollmentNo || '',
    })
    setPhotoFile(null)
    setPhotoPreview(s.photo || '')
    setAadhaarFile(null)
    setAadhaarPreview(s.aadhaarCard || '')
    setDmcFile(null)
    setDmcPreview(s.matricDmc || '')
    setFormErrors({})
    setShowAddModal(true)
  }

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'error')
      return
    }
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handlePhotoUpload(): Promise<string> {
    if (!photoFile) return form.photo || ''
    setPhotoUploading(true)
    try {
      const res = await uploadService.upload(photoFile, 'students')
      const path = res?.path || ''
      setForm((p) => ({ ...p, photo: path }))
      setPhotoFile(null)
      return path
    } finally {
      setPhotoUploading(false)
    }
  }

  async function handleAadhaarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'error')
      return
    }
    setAadhaarFile(file)
    const reader = new FileReader()
    reader.onload = () => setAadhaarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleAadhaarUpload(): Promise<string> {
    if (!aadhaarFile) return form.aadhaarCard || ''
    setAadhaarUploading(true)
    try {
      const res = await uploadService.upload(aadhaarFile, 'students')
      const path = res?.path || ''
      setForm((p) => ({ ...p, aadhaarCard: path }))
      setAadhaarFile(null)
      return path
    } finally {
      setAadhaarUploading(false)
    }
  }

  async function handleDmcSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'error')
      return
    }
    setDmcFile(file)
    const reader = new FileReader()
    reader.onload = () => setDmcPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleDmcUpload(): Promise<string> {
    if (!dmcFile) return form.matricDmc || ''
    setDmcUploading(true)
    try {
      const res = await uploadService.upload(dmcFile, 'students')
      const path = res?.path || ''
      setForm((p) => ({ ...p, matricDmc: path }))
      setDmcFile(null)
      return path
    } finally {
      setDmcUploading(false)
    }
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
      // Upload new files first (if any), then save student with the paths.
      const payload = { ...form }
      if (photoFile) {
        payload.photo = await handlePhotoUpload()
      }
      if (aadhaarFile) {
        payload.aadhaarCard = await handleAadhaarUpload()
      }
      if (dmcFile) {
        payload.matricDmc = await handleDmcUpload()
      }
      if (editingStudent) {
        await studentsService.update(Number(editingStudent.id), payload)
        toast('Student updated successfully')
      } else {
        await studentsService.create(payload)
        toast('Student added successfully')
      }
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setShowAddModal(false)
      setEditingStudent(null)
      setForm(emptyForm)
      setSelectedCourseDetails(null)
      setPhotoFile(null)
      setPhotoPreview('')
      setAadhaarFile(null)
      setAadhaarPreview('')
      setDmcFile(null)
      setDmcPreview('')
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to save student'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteStudent() {
    if (!showDeleteConfirm) return
    setDeletingId(showDeleteConfirm)
    try {
      await studentsService.delete(Number(showDeleteConfirm))
      toast('Student deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setShowDeleteConfirm(null)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete student'), 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const navigate = useNavigate()

  function formatDate(value?: string): string {
    if (!value) return '—'
    const d = new Date(value)
    if (isNaN(d.getTime())) return value
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const handleView = (s: Student) => { setViewStudent(s) }
  const closeView = () => { setViewStudent(null) }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#222222]">Students</h1>
          <p className="text-[11px] text-gray-500">Students appear here after their admission is approved</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9] shrink-0">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1565C0]" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-[#222222]">{students.length}</p>
            <p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Students</p>
          </div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] shrink-0">
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-[#222222]">{activeCount}</p>
            <p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Active Students</p>
          </div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFF8E1] border border-[#FFE082] shrink-0">
            <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F57F17]" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-[#222222]">{graduatedCount}</p>
            <p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Graduated</p>
          </div>
        </Card>
      </div>

      {/* Students */}
      <Panel title={`Students (${filteredStudents.length})`}>
        {/* Filter controls */}
        <div className="flex flex-col lg:flex-row gap-2 mb-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search by name, email, course, roll no..." className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm text-gray-900 bg-white outline-none transition-all shadow-sm placeholder:text-gray-400 focus:border-navy focus:ring-2 focus:ring-navy/15" value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
          </div>
          <SearchableCourseSelect
            courses={courses}
            value={courseFilter}
            onChange={(id) => { setCourseFilter(id); setCurrentPage(1) }}
            className="lg:w-56"
          />
          <div className="grid grid-cols-2 gap-2 lg:flex">
            <select className="form-select lg:w-36 h-[38px] px-2.5" value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}>
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Graduated">Graduated</option>
            </select>
            <select className="form-select lg:w-32 h-[38px] px-2.5" value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1) }}>
              <option value="">All Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p className="text-sm font-medium">Loading students...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-12 text-red-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Failed to load students</p>
            <button
              className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        ) : paginatedStudents.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">No students found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <ExcelSpreadsheet
              data={paginatedStudents}
              columns={[
                {
                  key: 'student', header: 'Student',
                  render: (s) => (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-bold text-[#1B5E20] shrink-0" style={{ background: getAvatarColor(s.name) }}>
                        {getInitials(s.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-gray-900 leading-tight">{s.name}</p>
                        <p className="text-[10px] text-gray-400 leading-tight truncate max-w-[160px]">{s.email}</p>
                      </div>
                    </div>
                  ),
                },
                { key: 'roll', header: 'Roll No', render: (s) => <span className="font-mono text-gray-700">{s.rollNo}</span> },
                { key: 'course', header: 'Course', render: (s) => <span className="text-gray-700">{s.course}</span> },
                { key: 'batch', header: 'Batch', render: (s) => <span className="text-gray-700">{s.batch}</span> },
                { key: 'mobile', header: 'Mobile', render: (s) => <span className="text-gray-700">{s.mobile}</span> },
                { key: 'admission', header: 'Admission Date', render: (s) => <span className="text-gray-600">{new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span> },
                { key: 'status', header: 'Status', render: (s) => getStatusBadge(s.status) },
                {
                  key: 'actions', header: 'Actions', align: 'center',
                  render: (s) => (
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleView(s)} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="View profile"><Eye className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openEditModal(s)} className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setShowDeleteConfirm(s.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ),
                },
              ]}
            />
            {filteredStudents.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-gray-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of {filteredStudents.length}
                </p>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!showDeleteConfirm}
        title="Delete Student"
        message="Are you sure you want to delete this student record? All associated data will be permanently removed."
        onCancel={() => setShowDeleteConfirm(null)}
        onConfirm={handleDeleteStudent}
        loading={!!deletingId}
      />

      {/* Add / Edit Student Modal */}
      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingStudent(null) }}
        title={editingStudent ? 'Edit Student' : 'Add New Student'}
        subtitle={editingStudent ? 'Update the student details below' : 'Fill in the student details below'}
        size="lg"
        scroll
        accent
        footer={
          <>
            <WinButton onClick={() => { setShowAddModal(false); setEditingStudent(null) }}>Cancel</WinButton>
            <WinButton variant="primary" onClick={handleSubmitStudent} disabled={submitting}>
              {submitting ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
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
                <FieldError message={formErrors.name} />
              </div>
              <div>
                <label className={labelCls}>Father's Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="Enter father's name" value={form.fatherName} onChange={(e) => handleFormChange('fatherName', e.target.value)} />
                <FieldError message={formErrors.fatherName} />
              </div>
              <div>
                <label className={labelCls}>Mother's Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="Enter mother's name" value={form.motherName} onChange={(e) => handleFormChange('motherName', e.target.value)} />
                <FieldError message={formErrors.motherName} />
              </div>
              <div>
                <label className={labelCls}>DOB <span className="text-red-500">*</span></label>
                <input type="date" className={inputCls} value={form.dob} onChange={(e) => handleFormChange('dob', e.target.value)} />
                <FieldError message={formErrors.dob} />
              </div>
              <div>
                <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                <select className={inputCls} value={form.gender} onChange={(e) => handleFormChange('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <FieldError message={formErrors.gender} />
              </div>
              <div>
                <label className={labelCls}>Mobile <span className="text-red-500">*</span></label>
                <input type="tel" className={inputCls} placeholder="Enter mobile" value={form.mobile} onChange={(e) => handleFormChange('mobile', e.target.value)} />
                <FieldError message={formErrors.mobile} />
              </div>
              <div>
                <label className={labelCls}>Aadhaar Number <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="tel" inputMode="numeric" maxLength={12} className={inputCls} placeholder="Enter 12-digit Aadhaar number" value={form.aadhaarNumber} onChange={(e) => handleFormChange('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} />
                <FieldError message={formErrors.aadhaarNumber} />
              </div>
            </div>

            {/* Student Photo */}
            <div className="mt-4 flex items-center gap-4">
              <div className="shrink-0">
                {photoPreview ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-navy/20 shadow-sm">
                    <img src={photoPreview} alt="Student preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPhotoPreview(''); setPhotoFile(null); setForm((p) => ({ ...p, photo: '' })) }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                      aria-label="Remove photo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-6 h-6" />
                    <span className="text-[8px] mt-0.5">No Photo</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelCls}>Student Photo <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={photoUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy/20 text-navy text-xs font-semibold hover:bg-navy/5 transition-colors disabled:opacity-50"
                  >
                    {photoUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    {photoUploading ? 'Uploading...' : photoFile ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {photoFile && (
                    <span className="text-[10px] text-gray-500 truncate">{photoFile.name}</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">JPG/PNG up to 5MB. This photo appears on the marksheet and certificate.</p>
              </div>
            </div>

            {/* Aadhaar Card */}
            <div className="mt-4 flex items-center gap-4">
              <div className="shrink-0">
                {aadhaarPreview ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-navy/20 shadow-sm">
                    <img src={aadhaarPreview} alt="Aadhaar preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setAadhaarPreview(''); setAadhaarFile(null); setForm((p) => ({ ...p, aadhaarCard: '' })) }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                      aria-label="Remove aadhaar"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-6 h-6" />
                    <span className="text-[8px] mt-0.5">No Card</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelCls}>Aadhaar Card <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  ref={aadhaarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAadhaarSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => aadhaarInputRef.current?.click()}
                    disabled={aadhaarUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy/20 text-navy text-xs font-semibold hover:bg-navy/5 transition-colors disabled:opacity-50"
                  >
                    {aadhaarUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    {aadhaarUploading ? 'Uploading...' : aadhaarFile ? 'Change Card' : 'Upload Card'}
                  </button>
                  {aadhaarFile && (
                    <span className="text-[10px] text-gray-500 truncate">{aadhaarFile.name}</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">JPG/PNG up to 5MB. Student's Aadhaar card image.</p>
              </div>
            </div>

            {/* Matric / DMC */}
            <div className="mt-4 flex items-center gap-4">
              <div className="shrink-0">
                {dmcPreview ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-navy/20 shadow-sm">
                    <img src={dmcPreview} alt="DMC preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setDmcPreview(''); setDmcFile(null); setForm((p) => ({ ...p, matricDmc: '' })) }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                      aria-label="Remove DMC"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                    <Camera className="w-6 h-6" />
                    <span className="text-[8px] mt-0.5">No DMC</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelCls}>Matric / DMC <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  ref={dmcInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDmcSelect}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => dmcInputRef.current?.click()}
                    disabled={dmcUploading}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-navy/20 text-navy text-xs font-semibold hover:bg-navy/5 transition-colors disabled:opacity-50"
                  >
                    {dmcUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    {dmcUploading ? 'Uploading...' : dmcFile ? 'Change DMC' : 'Upload DMC'}
                  </button>
                  {dmcFile && (
                    <span className="text-[10px] text-gray-500 truncate">{dmcFile.name}</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">JPG/PNG up to 5MB. Matriculation / DMC marksheet image.</p>
              </div>
            </div>
          </div>

          {/* Contact & Course */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Contact & Course" hint="Contact details and enrolled course" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input type="email" className={`${inputCls} pl-9`} placeholder="Enter email" value={form.email} onChange={(e) => handleFormChange('email', e.target.value)} />
                </div>
                <FieldError message={formErrors.email} />
              </div>
              <div>
                <label className={labelCls}>Address <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="Enter address" value={form.address} onChange={(e) => handleFormChange('address', e.target.value)} />
                <FieldError message={formErrors.address} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelCls}>Course <span className="text-red-500">*</span></label>
              <SearchableCourseSelect
                courses={courses}
                value={form.courseId}
                onChange={(id) => handleFormChange('courseId', id)}
                placeholder="Select Course"
                showCode
                className="w-full"
              />
              <FieldError message={formErrors.courseId} />
            </div>
            {selectedCourseDetails && (
              <div className="mt-4 bg-navy/[0.03] border border-navy/10 rounded-xl p-4">
                <p className="text-xs font-bold text-navy mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Course Information
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-white rounded-lg p-2.5 border border-gray-100">
                    <p className="text-[10px] text-gray-500">Duration</p>
                    <p className="text-xs font-semibold text-text-dark">{selectedCourseDetails.duration}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-100">
                    <p className="text-[10px] text-gray-500">Fee</p>
                    <p className="text-xs font-semibold text-green">₹{selectedCourseDetails.courseFee.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-gray-100">
                    <p className="text-[10px] text-gray-500">Reg. Fee</p>
                    <p className="text-xs font-semibold text-text-dark">₹{selectedCourseDetails.registrationFee.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 mb-1.5">Subjects</p>
                <div className="flex flex-wrap gap-1">
                  {selectedCourseDetails.subjects.map((sub: any) => <span key={sub.id} className="badge-info">{sub.name}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Enrollment Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionHeader icon={Clock} color="bg-gold/10 text-gold" title="Enrollment Details" hint="Batch, admission and auto-generated IDs" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Batch <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="e.g., 2024-2025" value={form.batch} onChange={(e) => handleFormChange('batch', e.target.value)} />
                <FieldError message={formErrors.batch} />
              </div>
              <div>
                <label className={labelCls}>Admission Date <span className="text-red-500">*</span></label>
                <input type="date" className={inputCls} value={form.admissionDate} onChange={(e) => handleFormChange('admissionDate', e.target.value)} />
                <FieldError message={formErrors.admissionDate} />
              </div>
              <div>
                <label className={labelCls}>Registration No</label>
                <input type="text" className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} value={editingStudent?.registrationNo || 'Auto-generated'} disabled />
              </div>
              <div>
                <label className={labelCls}>Roll No</label>
                <input type="text" className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} value={editingStudent?.rollNo || 'Auto-generated'} disabled />
              </div>
              <div>
                <label className={labelCls}>Enrollment No</label>
                <input type="text" className={inputCls} placeholder="Auto-generated" value={form.enrollmentNumber} onChange={(e) => handleFormChange('enrollmentNumber', e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Student Modal */}
      {viewStudent && (
        <Modal
          open={!!viewStudent}
          onClose={closeView}
          title="Student Details"
          subtitle="Full details of this student"
          size="lg"
          accent
          footer={
            <>
              <WinButton onClick={closeView}>Close</WinButton>
              <WinButton variant="primary" onClick={() => { navigate(`/admin/students/${viewStudent.id}`) }}>
                <Eye className="w-3 h-3" /> View Full Profile
              </WinButton>
            </>
          }
        >
          <div className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-navy shrink-0"
                style={{ background: getAvatarColor(viewStudent.name) }}
              >
                {getInitials(viewStudent.name)}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-text-dark truncate">{viewStudent.name}</p>
                <p className="text-xs text-gray-400 truncate">{viewStudent.course}</p>
              </div>
              <div className="ml-auto shrink-0">{getStatusBadge(viewStudent.status)}</div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={User} color="bg-navy/10 text-navy" title="Personal Information" hint="Student's personal details" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Father's Name</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.fatherName || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Mother's Name</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.motherName || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Date of Birth</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{formatDate(viewStudent.dob)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Gender</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.gender || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Mobile</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.mobile}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Email</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5 break-all">{viewStudent.email || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Aadhaar Number</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.aadhaarNumber || '—'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] text-gray-500 font-medium">Address</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.address || '—'}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Academic Information" hint="Course and enrollment details" />
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Course</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.course}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Batch</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.batch || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Admission Date</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{formatDate(viewStudent.admissionDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Registration No</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.registrationNo || '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Roll No</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.rollNo}</p>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium">Enrollment No</p>
                  <p className="text-sm font-semibold text-text-dark mt-0.5">{viewStudent.enrollmentNo || '—'}</p>
                </div>
                <div className="flex items-end gap-2 flex-wrap">
                  {viewStudent.resultPublished && <span className="badge-success">Result Published</span>}
                  {viewStudent.certificateIssued && <span className="badge-info">Certificate Issued</span>}
                </div>
              </div>
            </div>

            {/* Documents */}
            {(viewStudent.photo || viewStudent.aadhaarCard || viewStudent.matricDmc) && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-purple-100 text-purple-600">
                    <Eye className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text-dark">Documents</p>
                    <p className="text-[11px] text-gray-400">Uploaded student documents</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {viewStudent.photo && (
                    <button type="button" onClick={() => setLightbox(viewStudent.photo!)} className="group relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-navy transition-colors shadow-sm">
                      <img src={viewStudent.photo} alt="Student Photo" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-medium text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Photo</span>
                    </button>
                  )}
                  {viewStudent.aadhaarCard && (
                    <button type="button" onClick={() => setLightbox(viewStudent.aadhaarCard!)} className="group relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-navy transition-colors shadow-sm">
                      <img src={viewStudent.aadhaarCard} alt="Aadhaar Card" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-medium text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Aadhaar</span>
                    </button>
                  )}
                  {viewStudent.matricDmc && (
                    <button type="button" onClick={() => setLightbox(viewStudent.matricDmc!)} className="group relative w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-navy transition-colors shadow-sm">
                      <img src={viewStudent.matricDmc} alt="Matric DMC" className="w-full h-full object-cover" />
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
    </div>
  )
}

export default Students
