import { useMemo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap, UserPlus, BookOpen, Users, Award, BarChart3,
  TrendingUp, ArrowRight, Calendar, Clock, UserCheck, FileSpreadsheet, Palette,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  mockStudents, mockCourses, mockAdmissions, mockCertificates, mockResults, mockTeachers,
} from '@/admin/services/api'
import type { Student, AdmissionRequest, Certificate } from '@/admin/services/api'
import { dashboardService } from '@/services/dashboard.service'

import Panel from '@/admin/components/ui/Panel'
import Card from '@/admin/components/ui/Card'
import SectionHeader from '@/admin/components/ui/SectionHeader'
import DataTable from '@/admin/components/ui/DataTable'
import StatCard from '@/admin/components/dashboard/StatCard'
import QuickActionCard from '@/admin/components/dashboard/QuickActionCard'
import { ChartTooltip, PieTooltip, NoChartData } from '@/admin/components/charts/ChartTooltip'

const enrollmentTrend = [
  { month: 'Jul', students: 8 },
  { month: 'Aug', students: 12 },
  { month: 'Sep', students: 15 },
  { month: 'Oct', students: 18 },
  { month: 'Nov', students: 22 },
  { month: 'Dec', students: 10 },
]

const courseDistribution = [
  { name: 'ADCA', value: 4, color: '#3B82F6' },
  { name: 'DCA', value: 2, color: '#8B5CF6' },
  { name: 'Digital Marketing', value: 2, color: '#F59E0B' },
  { name: 'Tally Prime', value: 2, color: '#10B981' },
]

