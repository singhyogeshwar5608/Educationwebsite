import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Eye, Pencil, Trash2, X, Users, GraduationCap, UserCheck } from 'lucide-react'
import { mockStudents, mockCourses, getCourseDetails } from '@/data/mockData'
import type { Student } from '@/data/mockData'

const ITEMS_PER_PAGE = 10

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

function Students() {
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Add Student form state
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '' as '' | 'Male' | 'Female',
    mobile: '',
    email: '',
    address: '',
    courseId: '',
    batch: '',
    admissionDate: '',
  })

  const selectedCourseDetails = form.courseId ? getCourseDetails(form.courseId) : null

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((s) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.course.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q)

      const matchesCourse = !courseFilter || s.courseId === courseFilter
      const matchesStatus = !statusFilter || s.status === statusFilter
      const matchesGender = !genderFilter || s.gender === genderFilter

      return matchesSearch && matchesCourse && matchesStatus && matchesGender
    })
  }, [search, courseFilter, statusFilter, genderFilter])

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / ITEMS_PER_PAGE))
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const activeCount = mockStudents.filter((s) => s.status === 'Active').length
  const graduatedCount = mockStudents.filter((s) => s.status === 'Graduated').length

  function handleFormChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmitStudent() {
    if (!form.name || !form.fatherName || !form.motherName || !form.dob || !form.gender || !form.mobile || !form.courseId || !form.batch || !form.admissionDate) {
      return
    }
    // In production this would be an API call
    setShowAddModal(false)
    setForm({
      name: '',
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
    })
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
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <Users className="w-7 h-7" />
              Students
              <span className="text-sm font-medium text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full ml-1">
                {mockStudents.length}
              </span>
            </h1>
            <p className="text-text-gray text-sm mt-1">Manage all student records</p>
          </div>
          <button className="btn-gold" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{mockStudents.length}</p>
              <p className="text-xs text-text-gray font-medium">Total Students</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green">{activeCount}</p>
              <p className="text-xs text-text-gray font-medium">Active Students</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{graduatedCount}</p>
              <p className="text-xs text-text-gray font-medium">Graduated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="page-card p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
            <input
              type="text"
              placeholder="Search by name, email, course, roll no..."
              className="form-input pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          {/* Course Filter */}
          <select
            className="form-select lg:w-48"
            value={courseFilter}
            onChange={(e) => {
              setCourseFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Courses</option>
            {mockCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {/* Status Filter */}
          <select
            className="form-select lg:w-40"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
          {/* Gender Filter */}
          <select
            className="form-select lg:w-36"
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="">All Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="page-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Roll No</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-text-gray/30 mb-3" />
                      <p className="text-text-gray font-medium">No students found</p>
                      <p className="text-text-gray/60 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="group">
                    <td>
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(student.name)}`}
                      >
                        {getInitials(student.name)}
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold text-navy text-sm">{student.name}</p>
                        <p className="text-xs text-text-gray">{student.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{student.course}</span>
                    </td>
                    <td>
                      <span className="text-sm font-mono">{student.rollNo}</span>
                    </td>
                    <td>
                      <span className="text-sm">{student.mobile}</span>
                    </td>
                    <td>{getStatusBadge(student.status)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/students/${student.id}`}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          title="Delete"
                          onClick={() => setShowDeleteConfirm(student.id)}
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
        {filteredStudents.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-light">
            <p className="text-sm text-text-gray">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)} of{' '}
              {filteredStudents.length}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Delete Student</h3>
                <p className="text-sm text-text-gray">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-text-gray mb-6">
              Are you sure you want to delete this student record? All associated data will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn-outline text-sm" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn-danger text-sm" onClick={() => setShowDeleteConfirm(null)}>
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Add New Student</h2>
                <p className="text-sm text-text-gray">Fill in the student details below</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Row 1: Name, Father, Mother */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter student name"
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Father's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter father's name"
                    value={form.fatherName}
                    onChange={(e) => handleFormChange('fatherName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Mother's Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter mother's name"
                    value={form.motherName}
                    onChange={(e) => handleFormChange('motherName', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: DOB, Gender, Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.dob}
                    onChange={(e) => handleFormChange('dob', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={form.gender}
                    onChange={(e) => handleFormChange('gender', e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter mobile number"
                    value={form.mobile}
                    onChange={(e) => handleFormChange('mobile', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: Email, Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full address"
                    value={form.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 4: Course */}
              <div>
                <label className="form-label">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select"
                  value={form.courseId}
                  onChange={(e) => handleFormChange('courseId', e.target.value)}
                >
                  <option value="">Select Course</option>
                  {mockCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-populated Course Info Box */}
              {selectedCourseDetails && (
                <div className="bg-navy/5 border border-navy/10 rounded-xl p-4 animate-fade-in">
                  <h4 className="text-sm font-bold text-navy mb-3">Course Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-text-gray">Duration</p>
                      <p className="text-sm font-semibold text-navy">{selectedCourseDetails.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray">Course Fee</p>
                      <p className="text-sm font-semibold text-navy">₹{selectedCourseDetails.courseFee.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-gray">Registration Fee</p>
                      <p className="text-sm font-semibold text-navy">₹{selectedCourseDetails.registrationFee.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-text-gray mb-1.5">Subjects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCourseDetails.subjects.map((sub) => (
                        <span key={sub.id} className="badge-info text-xs">
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Row 5: Batch, Admission Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    Batch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., 2024-2025"
                    value={form.batch}
                    onChange={(e) => handleFormChange('batch', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Admission Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={form.admissionDate}
                    onChange={(e) => handleFormChange('admissionDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Auto-generated fields (display only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Registration No</label>
                  <input
                    type="text"
                    className="form-input bg-gray-50 cursor-not-allowed"
                    value="Auto-generated"
                    disabled
                  />
                </div>
                <div>
                  <label className="form-label">Roll No</label>
                  <input
                    type="text"
                    className="form-input bg-gray-50 cursor-not-allowed"
                    value="Auto-generated"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-gold" onClick={handleSubmitStudent}>
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Students
