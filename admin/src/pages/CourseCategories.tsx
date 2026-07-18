import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, X, Layers, BookOpen } from 'lucide-react'
import { mockCourses, courseCategories } from '@/data/mockData'

const CATEGORY_COLORS = [
  { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' },
  { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600' },
  { bg: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600' },
  { bg: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-600' },
  { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-600' },
  { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600' },
  { bg: 'bg-teal-500', light: 'bg-teal-50', text: 'text-teal-600' },
]

function CourseCategories() {
  const [categories, setCategories] = useState<string[]>([...courseCategories])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [addName, setAddName] = useState('')
  const [editName, setEditName] = useState('')

  // Count courses per category
  const courseCountMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const cat of categories) {
      map[cat] = mockCourses.filter((c) => c.category === cat).length
    }
    return map
  }, [categories])

  function handleAddCategory() {
    const trimmed = addName.trim()
    if (!trimmed) return
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return
    setCategories((prev) => [...prev, trimmed])
    setAddName('')
    setShowAddModal(false)
  }

  function handleEditCategory() {
    if (!selectedCategory || !editName.trim()) return
    const trimmed = editName.trim()
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase() && c !== selectedCategory)) return
    setCategories((prev) => prev.map((c) => (c === selectedCategory ? trimmed : c)))
    setEditName('')
    setSelectedCategory(null)
    setShowEditModal(false)
  }

  function handleDeleteCategory() {
    if (!selectedCategory) return
    setCategories((prev) => prev.filter((c) => c !== selectedCategory))
    setSelectedCategory(null)
    setShowDeleteModal(false)
  }

  function openEditModal(cat: string) {
    setSelectedCategory(cat)
    setEditName(cat)
    setShowEditModal(true)
  }

  function openDeleteModal(cat: string) {
    setSelectedCategory(cat)
    setShowDeleteModal(true)
  }

  return (
    <div className="animate-fade-in">
      {/* ─── Header ─── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy flex items-center gap-2">
              <Layers className="w-7 h-7" />
              Course Categories
              <span className="text-sm font-medium text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full ml-1">
                {categories.length}
              </span>
            </h1>
            <p className="text-text-gray text-sm mt-1">Organize courses by category</p>
          </div>
          <button className="btn-gold" onClick={() => { setAddName(''); setShowAddModal(true) }}>
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* ─── Categories Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, index) => {
          const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length]
          const count = courseCountMap[cat] || 0
          return (
            <div
              key={cat}
              className="page-card p-5 hover:shadow-lg transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-12 h-12 rounded-xl ${color.bg} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-navy text-sm truncate">{cat}</h3>
                    <p className="text-xs text-text-gray mt-0.5">
                      {count} {count === 1 ? 'course' : 'courses'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors"
                    title="Edit"
                    onClick={() => openEditModal(cat)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    title="Delete"
                    onClick={() => openDeleteModal(cat)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Course pills */}
              {count > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {mockCourses
                    .filter((c) => c.category === cat)
                    .map((course) => (
                      <span key={course.id} className={`${color.light} ${color.text} text-xs font-medium px-2.5 py-1 rounded-full`}>
                        {course.name}
                      </span>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-text-gray italic">No courses yet</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="page-card p-12 text-center">
          <Layers className="w-16 h-16 text-text-gray/20 mx-auto mb-4" />
          <h3 className="font-bold text-navy text-lg mb-2">No Categories</h3>
          <p className="text-text-gray text-sm mb-4">Create your first course category to organize your courses.</p>
          <button className="btn-gold" onClick={() => { setAddName(''); setShowAddModal(true) }}>
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      )}

      {/* ─── Add Category Modal ─── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Add Category</h2>
                <p className="text-sm text-text-gray">Create a new course category</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>
            <div className="p-6">
              <label className="form-label">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Programming, Design, Marketing..."
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory() }}
                autoFocus
              />
              {addName.trim() && categories.some((c) => c.toLowerCase() === addName.trim().toLowerCase()) && (
                <p className="text-xs text-red-500 mt-1.5">Category already exists</p>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                className="btn-gold"
                onClick={handleAddCategory}
                disabled={!addName.trim() || categories.some((c) => c.toLowerCase() === addName.trim().toLowerCase())}
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Edit Category Modal ─── */}
      {showEditModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <div>
                <h2 className="text-lg font-bold text-navy">Edit Category</h2>
                <p className="text-sm text-text-gray">Update category name</p>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => { setShowEditModal(false); setSelectedCategory(null) }}
              >
                <X className="w-5 h-5 text-text-gray" />
              </button>
            </div>
            <div className="p-6">
              <label className="form-label">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleEditCategory() }}
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-light bg-gray-50/50 rounded-b-2xl">
              <button className="btn-outline" onClick={() => { setShowEditModal(false); setSelectedCategory(null) }}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleEditCategory} disabled={!editName.trim()}>
                <Pencil className="w-4 h-4" />
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {showDeleteModal && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-navy">Delete Category</h3>
                <p className="text-sm text-text-gray">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-text-gray mb-2">
              Are you sure you want to delete the category <strong className="text-navy">"{selectedCategory}"</strong>?
            </p>
            {(courseCountMap[selectedCategory] || 0) > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800 font-medium">
                  ⚠️ This category has {courseCountMap[selectedCategory]} course{courseCountMap[selectedCategory] !== 1 ? 's' : ''} assigned. Deleting it may affect course organization.
                </p>
              </div>
            )}
            {(courseCountMap[selectedCategory] || 0) === 0 && <div className="mb-4" />}
            <div className="flex justify-end gap-3">
              <button className="btn-outline" onClick={() => { setShowDeleteModal(false); setSelectedCategory(null) }}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteCategory}>
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

export default CourseCategories