function StatusBadge({ label, variant }: { label: string; variant: 'success' | 'warning' | 'danger' | 'info' }) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${styles[variant]}`}>
      {label}
    </span>
  )
}

function StudentStatusBadge({ status }: { status: Student['status'] }) {
  if (status === 'Active') return <StatusBadge label="Active" variant="success" />
  if (status === 'Inactive') return <StatusBadge label="Inactive" variant="danger" />
  return <StatusBadge label="Graduated" variant="info" />
}

function AdmissionStatusBadge({ status }: { status: AdmissionRequest['status'] }) {
  if (status === 'Pending') return <StatusBadge label="Pending" variant="warning" />
  if (status === 'Approved') return <StatusBadge label="Approved" variant="success" />
  return <StatusBadge label="Rejected" variant="danger" />
}

interface StatCardData {
  label: string
  count: number
  growth: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
}

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  to: string
  variant: 'primary' | 'gold'
  disabled?: boolean
}

const quickActions: QuickAction[] = [
  { icon: UserPlus, title: 'Add Student', description: 'Enroll a new student', to: '/admin/students', variant: 'gold' },
  { icon: BookOpen, title: 'Add Course', description: 'Create new course', to: '/admin/courses', variant: 'primary' },
  { icon: Award, title: 'Issue Certificate', description: 'Generate certificate', to: '/admin/certificates', variant: 'gold' },
  { icon: FileSpreadsheet, title: 'Generate Result', description: 'Publish results', to: '/admin/results', variant: 'primary' },
  { icon: Users, title: 'Add Teacher', description: 'Hire new teacher', to: '/admin/teachers', variant: 'gold', disabled: true },
  { icon: Palette, title: 'Manage Gallery', description: 'Upload media', to: '/admin/gallery', variant: 'primary' },
]

function Avatar({ name, bgColor = '#E0E0E0' }: { name: string; bgColor?: string }) {
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold text-white shadow-sm" style={{ background: bgColor }}>
      {name.charAt(0)}
    </div>
  )
}

function DashboardHeader() {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
          <Calendar className="w-3.5 h-3.5" />
          {dateStr}
        </p>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <Clock className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-sm font-medium text-gray-700">{timeStr}</span>
      </div>
    </div>
  )
}

function KpiGrid({ cards }: { cards: StatCardData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  )
}

function QuickActionsGrid() {
  return (
    <section>
      <SectionHeader title="Quick Actions" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {quickActions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  )
}

function AnalyticsSection({ enrollmentTrend, courseDistribution, totalStudents }: { enrollmentTrend: any[]; courseDistribution: any[]; totalStudents: number }) {
  return (
    <section>
      <SectionHeader title="Analytics" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Enrollment Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Monthly new enrollments</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +25%
            </span>
          </div>
          <div className="h-[220px] w-full">
            {enrollmentTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="navyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={2} fill="url(#navyGradient)" dot={{ r: 4, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
            ) : <NoChartData />}
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Course Distribution</h3>
              <p className="text-xs text-gray-500 mt-0.5">Students per course</p>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{totalStudents} total</span>
          </div>
          <div className="h-[220px] w-full">
            {courseDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {courseDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
            ) : <NoChartData />}
          </div>
        </Card>
      </div>
    </section>
  )
}

function RecentStudentsSection({ students }: { students: Student[] }) {
  const columns = [
    { key: 'name', header: 'Name', render: (s: Student) => (
      <div className="flex items-center gap-3">
        <Avatar name={s.name} bgColor="#3B82F6" />
        <span className="text-sm font-medium text-gray-900">{s.name}</span>
      </div>
    )},
    { key: 'course', header: 'Course', render: (s: Student) => <span className="text-sm text-gray-500">{s.course}</span> },
    { key: 'date', header: 'Date', render: (s: Student) => (
      <span className="text-sm text-gray-400">{new Date(s.admissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
    )},
    { key: 'status', header: 'Status', align: 'right' as const, render: (s: Student) => <StudentStatusBadge status={s.status} /> },
  ]

  return (
    <section>
      <SectionHeader
        title="Recent Students"
        action={<Link to="/admin/students" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>}
      />
      <DataTable columns={columns} data={students} />
    </section>
  )
}

function RecentAdmissionsSection({ admissions }: { admissions: AdmissionRequest[] }) {
  const columns = [
    { key: 'name', header: 'Name', render: (a: AdmissionRequest) => (
      <div className="flex items-center gap-3">
        <Avatar name={a.studentName} bgColor="#F59E0B" />
        <span className="text-sm font-medium text-gray-900">{a.studentName}</span>
      </div>
    )},
    { key: 'course', header: 'Course', render: (a: AdmissionRequest) => <span className="text-sm text-gray-500">{a.course}</span> },
    { key: 'date', header: 'Date', render: (a: AdmissionRequest) => (
      <span className="text-sm text-gray-400">{new Date(a.appliedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
    )},
    { key: 'status', header: 'Status', align: 'right' as const, render: (a: AdmissionRequest) => <AdmissionStatusBadge status={a.status} /> },
  ]

  return (
    <section>
      <SectionHeader
        title="Recent Admissions"
        action={<Link to="/admin/admissions" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>}
      />
      <DataTable columns={columns} data={admissions} />
    </section>
  )
}

function RecentCertificatesSection({ certificates }: { certificates: Certificate[] }) {
  const columns = [
    { key: 'certNo', header: 'Cert No', render: (c: Certificate) => (
      <span className="text-xs font-mono font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">{c.certificateNo}</span>
    )},
    { key: 'student', header: 'Student', render: (c: Certificate) => (
      <div className="flex items-center gap-3">
        <Avatar name={c.studentName} bgColor="#10B981" />
        <span className="text-sm font-medium text-gray-900">{c.studentName}</span>
      </div>
    )},
    { key: 'date', header: 'Date', align: 'right' as const, render: (c: Certificate) => (
      <span className="text-sm text-gray-400">{new Date(c.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
    )},
  ]

  return (
    <section>
      <SectionHeader
        title="Recent Certificates"
        action={<Link to="/admin/certificates" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>}
      />
      <DataTable columns={columns} data={certificates} />
    </section>
  )
}

function CourseDistributionBar() {
  const total = courseDistribution.reduce((sum, c) => sum + c.value, 0)
  return (
    <Panel title="Course Distribution">
      <div className="flex flex-col gap-4">
        {courseDistribution.map((course) => (
          <div key={course.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: course.color }} />
                <span className="text-sm font-medium text-gray-700">{course.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{course.value}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(course.value / total) * 100}%`, background: course.color }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ActivityTimeline() {
  const activities = [
    { icon: UserCheck, text: 'New student enrolled: Ravi Shankar', time: '2 hours ago', color: 'text-blue-600 bg-blue-50' },
    { icon: UserPlus, text: 'Admission request from Sita Kumari', time: '5 hours ago', color: 'text-amber-600 bg-amber-50' },
    { icon: Award, text: 'Certificate issued to Vikram Patel', time: '1 day ago', color: 'text-emerald-600 bg-emerald-50' },
    { icon: FileSpreadsheet, text: 'Results published for ADCA batch', time: '2 days ago', color: 'text-purple-600 bg-purple-50' },
    { icon: Users, text: 'New teacher: Mrs. Ritu Verma joined', time: '3 days ago', color: 'text-rose-600 bg-rose-50' },
  ]

  return (
    <section>
      <SectionHeader title="Recent Activity" />
      <Card padding="md" className="flex flex-col gap-0">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex gap-3 pb-4 last:pb-0 border-b border-gray-50 last:border-b-0 mb-3 last:mb-0">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">{activity.text}</p>
              <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </Card>
    </section>
  )
}

