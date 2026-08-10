import { Link } from 'react-router-dom'
import type { ComponentType } from 'react'

interface QuickActionCardProps {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
  to: string
  variant?: 'primary' | 'gold'
  disabled?: boolean
}

export default function QuickActionCard({ icon: Icon, title, description, to, disabled }: QuickActionCardProps) {
  if (disabled) {
    return (
      <div
        title="Coming soon"
        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60 cursor-not-allowed select-none"
      >
        <div className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        </div>
        <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">Soon</span>
      </div>
    )
  }

  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
