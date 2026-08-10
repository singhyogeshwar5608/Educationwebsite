import type { ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  scroll?: boolean
  accent?: boolean
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
}

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', scroll = false, accent = false }: ModalProps) {
  if (!open) return null

  const Container = scroll ? 'div' : 'div'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-full items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        <div className={`bg-white border w-full ${sizeMap[size]} ${scroll ? 'max-h-[90vh] flex flex-col' : ''} ${accent ? 'border-navy/15 rounded-xl shadow-2xl overflow-hidden' : 'border-gray-300'}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 ${accent ? 'bg-gradient-to-r from-navy to-navy-light' : 'bg-[#F0F0F0] border-b border-gray-300'}`}>
          <div>
            <h3 className={`font-bold ${accent ? 'text-sm text-white' : 'text-xs text-[#222222]'}`}>{title}</h3>
            {subtitle && <p className={accent ? 'text-[11px] text-blue-100' : 'text-[10px] text-gray-500'}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className={`p-0.5 ${accent ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-red-600 hover:bg-gray-200'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <Container className={scroll ? 'flex-1 min-h-0 overflow-y-auto' : ''}>
          {children}
        </Container>

        {/* Footer */}
        {footer && (
          <div className={`flex items-center justify-end gap-2 px-4 py-3 ${accent ? 'bg-gray-50 border-t border-gray-100' : 'bg-[#F0F0F0] border-t border-gray-300'}`}>
            {footer}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export function WinButton({ children, onClick, className = '', disabled, variant = 'default' }: {
  children: ReactNode; onClick?: () => void; className?: string; disabled?: boolean; variant?: 'default' | 'primary' | 'danger'
}) {
  const base = 'px-3 py-1.5 text-[11px] font-medium border flex items-center gap-1.5 disabled:opacity-50'
  const styles: Record<string, string> = {
    default: 'bg-[#E1E1E1] text-[#222222] border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#E8E8E8]',
    primary: 'text-white bg-[#28A745] border border-[#1E7E34] hover:bg-[#239B3F]',
    danger: 'bg-[#E1E1E1] text-red-600 border-[#B0B0B0] border-t-[#F5F5F5] border-l-[#F5F5F5] hover:bg-[#FFEBEE]',
  }
  return <button className={`${base} ${styles[variant]} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>
}
