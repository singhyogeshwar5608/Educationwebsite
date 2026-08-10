import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminLayout from './AdminLayout'
import { ToastProvider } from '@/admin/components/Toast'
import Dashboard from './pages/Dashboard'
import Admissions from './pages/Admissions'
import Students from './pages/Students'
import StudentProfile from './pages/StudentProfile'
import Courses from './pages/Courses'
import CourseCategories from './pages/CourseCategories'
import Subjects from './pages/Subjects'
import Results from './pages/Results'
import Certificates from './pages/Certificates'
import ContactEnquiries from './pages/ContactEnquiries'
import Gallery from './pages/Gallery'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('admin_token')
  })

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentProfile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course-categories" element={<CourseCategories />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="results" element={<Results />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="enquiries" element={<ContactEnquiries />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
