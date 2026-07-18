import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  BookOpen,
  Upload,
  Clock,
  IndianRupee,
  Tag,
  Layers,
  Eye,
} from 'lucide-react'
import { mockCourses, courseCategories } from '@/data/mockData'
import type { Course } from '@/data/mockData'

function Courses() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  // Form state
  const emptyForm = {
    name: '',
    code: '',
    category: '',
    duration: '',
    courseFee: '',
    registrationFee: '',
    eligibility: '',
    description: '',
    status: 'Active' as 'Active' | 'Inactive',
  }
  const [form, setForm] = useState(emptyForm)

  const filteredCourses = useMemo(() => {
    return mockCourses.filter((c) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)

      const matchesCategory = !categoryFilter || c.category === categoryFilter
      const matchesStatus = !statusFilter || c.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [search, categoryFilter, statusFilter])

  function handleFormChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function openAddModal() {
    setForm(emptyForm)
    setShowAddModal(true)
  }

  function openEditModal(course: Course) {
    setEditingCourse(course)
    setForm({
      name: course.name,
      code: course.code,
      category: course.category,
      duration: course.duration,
      courseFee: String(course.courseFee),
      registrationFee: String(course.registrationFee),
      eligibility: course.eligibility,
      description: course.description,
      status: course.status,
    })
    setShowEditModal(true)
  }

  function handleSubmitAdd() {
    if (!form.name || !form.code || !form.category || !form.duration || !form.courseFee || !form.registrationFee || !form.eligibility) {
      return
    }
    setShowAddModal(false)
    setForm(emptyForm)
  }

  function handleSubmitEdit() {
    if (!form.name || !form.code || !form.category || !form.duration || !form.courseFee || !form.registrationFee || !form.eligibility) {
      return
    }
    setShowEditModal(false)
    setEditingCourse(null)
  }

  function getCourseGradient(code: string): string {
    const gradients = [
      'from-blue-600 to-indigo-700',
      'from-emerald-600 to-teal-700',
      'from-violet-600 to-purple-700',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-pink-600',
      'from-cyan-600 to-blue-700',
      'from-fuchsia-600 to-violet-700',
      'from-lime-500 to-emerald-600',
    ]
    let hash = 0
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash)
    }
    return gradients[Math.abs(hash) % gradients.length]
  }

  function getCategoryBadgeStyle(category: string): string {
    switch (category) {
      case 'Computer Applications':
        return 'bg-blue-100 text-blue-700'
      case 'Marketing':
        return 'bg-emerald-100 text-emerald-700'
      case 'Accounting':
        return 'bg-amber-100 text-amber-700'
      case 'Programming':
        return 'bg-violet-100 text-violet-700'
      case 'Design':
        return 'bg-rose-100 text-rose-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  function renderCourseForm(_isEdit: boolean) {
    return (
      <div className="p-6 space-y-5">
        {/* Row 1: Name, Code, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">
              Course Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter course name"
              value={form.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., ADCA"
              value={form.code}
              onChange={(e) => handleFormChange('code', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="form-select"
              value={form.category}
              onChange={(e) => handleFormChange('category', e.target.value)}
            >
              <option value="">Select Category</option>
              {courseCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Duration, Fees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., 12 Months"
              value={form.duration}
              onChange={(e) => handleFormChange('duration', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">
              Course Fee (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter course fee"
              value={form.courseFee}
              onChange={(e) => handleFormChange('courseFee', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">
              Registration Fee (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter registration fee"
              value={form.registrationFee}
              onChange={(e) => handleFormChange('registrationFee', e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Eligibility, Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Eligibility <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., 10th Pass"
              value={form.eligibility}
              onChange={(e) => handleFormChange('eligibility', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Description</label>
            <textarea
              className="form-input min-h-[80px] resize-y"
              placeholder="Enter course description"
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
            />
          </div>
        </div>

        {/* Row 4: Banner, Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadField label="Course Banner" />
          <FileUploadField label="Course Image" />
        </div>

        {/* Row 5: PDF, Certificate Template */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadField label="Course PDF" />
          <FileUploadField label="Certificate Template" />
        </div>

        {/* Row 6: Marksheet Template, Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadField label="Marksheet Template" />
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => handleFormChange('status', e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <BookOpen className="w-7 h-7" />
              Courses
              <span className="text-sm font-medium text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full ml-1">
                {mockCourses.length}
              </span>
            </h1>
            <p className="text-text-gray text-sm mt-1">Manage course offerings and curriculum</p>
          </div>
          <button className="btn-gold" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            Add Course
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="page-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
            <input
              type="text"
              placeholder="Search by name, code, category..."
              className="form-input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Category Filter */}
          <select
            className="form-select lg:w-52"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {courseCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {/* Status Filter */}
          <select
            className="form-select lg:w-40"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length === 0 ? (
        <div className="page-card p-12 text-center">
          <BookOpen className="w-12 h-12 text-text-gray/30 mx-auto mb-3" />
          <p className="text-text-gray font-medium">No courses found</p>
          <p className="text-text-gray/60 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="page-card overflow-hidden group hover:shadow-lg transition-all duration-300">
              {/* Banner */}
              <div
                className={`h-28 bg-gradient-to-br ${getCourseGradient(course.code)} flex items-center justify-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-2 left-4 w-20 h-20 rounded-full border-2 border-white/30" />
                  <div className="absolute bottom-0 right-2 w-16 h-16 rounded-full border border-white/20" />
                </div>
                <div className="text-center relative z-10">
                  <p className="text-white/80 text-xs font-medium tracking-wider uppercase">Course Code</p>
                  <p className="text-white text-3xl font-bold tracking-wide">{course.code}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-navy leading-tight">{course.name}</h3>
                  {course.status === 'Active' ? (
                    <span className="badge-success shrink-0 ml-2">Active</span>
                  ) : (
                    <span className="badge-danger shrink-0 ml-2">Inactive</span>
                  )}
                </div>

                <span
                  className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${getCategoryBadgeStyle(course.category)}`}
                >
                  {course.category}
                </span>

                <p className="text-sm text-text-gray line-clamp-2 mb-4 min-h-[2.5rem]">
                  {course.description}
                </p>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <Clock className="w-4 h-4 text-text-gray mx-auto mb-1" />
                    <p className="text-xs text-text-gray">Duration</p>
                    <p className="text-sm font-bold text-navy">{course.duration}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <IndianRupee className="w-4 h-4 text-text-gray mx-auto mb-1" />
                    <p className="text-xs text-text-gray">Fee</p>
                    <p className="text-sm font-bold text-navy">₹{course.courseFee.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                    <Tag className="w-4 h-4 text-text-gray mx-auto mb-1" />
                    <p className="text-xs text-text-gray">Reg. Fee</p>
                    <p className="text-sm font-bold text-navy">₹{course.registrationFee.toLocaleString()}</p>
                  </div>
                </div>

                {/* Subjects Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-navy-light" />
                  <span className="text-sm font-medium text-navy">{course.subjects.length} Subjects</span>
                  <div className="flex-1 h-px bg-border-light" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border-light">
                  <Link
                    to="/subjects"
                    className="btn-outline text-xs py-1.5 flex-1 justify-center"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Subjects
                  </Link>
                  <button
                    className="p-2 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors border border-transparent hover:border-amber-200"
                    title="Edit"
                    onClick={() => openEditModal(course)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors border border-transparent hover:border-red-200"
                    title="Delete"
                    onClick={() => setShowDeleteConfirm(course.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Delete Course</h3>
                <p className="text-sm text-text-gray">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-text-gray mb-6">
              Are you sure you want to delete this course? All associated subjects and student enrollments will be affected.
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

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Add New Course</h2>
                <p className="text-sm text-text-gray">Create a new course offering</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>

            {renderCourseForm(false)}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="btn-gold" onClick={handleSubmitAdd}>
                <Plus className="w-4 h-4" />
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Edit Course</h2>
                <p className="text-sm text-text-gray">
                  Update course details for <span className="font-semibold text-navy">{editingCourse.name}</span>
                </p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingCourse(null)
                }}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>

            {renderCourseForm(true)}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button
                className="btn-outline"
                onClick={() => {
                  setShowEditModal(false)
                  setEditingCourse(null)
                }}
              >
                Cancel
              </button>
              <button className="btn-gold" onClick={handleSubmitEdit}>
                <Pencil className="w-4 h-4" />
                Update Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FileUploadField({ label }: { label: string }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="border-2 border-dashed border-gray-300 hover:border-navy/40 rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-gray-50">
        <Upload className="w-8 h-8 text-text-gray/40 mx-auto mb-2" />
        <p className="text-sm font-medium text-text-gray">Click to upload</p>
        <p className="text-xs text-text-gray/60 mt-1">PNG, JPG, PDF up to 5MB</p>
      </div>
    </div>
  )
}

export default Courses
