import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Search, Eye, Trash2, X, Loader2, AlertCircle, Mail, Phone, User, MessageSquare, Inbox, CheckCircle2,
} from 'lucide-react'
import { enquiriesService } from '@/services/enquiries.service'
import type { Enquiry } from '@/admin/services/api'
import { useToast } from '@/admin/components/Toast'
import ConfirmDialog from '@/admin/components/ConfirmDialog'
import Panel from '@/admin/components/ui/Panel'
import Card from '@/admin/components/ui/Card'
import ExcelSpreadsheet from '@/admin/components/ExcelSpreadsheet'
import type { ExcelColumn } from '@/admin/components/ExcelSpreadsheet'

const ITEMS_PER_PAGE = 10
const STATUSES = ['New', 'Read', 'Replied']

type StatusFilter = 'all' | (typeof STATUSES)[number]

function getStatusBadge(status: string) {
  switch (status) {
    case 'New': return <span className="badge-warning">New</span>
    case 'Read': return <span className="badge-info">Read</span>
    case 'Replied': return <span className="badge-success">Replied</span>
    default: return <span className="badge-info">{status}</span>
  }
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
}

const avatarColors = ['#E3F2FD', '#E8F5E9', '#F3E5F5', '#FFF8E1', '#FFEBEE', '#E0F7FA', '#E8EAF6', '#E0F2F1', '#FFF3E0', '#FCE4EC']

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function ContactEnquiries() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewEnquiry, setViewEnquiry] = useState<Enquiry | null>(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: enquiries = [], isLoading, isError, refetch } = useQuery<Enquiry[]>({
    queryKey: ['enquiries'],
    queryFn: () => enquiriesService.list() as Promise<Enquiry[]>,
  })

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return enquiries.filter((e) =>
      (statusFilter === 'all' || e.status === statusFilter) &&
      (!q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.phone || '').toLowerCase().includes(q))
    )
  }, [enquiries, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const newCount = enquiries.filter((e) => e.status === 'New').length
  const readCount = enquiries.filter((e) => e.status === 'Read').length
  const repliedCount = enquiries.filter((e) => e.status === 'Replied').length

  function getErrorMessage(err: any, fallback: string): string {
    const data = err?.response?.data
    if (data?.errors) {
      const messages = Object.values(data.errors).flat()
      return (messages[0] as string) || fallback
    }
    return data?.message || data?.error || err?.message || fallback
  }

  async function handleStatusChange(enquiry: Enquiry, status: string) {
    if (status === enquiry.status) return
    setUpdatingId(enquiry.id)
    try {
      await enquiriesService.updateStatus(Number(enquiry.id), status)
      toast(`Status updated to ${status}`)
      queryClient.invalidateQueries({ queryKey: ['enquiries'] })
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to update status'), 'error')
    } finally {
      setUpdatingId(null)
    }
  }

  function handleView(enquiry: Enquiry) {
    setViewEnquiry(enquiry)
    setViewLoading(true)
    enquiriesService.show(Number(enquiry.id))
      .then((full) => setViewEnquiry(full))
      .catch(() => {})
      .finally(() => setViewLoading(false))
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    setDeleting(true)
    try {
      await enquiriesService.delete(Number(deleteConfirm))
      toast('Enquiry deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['enquiries'] })
      setDeleteConfirm(null)
    } catch (err: any) {
      toast(getErrorMessage(err, 'Failed to delete enquiry'), 'error')
    } finally {
      setDeleting(false)
    }
  }

  const columns: ExcelColumn<Enquiry>[] = [
    {
      key: 'name', header: 'Name',
      render: (e: Enquiry) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 flex items-center justify-center border border-gray-300 text-[10px] font-bold text-[#222222]" style={{ background: getAvatarColor(e.name) }}>
            {getInitials(e.name)}
          </div>
          <div>
            <p className="text-xs font-semibold text-[#222222]">{e.name}</p>
            <p className="text-[10px] text-gray-500">{e.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (e: Enquiry) => <span className="text-xs text-gray-600">{e.phone || '—'}</span> },
    { key: 'subject', header: 'Subject', render: (e: Enquiry) => <span className="text-xs text-gray-600">{e.subject || '—'}</span> },
    {
      key: 'message', header: 'Message',
      render: (e: Enquiry) => (
        <span className="text-xs text-gray-600 block max-w-[260px] truncate">
          {e.message.length > 60 ? e.message.slice(0, 60) + '…' : e.message}
        </span>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (e: Enquiry) => (
        <div className="flex items-center gap-1.5">
          {getStatusBadge(e.status)}
          <select
            className="form-select w-24 text-[11px] !py-0.5"
            value={e.status}
            disabled={updatingId === e.id}
            title="Change status"
            onChange={(ev) => handleStatusChange(e, ev.target.value)}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      ),
    },
    { key: 'date', header: 'Submitted', render: (e: Enquiry) => <span className="text-xs text-gray-500">{e.date}</span> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (e: Enquiry) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => handleView(e)} className="p-1 text-gray-500 hover:text-[#0078D7]" title="View details"><Eye className="w-3.5 h-3.5" /></button>
          <button onClick={() => setDeleteConfirm(e.id)} className="p-1 text-gray-500 hover:text-red-600" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-[#222222]">Contact Enquiries</h1>
          <p className="text-[11px] text-gray-500">Messages received from the public contact form</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9] shrink-0"><Inbox className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1565C0]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{enquiries.length}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Total Enquiries</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#FFF8E1] border border-[#FFE082] shrink-0"><AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F57F17]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{newCount}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">New</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E3F2FD] border border-[#90CAF9] shrink-0"><MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1565C0]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{readCount}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Read</p></div>
        </Card>
        <Card padding="sm" className="flex flex-col items-center justify-center text-center gap-1 sm:flex-row sm:items-center sm:text-left sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#E8F5E9] border border-[#A5D6A7] shrink-0"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7D32]" /></div>
          <div><p className="text-sm sm:text-base font-bold text-[#222222]">{repliedCount}</p><p className="text-[9px] sm:text-[11px] text-gray-500 leading-tight">Replied</p></div>
        </Card>
      </div>

      {/* Enquiries */}
      <Panel title={`Enquiries (${filtered.length})`}>
        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-2 mb-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" placeholder="Search by name, email, phone..." className="form-input pl-8" value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }} />
          </div>
          <select className="form-select lg:w-40" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setCurrentPage(1) }}>
            <option value="all">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Loader2 className="w-8 h-8 mb-2 animate-spin" />
            <p className="text-sm font-medium">Loading enquiries...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center py-12 text-red-400">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Failed to load enquiries</p>
            <button className="mt-3 px-3 py-1.5 text-xs font-medium text-white bg-[#0078D7] border border-[#005A9E] hover:bg-[#006CC1]" onClick={() => refetch()}>Retry</button>
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <MessageSquare className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">No enquiries found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <ExcelSpreadsheet data={paginated} columns={columns} />
            {filtered.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-gray-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
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

      {/* View Details Modal */}
      {viewEnquiry && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto" onClick={() => setViewEnquiry(null)}>
          <div className="bg-white border border-gray-300 w-full max-w-lg my-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-3 py-2 bg-[#F0F0F0] border-b border-gray-300">
              <h2 className="text-xs font-bold text-[#222222]">Enquiry Details</h2>
              <button className="p-0.5 text-gray-500 hover:text-red-600" onClick={() => setViewEnquiry(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {viewLoading ? (
                <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="text-xs font-medium">Loading...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                    <div className="w-10 h-10 flex items-center justify-center border border-gray-300 text-[11px] font-bold text-[#222222]" style={{ background: getAvatarColor(viewEnquiry.name) }}>
                      {getInitials(viewEnquiry.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#222222]">{viewEnquiry.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">{getStatusBadge(viewEnquiry.status)}<span>{viewEnquiry.date}</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /><a href={`mailto:${viewEnquiry.email}`} className="text-[#0078D7] hover:underline truncate">{viewEnquiry.email}</a></div>
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" /><span className="text-[#222222]">{viewEnquiry.phone || '—'}</span></div>
                    <div className="sm:col-span-2 flex items-start gap-2"><User className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" /><span className="text-gray-500">Subject:</span><span className="font-semibold text-[#222222]">{viewEnquiry.subject || '—'}</span></div>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded p-3">
                    <p className="text-[10px] font-semibold text-gray-500 uppercase mb-1.5">Message</p>
                    <p className="text-xs text-[#222222] leading-relaxed whitespace-pre-wrap">{viewEnquiry.message}</p>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-end px-3 py-2 bg-[#F0F0F0] border-t border-gray-300">
              <button className="px-3 py-1.5 text-[11px] bg-[#E1E1E1] border border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8] text-[#222222]" onClick={() => setViewEnquiry(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}

export default ContactEnquiries
