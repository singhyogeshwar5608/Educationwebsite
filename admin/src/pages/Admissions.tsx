import { useState, useMemo, useCallback } from 'react'
import {
  UserPlus,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Info,
  BookOpen,
  CalendarDays,
  Hash,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  AlertCircle,
} from 'lucide-react'
import {
  mockAdmissions,
  mockCourses,
  getCourseDetails,
} from '@/data/mockData'
import type { AdmissionRequest, Course } from '@/data/mockData'

// ─── Status badge helper ───────────────────────────────────
function AdmissionStatusBadge({ status }: { status: AdmissionRequest['status'] }) {
  if (status === 'Pending') return <span className="badge-warning">Pending</span>
  if (status === 'Approved') return <span className="badge-success">Approved</span>
  return <span className="badge-danger">Rejected</span>
}

// ─── Form data type ────────────────────────────────────────
interface ManualFormData {
  studentName: string
  fatherName: string
  motherName: string
  dob: string
  gender: string
  mobile: string
  email: string
  address: string
  courseId: string
  batch: string
  admissionDate: string
}

const initialFormData: ManualFormData = {
  studentName: '',
  fatherName: '',
  motherName: '',
  dob: '',
  gender: '',
  mobile: '',
  email: '',
  address: '',
  courseId: '',
  batch: '',
  admissionDate: '',
}

