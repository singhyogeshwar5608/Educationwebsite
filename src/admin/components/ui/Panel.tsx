import type { ReactNode } from 'react'

interface PanelProps {
  title?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

export default function Panel({ title, children, className = '', actions }: PanelProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}
