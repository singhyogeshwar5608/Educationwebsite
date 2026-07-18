import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  UserPlus,
  BookOpen,
  Users,
  Award,
  BarChart3,
  Plus,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  mockStudents,
  mockCourses,
  mockAdmissions,
  mockCertificates,
  mockResults,
  mockTeachers,
} from '@/data/mockData'
import type { Student, AdmissionRequest, Certificate } from '@/data/mockData'

// ─── Chart data ────────────────────────────────────────────
const enrollmentTrend = [
  { month: 'Jul', students: 8 },
  { month: 'Aug', students: 12 },
  { month: 'Sep', students: 15 },
  { month: 'Oct', students: 18 },
  { month: 'Nov', students: 22 },
  { month: 'Dec', students: 10 },
]

const courseDistribution = [
  { name: 'ADCA', value: 4, color: '#0A2647' },
  { name: 'DCA', value: 2, color: '#144272' },
  { name: 'Digital Marketing', value: 2, color: '#FFC107' },
  { name: 'Tally Prime', value: 2, color: '#FFD54F' },
]

// ─── Status badge helper ───────────────────────────────────
function StudentStatusBadge({ status }: { status: Student['status'] }) {
  if (status === 'Active') return <span className="badge-success">Active</span>
  if (status === 'Inactive') return <span className="badge-danger">Inactive</span>
  return <span className="badge-info">Graduated</span>
}

function AdmissionStatusBadge({ status }: { status: AdmissionRequest['status'] }) {
  if (status === 'Pending') return <span className="badge-warning">Pending</span>
  if (status === 'Approved') return <span className="badge-success">Approved</span>
  return <span className="badge-danger">Rejected</span>
}

// ─── Stat card data type ───────────────────────────────────
interface StatCardData {
  label: string
  count: number
  growth: string
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
}

// ─── Custom tooltip for charts ─────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name?: string }>; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-border-light px-3 py-2">
      <p className="text-xs font-semibold text-navy">{label}</p>
      <p className="text-sm font-bold text-navy-dark">{payload[0].value}</p>
    </div>
  )
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-border-light px-3 py-2">
      <p className="text-xs font-semibold text-navy">{payload[0].name}</p>
      <p className="text-sm font-bold text-navy-dark">{payload[0].value} students</p>
    </div>
  )
}

// ─── Dashboard Component ───────────────────────────────────
function Dashboard() {
  const pendingAdmissions = useMemo(
    () => mockAdmissions.filter((a) => a.status === 'Pending').length,
    [],
  )

  const recentStudents = useMemo(() => mockStudents.slice(0, 5), [])
  const recentAdmissions = useMemo(() => mockAdmissions.slice(0, 5), [])
  const recentCertificates = useMemo(() => mockCertificates.slice(0, 5), [])

  const statCards: StatCardData[] = [
    {
      label: 'Total Students',
      count: mockStudents.length,
      growth: '+12%',
      icon: GraduationCap,
      iconBg: 'bg-navy',
    },
    {
      label: 'Pending Admissions',
      count: pendingAdmissions,
      growth: '+5%',
      icon: UserPlus,
      iconBg: 'bg-orange-500',
    },
    {
      label: 'Courses',
      count: mockCourses.length,
      growth: '+8%',
      icon: BookOpen,
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Teachers',
      count: mockTeachers.length,
      growth: '+3%',
      icon: Users,
      iconBg: 'bg-purple-500',
    },
    {
      label: 'Certificates Issued',
      count: mockCertificates.length,
      growth: '+15%',
      icon: Award,
      iconBg: 'bg-green',
    },
    {
      label: 'Results Published',
      count: mockResults.length,
      growth: '+10%',
      icon: BarChart3,
      iconBg: 'bg-gold',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ═══ Statistics Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center gap-3">
              <div
                className={`${card.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-bold text-navy-dark leading-tight">
                  {card.count}
                </p>
                <p className="text-xs text-text-gray font-medium truncate">
                  {card.label}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-green" />
              <span className="text-xs font-semibold text-green">{card.growth}</span>
              <span className="text-xs text-text-gray ml-0.5">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Recent Activity Section ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Students */}
        <div className="page-card">
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <h3 className="font-bold text-navy text-sm">Recent Students</h3>
            <Link
              to="/students"
              className="text-xs font-semibold text-gold hover:text-navy transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="font-medium text-navy whitespace-nowrap">
                      {s.name}
                    </td>
                    <td className="whitespace-nowrap">{s.course}</td>
                    <td className="whitespace-nowrap text-text-gray">
                      {new Date(s.admissionDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </td>
                    <td>
                      <StudentStatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="page-card">
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <h3 className="font-bold text-navy text-sm">Recent Admissions</h3>
            <Link
              to="/admissions"
              className="text-xs font-semibold text-gold hover:text-navy transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.map((a) => (
                  <tr key={a.id}>
                    <td className="font-medium text-navy whitespace-nowrap">
                      {a.studentName}
                    </td>
                    <td className="whitespace-nowrap">{a.course}</td>
                    <td className="whitespace-nowrap text-text-gray">
                      {new Date(a.appliedDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </td>
                    <td>
                      <AdmissionStatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Certificates */}
        <div className="page-card">
          <div className="flex items-center justify-between p-4 border-b border-border-light">
            <h3 className="font-bold text-navy text-sm">Recent Certificates</h3>
            <Link
              to="/certificates"
              className="text-xs font-semibold text-gold hover:text-navy transition-colors flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cert No</th>
                  <th>Student</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentCertificates.map((c: Certificate) => (
                  <tr key={c.id}>
                    <td className="font-medium text-navy whitespace-nowrap font-mono text-xs">
                      {c.certificateNo}
                    </td>
                    <td className="whitespace-nowrap">{c.studentName}</td>
                    <td className="whitespace-nowrap text-text-gray">
                      {new Date(c.issueDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/students" className="btn-gold justify-center py-3 text-sm rounded-xl">
          <Plus className="w-4 h-4" />
          Add Student
        </Link>
        <Link to="/courses" className="btn-primary justify-center py-3 text-sm rounded-xl">
          <BookOpen className="w-4 h-4" />
          Add Course
        </Link>
        <Link to="/certificates" className="btn-gold justify-center py-3 text-sm rounded-xl">
          <Award className="w-4 h-4" />
          Issue Certificate
        </Link>
        <Link to="/results" className="btn-primary justify-center py-3 text-sm rounded-xl">
          <BarChart3 className="w-4 h-4" />
          Generate Result
        </Link>
      </div>

      {/* ═══ Charts Section ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Student Enrollment Trend */}
        <div className="page-card p-4 sm:p-6">
          <h3 className="font-bold text-navy text-sm mb-4">
            Student Enrollment Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="navyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2647" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0A2647" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#0A2647"
                  strokeWidth={2.5}
                  fill="url(#navyGradient)"
                  dot={{ r: 4, fill: '#0A2647', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#FFC107', stroke: '#0A2647', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Distribution */}
        <div className="page-card p-4 sm:p-6">
          <h3 className="font-bold text-navy text-sm mb-4">
            Course Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs font-medium text-text-gray">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
