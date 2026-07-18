import { useState, useMemo } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Clock,
  IndianRupee,
  BookOpen,
} from 'lucide-react'
import { mockCourses } from '@/data/mockData'
import type { Subject } from '@/data/mockData'

interface SubjectFormData {
  courseId: string
  name: string
  maxMarks: number
  passingMarks: number
}

const SUBJECT_PILL_COLORS = [
  'bg-blue-50 text-blue-700 border-blue-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-rose-50 text-rose-700 border-rose-200',
  'bg-violet-50 text-violet-700 border-violet-200',
  'bg-cyan-50 text-cyan-700 border-cyan-200',
  'bg-orange-50 text-orange-700 border-orange-200',
  'bg-teal-50 text-teal-700 border-teal-200',
]

const emptyForm: SubjectFormData = {
  courseId: '',
  name: '',
  maxMarks: 100,
  passingMarks: 35,
}

function Subjects() {
  const [courseFilter, setCourseFilter] = useState('')
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    mockCourses.forEach((c) => initial.add(c.id))
    return initial
  })
  const [subjects, setSubjects] = useState<Subject[]>(() =>
    mockCourses.flatMap((c) => c.subjects)
  )

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [addForm, setAddForm] = useState<SubjectFormData>({ ...emptyForm })
  const [editForm, setEditForm] = useState<SubjectFormData>({ ...emptyForm })

  // Get subjects for a specific course
  function getSubjectsForCourse(courseId: string): Subject[] {
    return subjects.filter((s) => s.courseId === courseId)
  }

  // Total subject count
  const totalSubjects = subjects.length

  // Displayed courses based on filter
  const displayCourses = useMemo(() => {
    if (!courseFilter) return mockCourses
    return mockCourses.filter((c) => c.id === courseFilter)
  }, [courseFilter])

  function toggleCourse(courseId: string) {
    setExpandedCourses((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

  function handleAddSubject() {
    if (!addForm.courseId || !addForm.name.trim()) return
    const course = mockCourses.find((c) => c.id === addForm.courseId)
    if (!course) return
    const newSubject: Subject = {
      id: `SUB${Date.now()}`,
      name: addForm.name.trim(),
      courseId: addForm.courseId,
      courseName: course.name,
      maxMarks: addForm.maxMarks,
      passingMarks: addForm.passingMarks,
    }
    setSubjects((prev) => [...prev, newSubject])
    setAddForm({ ...emptyForm })
    setShowAddModal(false)
  }

  function handleEditSubject() {
    if (!selectedSubject || !editForm.name.trim()) return
    setSubjects((prev) =>
      prev.map((s) =>
        s.id === selectedSubject.id
          ? { ...s, name: editForm.name.trim(), maxMarks: editForm.maxMarks, passingMarks: editForm.passingMarks }
          : s
      )
    )
    setSelectedSubject(null)
    setEditForm({ ...emptyForm })
    setShowEditModal(false)
  }

  function handleDeleteSubject() {
    if (!selectedSubject) return
    setSubjects((prev) => prev.filter((s) => s.id !== selectedSubject.id))
    setSelectedSubject(null)
    setShowDeleteModal(false)
  }

  function openEditModal(subject: Subject) {
    setSelectedSubject(subject)
    setEditForm({
      courseId: subject.courseId,
      name: subject.name,
      maxMarks: subject.maxMarks,
      passingMarks: subject.passingMarks,
    })
    setShowEditModal(true)
  }

  function openDeleteModal(subject: Subject) {
    setSelectedSubject(subject)
    setShowDeleteModal(true)
  }

  return (
    <div className="animate-fade-in">
      {/* ─── Header ─── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <FileText className="w-7 h-7" />
              Subjects
              <span className="text-sm font-medium text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full ml-1">
                {totalSubjects}
              </span>
            </h1>
            <p className="text-text-gray text-sm mt-1">Manage subjects across all courses</p>
          </div>
          <button className="btn-gold" onClick={() => { setAddForm({ ...emptyForm }); setShowAddModal(true) }}>
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>

        {/* Filter bar */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <select
            className="form-select sm:w-64"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="">All Courses</option>
            {mockCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Course-Subject Flow Diagram ─── */}
      <div className="page-card p-5 mb-6">
        <h3 className="font-bold text-navy text-sm mb-4 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-gold" />
          Course → Subject Flow
        </h3>
        <div className="space-y-4">
          {displayCourses.map((course) => {
            const courseSubjects = getSubjectsForCourse(course.id)
            return (
              <div key={course.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                {/* Course Name */}
                <div
                  className="flex-shrink-0 px-4 py-2 rounded-xl text-white font-bold text-sm flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #0A2647, #144272)' }}
                >
                  <BookOpen className="w-4 h-4" />
                  {course.name}
                </div>

                {/* Arrow */}
                <div className="hidden sm:flex items-center">
                  <ArrowRight className="w-5 h-5 text-gold" />
                </div>
                <div className="sm:hidden flex items-center">
                  <ArrowRight className="w-5 h-5 text-gold rotate-90" />
                </div>

                {/* Subject Pills */}
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {courseSubjects.length > 0 ? (
                    courseSubjects.map((sub, idx) => (
                      <span
                        key={sub.id}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${SUBJECT_PILL_COLORS[idx % SUBJECT_PILL_COLORS.length]} transition-all hover:shadow-sm cursor-pointer group/pill`}
                        onClick={() => openEditModal(sub)}
                      >
                        {sub.name}
                        <Pencil className="w-2.5 h-2.5 opacity-0 group-hover/pill:opacity-60 transition-opacity" />
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-text-gray italic">No subjects</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Course-Based Subject Groups ─── */}
      <div className="space-y-4">
        {displayCourses.map((course) => {
          const courseSubjects = getSubjectsForCourse(course.id)
          const isExpanded = expandedCourses.has(course.id)

          return (
            <div key={course.id} className="page-card overflow-hidden animate-fade-in">
              {/* Course Header - Clickable to expand/collapse */}
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors text-left"
                onClick={() => toggleCourse(course.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 ${isExpanded ? 'bg-navy text-white' : 'bg-navy/10 text-navy'}`}
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-navy text-sm">{course.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-text-gray flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      <span className="text-xs text-text-gray flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {course.courseFee.toLocaleString()}
                      </span>
                      <span className="badge-info text-xs">{courseSubjects.length} subject{courseSubjects.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Subjects Table - When Expanded */}
              {isExpanded && (
                <div className="border-t border-border-light animate-fade-in">
                  {courseSubjects.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Subject Name</th>
                            <th>Max Marks</th>
                            <th>Passing Marks</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {courseSubjects.map((subject) => {
                            const ratio = subject.passingMarks / subject.maxMarks
                            const statusLabel = ratio > 0.5 ? 'Strict' : ratio > 0.35 ? 'Standard' : 'Lenient'
                            const statusClass = ratio > 0.5 ? 'badge-danger' : ratio > 0.35 ? 'badge-success' : 'badge-warning'
                            return (
                              <tr key={subject.id}>
                                <td className="font-medium text-navy">{subject.name}</td>
                                <td>{subject.maxMarks}</td>
                                <td>{subject.passingMarks}</td>
                                <td>
                                  <span className={statusClass}>{statusLabel}</span>
                                </td>
                                <td>
                                  <div className="flex items-center gap-1">
                                    <button
                                      className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                                      title="Edit"
                                      onClick={() => openEditModal(subject)}
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                      title="Delete"
                                      onClick={() => openDeleteModal(subject)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <FileText className="w-10 h-10 text-text-gray/20 mx-auto mb-2" />
                      <p className="text-sm text-text-gray">No subjects added yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state for filtered view */}
      {displayCourses.length === 0 && (
        <div className="page-card p-12 text-center">
          <FileText className="w-16 h-16 text-text-gray/20 mx-auto mb-4" />
          <h3 className="font-bold text-navy text-lg mb-2">No Courses Found</h3>
          <p className="text-text-gray text-sm">Select a different course filter or add a new course.</p>
        </div>
      )}

      {/* ─── Add Subject Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Add Subject</h2>
                <p className="text-sm text-text-gray">Add a new subject to a course</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Course Select */}
              <div>
                <label className="form-label">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select"
                  value={addForm.courseId}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, courseId: e.target.value }))}
                >
                  <option value="">Select Course</option>
                  {mockCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.duration}
                    </option>
                  ))}
                </select>
                {addForm.courseId && (
                  <div className="mt-2 bg-navy/5 border border-navy/10 rounded-lg p-3 animate-fade-in">
                    <p className="text-xs font-medium text-navy">
                      Adding to: <strong>{mockCourses.find((c) => c.id === addForm.courseId)?.name}</strong>
                    </p>
                    <p className="text-xs text-text-gray mt-0.5">
                      Current subjects: {getSubjectsForCourse(addForm.courseId).length}
                    </p>
                  </div>
                )}
              </div>

              {/* Subject Name */}
              <div>
                <label className="form-label">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Computer Fundamentals, MS Office..."
                  value={addForm.name}
                  onChange={(e) => setAddForm((prev) => ({ ...prev, name: e.target.value }))}
                  autoFocus
                />
              </div>

              {/* Marks Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    Max Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={addForm.maxMarks}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, maxMarks: Number(e.target.value) }))}
                    min={1}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Passing Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={addForm.passingMarks}
                    onChange={(e) => setAddForm((prev) => ({ ...prev, passingMarks: Number(e.target.value) }))}
                    min={1}
                    max={addForm.maxMarks}
                  />
                </div>
              </div>

              {/* Passing ratio preview */}
              {addForm.maxMarks > 0 && (
                <div className="bg-light-gray rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-gray">Passing Ratio</span>
                    <span className="text-xs font-bold text-navy">
                      {((addForm.passingMarks / addForm.maxMarks) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(addForm.passingMarks / addForm.maxMarks) * 100}%`,
                        background:
                          addForm.passingMarks / addForm.maxMarks > 0.5
                            ? '#ef4444'
                            : addForm.passingMarks / addForm.maxMarks > 0.35
                              ? '#28A745'
                              : '#FFC107',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="btn-gold"
                onClick={handleAddSubject}
                disabled={!addForm.courseId || !addForm.name.trim()}
              >
                <Plus className="w-4 h-4" />
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Subject Modal ─── */}
      {showEditModal && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8 animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Edit Subject</h2>
                <p className="text-sm text-text-gray">Update subject details</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => { setShowEditModal(false); setSelectedSubject(null) }}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Course (read-only in edit) */}
              <div>
                <label className="form-label">Course</label>
                <input
                  type="text"
                  className="form-input bg-gray-50 cursor-not-allowed"
                  value={selectedSubject.courseName}
                  disabled
                />
              </div>

              {/* Subject Name */}
              <div>
                <label className="form-label">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  autoFocus
                />
              </div>

              {/* Marks Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    Max Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.maxMarks}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, maxMarks: Number(e.target.value) }))}
                    min={1}
                  />
                </div>
                <div>
                  <label className="form-label">
                    Passing Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={editForm.passingMarks}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, passingMarks: Number(e.target.value) }))}
                    min={1}
                    max={editForm.maxMarks}
                  />
                </div>
              </div>

              {/* Passing ratio preview */}
              {editForm.maxMarks > 0 && (
                <div className="bg-light-gray rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-text-gray">Passing Ratio</span>
                    <span className="text-xs font-bold text-navy">
                      {((editForm.passingMarks / editForm.maxMarks) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(editForm.passingMarks / editForm.maxMarks) * 100}%`,
                        background:
                          editForm.passingMarks / editForm.maxMarks > 0.5
                            ? '#ef4444'
                            : editForm.passingMarks / editForm.maxMarks > 0.35
                              ? '#28A745'
                              : '#FFC107',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => { setShowEditModal(false); setSelectedSubject(null) }}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleEditSubject}
                disabled={!editForm.name.trim()}
              >
                <Pencil className="w-4 h-4" />
                Update Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {showDeleteModal && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Delete Subject</h3>
                <p className="text-sm text-text-gray">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-text-gray mb-2">
              Are you sure you want to delete the subject <strong className="text-navy">"{selectedSubject.name}"</strong>?
            </p>
            <p className="text-xs text-text-gray mb-6">
              Course: {selectedSubject.courseName} • Max: {selectedSubject.maxMarks} • Pass: {selectedSubject.passingMarks}
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn-outline" onClick={() => { setShowDeleteModal(false); setSelectedSubject(null) }}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteSubject}>
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

export default Subjects
