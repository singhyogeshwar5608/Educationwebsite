import { useState, useRef, useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  User,
  Settings,
} from 'lucide-react'
import { navItems, getPageTitle } from '@/admin/config/navigation'
import { authService } from '@/services/auth.service'
import logoImg from '@/assets/Logo/Logo.png'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pageTitle = getPageTitle(location.pathname)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const handleLogout = async () => {
    setProfileDropdownOpen(false)
    try {
      await authService.logout()
    } catch {
      // Ignore server/network errors; local session must still be cleared below.
    }
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen flex bg-[#F0F0F0] admin-panel">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-[220px] flex flex-col transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`} style={{ background: '#1E1E1E' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#333333]">
          <div className="w-8 h-8 flex items-center justify-center bg-white rounded-md shrink-0 overflow-hidden">
            <img src={logoImg} alt="Z-TECH Career Institute Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-bold text-sm leading-tight truncate">Z-Tech</h2>
          </div>
          <button className="lg:hidden ml-auto text-gray-400 hover:text-white p-0.5" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5" style={{ scrollbarWidth: 'thin' }}>
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/admin/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-2 py-2 border-t border-[#333333]">
          <button onClick={handleLogout} className="sidebar-link w-full text-gray-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-[#F0F0F0] border-b border-gray-300">
          <div className="flex items-center justify-between h-10 px-3">
            <div className="flex items-center gap-2">
              <button className="lg:hidden p-1 text-gray-600 hover:bg-gray-200" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar">
                <Menu className="w-4 h-4" />
              </button>
              <h1 className="text-sm font-bold text-[#222222] leading-tight">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-1">
              <button className="relative p-1.5 text-gray-600 hover:bg-gray-200" aria-label="Notifications">
                <Bell className="w-4 h-4" />
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 flex items-center justify-center text-[8px] font-bold text-white" style={{ background: '#C62828' }}>3</span>
              </button>
              <div ref={dropdownRef} className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 hover:bg-gray-200" aria-label="User menu" aria-expanded={profileDropdownOpen}>
                  <div className="w-6 h-6 flex items-center justify-center text-[9px] font-bold text-white bg-[#0078D7] shrink-0">SA</div>
                  <span className="hidden sm:block text-xs text-[#222222] max-w-[80px] truncate">Super Admin</span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform hidden sm:block ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-300 py-1 z-50">
                    <div className="px-3 py-1.5 border-b border-gray-200">
                      <p className="text-xs font-semibold text-[#222222]">Super Admin</p>
                      <p className="text-[10px] text-gray-500">admin@ztech.edu</p>
                    </div>
                    <button onClick={() => { setProfileDropdownOpen(false); navigate('/admin/profile') }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-[#E8E8E8]">
                      <User className="w-3.5 h-3.5" /> Profile
                    </button>
                    <button onClick={() => { setProfileDropdownOpen(false); navigate('/admin/settings') }}
                      className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-[#E8E8E8]">
                      <Settings className="w-3.5 h-3.5" /> Settings
                    </button>
                    <div className="border-t border-gray-200">
                      <button onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-700 hover:bg-[#FFEBEE]">
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full p-4" style={{ maxWidth: '1680px' }}>
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
