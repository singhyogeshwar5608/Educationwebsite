import type { ComponentType } from 'react'

interface StatCardProps {
  label: string
  count: number
  growth: string
  icon: ComponentType<{ className?: string }>
  iconBg: string
}

const bgGradients: Record<string, string> = {
  '#0078D7': 'from-blue-500 to-blue-600',
  'bg-orange-500': 'from-orange-400 to-orange-500',
  'bg-blue-500': 'from-blue-400 to-blue-500',
  'bg-purple-500': 'from-purple-400 to-purple-500',
  'bg-green': 'from-emerald-400 to-emerald-500',
}

export default function StatCard({ label, count, growth, icon: Icon, iconBg }: StatCardProps) {
  const gradient = bgGradients[iconBg] || 'from-blue-500 to-blue-600'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          {growth}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{count}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}
