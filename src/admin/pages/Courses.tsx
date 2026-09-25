import { useState, useMemo, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller, useController, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Search, Plus, Pencil, Trash2, BookOpen, Layers,
  X, Loader2, CheckCircle2, AlertCircle, ChevronDown, Check,
  FileText, GraduationCap, Clock, Banknote, Images, Upload, Star,
  RefreshCw, Sparkles,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { createPortal } from 'react-dom'
import type { Course } from '@/admin/services/api'
import { coursesService } from '@/services/courses.service'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Card from '@/admin/components/ui/Card'
import Panel from '@/admin/components/ui/Panel'
import Modal, { WinButton } from '@/admin/components/ui/Modal'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'

const inputCls =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-navy/15 focus:border-navy outline-none transition-shadow bg-white'

const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5'

function StatusBadge({ status }: { status: Course['status'] }) {
  if (status === 'Active') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      Inactive
    </span>
  )
}

// ─── Form types & schema ─────────────────────────────

interface TopicRow { topic: string; description: string }
type SubjectSyllabusMap = Record<string, TopicRow[]>
type SubjectYearMap = Record<string, number>

interface CourseFormValues {
  name: string
  code: string
  subtitle: string
  categoryId: string
  duration: string
  courseFee: string
  registrationFee: string
  level: string
  eligibility: string
  description: string
  featured: boolean
  subjectIds: string[]
  subjectYears: SubjectYearMap
  subjectSyllabus: SubjectSyllabusMap
}

const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  subtitle: z.string().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  duration: z.string().min(1, 'Duration is required'),
  courseFee: z.string().min(1, 'Course fee is required'),
  registrationFee: z.string().min(1, 'Registration fee is required'),
  level: z.string().min(1, 'Please select a level'),
  eligibility: z.string().min(1, 'Eligibility is required'),
  description: z.string().optional(),
  featured: z.boolean().optional(),
  subjectIds: z.array(z.string()).optional(),
  subjectYears: z.record(z.string(), z.number().min(1)).optional(),
  subjectSyllabus: z.record(z.string(), z.array(z.object({ topic: z.string(), description: z.string() }))).optional(),
})

type CourseFormValues_ = z.infer<typeof courseSchema>

const defaultValues: CourseFormValues_ = {
  name: '', code: '', subtitle: '', categoryId: '', duration: '', courseFee: '', registrationFee: '',
  level: 'Beginner', eligibility: '', description: '', featured: false, subjectIds: [],
  subjectYears: {},
  subjectSyllabus: {},
}

// Number of study-years a course has, derived from its duration text (e.g.
// "3 Years" → 3, "2 Year(s)" → 2, "6 Months" → 1). Over-approximates ("2.5 Years" → 3).
function yearsFromDuration(duration: string): number {
  const match = String(duration || '').trim().match(/(\d+(?:\.\d+)?)\s*(year|yr)/i)
  if (!match) return 1
  return Math.max(1, Math.ceil(parseFloat(match[1])))
}

// ─── Course code auto-generation ─────────────────────

const CODE_STOP_WORDS = new Set(['of', 'the', 'and', 'in', 'for', 'to', 'a', 'an', 'on', 'at', 'with', '&'])
const CODE_SPECIALS = ['#', '@', '!', '$', '&']

function generateCourseCode(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ''
  const meaningful = words.filter((w) => !CODE_STOP_WORDS.has(w.toLowerCase()))
  const source = meaningful.length ? meaningful : words
  const base = source.map((w) => w[0]).join('').toUpperCase()
  const acronym = base.length >= 2 ? base : words.join('').slice(0, 4).toUpperCase()
  const special = CODE_SPECIALS[acronym.charCodeAt(0) % CODE_SPECIALS.length]
  return `${acronym}-01${special}`
}

function uniqueCourseCode(name: string, existingCodes: string[]): string {
  const base = generateCourseCode(name)
  if (!base) return ''
  const taken = existingCodes.map((c) => c.trim().toUpperCase())
  const [prefix, special] = [base.slice(0, -3), base.slice(-1)]
  let i = 1
  let candidate = base
  while (taken.includes(candidate)) {
    i++
    candidate = `${prefix}-${String(i).padStart(2, '0')}${special}`
  }
  return candidate
}

// ─── Curriculum editor — subjects with shared per-subject syllabus ─────────────

