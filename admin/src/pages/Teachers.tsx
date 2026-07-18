import { useState, useMemo, useRef } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Users,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Calendar,
  Camera,
} from 'lucide-react'
import { mockTeachers, mockCourses } from '@/data/mockData'
import type { Teacher } from '@/data/mockData'

const AVATAR_COLORS = [
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

interface TeacherFormData {
  name: string
  email: string
  mobile: string
  qualification: string
  specialization: string
  subjects: string
  joinDate: string
  status: 'Active' | 'Inactive'
}

const emptyForm: TeacherFormData = {
  name: '',
  email: '',
  mobile: '',
  qualification: '',
  specialization: '',
  subjects: '',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'Active',
}

function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([...mockTeachers])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [addForm, setAddForm] = useState<TeacherFormData>({ ...emptyForm })
  const [editForm, setEditForm] = useState<TeacherFormData>({ ...emptyForm })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  // All available subjects (from courses)
  const allSubjects = useMemo(() => {
    const subjectSet = new Set<string>()
    mockCourses.forEach((c) => c.subjects.forEach((s) => subjectSet.add(s.name)))
    teachers.forEach((t) => t.subjects.forEach((s) => subjectSet.add(s)))
    return Array.from(subjectSet).sort()
  }, [teachers])

  // Filter teachers
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.mobile.includes(q) ||
        t.specialization.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || t.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, teachers])

  const activeCount = teachers.filter((t) => t.status === 'Active').length
  const inactiveCount = teachers.filter((t) => t.status === 'Inactive').length

  function handleAddTeacher() {
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.mobile.trim() || !addForm.qualification.trim() || !addForm.specialization.trim() || !addForm.joinDate) {
      return
    }
    const newTeacher: Teacher = {
      id: `TCH${Date.now()}`,
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      mobile: addForm.mobile.trim(),
      qualification: addForm.qualification.trim(),
      specialization: addForm.specialization.trim(),
      subjects: addForm.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      status: addForm.status,
      joinDate: addForm.joinDate,
    }
    setTeachers((prev) => [...prev, newTeacher])
    setAddForm({ ...emptyForm })
    setShowAddModal(false)
  }

  function handleEditTeacher() {
    if (!selectedTeacher) return
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.mobile.trim()) return
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === selectedTeacher.id
          ? {
              ...t,
              name: editForm.name.trim(),
              email: editForm.email.trim(),
              mobile: editForm.mobile.trim(),
              qualification: editForm.qualification.trim(),
              specialization: editForm.specialization.trim(),
              subjects: editForm.subjects.split(',').map((s) => s.trim()).filter(Boolean),
              status: editForm.status,
              joinDate: editForm.joinDate,
            }
          : t
      )
    )
    setSelectedTeacher(null)
    setEditForm({ ...emptyForm })
    setShowEditModal(false)
  }

  function handleDeleteTeacher() {
    if (!selectedTeacher) return
    setTeachers((prev) => prev.filter((t) => t.id !== selectedTeacher.id))
    setSelectedTeacher(null)
    setShowDeleteModal(false)
  }

  function openEditModal(teacher: Teacher) {
    setSelectedTeacher(teacher)
    setEditForm({
      name: teacher.name,
      email: teacher.email,
      mobile: teacher.mobile,
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      subjects: teacher.subjects.join(', '),
      joinDate: teacher.joinDate,
      status: teacher.status,
    })
    setShowEditModal(true)
  }

  function openDeleteModal(teacher: Teacher) {
    setSelectedTeacher(teacher)
    setShowDeleteModal(true)
  }

  // Teacher form component (shared between add/edit)
  function renderTeacherForm(
    form: TeacherFormData,
    setForm: (fn: (prev: TeacherFormData) => TeacherFormData) => void,
    fileRef: React.RefObject<HTMLInputElement | null>,
  ) {
    return (
      <div className="space-y-5">
        {/* Row 1: Name, Email, Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">
              Teacher Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
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
              onChange={(e) => setForm((prev) => ({ ...prev, mobile: e.target.value }))}
            />
          </div>
        </div>

        {/* Row 2: Qualification, Specialization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Qualification <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., M.Tech, PhD, BCA..."
              value={form.qualification}
              onChange={(e) => setForm((prev) => ({ ...prev, qualification: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Computer Science, Accounting..."
              value={form.specialization}
              onChange={(e) => setForm((prev) => ({ ...prev, specialization: e.target.value }))}
            />
          </div>
        </div>

        {/* Row 3: Subjects */}
        <div>
          <label className="form-label">Subjects</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter subjects separated by commas (e.g., C Programming, Computer Fundamentals)"
            value={form.subjects}
            onChange={(e) => setForm((prev) => ({ ...prev, subjects: e.target.value }))}
          />
          <p className="text-xs text-text-gray mt-1.5">Separate multiple subjects with commas</p>
          {/* Quick subject suggestions */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {allSubjects.slice(0, 8).map((sub) => (
              <button
                key={sub}
                type="button"
                className="text-xs px-2 py-0.5 rounded-full border border-border-light hover:bg-navy/5 hover:border-navy/20 transition-colors text-text-gray hover:text-navy"
                onClick={() => {
                  const current = form.subjects ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean) : []
                  if (!current.includes(sub)) {
                    const newSubjects = current.length > 0 ? [...current, sub].join(', ') : sub
                    setForm((prev) => ({ ...prev, subjects: newSubjects }))
                  }
                }}
              >
                + {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Join Date, Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">
              Join Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="form-input"
              value={form.joinDate}
              onChange={(e) => setForm((prev) => ({ ...prev, joinDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as 'Active' | 'Inactive' }))}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Row 5: Photo Upload */}
        <div>
          <label className="form-label">Photo</label>
          <div
            className="border-2 border-dashed border-border-light rounded-xl p-6 text-center hover:border-navy/30 hover:bg-navy/[0.02] transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Camera className="w-8 h-8 text-text-gray/30 mx-auto mb-2" />
            <p className="text-sm text-text-gray font-medium">Click to upload photo</p>
            <p className="text-xs text-text-gray/60 mt-1">JPG, PNG up to 2MB</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={() => {/* File handling placeholder */}}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* ─── Header ─── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <Users className="w-7 h-7" />
              Teachers
              <span className="text-sm font-medium text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full ml-1">
                {teachers.length}
              </span>
            </h1>
            <p className="text-text-gray text-sm mt-1">Manage teaching staff and assignments</p>
          </div>
          <button className="btn-gold" onClick={() => { setAddForm({ ...emptyForm }); setShowAddModal(true) }}>
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy">{teachers.length}</p>
              <p className="text-xs text-text-gray font-medium">Total Teachers</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green">{activeCount}</p>
              <p className="text-xs text-text-gray font-medium">Active</p>
            </div>
          </div>
          <div className="stat-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{inactiveCount}</p>
              <p className="text-xs text-text-gray font-medium">Inactive</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Bar ─── */}
      <div className="page-card p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-gray" />
            <input
              type="text"
              placeholder="Search by name, email, mobile, specialization..."
              className="form-input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Status Filter */}
          <select
            className="form-select lg:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ─── Teacher Cards Grid ─── */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher, index) => (
            <div
              key={teacher.id}
              className="page-card p-5 hover:shadow-lg transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Top: Avatar + Name + Specialization */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`w-[60px] h-[60px] rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 ${getAvatarColor(teacher.name)}`}
                >
                  {getInitials(teacher.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-navy text-sm leading-tight truncate">{teacher.name}</h3>
                  <p className="text-xs text-text-gray mt-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {teacher.specialization}
                  </p>
                  <div className="mt-1.5">
                    {teacher.status === 'Active' ? (
                      <span className="badge-success">Active</span>
                    ) : (
                      <span className="badge-danger">Inactive</span>
                    )}
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                    title="Edit"
                    onClick={() => openEditModal(teacher)}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    title="Delete"
                    onClick={() => openDeleteModal(teacher)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Info Rows */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-text-gray">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-navy/40" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-gray">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-navy/40" />
                  <span>{teacher.mobile}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-gray">
                  <GraduationCap className="w-3.5 h-3.5 flex-shrink-0 text-navy/40" />
                  <span>{teacher.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-gray">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-navy/40" />
                  <span>Joined: {new Date(teacher.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
                </div>
              </div>

              {/* Subjects */}
              <div className="border-t border-border-light pt-3">
                <p className="text-xs font-semibold text-navy mb-2">Subjects</p>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.length > 0 ? (
                    teacher.subjects.map((sub) => (
                      <span key={sub} className="badge-info text-xs">
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-gray italic">No subjects assigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="page-card p-12 text-center">
          <Users className="w-16 h-16 text-text-gray/20 mx-auto mb-4" />
          <h3 className="font-bold text-navy text-lg mb-2">No Teachers Found</h3>
          <p className="text-text-gray text-sm">Try adjusting your search or filters</p>
        </div>
      )}

      {/* ─── Add Teacher Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Add Teacher</h2>
                <p className="text-sm text-text-gray">Fill in the teacher details below</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>

            <div className="p-6">
              {renderTeacherForm(addForm, setAddForm, fileInputRef)}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="btn-gold"
                onClick={handleAddTeacher}
                disabled={!addForm.name.trim() || !addForm.email.trim() || !addForm.mobile.trim() || !addForm.qualification.trim() || !addForm.specialization.trim() || !addForm.joinDate}
              >
                <Plus className="w-4 h-4" />
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Teacher Modal ─── */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Edit Teacher</h2>
                <p className="text-sm text-text-gray">Update teacher details</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => { setShowEditModal(false); setSelectedTeacher(null) }}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>

            <div className="p-6">
              {renderTeacherForm(editForm, setEditForm, editFileInputRef)}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => { setShowEditModal(false); setSelectedTeacher(null) }}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleEditTeacher}
                disabled={!editForm.name.trim() || !editForm.email.trim() || !editForm.mobile.trim()}
              >
                <Pencil className="w-4 h-4" />
                Update Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {showDeleteModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Delete Teacher</h3>
                <p className="text-sm text-text-gray">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-text-gray mb-2">
              Are you sure you want to delete <strong className="text-navy">"{selectedTeacher.name}"</strong>?
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-amber-800 font-medium">
                ⚠️ This teacher handles {selectedTeacher.subjects.length} subject{selectedTeacher.subjects.length !== 1 ? 's' : ''}: {selectedTeacher.subjects.join(', ') || 'None'}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button className="btn-outline" onClick={() => { setShowDeleteModal(false); setSelectedTeacher(null) }}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteTeacher}>
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

export default Teachers
