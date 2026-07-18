import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FileText,
  Award,
  Download,
  User,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Hash,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { mockStudents, mockCourses, mockResults, mockCertificates } from '@/data/mockData'
import type { Student } from '@/data/mockData'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function StudentProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const student = useMemo(() => mockStudents.find((s) => s.id === id), [id])
  const studentResult = useMemo(
    () => (student ? mockResults.find((r) => r.studentId === student.id) : null),
    [student]
  )
  const studentCertificate = useMemo(
    () => (student ? mockCertificates.find((c) => c.studentId === student.id) : null),
    [student]
  )
  const courseDetails = useMemo(
    () => (student ? mockCourses.find((c) => c.id === student.courseId) : null),
    [student]
  )

  if (!student) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <XCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">Student Not Found</h2>
        <p className="text-text-gray mb-6">The student you are looking for does not exist.</p>
        <button className="btn-primary" onClick={() => navigate('/students')}>
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
      </div>
    )
  }

  function getStatusBadge(status: Student['status']) {
    switch (status) {
      case 'Active':
        return <span className="badge-success">Active</span>
      case 'Inactive':
        return <span className="badge-danger">Inactive</span>
      case 'Graduated':
        return <span className="badge-info">Graduated</span>
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 text-text-gray hover:text-navy transition-colors mb-6 group"
        onClick={() => navigate('/students')}
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Students</span>
      </button>

      {/* Profile Header Card */}
      <div className="page-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 ${getAvatarColor(student.name)}`}
          >
            {getInitials(student.name)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-navy">{student.name}</h1>
              <div className="flex items-center gap-2">
                <span className="badge-info">{student.course}</span>
                {getStatusBadge(student.status)}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-gray mt-1">
              <span className="flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" />
                {student.rollNo}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {student.mobile}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {student.email}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button className="btn-outline text-xs py-1.5">
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
            <button className="btn-danger text-xs py-1.5">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
            <button className="btn-outline text-xs py-1.5">
              <FileText className="w-3.5 h-3.5" />
              View Result
            </button>
            <button className="btn-outline text-xs py-1.5">
              <Award className="w-3.5 h-3.5" />
              View Certificate
            </button>
            <button className="btn-outline text-xs py-1.5">
              <Download className="w-3.5 h-3.5" />
              Certificate
            </button>
            <button className="btn-outline text-xs py-1.5">
              <Download className="w-3.5 h-3.5" />
              Marksheet
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="page-card p-6">
          <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-gold" />
            Personal Information
          </h3>
          <div className="space-y-4">
            <DetailRow icon={User} label="Father Name" value={student.fatherName} />
            <DetailRow icon={User} label="Mother Name" value={student.motherName} />
            <DetailRow icon={Calendar} label="Date of Birth" value={student.dob} />
            <DetailRow icon={User} label="Gender" value={student.gender} />
            <DetailRow icon={Phone} label="Mobile" value={student.mobile} />
            <DetailRow icon={Mail} label="Email" value={student.email || '—'} />
            <DetailRow icon={MapPin} label="Address" value={student.address || '—'} />
          </div>
        </div>

        {/* Academic Information */}
        <div className="page-card p-6">
          <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-gold" />
            Academic Information
          </h3>
          <div className="space-y-4">
            <DetailRow icon={BookOpen} label="Course" value={student.course} />
            <DetailRow icon={Calendar} label="Batch" value={student.batch} />
            <DetailRow icon={Calendar} label="Admission Date" value={student.admissionDate} />
            <DetailRow icon={Hash} label="Registration No" value={student.registrationNo} />
            <DetailRow icon={Hash} label="Roll No" value={student.rollNo} />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-text-gray" />
              </div>
              <div>
                <p className="text-xs text-text-gray font-medium">Status</p>
                <div className="mt-0.5">{getStatusBadge(student.status)}</div>
              </div>
            </div>
            {courseDetails && (
              <>
                <div className="border-t border-border-light my-3" />
                <DetailRow icon={Calendar} label="Duration" value={courseDetails.duration} />
                <DetailRow icon={BookOpen} label="Eligibility" value={courseDetails.eligibility} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="mb-6">
        {student.resultPublished && studentResult ? (
          <div className="page-card p-6">
            <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-gold" />
              Exam Results
            </h3>

            {/* Results Table */}
            <div className="overflow-x-auto mb-5">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Max Marks</th>
                    <th>Passing Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentResult.subjects.map((sub, idx) => (
                    <tr key={idx}>
                      <td className="font-medium">{sub.name}</td>
                      <td>{sub.marks}</td>
                      <td>{sub.maxMarks}</td>
                      <td>{sub.passingMarks}</td>
                      <td>
                        {sub.marks >= sub.passingMarks ? (
                          <span className="badge-success">Pass</span>
                        ) : (
                          <span className="badge-danger">Fail</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-text-gray font-medium mb-1">Total</p>
                <p className="text-xl font-bold text-navy">
                  {studentResult.total}/{studentResult.maxTotal}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-text-gray font-medium mb-1">Percentage</p>
                <p className="text-xl font-bold text-navy">{studentResult.percentage}%</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-text-gray font-medium mb-1">Grade</p>
                <p className="text-xl font-bold text-navy">{studentResult.grade}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-text-gray font-medium mb-1">Status</p>
                {studentResult.pass ? (
                  <span className="badge-success text-sm">Pass</span>
                ) : (
                  <span className="badge-danger text-sm">Fail</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="page-card p-6">
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Result not yet published</p>
                <p className="text-amber-600 text-xs mt-0.5">
                  The examination results for this student have not been published yet. Please check back later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Certificate Section */}
      <div>
        {student.certificateIssued && studentCertificate ? (
          <div className="page-card p-6">
            <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-gold" />
              Certificate Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs text-green-700 font-medium mb-1">Certificate No</p>
                <p className="text-sm font-bold text-green-800">{studentCertificate.certificateNo}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-xs text-blue-700 font-medium mb-1">Issue Date</p>
                <p className="text-sm font-bold text-blue-800">{studentCertificate.issueDate}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <p className="text-xs text-purple-700 font-medium mb-1">Verification URL</p>
                <a
                  href={studentCertificate.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-purple-800 hover:text-purple-600 flex items-center gap-1 transition-colors"
                >
                  Verify Certificate
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="btn-gold text-sm">
                <Download className="w-4 h-4" />
                Download Certificate
              </button>
              <button className="btn-outline text-sm">
                <Download className="w-4 h-4" />
                Download Marksheet
              </button>
            </div>
          </div>
        ) : student.resultPublished && studentResult && studentResult.pass && !student.certificateIssued ? (
          <div className="page-card p-6">
            <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-gold" />
              Certificate
            </h3>
            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-amber-800 text-sm">Certificate not yet issued</p>
                  <p className="text-amber-600 text-xs mt-0.5">
                    Student has passed the examination. Certificate can be issued now.
                  </p>
                </div>
              </div>
              <button className="btn-gold text-sm shrink-0">
                <Award className="w-4 h-4" />
                Issue Certificate
              </button>
            </div>
          </div>
        ) : student.resultPublished && studentResult && !studentResult.pass ? (
          <div className="page-card p-6">
            <h3 className="text-base font-bold text-navy mb-4 flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-gold" />
              Certificate
            </h3>
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Certificate not available</p>
                <p className="text-red-600 text-xs mt-0.5">
                  Student did not pass the examination. Certificate cannot be issued.
                </p>
              </div>
            </div>
          </div>
        ) : !student.resultPublished ? null : null}
      </div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-text-gray" />
      </div>
      <div>
        <p className="text-xs text-text-gray font-medium">{label}</p>
        <p className="text-sm font-semibold text-navy mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default StudentProfile