function SubjectSyllabusEditor({ control }: { control: any }) {
  const subjectIds = useController({ control, name: 'subjectIds' })
  const syllabus = useController({ control, name: 'subjectSyllabus' })
  const subjectYears = useController({ control, name: 'subjectYears' })
  const watchDuration = useWatch({ control, name: 'duration' })
  const maxYears = yearsFromDuration(watchDuration)

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<{ topic: string; description: string }>({ topic: '', description: '' })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const { data: subjects = [], isLoading } = useQuery<any[]>({
    queryKey: ['subjects'],
    queryFn: () => coursesService.subjects.list() as Promise<any[]>,
  })

  const updatePosition = () => {
    const el = triggerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({ top: r.bottom + 6, left: r.left, width: r.width })
  }

  const toggleOpen = () => {
    setOpen((o) => {
      if (!o) updatePosition()
      return !o
    })
    setSearch('')
  }

  useEffect(() => {
    if (!open) return
    updatePosition()
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    const onScrollOrResize = () => updatePosition()
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [open])

  const selectedIds: string[] = subjectIds.field.value ?? []
  const record: SubjectSyllabusMap = syllabus.field.value ?? {}
  const yearMap: SubjectYearMap = subjectYears.field.value ?? {}
  const selectedSubjects = subjects.filter((s) => selectedIds.includes(String(s.id)))
  const filtered = subjects.filter((s) => s.name.toLowerCase().includes(search.trim().toLowerCase()))

  const setSubjectYear = (id: string, year: number) => {
    subjectYears.field.onChange({ ...yearMap, [id]: Math.min(Math.max(1, year), Math.max(maxYears, 1)) })
  }

  const toggleSubject = (id: string) => {
    if (selectedIds.includes(id)) {
      subjectIds.field.onChange(selectedIds.filter((x) => x !== id))
      if (expandedId === id) setExpandedId(null)
      const next = { ...record }
      delete next[id]
      syllabus.field.onChange(next)
      const nextYears = { ...yearMap }
      delete nextYears[id]
      subjectYears.field.onChange(nextYears)
    } else {
      subjectIds.field.onChange([...selectedIds, id])
      setSubjectYear(id, yearMap[id] ?? 1)
      if (!(id in record)) {
        const subj = subjects.find((s) => String(s.id) === id)
        const prefill = (subj?.syllabusTopics || []).map((t: any) => ({ topic: t.topic, description: t.description || '' }))
        syllabus.field.onChange({ ...record, [id]: prefill })
      }
    }
  }

  const submitDraft = () => {
    const topic = draft.topic.trim()
    if (!topic || !expandedId) return
    const cur = record[expandedId] ?? []
    const nextRow: TopicRow = { topic, description: draft.description.trim() }
    let next: TopicRow[]
    if (editingIndex != null) {
      next = cur.map((r, i) => (i === editingIndex ? nextRow : r))
      setEditingIndex(null)
    } else {
      next = [...cur, nextRow]
    }
    syllabus.field.onChange({ ...record, [expandedId]: next })
    setDraft({ topic: '', description: '' })
  }

  const startEdit = (idx: number) => {
    const rows = record[expandedId ?? ''] ?? []
    const row = rows[idx]
    if (!row) return
    setDraft({ topic: row.topic, description: row.description || '' })
    setEditingIndex(idx)
    setExpandedId(expandedId)
  }

  const deleteEntry = (idx: number) => {
    if (!expandedId) return
    const cur = record[expandedId] ?? []
    const next = cur.filter((_, i) => i !== idx)
    const updated = { ...record, [expandedId]: next }
    syllabus.field.onChange(updated)
    if (editingIndex === idx) {
      setEditingIndex(null)
      setDraft({ topic: '', description: '' })
    }
  }

  const expanded = expandedId ? subjects.find((s) => String(s.id) === expandedId) : null
  const expandedRows = expandedId ? (record[expandedId] ?? []) : []

  return (
    <div className="bg-gray-50/60 rounded-xl border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-navy-light" />
            Subjects & Syllabus
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Subjects select karo aur har subject ka syllabus add/edit karo — ek subject ka syllabus sab courses mein same rahega.
          </p>
        </div>
        <span className="shrink-0 text-[11px] font-semibold bg-navy/5 text-navy px-2.5 py-1 rounded-full">
          {selectedIds.length} selected
        </span>
      </div>

      {/* Multi-select dropdown */}
      <div className="mb-3">
        <button
          ref={triggerRef}
          type="button"
          onClick={toggleOpen}
          className="w-full flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-left hover:border-navy-light/40 hover:shadow-sm transition-all"
        >
          <span className="flex items-center gap-2 text-gray-600">
            <GraduationCap className="w-4 h-4 text-navy-light" />
            {isLoading ? 'Loading subjects...' : selectedIds.length === 0 ? 'Subjects select karo...' : `${selectedIds.length} subjects selected`}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown rendered via portal so it is never clipped by the modal's scroll container */}
      {open && pos && createPortal(
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
          className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
        >
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              autoFocus
              placeholder="Search subjects... (e.g. MS)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-xs text-gray-400">{isLoading ? 'Loading subjects...' : 'No matching subjects found'}</p>
            ) : (
              filtered.map((s) => {
                const isSelected = selectedIds.includes(String(s.id))
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSubject(String(s.id))}
                    className={`w-full flex items-center gap-2 text-left px-2 py-2 text-sm rounded hover:bg-[#F0F7FF] ${isSelected ? 'bg-[#F0F7FF] text-navy font-medium' : 'text-gray-800'}`}
                  >
                    <span className={`w-4 h-4 border rounded-sm flex items-center justify-center shrink-0 ${isSelected ? 'bg-navy border-navy text-white' : 'border-gray-300'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </span>
                    <span className="flex-1 truncate">{s.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-navy-light">
                        {(record[String(s.id)] ?? []).length} topics
                      </span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Selected subject chips */}
      {selectedSubjects.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedSubjects.map((s) => {
            const id = String(s.id)
            const active = expandedId === id
            const count = (record[id] ?? []).length
            return (
              <div
                key={id}
                onClick={() => setExpandedId(active ? null : id)}
                className={`group relative flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-xl border text-sm font-medium cursor-pointer transition-all duration-200 ${
                  active
                    ? 'bg-navy text-white border-navy shadow-md shadow-navy/20 scale-[1.03]'
                    : 'bg-white text-navy border-gray-200 hover:border-navy-light/50 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-gold text-navy' : 'bg-navy/10 text-navy'}`}>
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
                <span className="max-w-[130px] truncate">{s.name}</span>
                <select
                  value={yearMap[id] ?? 1}
                  onChange={(e) => { e.stopPropagation(); setSubjectYear(id, Number(e.target.value)) }}
                  onClick={(e) => e.stopPropagation()}
                  title="Study year"
                  className={`shrink-0 cursor-pointer rounded-md border py-0.5 pl-1.5 pr-1 text-[11px] font-semibold outline-none ${
                    active ? 'bg-white/15 text-white border-white/25' : 'bg-navy/5 text-navy border-navy/15'
                  }`}
                >
                  {Array.from({ length: maxYears }, (_, i) => i + 1).map((y) => (
                    <option key={y} value={y} className="text-navy">{y} Year</option>
                  ))}
                </select>
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-navy/5 text-navy-light'}`}>
                  {count} topic{count === 1 ? '' : 's'}
                </span>
                <button
                  type="button"
                  title="Remove subject"
                  onClick={(e) => { e.stopPropagation(); toggleSubject(id) }}
                  className={`p-0.5 rounded transition-colors ${active ? 'text-white/60 hover:text-white' : 'text-gray-300 hover:text-red-500'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-gray-200 bg-white/50 text-sm text-gray-400">
          <BookOpen className="w-4 h-4 shrink-0" />
          Abhi koi subject select nahi hua — upar se subjects select karke unka syllabus bharo.
        </div>
      )}

      {/* Per-subject syllabus editor (expandable) */}
      <AnimatePresence initial={false}>
        {expanded && expandedId && (
          <motion.div
            key={expandedId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-white rounded-xl border border-navy/10 shadow-sm overflow-hidden">
              {/* Editor header */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 bg-navy text-white">
                <div className="flex items-center gap-2 min-w-0">
                  <GraduationCap className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-sm font-semibold truncate">{expanded.name} — Syllabus</span>
                </div>
                <span className="shrink-0 text-[11px] font-medium bg-white/15 px-2 py-0.5 rounded-full">
                  {expandedRows.length} topics
                </span>
              </div>

              <div className="p-4">
                {/* Add / edit form */}
                <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    type="text"
                    value={draft.topic}
                    onChange={(e) => setDraft((d) => ({ ...d, topic: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submitDraft() } }}
                    placeholder="Topic name"
                    className={inputCls}
                  />
                  <textarea
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Description (optional)"
                    rows={1}
                    className={`${inputCls} min-h-[38px] resize-y`}
                  />
                  <button
                    type="button"
                    onClick={submitDraft}
                    className="h-[38px] inline-flex items-center justify-center gap-1.5 px-4 text-sm font-semibold rounded-lg bg-gold hover:bg-[#FFD54F] text-navy shadow-sm hover:shadow transition-all"
                  >
                    {editingIndex != null ? <><Check className="w-4 h-4" /> Update</> : <><Plus className="w-4 h-4" /> Add Topic</>}
                  </button>
                </div>
                {editingIndex != null && (
                  <button
                    type="button"
                    onClick={() => { setEditingIndex(null); setDraft({ topic: '', description: '' }) }}
                    className="mt-2 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Edit cancel karein
                  </button>
                )}

                {/* Entries list / empty state */}
                {expandedRows.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {expandedRows.map((row, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                          editingIndex === idx ? 'border-gold bg-amber-50' : 'border-gray-100 bg-gray-50/70 hover:border-gray-200'
                        }`}
                      >
                        <span className="w-6 h-6 bg-navy/10 text-navy rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-dark">{row.topic}</p>
                          {row.description && <p className="text-xs text-text-gray mt-0.5 leading-relaxed">{row.description}</p>}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEdit(idx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-navy hover:bg-navy/5 transition-colors"
                            title="Edit topic"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEntry(idx)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete topic"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4 p-6 rounded-lg border border-dashed border-gray-200 text-center">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-text-gray">No topics added yet. Add your first topic.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Course Gallery editor (existing + new uploads) ─────────────

interface GalleryEditorProps {
  existing: any[]
  deletedIds: number[]
  files: File[]
  captions: string[]
  onDeleteExisting: (id: number) => void
  onAddFiles: (files: File[]) => void
  onRemoveFile: (index: number) => void
  onCaptionChange: (index: number, value: string) => void
}

const MAX_GALLERY = 5

function GalleryEditor({
  existing, deletedIds, files, captions,
  onDeleteExisting, onAddFiles, onRemoveFile, onCaptionChange,
}: GalleryEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const totalCount = existing.filter((e) => !deletedIds.includes(Number(e.id))).length + files.length
  const remaining = MAX_GALLERY - totalCount

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'))
    if (selected.length) onAddFiles(selected.slice(0, remaining))
    e.target.value = ''
  }

  return (
    <div className="bg-gray-50/60 rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Images className="w-4 h-4 text-navy-light" />
            Course Gallery
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Course ke classroom/campus ki photos — max {MAX_GALLERY} images allowed.
          </p>
        </div>
        <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${totalCount === MAX_GALLERY ? 'bg-red-50 text-red-500' : 'bg-navy/5 text-navy'}`}>
          {totalCount} / {MAX_GALLERY} images
        </span>
      </div>

      {/* Upload button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={remaining <= 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gold hover:bg-[#FFD54F] text-navy shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" /> Add Images {remaining > 0 ? `(${remaining} remaining)` : ''}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={handleFiles}
        />
      </div>
      {remaining <= 0 && (
        <p className="text-xs text-red-500 mt-2">Maximum {MAX_GALLERY} images allowed</p>
      )}

      {/* Image grid */}
      {totalCount > 0 ? (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {existing.map((img) => {
            if (deletedIds.includes(Number(img.id))) return null
            return (
              <div key={img.id} className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <img src={img.image_url} alt={img.caption || 'Course image'} className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => onDeleteExisting(Number(img.id))}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {img.caption && <p className="px-2 py-1 text-[11px] text-gray-500 truncate border-t border-gray-100">{img.caption}</p>}
              </div>
            )
          })}

          {files.map((file, i) => (
            <div key={`new-${i}`} className="relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-24 object-cover" />
              <button
                type="button"
                onClick={() => onRemoveFile(i)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <input
                value={captions[i] ?? ''}
                onChange={(e) => onCaptionChange(i, e.target.value)}
                placeholder="Caption (optional)"
                className="w-full px-2 py-1.5 text-[11px] border-t border-gray-100 outline-none focus:border-navy transition-colors"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 p-6 rounded-lg border border-dashed border-gray-200 text-center">
          <Images className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-text-gray">No gallery images yet. Add course photos to showcase this course.</p>
        </div>
      )}
    </div>
  )
}

// ─── Main component ─────────────────────────────

type FormTab = 'basic' | 'curriculum' | 'gallery'

function Courses() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [tab, setTab] = useState<FormTab>('basic')
  const [galleryExisting, setGalleryExisting] = useState<any[]>([])
  const [galleryDeletedIds, setGalleryDeletedIds] = useState<number[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryCaptions, setGalleryCaptions] = useState<string[]>([])

  const queryClient = useQueryClient()
  const { toast } = useToast()
  const codeEdited = useRef(false)

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CourseFormValues_>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  })

  const { data: courses = [], isLoading, isError, refetch } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: () => coursesService.list() as Promise<Course[]>,
  })

  const existingCodes = useMemo(() => courses.map((c) => c.code), [courses])

  const categoriesQuery = useQuery<any[]>({
    queryKey: ['course-categories'],
    queryFn: () => coursesService.categories.list() as Promise<any[]>,
  })
  const categories = categoriesQuery.data ?? []

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = search.toLowerCase()
      return (!q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) &&
        (!categoryFilter || c.category === categoryFilter) && (!statusFilter || c.status === statusFilter)
    })
  }, [courses, search, categoryFilter, statusFilter])

  const ITEMS_PER_PAGE = 8
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / ITEMS_PER_PAGE))
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const activeCourses = courses.filter((c) => c.status === 'Active').length
  const inactiveCourses = courses.filter((c) => c.status === 'Inactive').length
  const totalSubjectCount = courses.reduce((sum, c) => sum + c.subjects.length, 0)

  function getErrorMessage(err: any, fallback: string): string {
    const data = err?.response?.data
    if (data?.errors) {
      const messages = Object.values(data.errors).flat()
      return (messages[0] as string) || fallback
    }
    return data?.message || data?.error || err?.message || fallback
  }

  function resetGalleryState() {
    setGalleryExisting([])
    setGalleryDeletedIds([])
    setGalleryFiles([])
    setGalleryCaptions([])
  }

  function openAddModal() {
    setEditingCourse(null)
    setTab('basic')
    reset(defaultValues)
    resetGalleryState()
    codeEdited.current = false
    refetch()
    setShowAddModal(true)
  }

  async function openEditModal(course: Course) {
    setEditingCourse(course)
    setTab('basic')
    setShowEditModal(true)
    setLoadingEdit(true)
    resetGalleryState()
    codeEdited.current = true
    try {
      const full = await coursesService.show(Number(course.id))
      setGalleryExisting(full.gallery || [])
      reset({
        name: course.name,
        code: course.code,
        subtitle: course.subtitle || '',
        categoryId: course.category_id != null ? String(course.category_id) : '',
        duration: course.duration || '',
        courseFee: course.courseFee != null ? String(course.courseFee) : '',
        registrationFee: course.registrationFee != null ? String(course.registrationFee) : '',
        level: course.level || 'Beginner',
        eligibility: Array.isArray(course.eligibility) ? course.eligibility[0] || '' : course.eligibility || '',
        description: course.description || '',
        featured: Boolean(course.featured),
        subjectIds: (course.subjects || []).map((s: any) => String(s.id)),
        subjectYears: (course.subjects || []).reduce((acc: SubjectYearMap, s: any) => {
          acc[String(s.id)] = Number(s.year ?? 1)
          return acc
        }, {}),
        subjectSyllabus: (full.subjects || []).reduce((acc: Record<string, TopicRow[]>, s: any) => {
          acc[String(s.id)] = (s.syllabusTopics || []).map((t: any) => ({ topic: t.topic, description: t.description || '' }))
          return acc
        }, {}),
      })
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to load course details'), 'error')
    } finally {
      setLoadingEdit(false)
    }
  }

  const onSubmit = async (values: CourseFormValues_) => {
    setSubmitting(true)
    const dup = existingCodes.some((code) =>
      code.trim().toUpperCase() === values.code.trim().toUpperCase() && (!editingCourse || editingCourse.code.trim().toUpperCase() !== values.code.trim().toUpperCase())
    )
    if (dup) {
      setSubmitting(false)
      setTab('basic')
      setValue('code', uniqueCourseCode(getValues('name'), existingCodes), { shouldValidate: true })
      toast(`Course code "${values.code}" is already taken — a unique code has been generated.`, 'error')
      return
    }

    const subjectSyllabus = Object.entries(values.subjectSyllabus || {}).reduce((acc: Record<string, TopicRow[]>, [subjectId, rows]) => {
      const cleaned = (rows || []).filter((r) => r.topic.trim()).map((r) => ({ topic: r.topic.trim(), description: r.description.trim() }))
      if (cleaned.length) acc[subjectId] = cleaned
      return acc
    }, {})

    // Gallery images require multipart/form-data (FormData) instead of JSON.
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('code', values.code)
    fd.append('subtitle', values.subtitle || '')
    fd.append('category_id', String(values.categoryId))
    fd.append('duration', values.duration)
    fd.append('courseFee', String(Number(values.courseFee) || 0))
    fd.append('registrationFee', String(Number(values.registrationFee) || 0))
    fd.append('level', values.level || 'Beginner')
    fd.append('description', values.description || '')
    fd.append('eligibility', JSON.stringify(values.eligibility ? [values.eligibility] : []))
    fd.append('featured', values.featured ? '1' : '0')
    ;(values.subjectIds || []).forEach((id) => fd.append('subjects[]', String(id)))
    fd.append('subjectYears', JSON.stringify(values.subjectYears || {}))
    fd.append('subjectSyllabus', JSON.stringify(subjectSyllabus))
    galleryFiles.forEach((f) => fd.append('galleryFiles[]', f))
    galleryCaptions.forEach((c) => fd.append('galleryCaptions[]', c))
    galleryDeletedIds.forEach((id) => fd.append('galleryDeletedIds[]', String(id)))

    try {
      if (editingCourse) {
        await coursesService.update(Number(editingCourse.id), fd)
        toast('Course updated successfully')
      } else {
        await coursesService.create(fd)
        toast('Course added successfully')
      }
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course-categories'] })
      queryClient.invalidateQueries({ queryKey: ['course-subjects'] })
      setShowAddModal(false); setShowEditModal(false); setEditingCourse(null)
      reset(defaultValues)
      resetGalleryState()
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to save course'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const onInvalid = () => {
    setTab('basic')
    toast('Please fill in the required fields on the Basic Info tab', 'error')
  }

  async function handleDelete() {
    if (!showDeleteConfirm) return
    setDeleting(true)
    try {
      await coursesService.delete(Number(showDeleteConfirm))
      toast('Course deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['course-categories'] })
      setShowDeleteConfirm(null)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete course'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const fieldErr = (key: 'name' | 'code' | 'categoryId' | 'duration' | 'courseFee' | 'registrationFee' | 'level' | 'eligibility') =>
    errors[key]?.message as string | undefined

  const renderTabs = () => (
    <div className="px-6 pt-4">
      <div className="inline-flex items-center gap-1 bg-navy/5 rounded-xl p-1 w-full sm:w-auto">
        {([
          { id: 'basic', label: 'Basic Info', icon: BookOpen },
          { id: 'curriculum', label: 'Curriculum', icon: Layers },
        ] as { id: FormTab; label: string; icon: any }[]).map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                active ? 'bg-navy text-white shadow-md shadow-navy/25' : 'text-gray-500 hover:text-navy hover:bg-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )

  const SectionHeader = ({ icon: Icon, color, title, hint }: { icon: any; color: string; title: string; hint: string }) => (
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

  const renderBasicTab = () => (
    <div className="flex flex-col gap-5 p-6">
      {/* Course Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <SectionHeader icon={BookOpen} color="bg-navy/10 text-navy" title="Course Details" hint="Basic identification of the course" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Course Name <span className="text-red-500">*</span></label>
            <input type="text" className={inputCls} placeholder="Enter course name" {...register('name', {
              onChange: (e) => {
                if (!editingCourse && !codeEdited.current) {
                  setValue('code', uniqueCourseCode(e.target.value, existingCodes), { shouldValidate: true })
                }
              },
            })} />
            {fieldErr('name') && <p className="text-red-500 text-xs mt-1">{fieldErr('name')}</p>}
          </div>
          <div>
            <label className={labelCls}>Course Code <span className="text-red-500">*</span></label>
            <div className="relative">
              <input type="text" className={`${inputCls} pr-10`} placeholder="e.g., ADCA" {...register('code', {
                onChange: () => { codeEdited.current = true },
              })} />
              <button
                type="button"
                title="Regenerate code from course name"
                onClick={() => setValue('code', uniqueCourseCode(getValues('name'), existingCodes), { shouldValidate: true })}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-navy transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" /> Auto-generated from course name
            </p>
            {fieldErr('code') && <p className="text-red-500 text-xs mt-1">{fieldErr('code')}</p>}
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <input type="text" className={inputCls} placeholder="e.g., Advanced Diploma in Computer Applications" {...register('subtitle')} />
          </div>
          <div>
            <label className={labelCls}>Category <span className="text-red-500">*</span></label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <select className={inputCls} value={field.value} onChange={(e) => field.onChange(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories.map((c: any) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
                </select>
              )}
            />
            {fieldErr('categoryId') && <p className="text-red-500 text-xs mt-1">{fieldErr('categoryId')}</p>}
          </div>
          <div>
            <label className={labelCls}>Level <span className="text-red-500">*</span></label>
            <select className={inputCls} {...register('level')}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            {fieldErr('level') && <p className="text-red-500 text-xs mt-1">{fieldErr('level')}</p>}
          </div>
        </div>
      </div>

      {/* Duration & Fees */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <SectionHeader icon={Banknote} color="bg-gold/10 text-gold" title="Duration & Fees" hint="Course duration and fee structure" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Duration <span className="text-red-500">*</span></label>
            <input type="text" className={inputCls} placeholder="e.g., 12 Months" {...register('duration')} />
            {fieldErr('duration') && <p className="text-red-500 text-xs mt-1">{fieldErr('duration')}</p>}
          </div>
          <div>
            <label className={labelCls}>Course Fee (₹) <span className="text-red-500">*</span></label>
            <input type="number" className={inputCls} placeholder="Enter course fee" {...register('courseFee')} />
            {fieldErr('courseFee') && <p className="text-red-500 text-xs mt-1">{fieldErr('courseFee')}</p>}
          </div>
          <div>
            <label className={labelCls}>Reg. Fee (₹) <span className="text-red-500">*</span></label>
            <input type="number" className={inputCls} placeholder="Enter registration fee" {...register('registrationFee')} />
            {fieldErr('registrationFee') && <p className="text-red-500 text-xs mt-1">{fieldErr('registrationFee')}</p>}
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <Controller
            control={control}
            name="featured"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${field.value ? 'bg-gold/15 text-gold' : 'bg-gray-100 text-gray-400'}`}>
                    <Star className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">Featured Course</p>
                    <p className="text-[11px] text-gray-400">Featured courses are highlighted on the website homepage.</p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(field.value)}
                  onClick={() => field.onChange(!field.value)}
                  className={`relative w-12 h-6.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40 ${
                    field.value ? 'bg-gold' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5.5 h-5.5 bg-white rounded-full shadow transition-transform duration-200 ${
                      field.value ? 'translate-x-[22px]' : ''
                    }`}
                  />
                </button>
              </div>
            )}
          />
        </div>
      </div>

      {/* Eligibility & Description */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">
        <SectionHeader icon={Clock} color="bg-green/10 text-green" title="Eligibility & Description" hint="Who can enroll and course summary" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Eligibility <span className="text-red-500">*</span></label>
            <input type="text" className={inputCls} placeholder="e.g., 10th Pass" {...register('eligibility')} />
            {fieldErr('eligibility') && <p className="text-red-500 text-xs mt-1">{fieldErr('eligibility')}</p>}
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} min-h-[80px] resize-y`} placeholder="Enter course description" {...register('description')} />
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurriculumTab = () => (
    <div className="flex flex-col gap-4 p-6">
      <SubjectSyllabusEditor control={control} />
    </div>
  )

  const renderGalleryTab = () => (
    <div className="flex flex-col gap-4 p-6">
      <GalleryEditor
        existing={galleryExisting}
        deletedIds={galleryDeletedIds}
        files={galleryFiles}
        captions={galleryCaptions}
        onDeleteExisting={(id) => {
          setGalleryDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
        }}
        onAddFiles={(newFiles) => setGalleryFiles((prev) => [...prev, ...newFiles])}
        onRemoveFile={(index) => {
          setGalleryFiles((prev) => prev.filter((_, i) => i !== index))
          setGalleryCaptions((prev) => prev.filter((_, i) => i !== index))
        }}
        onCaptionChange={(index, value) => {
          setGalleryCaptions((prev) => {
            const next = [...prev]
            next[index] = value
            return next
          })
        }}
      />
    </div>
  )
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#222222]">Courses</h1>
          <p className="text-[11px] text-gray-500">Manage course offerings and curriculum</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Course
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9] shrink-0"><BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1565C0]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{courses.length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Courses</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] shrink-0"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{activeCourses}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Active</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFEBEE] border border-[#EF9A9A] shrink-0"><AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C62828]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{inactiveCourses}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Inactive</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFF8E1] border border-[#FFE082] shrink-0"><Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F57F17]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{totalSubjectCount}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Subjects</p></div>
        </Card>
      </div>

      {/* Filters */}
      <Panel>
        <div className="flex flex-col lg:flex-row gap-2 pt-1 lg:pt-0">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search by name, code, category..." className="form-input pl-8" value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
          </div>
          <select className="form-select lg:w-48" value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1) }}>
            <option value="">All Categories</option>
            {categories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select className="form-select lg:w-36" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </Panel>

      {/* Course Table */}
      <Panel title={`Courses (${filteredCourses.length})`}>
        {isLoading ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p className="text-sm font-medium">Loading courses...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-12 text-red-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Failed to load courses</p>
            <button className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]" onClick={() => refetch()}>Retry</button>
          </div>
        ) : paginatedCourses.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400">
            <BookOpen className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">No courses found</p>
          </div>
        ) : (
          <>
            <ExcelSpreadsheet
              data={paginatedCourses}
              columns={[
                {
                  key: 'image', header: 'Image',
                  render: (c) => c.thumbnail ? (
                    <img
                      src={c.thumbnail}
                      alt={c.name}
                      className="w-11 h-11 object-cover rounded-lg border border-gray-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200">
                      <Images className="w-4 h-4 text-gray-300" />
                    </div>
                  ),
                },
                {
                  key: 'name', header: 'Course',
                  render: (c) => (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-white bg-[#0078D7] px-1.5 py-0.5 rounded">{c.code}</span>
                      <span className="text-[12px] font-semibold text-gray-900">{c.name}</span>
                    </div>
                  ),
                },
                { key: 'category', header: 'Category', render: (c) => <span className="text-gray-700">{c.category}</span> },
                { key: 'duration', header: 'Duration', render: (c) => <span className="text-gray-700">{c.duration}</span> },
                { key: 'fee', header: 'Fee', render: (c) => <span className="text-gray-700">₹{c.courseFee.toLocaleString()}</span> },
                { key: 'reg', header: 'Reg.', render: (c) => <span className="text-gray-700">₹{c.registrationFee.toLocaleString()}</span> },
                { key: 'subjects', header: 'Subjects', render: (c) => <span className="text-gray-600">{c.subjects.length}</span> },
                { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
                {
                  key: 'actions', header: 'Actions', align: 'center',
                  render: (c) => (
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEditModal(c)} className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setShowDeleteConfirm(c.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ),
                },
              ]}
            />
            {filteredCourses.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-gray-500">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredCourses.length)} of {filteredCourses.length}</p>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!showDeleteConfirm}
        title="Delete Course"
        message="Are you sure you want to delete this course? All associated subjects and student enrollments will be affected."
        onCancel={() => setShowDeleteConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />

      {/* Add/Edit Modal */}
      <Modal
        open={showAddModal || showEditModal}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); setEditingCourse(null); resetGalleryState() }}
        title={showEditModal ? 'Edit Course' : 'Add New Course'}
        subtitle={showEditModal ? 'Update course details' : 'Create a new course offering'}
        size="lg"
        scroll
        accent
        footer={
          <>
            <WinButton onClick={() => { setShowAddModal(false); setShowEditModal(false); setEditingCourse(null); resetGalleryState() }}>Cancel</WinButton>
            <WinButton variant="primary" onClick={handleSubmit(onSubmit, onInvalid)} disabled={submitting || loadingEdit}>
              {submitting ? 'Saving...' : showEditModal ? <><Pencil className="w-3 h-3" /> Update Course</> : <><Plus className="w-3 h-3" /> Create Course</>}
            </WinButton>
          </>
        }
      >
        {loadingEdit ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-sm font-medium">Loading course details...</p>
          </div>
        ) : (
          <>
            {renderTabs()}
            {tab === 'basic' && renderBasicTab()}
            {tab === 'curriculum' && renderCurriculumTab()}
            {tab === 'gallery' && renderGalleryTab()}
          </>
        )}
      </Modal>
    </div>
  )
}

export default Courses
