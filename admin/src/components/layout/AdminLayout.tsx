import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  UserPlus,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  Users,
  BarChart3,
  Award,
  Image,
  Globe,
  MessageSquare,
  Settings as SettingsIcon,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react'

interface AdminLayoutProps {
  onLogout: () => void
}

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Admissions', path: '/admissions', icon: UserPlus },
  { label: 'Students', path: '/students', icon: GraduationCap },
  { label: 'Courses', path: '/courses', icon: BookOpen },
  { label: 'Course Categories', path: '/course-categories', icon: Layers },
  { label: 'Subjects', path: '/subjects', icon: FileText },
  { label: 'Teachers', path: '/teachers', icon: Users },
  { label: 'Results', path: '/results', icon: BarChart3 },
  { label: 'Certificates', path: '/certificates', icon: Award },
  { label: 'Gallery', path: '/gallery', icon: Image },
  { label: 'Website CMS', path: '/website-cms', icon: Globe },
  { label: 'Contact Enquiries', path: '/enquiries', icon: MessageSquare },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
  { label: 'Profile', path: '/profile', icon: User },
]

function getPageTitle(pathname: string): string {
  const item = navItems.find((n) => n.path === pathname)
  if (item) return item.label
  if (pathname.startsWith('/students/')) return 'Student Profile'
  return 'Dashboard'
}

function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const pageTitle = getPageTitle(location.pathname)

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const handleLogout = () => {
    setProfileDropdownOpen(false)
    onLogout()
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: 'linear-gradient(180deg, #0A2647 0%, #050e1f 100%)' }}
      >
        {/* Sidebar Header - Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FFC107, #FFD54F)' }}
          >
            <img
              src="/logo.svg"
              alt="Z-Tech Logo"
              className="w-7 h-7"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-base leading-tight truncate">
              Z-Tech
            </h2>
            <p className="text-white/50 text-[11px] font-medium tracking-wide truncate">
              Career Academy
            </p>
          </div>
          {/* Mobile close button */}
          <button
            className="lg:hidden ml-auto text-white/60 hover:text-white transition-colors p-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" style={{ scrollbarWidth: 'thin' }}>
          {navItems.slice(0, 12).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              end={item.path === '/dashboard'}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}

          {/* Divider */}
          <div className="my-3 mx-2 border-t border-white/10" />

          {/* Settings & Profile */}
          {navItems.slice(12).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer - Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-300 hover:text-red-200 hover:bg-red-500/10"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-border-light shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left side */}
            <div className="flex items-center gap-3">
              {/* Hamburger menu (mobile) */}
              <button
                className="lg:hidden p-2 rounded-lg text-text-gray hover:bg-light-gray transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Page Title */}
              <div>
                <h1 className="text-lg font-bold text-navy leading-tight">
                  {pageTitle}
                </h1>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notification Bell */}
              <button
                className="relative p-2 rounded-lg text-text-gray hover:bg-light-gray transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span
                  className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                  style={{ background: '#ef4444' }}
                >
                  3
                </span>
              </button>

              {/* Profile Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-light-gray transition-colors"
                  aria-label="User menu"
                  aria-expanded={profileDropdownOpen}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #0A2647, #144272)' }}
                  >
                    SA
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-navy max-w-[100px] truncate">
                    Super Admin
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-text-gray transition-transform duration-200 hidden sm:block ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-border-light py-2 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-border-light">
                      <p className="text-sm font-semibold text-navy">Super Admin</p>
                      <p className="text-xs text-text-gray">admin@ztech.edu</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          navigate('/profile')
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-text-gray hover:bg-light-gray hover:text-navy transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          navigate('/settings')
                        }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-text-gray hover:bg-light-gray hover:text-navy transition-colors"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        Settings
                      </button>
                    </div>
                    <div className="border-t border-border-light pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
