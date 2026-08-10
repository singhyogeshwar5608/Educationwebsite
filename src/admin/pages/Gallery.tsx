import { useState, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Images, Plus, Pencil, Trash2, Search, Loader2, AlertCircle, Film, Upload, X, CheckCircle2, FolderOpen,
} from 'lucide-react'
import { galleryService } from '@/services/gallery.service'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Modal, { WinButton } from '@/admin/components/ui/Modal'
import Panel from '@/admin/components/ui/Panel'
import Card from '@/admin/components/ui/Card'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'

interface GalleryItemRow {
  id: string
  type: 'image' | 'video'
  title: string | null
  album: string | null
  albumId: string | null
  url: string | null
  uploadedDate: string
}

interface AlbumRow {
  id: string
  name: string
  description: string | null
  items_count: number
}

const ITEMS_PER_PAGE = 10
const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-navy/15 focus:border-navy outline-none transition-shadow bg-white'
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

export default function Gallery() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const [search, setSearch] = useState('')
  const [albumFilter, setAlbumFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showUpload, setShowUpload] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editing, setEditing] = useState<GalleryItemRow | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload form state
  const [upFile, setUpFile] = useState<File | null>(null)
  const [upType, setUpType] = useState<'image' | 'video'>('image')
  const [upTitle, setUpTitle] = useState('')
  const [upAlbumChoice, setUpAlbumChoice] = useState('')
  const [upNewAlbum, setUpNewAlbum] = useState('')
  // Edit form state
  const [edTitle, setEdTitle] = useState('')
  const [edAlbumChoice, setEdAlbumChoice] = useState('')
  const [edNewAlbum, setEdNewAlbum] = useState('')
  const [edType, setEdType] = useState<'image' | 'video'>('image')

  const { data: items = [], isLoading, isError, refetch } = useQuery<GalleryItemRow[]>({
    queryKey: ['gallery-items'],
    queryFn: () => galleryService.list() as Promise<GalleryItemRow[]>,
  })

  const { data: albums = [] } = useQuery<AlbumRow[]>({
    queryKey: ['gallery-albums'],
    queryFn: () => galleryService.albums() as Promise<AlbumRow[]>,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((it) =>
      (!albumFilter || it.album === albumFilter) &&
      (!q || (it.title || '').toLowerCase().includes(q) || (it.album || '').toLowerCase().includes(q))
    )
  }, [items, search, albumFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  const videoCount = items.filter((i) => i.type === 'video').length
  const imageCount = items.length - videoCount

  function getErrorMessage(err: any, fallback: string): string {
    const data = err?.response?.data
    if (data?.errors) {
      const messages = Object.values(data.errors).flat()
      return (messages[0] as string) || fallback
    }
    return data?.message || data?.error || err?.message || fallback
  }

  function resetUpload() { setUpFile(null); setUpType('image'); setUpTitle(''); setUpAlbumChoice(''); setUpNewAlbum('') }
  function resetEdit() { setEditing(null); setEdTitle(''); setEdAlbumChoice(''); setEdNewAlbum(''); setEdType('image') }

  function resolveAlbum(choice: string, newName: string): string | undefined {
    if (!choice) return undefined
    if (choice === '__new__') return newName.trim() || undefined
    const album = albums.find((a) => String(a.id) === choice)
    return album?.name
  }

  async function handleUpload() {
    if (!upFile) { toast('Please select a file to upload', 'error'); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('file', upFile)
      fd.append('type', upType)
      if (upTitle.trim()) fd.append('title', upTitle.trim())
      const album = resolveAlbum(upAlbumChoice, upNewAlbum)
      if (album) fd.append('album', album)
      await galleryService.create(fd)
      toast('Gallery item uploaded successfully')
      setShowUpload(false)
      resetUpload()
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-albums'] })
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to upload'), 'error')
    } finally { setSubmitting(false) }
  }

  async function handleEdit() {
    if (!editing) return
    setSubmitting(true)
    try {
      const payload: any = { type: edType }
      if (edTitle.trim()) payload.title = edTitle.trim()
      const album = resolveAlbum(edAlbumChoice, edNewAlbum)
      if (album) payload.album = album
      await galleryService.update(Number(editing.id), payload)
      toast('Gallery item updated')
      setShowEdit(false)
      resetEdit()
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
      queryClient.invalidateQueries({ queryKey: ['gallery-albums'] })
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to update'), 'error')
    } finally { setSubmitting(false) }
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    setDeleting(true)
    try {
      await galleryService.delete(Number(deleteConfirm))
      toast('Gallery item deleted')
      setDeleteConfirm(null)
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] })
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete'), 'error')
    } finally { setDeleting(false) }
  }

  const openUpload = () => { resetUpload(); setShowUpload(true) }
  const openEdit = (item: GalleryItemRow) => {
    setEditing(item)
    setEdTitle(item.title || '')
    setEdAlbumChoice(item.albumId ? String(item.albumId) : '')
    setEdNewAlbum('')
    setEdType(item.type)
    setShowEdit(true)
  }

  const albumOptions = (value: string, onChange: (v: string) => void) => (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">No album</option>
      {albums.map((a) => <option key={a.id} value={String(a.id)}>{a.name}</option>)}
      <option value="__new__">+ Create new album...</option>
    </select>
  )

  const albumNewInput = (choice: string, value: string, onChange: (v: string) => void) => (
    choice === '__new__' && (
      <div>
        <label className={labelCls}>New Album Name</label>
        <input type="text" className={inputCls} placeholder="e.g., Campus, Events..." value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    )
  )

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#222222]">Gallery</h1>
          <p className="text-[11px] text-gray-500">Manage website gallery media</p>
        </div>
        <button onClick={openUpload} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]">
          <Plus className="w-3.5 h-3.5" /> Upload Media
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card padding="sm" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9]"><Images className="w-4 h-4 text-[#1565C0]" /></div>
          <div><p className="text-base font-bold text-[#222222]">{items.length}</p><p className="text-[11px] text-gray-500">Total Items</p></div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7]"><CheckCircle2 className="w-4 h-4 text-[#2E7D32]" /></div>
          <div><p className="text-base font-bold text-[#222222]">{imageCount}</p><p className="text-[11px] text-gray-500">Images</p></div>
        </Card>
        <Card padding="sm" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#FFF8E1] border border-[#FFE082]"><FolderOpen className="w-4 h-4 text-[#F57F17]" /></div>
          <div><p className="text-base font-bold text-[#222222]">{albums.length}</p><p className="text-[11px] text-gray-500">Albums</p></div>
        </Card>
      </div>

      {/* Items */}
      <Panel title={`Gallery Items (${filtered.length})`}>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-2 mb-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search by title or album..." className="form-input pl-8" value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
          </div>
          <select className="form-select lg:w-48" value={albumFilter}
            onChange={(e) => { setAlbumFilter(e.target.value); setCurrentPage(1) }}>
            <option value="">All Albums</option>
            {albums.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}
          </select>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p className="text-sm font-medium">Loading gallery...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-12 text-red-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Failed to load gallery</p>
            <button className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]" onClick={() => refetch()}>Retry</button>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <Images className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">No gallery items found</p>
          </div>
        ) : (
          <>
            <ExcelSpreadsheet
              data={paginated}
              columns={[
                {
                  key: 'thumb', header: 'Preview',
                  render: (it) => it.type === 'image' && it.url
                    ? <img src={it.url} className="w-12 h-9 object-cover rounded border border-gray-200" alt={it.title || 'gallery'} />
                    : <span className="inline-flex items-center justify-center w-12 h-9 bg-gray-100 rounded border border-gray-200"><Film className="w-4 h-4 text-gray-400" /></span>,
                },
                { key: 'title', header: 'Title', render: (it) => <span className="text-[12px] font-semibold text-gray-900">{it.title || '—'}</span> },
                { key: 'album', header: 'Album', render: (it) => it.album ? <span className="badge-info">{it.album}</span> : <span className="text-gray-400">—</span> },
                { key: 'type', header: 'Type', render: (it) => it.type === 'video' ? <span className="badge-warning">Video</span> : <span className="badge-success">Image</span> },
                { key: 'date', header: 'Uploaded', render: (it) => <span className="text-gray-600">{it.uploadedDate}</span> },
                {
                  key: 'actions', header: 'Actions', align: 'center',
                  render: (it) => (
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(it)} className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteConfirm(it.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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

      {/* Upload Modal */}
      <Modal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        title="Upload Media"
        subtitle="Add images or videos to the gallery"
        size="md"
        accent
        footer={
          <>
            <WinButton onClick={() => setShowUpload(false)}>Cancel</WinButton>
            <WinButton variant="primary" onClick={handleUpload} disabled={!upFile || submitting}>
              {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />} Upload
            </WinButton>
          </>
        }
      >
        <div className="flex flex-col gap-4 p-6">
          {/* File picker */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-navy/30 hover:bg-navy/5 transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              className="hidden"
              onChange={(e) => setUpFile(e.target.files?.[0] ?? null)}
            />
            {upFile ? (
              <div className="flex flex-col items-center gap-2">
                {upType === 'image' && <img src={URL.createObjectURL(upFile)} className="w-24 h-16 object-cover rounded-lg border border-gray-200" alt="preview" />}
                <p className="text-sm font-semibold text-navy">{upFile.name}</p>
                <p className="text-[11px] text-gray-400">Click to change file</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-text-gray">Click karke file select karo</p>
                <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WEBP (image) ya MP4, WEBM (video)</p>
              </>
            )}
          </div>

          {/* Type */}
          <div>
            <label className={labelCls}>Type</label>
            <div className="flex gap-2">
              {(['image', 'video'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setUpType(t)}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border transition-all capitalize ${
                    upType === t ? 'bg-navy text-white border-navy shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-navy/30'
                  }`}
                >
                  {t === 'image' ? <CheckCircle2 className="w-4 h-4" /> : <Film className="w-4 h-4" />} {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Title <span className="text-gray-400 font-normal">(optional)</span></label>
            <input type="text" className={inputCls} placeholder="e.g., Computer Lab" value={upTitle} onChange={(e) => setUpTitle(e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Album <span className="text-gray-400 font-normal">(optional)</span></label>
            {albumOptions(upAlbumChoice, setUpAlbumChoice)}
          </div>
          {albumNewInput(upAlbumChoice, upNewAlbum, setUpNewAlbum)}
        </div>
      </Modal>

      {/* Edit Modal */}
      {editing && (
        <Modal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          title="Edit Gallery Item"
          subtitle="Update item details"
          size="md"
          accent
          footer={
            <>
              <WinButton onClick={() => setShowEdit(false)}>Cancel</WinButton>
              <WinButton variant="primary" onClick={handleEdit} disabled={submitting}>
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pencil className="w-3 h-3" />} Update
              </WinButton>
            </>
          }
        >
          <div className="flex flex-col gap-4 p-6">
            <div className="flex items-center gap-3">
              {editing.type === 'image' && editing.url
                ? <img src={editing.url} className="w-16 h-12 object-cover rounded-lg border border-gray-200" alt="preview" />
                : <span className="inline-flex items-center justify-center w-16 h-12 bg-gray-100 rounded-lg border border-gray-200"><Film className="w-5 h-5 text-gray-400" /></span>}
              <div>
                <p className="text-sm font-bold text-text-dark">{editing.title || 'Untitled'}</p>
                <p className="text-[11px] text-gray-400">Uploaded: {editing.uploadedDate}</p>
              </div>
            </div>

            <div>
              <label className={labelCls}>Type</label>
              <div className="flex gap-2">
                {(['image', 'video'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEdType(t)}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border transition-all capitalize ${
                      edType === t ? 'bg-navy text-white border-navy shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-navy/30'
                    }`}
                  >
                    {t === 'image' ? <CheckCircle2 className="w-4 h-4" /> : <Film className="w-4 h-4" />} {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Title <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="text" className={inputCls} placeholder="e.g., Computer Lab" value={edTitle} onChange={(e) => setEdTitle(e.target.value)} />
            </div>

            <div>
              <label className={labelCls}>Album <span className="text-gray-400 font-normal">(optional)</span></label>
              {albumOptions(edAlbumChoice, setEdAlbumChoice)}
            </div>
            {albumNewInput(edAlbumChoice, edNewAlbum, setEdNewAlbum)}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Gallery Item"
        message="Are you sure you want to delete this gallery item?"
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