// ─── Admissions Component ──────────────────────────────────
function Admissions() {
  const [activeTab, setActiveTab] = useState<'online' | 'manual'>('online')
  const [searchTerm, setSearchTerm] = useState('')
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>(mockAdmissions)
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<ManualFormData>(initialFormData)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Filtered admissions for search
  const filteredAdmissions = useMemo(() => {
    if (!searchTerm.trim()) return admissions
    const lower = searchTerm.toLowerCase()
    return admissions.filter(
      (a) =>
        a.studentName.toLowerCase().includes(lower) ||
        a.email.toLowerCase().includes(lower) ||
        a.mobile.includes(searchTerm) ||
        a.course.toLowerCase().includes(lower),
    )
  }, [admissions, searchTerm])

  const pendingCount = useMemo(
    () => admissions.filter((a) => a.status === 'Pending').length,
    [admissions],
  )

  // Auto-generated registration & roll numbers
  const regNo = useMemo(() => {
    if (!selectedCourse || !formData.admissionDate) return '—'
    const year = new Date(formData.admissionDate).getFullYear()
    const seq = String(admissions.length + 1).padStart(3, '0')
    return `REG${year}${seq}`
  }, [selectedCourse, formData.admissionDate, admissions.length])

  const rollNo = useMemo(() => {
    if (!selectedCourse) return '—'
    const code = selectedCourse.code
    const seq = String(admissions.length + 1).padStart(3, '0')
    return `${code}${seq}`
  }, [selectedCourse, admissions.length])

  // Handle course selection → auto-fill info box
  const handleCourseChange = useCallback((courseId: string) => {
    const course = getCourseDetails(courseId) || null
    setSelectedCourse(course)
    setFormData((prev) => ({ ...prev, courseId }))
  }, [])

  // Handle approve / reject
  const handleStatusChange = useCallback((id: string, newStatus: 'Approved' | 'Rejected') => {
    setAdmissions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
    )
    if (selectedAdmission?.id === id) {
      setSelectedAdmission((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
  }, [selectedAdmission])

  // Open view modal
  const openView = useCallback((admission: AdmissionRequest) => {
    setSelectedAdmission(admission)
    setShowModal(true)
  }, [])

  // Close modal
  const closeModal = useCallback(() => {
    setShowModal(false)
    setSelectedAdmission(null)
  }, [])

  // Form field change
  const updateField = useCallback((field: keyof ManualFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Submit manual admission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setFormData(initialFormData)
      setSelectedCourse(null)
    }, 3000)
  }, [])

  return (
    <div className="space-y-6">
      {/* ═══ Search Bar ═══ */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
        <input
          type="text"
          placeholder="Search by name, email, mobile, or course..."
          className="form-input pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ═══ Tab Buttons ═══ */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('online')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'online'
              ? 'bg-navy text-white shadow-md'
              : 'bg-white text-text-gray border border-border-light hover:bg-light-gray'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Online Requests
          {pendingCount > 0 && (
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 rounded-full text-[10px] font-bold px-1.5 ${
                activeTab === 'online'
                  ? 'bg-gold text-navy'
                  : 'bg-orange-100 text-orange-700'
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'manual'
              ? 'bg-navy text-white shadow-md'
              : 'bg-white text-text-gray border border-border-light hover:bg-light-gray'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Manual Admission
        </button>
      </div>

      {/* ═══ Tab Content ═══ */}
      <div key={activeTab} className="animate-fade-in">
        {/* ─── Tab 1: Online Admission Requests ─── */}
        {activeTab === 'online' && (
          <div className="page-card">
            <div className="p-4 sm:p-6 border-b border-border-light">
              <h3 className="font-bold text-navy">Online Admission Requests</h3>
              <p className="text-xs text-text-gray mt-1">
                Review and manage incoming admission applications
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Course</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.map((a) => (
                    <tr key={a.id}>
                      <td className="font-medium text-navy whitespace-nowrap">
                        {a.studentName}
                      </td>
                      <td className="whitespace-nowrap text-text-gray">{a.email}</td>
                      <td className="whitespace-nowrap">{a.mobile}</td>
                      <td className="whitespace-nowrap">{a.course}</td>
                      <td className="whitespace-nowrap text-text-gray">
                        {new Date(a.appliedDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit',
                        })}
                      </td>
                      <td>
                        <AdmissionStatusBadge status={a.status} />
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openView(a)}
                            className="p-1.5 rounded-lg text-text-gray hover:bg-light-gray hover:text-navy transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {a.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(a.id, 'Approved')}
                                className="p-1.5 rounded-lg text-green hover:bg-green/10 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(a.id, 'Rejected')}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAdmissions.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-text-gray">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No admission requests found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Tab 2: Manual Admission ─── */}
        {activeTab === 'manual' && (
          <div className="page-card">
            <div className="p-4 sm:p-6 border-b border-border-light">
              <h3 className="font-bold text-navy">Manual Admission</h3>
              <p className="text-xs text-text-gray mt-1">
                Enroll a student directly into a course
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-4 sm:p-6">
              {/* Row 1: Student Name, Father's Name, Mother's Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="form-label">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                      type="text"
                      className="form-input pl-10"
                      placeholder="Enter student name"
                      value={formData.studentName}
                      onChange={(e) => updateField('studentName', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">
                    Father&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter father's name"
                    value={formData.fatherName}
                    onChange={(e) => updateField('fatherName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Mother&apos;s Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter mother's name"
                    value={formData.motherName}
                    onChange={(e) => updateField('motherName', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: DOB, Gender, Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="form-label">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                      type="date"
                      className="form-input pl-10"
                      value={formData.dob}
                      onChange={(e) => updateField('dob', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                      type="tel"
                      className="form-input pl-10"
                      placeholder="Enter mobile number"
                      value={formData.mobile}
                      onChange={(e) => updateField('mobile', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Email, Address */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="form-label">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                      type="email"
                      className="form-input pl-10"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-text-gray" />
                    <textarea
                      className="form-input pl-10 min-h-[42px] resize-y"
                      placeholder="Enter full address"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Course, Batch */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="form-label">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray pointer-events-none" />
                    <select
                      className="form-select pl-10"
                      value={formData.courseId}
                      onChange={(e) => handleCourseChange(e.target.value)}
                      required
                    >
                      <option value="">Select Course</option>
                      {mockCourses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2024-2025"
                    value={formData.batch}
                    onChange={(e) => updateField('batch', e.target.value)}
                    required
                  />
                </div>
                <div />
              </div>

              {/* Course Info Box (auto-filled when course selected) */}
              {selectedCourse && (
                <div className="mb-4 rounded-xl border-2 border-navy/10 bg-navy/[0.03] p-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-navy" />
                    <h4 className="font-bold text-navy text-sm">
                      Course Details: {selectedCourse.name}
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div className="bg-white rounded-lg p-2.5 border border-border-light">
                      <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold">
                        Duration
                      </p>
                      <p className="text-sm font-bold text-navy">
                        {selectedCourse.duration}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-border-light">
                      <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold">
                        Course Fee
                      </p>
                      <p className="text-sm font-bold text-navy">
                        ₹{selectedCourse.courseFee.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-border-light">
                      <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold">
                        Registration Fee
                      </p>
                      <p className="text-sm font-bold text-navy">
                        ₹{selectedCourse.registrationFee.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-2.5 border border-border-light">
                      <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold">
                        Eligibility
                      </p>
                      <p className="text-sm font-bold text-navy">
                        {selectedCourse.eligibility}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-navy mb-2">
                      Subjects to be enrolled:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.subjects.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1 bg-white border border-border-light rounded-lg px-2.5 py-1 text-xs font-medium text-navy"
                        >
                          <BookOpen className="w-3 h-3 text-gold" />
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Row 5: Admission Date, Registration No, Roll No */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="form-label">
                    Admission Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                      type="date"
                      className="form-input pl-10"
                      value={formData.admissionDate}
                      onChange={(e) => updateField('admissionDate', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Registration No</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                      type="text"
                      className="form-input pl-10 bg-light-gray cursor-not-allowed"
                      value={regNo}
                      readOnly
                    />
                  </div>
                  <p className="text-[10px] text-text-gray mt-1">Auto-generated</p>
                </div>
                <div>
                  <label className="form-label">Roll No</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
                    <input
                      type="text"
                      className="form-input pl-10 bg-light-gray cursor-not-allowed"
                      value={rollNo}
                      readOnly
                    />
                  </div>
                  <p className="text-[10px] text-text-gray mt-1">Auto-generated</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-4">
                <button type="submit" className="btn-gold py-3 px-8 text-sm rounded-xl">
                  <GraduationCap className="w-4 h-4" />
                  Enroll Student
                </button>
              </div>

              {/* Success Toast */}
              {showSuccess && (
                <div className="mt-4 flex items-center gap-3 bg-green/10 border border-green/20 rounded-xl p-4 animate-fade-in">
                  <CheckCircle className="w-5 h-5 text-green flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-navy">
                      Student Enrolled Successfully!
                    </p>
                    <p className="text-xs text-text-gray">
                      {formData.studentName} has been enrolled in{' '}
                      {selectedCourse?.name || 'the selected course'}
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* ═══ View Details Modal ═══ */}
      {showModal && selectedAdmission && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 animate-fade-in" />

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-border-light p-4 sm:p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-navy text-lg">
                  Admission Details
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg text-text-gray hover:bg-light-gray transition-colors"
                  aria-label="Close modal"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Student info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Student Name
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {selectedAdmission.studentName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Father Name
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {selectedAdmission.fatherName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Date of Birth
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {new Date(selectedAdmission.dob).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-navy break-all">
                    {selectedAdmission.email}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Mobile
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {selectedAdmission.mobile}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Applied Date
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {new Date(selectedAdmission.appliedDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Course
                  </p>
                  <p className="text-sm font-semibold text-navy">
                    {selectedAdmission.course}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                    Status
                  </p>
                  <AdmissionStatusBadge status={selectedAdmission.status} />
                </div>
              </div>

              {/* Address */}
              <div>
                <p className="text-[10px] uppercase tracking-wide text-text-gray font-semibold mb-0.5">
                  Address
                </p>
                <p className="text-sm font-semibold text-navy">
                  {selectedAdmission.address}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            {selectedAdmission.status === 'Pending' && (
              <div className="sticky bottom-0 bg-white border-t border-border-light p-4 sm:p-6 rounded-b-2xl flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    handleStatusChange(selectedAdmission.id, 'Rejected')
                    closeModal()
                  }}
                  className="btn-danger py-2.5 px-5 text-sm rounded-xl"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    handleStatusChange(selectedAdmission.id, 'Approved')
                    closeModal()
                  }}
                  className="btn-gold py-2.5 px-5 text-sm rounded-xl"
                  style={{ background: '#28A745', color: '#ffffff' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
              </div>
            )}
            {selectedAdmission.status !== 'Pending' && (
              <div className="sticky bottom-0 bg-white border-t border-border-light p-4 sm:p-6 rounded-b-2xl flex items-center justify-end">
                <button onClick={closeModal} className="btn-outline py-2.5 px-5 text-sm rounded-xl">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Admissions
