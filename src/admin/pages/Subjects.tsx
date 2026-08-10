import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Pencil, Trash2, FileText, BookOpen, AlertCircle, Search, Loader2, CheckCircle2, Layers,
} from 'lucide-react'
import type { Course, Subject } from '@/admin/services/api'
import { coursesService } from '@/services/courses.service'
import { useToast } from '@/admin/components/Toast'
import Card from '@/admin/components/ui/Card'
import Panel from '@/admin/components/ui/Panel'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'
import Modal, { WinButton } from '@/admin/components/ui/Modal'

interface SubjectFormData { name: string; maxMarks: number; passingMarks: number }

const emptyForm: SubjectFormData = { name: '', maxMarks: 100, passingMarks: 35 }

const ITEMS_PER_PAGE = 10

function passingRatio(max: number, pass: number) {
  const r = pass / max
  return { label: r > 0.5 ? 'Strict' : r > 0.35 ? 'Standard' : 'Lenient', cls: r > 0.5 ? 'badge-danger' : r > 0.35 ? 'badge-success' : 'badge-warning' }
}

function Subjects() {
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [addForm, setAddForm] = useState<SubjectFormData>({ ...emptyForm })
  const [editForm, setEditForm] = useState<SubjectFormData>({ ...emptyForm })
  const [stagedSubjects, setStagedSubjects] = useState<{ name: string; maxMarks: number; passingMarks: number }[]>([])
  const [addFormError, setAddFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => coursesService.list() as Promise<Course[]>,
  })

  // All subjects once — each subject carries its linked courses (many-to-many).
  const { data: allSubjects = [], isLoading: allSubjectsLoading, isError: subjectsError, refetch: refetchSubjects } = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: () => coursesService.subjects.list() as Promise<Subject[]>,
  })

  const filteredSubjects = useMemo(() => {
    const q = search.toLowerCase()
    return allSubjects.filter((s) => {
      const linkedCourses = s.courses ?? []
      const matchesCourse = !courseFilter || linkedCourses.some((c) => c.id === courseFilter)
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || linkedCourses.some((c) => c.name.toLowerCase().includes(q))
      return matchesCourse && matchesSearch
    })
  }, [allSubjects, search, courseFilter])

  const totalPages = Math.max(1, Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE))
  const paginated = filteredSubjects.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const strictCount = allSubjects.filter((s) => passingRatio(s.maxMarks, s.passingMarks).label === 'Strict').length
  const coursesWithSubjects = useMemo(() => {
    const set = new Set<string>()
    allSubjects.forEach((s) => (s.courses ?? []).forEach((c) => set.add(c.id)))
    return set.size
  }, [allSubjects])

  function getErrorMessage(err: any, fallback: string): string {
    const data = err?.response?.data
    if (data?.errors) {
      const messages = Object.values(data.errors).flat()
      return (messages[0] as string) || fallback
    }
    return data?.message || data?.error || err?.message || fallback
  }

  function openAddModal() {
    setStagedSubjects([])
    setAddForm({ ...emptyForm })
    setAddFormError('')
    setSaving(false)
    setShowAddModal(true)
  }

  function closeAddModal() {
    setShowAddModal(false)
    setStagedSubjects([])
    setAddForm({ ...emptyForm })
    setAddFormError('')
    setSaving(false)
  }

  function handleAddToList() {
    const name = addForm.name.trim()
    if (!name) { setAddFormError('Subject name is required.'); return }
    if (!(addForm.maxMarks > 0)) { setAddFormError('Max marks must be greater than 0.'); return }
    if (!(addForm.passingMarks > 0) || addForm.passingMarks > addForm.maxMarks) { setAddFormError('Passing marks must be between 1 and max marks.'); return }
    setAddFormError('')
    setStagedSubjects((prev) => [...prev, { name, maxMarks: addForm.maxMarks, passingMarks: addForm.passingMarks }])
    setAddForm((f) => ({ ...f, name: '', maxMarks: 100, passingMarks: 35 }))
  }

  function handleRemoveStaged(index: number) {
    setStagedSubjects((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSaveAllSubjects() {
    if (stagedSubjects.length === 0) return
    setSaving(true)
    try {
      // Send all staged subjects in parallel; track per-subject success/failure.
      const results = await Promise.allSettled(stagedSubjects.map((s) =>
        coursesService.subjects.create({
          name: s.name,
          maxMarks: s.maxMarks,
          passingMarks: s.passingMarks,
        })
      ))

      const failed: { name: string; reason: string }[] = []
      results.forEach((res, i) => {
        if (res.status === 'rejected') {
          failed.push({ name: stagedSubjects[i].name, reason: getErrorMessage(res.reason, 'Unknown error') })
        }
      })

      if (failed.length === 0) {
        toast(`${stagedSubjects.length} subject${stagedSubjects.length > 1 ? 's' : ''} added successfully`)
        queryClient.invalidateQueries({ queryKey: ['subjects'] })
        queryClient.invalidateQueries({ queryKey: ['courses'] })
        closeAddModal()
      } else {
        // Keep only the FAILED subjects in the staged list; drop the ones that saved.
        setStagedSubjects((prev) => prev.filter((_, i) => results[i].status === 'rejected'))
        const detail = failed.map((f) => `"${f.name}" (${f.reason})`).join(', ')
        toast(`Failed to save ${failed.length} subject${failed.length > 1 ? 's' : ''}: ${detail}`, 'error')
        const savedCount = stagedSubjects.length - failed.length
        if (savedCount > 0) {
          toast(`${savedCount} subject${savedCount > 1 ? 's' : ''} saved successfully`)
          queryClient.invalidateQueries({ queryKey: ['subjects'] })
          queryClient.invalidateQueries({ queryKey: ['courses'] })
        }
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleEditSubject() {
    if (!selectedSubject || !editForm.name.trim()) return
    setSubmitting(true)
    try {
      await coursesService.subjects.update(Number(selectedSubject.id), {
        name: editForm.name.trim(),
        maxMarks: editForm.maxMarks,
        passingMarks: editForm.passingMarks,
      })
      toast('Subject updated successfully')
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setSelectedSubject(null); setEditForm({ ...emptyForm }); setShowEditModal(false)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to update subject'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteSubject() {
    if (!selectedSubject) return
    setDeletingId(selectedSubject.id)
    try {
      await coursesService.subjects.delete(Number(selectedSubject.id))
      toast('Subject deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setSelectedSubject(null); setShowDeleteModal(false)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete subject'), 'error')
    } finally {
      setDeletingId(null)
    }
  }

  function openEditModal(s: Subject) { setSelectedSubject(s); setEditForm({ name: s.name, maxMarks: s.maxMarks, passingMarks: s.passingMarks }); setShowEditModal(true) }
  function openDeleteModal(s: Subject) { setSelectedSubject(s); setShowDeleteModal(true) }

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

  function MarksFields(form: SubjectFormData, setForm: (f: SubjectFormData) => void) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Max Marks <span className="text-red-500">*</span></label>
            <input type="number" className={inputCls} value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })} min={1} />
          </div>
          <div>
            <label className={labelCls}>Passing Marks <span className="text-red-500">*</span></label>
            <input type="number" className={inputCls} value={form.passingMarks} onChange={(e) => setForm({ ...form, passingMarks: Number(e.target.value) })} min={1} max={form.maxMarks} />
          </div>
        </div>
        {form.maxMarks > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-gray-500">Passing Ratio</span>
              <span className="text-[11px] font-bold text-text-dark">{((form.passingMarks / form.maxMarks) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${(form.passingMarks / form.maxMarks) * 100}%`, background: form.passingMarks / form.maxMarks > 0.5 ? '#ef4444' : form.passingMarks / form.maxMarks > 0.35 ? '#28A745' : '#FFC107' }} />
            </div>
          </div>
        )}
      </>
    )
  }

  function closeEditModal() {
    setShowEditModal(false)
    setSelectedSubject(null)
    setEditForm({ ...emptyForm })
  }

  function renderAddModal() {
    return (
      <Modal
        open={showAddModal}
        onClose={closeAddModal}
        title="Add Subjects"
        subtitle="Create subjects to assign across courses"
        size="md"
        scroll
        accent
        footer={
          <>
            <WinButton onClick={closeAddModal}>Cancel</WinButton>
            <WinButton variant="primary" onClick={handleSaveAllSubjects} disabled={stagedSubjects.length === 0 || saving}>
              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
              {saving ? `Saving ${stagedSubjects.length} subject${stagedSubjects.length > 1 ? 's' : ''}...` : `Save All Subjects (${stagedSubjects.length})`}
            </WinButton>
          </>
        }
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2.5 text-[11px] text-navy bg-navy/5 border border-navy/10 px-3 py-2.5 rounded-lg">
            <BookOpen className="w-4 h-4 shrink-0" />
            Subjects are created independently. Assign them to courses from the Course add/edit form.
          </div>

          {/* Subject entry */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionHeader icon={FileText} color="bg-navy/10 text-navy" title="Subject Details" hint="Name and marks for the subject" />
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Subject Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="e.g., Computer Fundamentals" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} autoFocus />
              </div>
              {MarksFields(addForm, (f) => setAddForm(f))}
              {addFormError && <p className="text-red-500 text-xs">{addFormError}</p>}
              <button
                type="button"
                onClick={handleAddToList}
                className="self-start inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gold hover:bg-[#FFD54F] text-navy shadow-sm hover:shadow transition-all"
              >
                <Plus className="w-4 h-4" /> Add to List
              </button>
            </div>
          </div>

          {/* Staged list */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-navy/5 border-b border-gray-100">
              <Layers className="w-4 h-4 text-navy" />
              <span className="text-xs font-bold text-navy">Staged Subjects ({stagedSubjects.length})</span>
            </div>
            {stagedSubjects.length === 0 ? (
              <div className="p-5 text-center">
                <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-text-gray">No subjects added yet. Add your first subject.</p>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-2">
                {stagedSubjects.map((s, i) => {
                  const r = passingRatio(s.maxMarks, s.passingMarks)
                  return (
                    <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50/70">
                      <span className="w-6 h-6 bg-navy/10 text-navy rounded-md flex items-center justify-center text-[11px] font-bold shrink-0">{i + 1}</span>
                      <span className="text-[12px] font-semibold text-gray-900 flex-1 min-w-0 truncate">{s.name}</span>
                      <span className="text-[11px] text-gray-500 shrink-0">Max: {s.maxMarks}</span>
                      <span className="text-[11px] text-gray-500 shrink-0">Pass: {s.passingMarks}</span>
                      <span className={`shrink-0 ${r.cls}`}>{r.label}</span>
                      <button type="button" onClick={() => handleRemoveStaged(i)} className="p-1 text-gray-400 hover:text-red-500 rounded" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    )
  }

  function renderEditModal() {
    return (
      <Modal
        open={showEditModal}
        onClose={closeEditModal}
        title="Edit Subject"
        subtitle="Update subject details"
        size="md"
        scroll
        accent
        footer={
          <>
            <WinButton onClick={closeEditModal}>Cancel</WinButton>
            <WinButton variant="primary" onClick={handleEditSubject} disabled={!editForm.name.trim() || submitting}>
              {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pencil className="w-3 h-3" />}
              Update Subject
            </WinButton>
          </>
        }
      >
        <div className="flex flex-col gap-4 p-6">
          {selectedSubject && (selectedSubject.courses ?? []).length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={BookOpen} color="bg-green/10 text-green" title="Assigned To Courses" hint="Courses can be managed from the Course form." />
              <div className="flex flex-wrap gap-1.5">
                {(selectedSubject.courses ?? []).map((c) => <span key={c.id} className="badge-info">{c.name}</span>)}
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
            <SectionHeader icon={FileText} color="bg-navy/10 text-navy" title="Subject Details" hint="Name and marks for the subject" />
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Subject Name <span className="text-red-500">*</span></label>
                <input type="text" className={inputCls} placeholder="e.g., Computer Fundamentals" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} autoFocus />
              </div>
              {MarksFields(editForm, (f) => setEditForm(f))}
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#222222]">Subjects</h1>
          <p className="text-[11px] text-gray-500">Manage subjects across all courses</p>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1] flex items-center gap-1.5" onClick={openAddModal}>
          <Plus className="w-3.5 h-3.5" /> Add Subject
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9] shrink-0"><FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1565C0]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{allSubjects.length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Subjects</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] shrink-0"><BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{coursesWithSubjects}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Courses With Subjects</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFEBEE] border border-[#EF9A9A] shrink-0"><AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C62828]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{strictCount}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Strict Passing Ratio</p></div>
        </Card>
      </div>

      {/* Subjects */}
      <Panel title={`Subjects (${filteredSubjects.length})`}>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-2 mb-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search by subject or course..." className="form-input pl-8" value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
          </div>
          <select className="form-select lg:w-48" value={courseFilter}
            onChange={(e) => { setCourseFilter(e.target.value); setCurrentPage(1) }}>
            <option value="">All Courses</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {allSubjectsLoading ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p className="text-sm font-medium">Loading subjects...</p>
          </div>
        ) : subjectsError ? (
          <div className="flex flex-col items-center py-12 text-red-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Failed to load subjects</p>
            <button className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]" onClick={() => refetchSubjects()}>Retry</button>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p className="text-sm font-medium">Loading subjects...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <FileText className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">No subjects found</p>
          </div>
        ) : (
          <>
            <ExcelSpreadsheet
              data={paginated}
              columns={[
                { key: 'name', header: 'Subject Name', render: (s) => <span className="text-[12px] font-semibold text-gray-900">{s.name}</span> },
                {
                  key: 'course', header: 'Courses', render: (s) => {
                    const linked = s.courses ?? []
                    if (linked.length === 0) return <span className="text-gray-400">—</span>
                    return (
                      <div className="flex flex-wrap gap-1">
                        {linked.map((c) => <span key={c.id} className="badge-info">{c.name}</span>)}
                      </div>
                    )
                  },
                },
                { key: 'max', header: 'Max Marks', render: (s) => <span className="text-gray-600">{s.maxMarks}</span> },
                { key: 'pass', header: 'Passing', render: (s) => <span className="text-gray-600">{s.passingMarks}</span> },
                { key: 'status', header: 'Status', render: (s) => { const r = passingRatio(s.maxMarks, s.passingMarks); return <span className={r.cls}>{r.label}</span> } },
                {
                  key: 'actions', header: 'Actions', align: 'center',
                  render: (s) => (
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEditModal(s)} className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openDeleteModal(s)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ),
                },
              ]}
            />
            {filteredSubjects.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-gray-500">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)} of {filteredSubjects.length}</p>
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

      {/* Add Subjects Modal */}
      {showAddModal && renderAddModal()}

      {/* Edit Modal */}
      {showEditModal && selectedSubject && renderEditModal()}

      {/* Delete Modal */}
      {showDeleteModal && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => { setShowDeleteModal(false); setSelectedSubject(null) }}>
          <div className="bg-white border border-gray-300 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F0F0] border-b border-gray-300">
              <Trash2 className="w-4 h-4 text-red-600" /><h3 className="text-xs font-bold text-[#222222]">Delete Subject</h3>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-600 mb-1">Delete <strong>"{selectedSubject.name}"</strong>?</p>
              <p className="text-[10px] text-gray-500 mb-4">Max: {selectedSubject.maxMarks} • Pass: {selectedSubject.passingMarks}</p>
              <div className="flex justify-end gap-2">
                <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222]" onClick={() => { setShowDeleteModal(false); setSelectedSubject(null) }}>Cancel</button>
                <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#FFEBEE] text-red-600 flex items-center gap-1 disabled:opacity-60" onClick={handleDeleteSubject} disabled={deletingId === selectedSubject.id}>
                  {deletingId === selectedSubject.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />} Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Subjects
