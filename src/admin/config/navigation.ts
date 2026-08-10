import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  BarChart3,
  Award,
  MessageSquare,
  Images,
} from 'lucide-react'
import type { ComponentType } from 'react'

export interface NavItem {
  label: string
  path: string
  icon: ComponentType<{ className?: string }>
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Admissions', path: '/admin/admissions', icon: UserPlus },
  { label: 'Students', path: '/admin/students', icon: GraduationCap },
  { label: 'Courses', path: '/admin/courses', icon: BookOpen },
  { label: 'Course Categories', path: '/admin/course-categories', icon: Layers },
  { label: 'Subjects', path: '/admin/subjects', icon: FileText },
  { label: 'Results', path: '/admin/results', icon: BarChart3 },
  { label: 'Certificates', path: '/admin/certificates', icon: Award },
  { label: 'Contact Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Gallery', path: '/admin/gallery', icon: Images },
]

export function getPageTitle(pathname: string): string {
  const item = navItems.find((n) => pathname.startsWith(n.path))
  if (item) return item.label
  if (pathname.includes('/students/')) return 'Student Profile'
  return 'Dashboard'
}
