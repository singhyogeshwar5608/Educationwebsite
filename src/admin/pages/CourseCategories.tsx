import { useState, useEffect, useMemo } from 'react'
import {
  Plus, Pencil, Trash2, Layers, BookOpen, Loader2, FolderOpen, GraduationCap, Sparkles, Search,
} from 'lucide-react'
import { coursesService } from '@/services/courses.service'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Card from '@/admin/components/ui/Card'
import Panel from '@/admin/components/ui/Panel'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'
import Modal, { WinButton } from '@/admin/components/ui/Modal'

interface Category {
  id: number; name: string; courses_count?: number; description?: string; sort_order?: number;
}

const ITEMS_PER_PAGE = 10

const categoryColors = [
  { bg: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-600' },
  { bg: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 text-emerald-600' },
  { bg: 'from-purple-500 to-purple-600', light: 'bg-purple-50 text-purple-600' },
  { bg: 'from-amber-500 to-amber-600', light: 'bg-amber-50 text-amber-600' },
  { bg: 'from-rose-500 to-rose-600', light: 'bg-rose-50 text-rose-600' },
  { bg: 'from-cyan-500 to-cyan-600', light: 'bg-cyan-50 text-cyan-600' },
  { bg: 'from-indigo-500 to-indigo-600', light: 'bg-indigo-50 text-indigo-600' },
  { bg: 'from-teal-500 to-teal-600', light: 'bg-teal-50 text-teal-600' },
]

function getCategoryColor(name: string) {
  let hash = 0; for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return categoryColors[Math.abs(hash) % categoryColors.length]
}

function CourseCategories() {
  const toast = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState<Category | null>(null)
  const [addName, setAddName] = useState('')
  const [addDesc, setAddDesc] = useState('')
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    setLoading(true)
    coursesService.categories.list().then(setCategories).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const totalCourses = categories.reduce((sum, c) => sum + (c.courses_count ?? 0), 0)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return categories.filter((c) => !q || c.name.toLowerCase().includes(q))
  }, [categories, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleAdd = async () => {
    const trimmed = addName.trim()
    if (!trimmed || categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) return
    setSubmitting(true)
    try {
      await coursesService.categories.create({ name: trimmed, description: addDesc.trim() })
      toast.toast('Category added successfully')
      setAddName(''); setAddDesc(''); setShowAdd(false); load()
    } catch { toast.toast('Failed to add category', 'error') }
    finally { setSubmitting(false) }
  }

  const handleEdit = async () => {
    if (!selected || !editName.trim()) return
    setSubmitting(true)
    try {
      await coursesService.categories.update(selected.id, { name: editName.trim(), description: editDesc.trim() })
      toast.toast('Category updated')
      setEditName(''); setEditDesc(''); setSelected(null); setShowEdit(false); load()
    } catch { toast.toast('Failed to update category', 'error') }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await coursesService.categories.delete(selected.id)
      toast.toast('Category deleted')
      setSelected(null); setShowDelete(false); load()
    } catch { toast.toast('Failed to delete category', 'error') }
    finally { setSubmitting(false) }
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

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#222222]">Course Categories</h1>
          <p className="text-[11px] text-gray-500">Organize courses by category</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]" onClick={() => { setAddName(''); setAddDesc(''); setShowAdd(true) }}>
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9] shrink-0"><FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1565C0]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{categories.length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Categories</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] shrink-0"><GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{totalCourses}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Courses</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#F3E5F5] border border-[#CE93D8] shrink-0"><Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7B1FA2]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{categories.filter((c) => (c.courses_count ?? 0) > 0).length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Active Categories</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFF8E1] border border-[#FFE082] shrink-0"><Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F57F17]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{categories.filter((c) => (c.courses_count ?? 0) === 0).length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Empty Categories</p></div>
        </Card>
      </div>

      {/* Categories */}
      <Panel title={`Categories (${filtered.length})`}>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Search categories..." className="form-input pl-8" value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
        </div>
        {loading ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p className="text-sm font-medium">Loading categories...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Layers className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">No categories found</p>
          </div>
        ) : (
          <>
            <ExcelSpreadsheet
              data={paginated}
              columns={[
                {
                  key: 'name', header: 'Category',
                  render: (cat) => {
                    const colors = getCategoryColor(cat.name)
                    return (
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 flex items-center justify-center rounded bg-gradient-to-r ${colors.bg} shrink-0`}>
                          <BookOpen className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-gray-900 leading-tight">{cat.name}</p>
                          {cat.description && <p className="text-[10px] text-gray-400 truncate max-w-[260px]">{cat.description}</p>}
                        </div>
                      </div>
                    )
                  },
                },
                { key: 'courses', header: 'Courses', render: (cat) => <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${getCategoryColor(cat.name).light}`}>{cat.courses_count ?? 0}</span> },
                { key: 'sort', header: 'Sort', render: (cat) => <span className="text-gray-600">{cat.sort_order ?? 0}</span> },
                {
                  key: 'actions', header: 'Actions', align: 'center',
                  render: (cat) => (
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => { setSelected(cat); setEditName(cat.name); setEditDesc(cat.description || ''); setShowEdit(true) }} className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => { setSelected(cat); setShowDelete(true) }} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ),
                },
              ]}
            />
            {filtered.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-gray-500">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
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

      {/* Add Modal */}
      {showAdd && (
        <Modal
          open={showAdd}
          onClose={() => setShowAdd(false)}
          title="Add Category"
          subtitle="Create a new course category"
          size="md"
          accent
          footer={
            <>
              <WinButton onClick={() => setShowAdd(false)}>Cancel</WinButton>
              <WinButton variant="primary" onClick={handleAdd} disabled={!addName.trim() || submitting}>
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} Add Category
              </WinButton>
            </>
          }
        >
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={FolderOpen} color="bg-navy/10 text-navy" title="Category Details" hint="Give this category a clear name" />
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Category Name <span className="text-red-500">*</span></label>
                  <input type="text" className={inputCls} placeholder="e.g., Programming, Design, Marketing..." value={addName} onChange={(e) => setAddName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }} autoFocus />
                  {addName.trim() && categories.some((c) => c.name.toLowerCase() === addName.trim().toLowerCase()) && (
                    <p className="text-xs text-red-500 mt-1.5">This category already exists</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    rows={3}
                    className={`${inputCls} resize-y`}
                    placeholder="e.g., Courses related to Programming, Design, Marketing..."
                    value={addDesc}
                    onChange={(e) => setAddDesc(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && selected && (
        <Modal
          open={showEdit}
          onClose={() => { setShowEdit(false); setSelected(null) }}
          title="Edit Category"
          subtitle="Update category details"
          size="md"
          accent
          footer={
            <>
              <WinButton onClick={() => { setShowEdit(false); setSelected(null) }}>Cancel</WinButton>
              <WinButton variant="primary" onClick={handleEdit} disabled={!editName.trim() || submitting}>
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pencil className="w-3 h-3" />} Update Category
              </WinButton>
            </>
          }
        >
          <div className="p-6">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <SectionHeader icon={FolderOpen} color="bg-navy/10 text-navy" title="Category Details" hint="Update the category details" />
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelCls}>Category Name <span className="text-red-500">*</span></label>
                  <input type="text" className={inputCls} value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleEdit() }} autoFocus />
                </div>
                <div>
                  <label className={labelCls}>Description <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea
                    rows={3}
                    className={`${inputCls} resize-y`}
                    placeholder="e.g., Courses related to Programming, Design, Marketing..."
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      <ConfirmDialog
        open={showDelete && !!selected}
        title="Delete Category"
        message={`Are you sure you want to delete "${selected?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => { setShowDelete(false); setSelected(null) }}
        loading={submitting}
      />
    </div>
  )
}

export default CourseCategories
