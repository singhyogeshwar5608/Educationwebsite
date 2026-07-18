import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import Admissions from './pages/Admissions'
import Students from './pages/Students'
import StudentProfile from './pages/StudentProfile'
import Courses from './pages/Courses'
import CourseCategories from './pages/CourseCategories'
import Subjects from './pages/Subjects'
import Teachers from './pages/Teachers'
import Results from './pages/Results'
import Certificates from './pages/Certificates'
import Gallery from './pages/Gallery'
import WebsiteCMS from './pages/WebsiteCMS'
import ContactEnquiries from './pages/ContactEnquiries'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true'
  })

  const handleLogin = () => {
    localStorage.setItem('admin_auth', 'true')
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout onLogout={handleLogout} />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="admissions" element={<Admissions />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="courses" element={<Courses />} />
        <Route path="course-categories" element={<CourseCategories />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="results" element={<Results />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="website-cms" element={<WebsiteCMS />} />
        <Route path="enquiries" element={<ContactEnquiries />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