function Dashboard() {
  const [stats, setStats] = useState<any>({})
  const [enrollmentData, setEnrollmentData] = useState(enrollmentTrend)
  const [distData, setDistData] = useState(courseDistribution)

  useEffect(() => {
    dashboardService.stats().then(setStats).catch(() => {})
    dashboardService.enrollmentTrend().then((d: any) => {
      if (d?.length) setEnrollmentData(d.map((m: any) => ({ month: m.month, students: m.count })))
    }).catch(() => {})
    dashboardService.courseDistribution().then((d: any) => {
      if (d?.length) setDistData(d.map((c: any, i: number) => ({
        name: c.name, value: c.value, color: ['#3B82F6','#8B5CF6','#F59E0B','#10B981'][i % 4]
      })))
    }).catch(() => {})
  }, [])

  const pendingAdmissions = useMemo(() => mockAdmissions.filter((a) => a.status === 'Pending').length, [])
  const recentStudents = useMemo(() => mockStudents.slice(0, 5), [])
  const recentAdmissions = useMemo(() => mockAdmissions.slice(0, 5), [])
  const recentCertificates = useMemo(() => mockCertificates.slice(0, 5), [])

  const statCards: StatCardData[] = [
    { label: 'Total Students', count: stats.totalStudents ?? mockStudents.length, growth: '+12%', icon: GraduationCap, iconBg: '#0078D7' },
    { label: 'Pending Admissions', count: stats.pendingAdmissions ?? pendingAdmissions, growth: '+5%', icon: UserPlus, iconBg: 'bg-orange-500' },
    { label: 'Courses', count: stats.totalCourses ?? mockCourses.length, growth: '+8%', icon: BookOpen, iconBg: 'bg-blue-500' },
    { label: 'Teachers', count: 0, growth: '+3%', icon: Users, iconBg: 'bg-purple-500' },
    { label: 'Certificates Issued', count: stats.certificatesIssued ?? mockCertificates.length, growth: '+15%', icon: Award, iconBg: 'bg-green' },
    { label: 'Results Published', count: stats.resultsPublished ?? mockResults.length, growth: '+10%', icon: BarChart3, iconBg: '#0078D7' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      <KpiGrid cards={statCards} />
      <QuickActionsGrid />
      <AnalyticsSection enrollmentTrend={enrollmentData} courseDistribution={distData} totalStudents={stats.totalStudents ?? mockStudents.length} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentStudentsSection students={recentStudents} />
        <RecentAdmissionsSection admissions={recentAdmissions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCertificatesSection certificates={recentCertificates} />
        </div>
        <div className="flex flex-col gap-6">
          <CourseDistributionBar />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
