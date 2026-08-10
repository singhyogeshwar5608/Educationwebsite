import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export default function Card({ children, className = '', padding = 'sm' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-100 shadow-sm ${paddingMap[padding]} ${className}`}>
      {children}
    </div>
  )
}
