import { useState, useMemo, useCallback } from 'react'
import {
  Image as ImageIcon,
  Video,
  Upload,
  Play,
  Pencil,
  Trash2,
  X,
  FolderOpen,
  Plus,
  CheckCircle,
} from 'lucide-react'
import { mockGallery, galleryAlbums } from '@/data/mockData'
import type { GalleryItem } from '@/data/mockData'

// ─── Types ─────────────────────────────────────────────────
type FilterTab = 'All' | 'Images' | 'Videos'

interface UploadFormData {
  type: 'image' | 'video'
  title: string
  album: string
  newAlbum: string
}

interface EditFormData {
  title: string
  album: string
  type: 'image' | 'video'
}

const initialUploadForm: UploadFormData = {
  type: 'image',
  title: '',
  album: galleryAlbums[0],
  newAlbum: '',
}

// ─── Album Card Component ──────────────────────────────────
function AlbumCard({
  album,
  count,
  isSelected,
  onClick,
}: {
  album: string
  count: number
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 min-w-[160px] p-4 rounded-xl border-2 transition-all duration-300 text-left ${
        isSelected
          ? 'border-gold bg-gold/5 shadow-md'
          : 'border-border-light bg-white hover:border-navy-light/30 hover:shadow-sm'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${
          isSelected ? 'bg-gold/20' : 'bg-navy/5'
        }`}
      >
        <FolderOpen
          className={`w-6 h-6 ${isSelected ? 'text-gold' : 'text-navy-light'}`}
        />
      </div>
      <p className="font-semibold text-navy text-sm truncate">{album}</p>
      <p className="text-xs text-text-gray mt-0.5">
        {count} {count === 1 ? 'item' : 'items'}
      </p>
    </button>
  )
}

// ─── Gallery Grid Item Component ───────────────────────────
function GalleryGridItem({
  item,
  onEdit,
  onDelete,
}: {
  item: GalleryItem
  onEdit: () => void
  onDelete: () => void
}) {
  const isVideo = item.type === 'video'

  return (
    <div className="page-card group relative overflow-hidden animate-fade-in">
      {/* Media Preview */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {isVideo ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #144272 0%, #0A2647 60%, #050e1f 100%)',
            }}
          >
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #0A2647 0%, #144272 50%, #1a5a9e 100%)',
            }}
          >
            <ImageIcon className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Type Badge */}
        {isVideo && (
          <span className="absolute top-3 left-3 badge-info flex items-center gap-1">
            <Video className="w-3 h-3" />
            Video
          </span>
        )}

        {/* Album Badge */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-navy text-xs font-semibold px-2.5 py-1 rounded-full">
          {item.album}
        </span>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
          <h4 className="text-white font-semibold text-sm truncate">{item.title}</h4>
          <p className="text-white/70 text-xs mt-0.5">
            {new Date(item.uploadedDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-gold hover:text-navy transition-all duration-200"
            aria-label="Edit item"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all duration-200"
            aria-label="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Upload Modal Component ────────────────────────────────
function UploadModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UploadFormData) => void
}) {
  const [form, setForm] = useState<UploadFormData>(initialUploadForm)
  const [useNewAlbum, setUseNewAlbum] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalAlbum = useNewAlbum && form.newAlbum.trim() ? form.newAlbum.trim() : form.album
    onSubmit({ ...form, album: finalAlbum })
    setForm(initialUploadForm)
    setUseNewAlbum(false)
    setFileName('')
    onClose()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      setFileName(e.dataTransfer.files[0].name)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <h3 className="font-bold text-navy text-lg">Upload Media</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-light-gray flex items-center justify-center text-text-gray hover:text-navy transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="form-label">Media Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: 'image' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  form.type === 'image'
                    ? 'bg-navy text-white shadow-md'
                    : 'bg-light-gray text-text-gray hover:bg-gray-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Image
              </button>
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: 'video' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  form.type === 'video'
                    ? 'bg-navy text-white shadow-md'
                    : 'bg-light-gray text-text-gray hover:bg-gray-200'
                }`}
              >
                <Video className="w-4 h-4" />
                Video
              </button>
            </div>
          </div>

          {/* File Drop Zone */}
          <div>
            <label className="form-label">File</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragging
                  ? 'border-gold bg-gold/5'
                  : 'border-gray-300 hover:border-navy-light/40 bg-light-gray/50'
              }`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept={form.type === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileSelect}
              />
              <Upload
                className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-gold' : 'text-text-gray'}`}
              />
              {fileName ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green" />
                  <p className="text-sm font-medium text-navy">{fileName}</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-navy">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-text-gray mt-1">
                    {form.type === 'image'
                      ? 'Supports JPG, PNG, GIF'
                      : 'Supports MP4, AVI, MOV'}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter media title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          {/* Album */}
          <div>
            <label className="form-label">Album</label>
            {!useNewAlbum ? (
              <div className="space-y-2">
                <select
                  className="form-select"
                  value={form.album}
                  onChange={(e) => setForm((p) => ({ ...p, album: e.target.value }))}
                >
                  {galleryAlbums.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUseNewAlbum(true)}
                  className="text-xs font-semibold text-gold hover:text-navy transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add to new album
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  className="form-input"
                  placeholder="New album name"
                  value={form.newAlbum}
                  onChange={(e) => setForm((p) => ({ ...p, newAlbum: e.target.value }))}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setUseNewAlbum(false)}
                  className="text-xs font-semibold text-text-gray hover:text-navy transition-colors"
                >
                  Choose existing album instead
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-gold">
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Edit Modal Component ──────────────────────────────────
function EditModal({
  isOpen,
  onClose,
  item,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  item: GalleryItem | null
  onSubmit: (data: EditFormData) => void
}) {
  const [form, setForm] = useState<EditFormData>({
    title: '',
    album: galleryAlbums[0],
    type: 'image',
  })

  // Update form when item changes
  useState(() => {
    if (item) {
      setForm({ title: item.title, album: item.album, type: item.type })
    }
  })

  if (!isOpen || !item) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <h3 className="font-bold text-navy text-lg">Edit Media</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-light-gray flex items-center justify-center text-text-gray hover:text-navy transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Title */}
          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          {/* Album */}
          <div>
            <label className="form-label">Album</label>
            <select
              className="form-select"
              value={form.album}
              onChange={(e) => setForm((p) => ({ ...p, album: e.target.value }))}
            >
              {galleryAlbums.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Type (read-only) */}
          <div>
            <label className="form-label">Type</label>
            <div className="flex items-center gap-2 py-2.5 px-3.5 bg-light-gray rounded-lg">
              {form.type === 'image' ? (
                <ImageIcon className="w-4 h-4 text-navy-light" />
              ) : (
                <Video className="w-4 h-4 text-navy-light" />
              )}
              <span className="text-sm font-medium text-navy capitalize">
                {form.type}
              </span>
              <span className="text-xs text-text-gray ml-auto">(read-only)</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <CheckCircle className="w-4 h-4" />
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirmation Modal ─────────────────────────────
function DeleteModal({
  isOpen,
  onClose,
  itemTitle,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  itemTitle: string
  onConfirm: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="font-bold text-navy text-lg mb-2">Delete Media</h3>
        <p className="text-sm text-text-gray mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-navy">&ldquo;{itemTitle}&rdquo;</span>? This action
          cannot be undone.
        </p>
        <div className="flex gap-3">
          <button className="btn-outline flex-1 justify-center" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-danger flex-1 justify-center"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Gallery Main Component ────────────────────────────────
function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(mockGallery)
  const [activeTab, setActiveTab] = useState<FilterTab>('All')
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null)

  // ─── Filtered items ────────────────────────────────────
  const filteredItems = useMemo(() => {
    let result = items
    if (activeTab === 'Images') result = result.filter((i) => i.type === 'image')
    if (activeTab === 'Videos') result = result.filter((i) => i.type === 'video')
    if (selectedAlbum) result = result.filter((i) => i.album === selectedAlbum)
    return result
  }, [items, activeTab, selectedAlbum])

  // ─── Album counts ──────────────────────────────────────
  const albumCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    items.forEach((item) => {
      counts[item.album] = (counts[item.album] || 0) + 1
    })
    return counts
  }, [items])

  // ─── Handlers ──────────────────────────────────────────
  const handleUpload = useCallback(
    (data: UploadFormData) => {
      const newItem: GalleryItem = {
        id: `GAL${String(items.length + 1).padStart(3, '0')}`,
        type: data.type,
        title: data.title,
        album: data.album,
        url: data.type === 'image' ? '/placeholder.jpg' : '/placeholder.mp4',
        uploadedDate: new Date().toISOString().split('T')[0],
      }
      setItems((prev) => [newItem, ...prev])
    },
    [items.length],
  )

  const handleEdit = useCallback(
    (data: EditFormData) => {
      if (!editingItem) return
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, title: data.title, album: data.album } : item,
        ),
      )
    },
    [editingItem],
  )

  const handleDelete = useCallback(() => {
    if (!deletingItem) return
    setItems((prev) => prev.filter((item) => item.id !== deletingItem.id))
    if (selectedAlbum && !items.some((i) => i.album === selectedAlbum && i.id !== deletingItem.id)) {
      setSelectedAlbum(null)
    }
  }, [deletingItem, selectedAlbum, items])

  const openEdit = useCallback((item: GalleryItem) => {
    setEditingItem(item)
    setEditModalOpen(true)
  }, [])

  const openDelete = useCallback((item: GalleryItem) => {
    setDeletingItem(item)
    setDeleteModalOpen(true)
  }, [])

  // ─── Tab counts ────────────────────────────────────────
  const tabCounts = useMemo(
    () => ({
      All: selectedAlbum ? items.filter((i) => i.album === selectedAlbum).length : items.length,
      Images: selectedAlbum
        ? items.filter((i) => i.type === 'image' && i.album === selectedAlbum).length
        : items.filter((i) => i.type === 'image').length,
      Videos: selectedAlbum
        ? items.filter((i) => i.type === 'video' && i.album === selectedAlbum).length
        : items.filter((i) => i.type === 'video').length,
    }),
    [items, selectedAlbum],
  )

  const tabs: { label: FilterTab; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'All', icon: ImageIcon },
    { label: 'Images', icon: ImageIcon },
    { label: 'Videos', icon: Video },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
            Gallery
            <span className="text-sm font-semibold text-text-gray bg-light-gray px-2.5 py-0.5 rounded-full">
              {filteredItems.length}
            </span>
          </h2>
          <p className="text-sm text-text-gray mt-1">Manage your media library</p>
        </div>
        <button className="btn-gold" onClick={() => setUploadModalOpen(true)}>
          <Upload className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* ═══ Albums Row ═══ */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {/* All Album */}
          <AlbumCard
            album="All Albums"
            count={items.length}
            isSelected={selectedAlbum === null}
            onClick={() => setSelectedAlbum(null)}
          />
          {galleryAlbums.map((album) => (
            <AlbumCard
              key={album}
              album={album}
              count={albumCounts[album] || 0}
              isSelected={selectedAlbum === album}
              onClick={() => setSelectedAlbum(selectedAlbum === album ? null : album)}
            />
          ))}
        </div>
      </div>

      {/* ═══ Filter Tabs ═══ */}
      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.label
                  ? 'bg-navy text-white shadow-md'
                  : 'bg-white text-text-gray hover:bg-light-gray border border-border-light'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.label
                    ? 'bg-white/20 text-white'
                    : 'bg-light-gray text-text-gray'
                }`}
              >
                {tabCounts[tab.label]}
              </span>
            </button>
          )
        })}
      </div>

      {/* ═══ Gallery Grid ═══ */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <GalleryGridItem
              key={item.id}
              item={item}
              onEdit={() => openEdit(item)}
              onDelete={() => openDelete(item)}
            />
          ))}
        </div>
      ) : (
        <div className="page-card p-12 text-center">
          <ImageIcon className="w-16 h-16 text-text-gray/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-navy mb-2">No media found</h3>
          <p className="text-sm text-text-gray mb-4">
            {selectedAlbum
              ? `No items in the "${selectedAlbum}" album`
              : 'Start by uploading your first media item'}
          </p>
          <button className="btn-gold" onClick={() => setUploadModalOpen(true)}>
            <Upload className="w-4 h-4" />
            Upload Media
          </button>
        </div>
      )}

      {/* ═══ Modals ═══ */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmit={handleUpload}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setEditingItem(null)
        }}
        item={editingItem}
        onSubmit={handleEdit}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeletingItem(null)
        }}
        itemTitle={deletingItem?.title || ''}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default Gallery
