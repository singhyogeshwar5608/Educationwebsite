import { useState } from 'react'
import {
  Building2, Mail, Phone, Globe, MapPin, Clock, Lock, KeyRound,
  Bell, Database, Save, CheckCircle, Eye, EyeOff, CalendarDays,
} from 'lucide-react'
import Panel from '@/admin/components/ui/Panel'

function FormInput({ icon: Icon, label, error, ...props }: { icon?: React.ComponentType<{ className?: string }>; label?: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        <input
          className={`w-full text-sm text-gray-900 placeholder:text-gray-400 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 ${error ? 'border-red-300' : 'border-gray-200'}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function FormSelect({ icon: Icon, label, children, ...props }: { icon?: React.ComponentType<{ className?: string }>; label?: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
        <select
          className={`w-full text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none ${Icon ? 'pl-10' : 'pl-3'} pr-8 py-2`}
          {...props}
        >
          {children}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

function Toggle({ label, description, checked, onChange }: { label: string; description?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-200'}`}
      >
        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'system', label: 'System', icon: Database },
]

function Settings() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState<string | null>(null)
  const [showOldPw, setShowOldPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // General
  const [instituteName, setInstituteName] = useState('Z-Tech Academy')
  const [instituteAddress, setInstituteAddress] = useState('123, Education Street, New Delhi')
  const [institutePhone, setInstitutePhone] = useState('+91 9876543210')
  const [instituteEmail, setInstituteEmail] = useState('info@ztech.edu')
  const [instituteWebsite, setInstituteWebsite] = useState('https://ztech.edu')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [academicYear, setAcademicYear] = useState('2025-2026')

  // Security
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)
  const [newAdmissionNotif, setNewAdmissionNotif] = useState(true)
  const [resultNotif, setResultNotif] = useState(true)

  const handleSave = (section: string) => {
    setSaved(section)
    setTimeout(() => setSaved(null), 2500)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave('security')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your institute configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <Panel title="General Settings">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Institute Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput icon={Building2} label="Institute Name" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} />
                <FormInput icon={Globe} label="Website" value={instituteWebsite} onChange={(e) => setInstituteWebsite(e.target.value)} />
                <div className="md:col-span-2">
                  <FormInput icon={MapPin} label="Address" value={instituteAddress} onChange={(e) => setInstituteAddress(e.target.value)} />
                </div>
                <FormInput icon={Phone} label="Phone" value={institutePhone} onChange={(e) => setInstitutePhone(e.target.value)} />
                <FormInput icon={Mail} label="Email" value={instituteEmail} onChange={(e) => setInstituteEmail(e.target.value)} />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput icon={CalendarDays} label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="e.g. 2025-2026" />
                <FormSelect icon={Clock} label="Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                  <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                  <option value="Asia/Dubai">Asia/Dubai (UTC+4:00)</option>
                  <option value="UTC">UTC (UTC+0:00)</option>
                  <option value="America/New_York">America/New_York (UTC-5:00)</option>
                  <option value="Europe/London">Europe/London (UTC+0:00)</option>
                </FormSelect>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleSave('general')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
              {saved === 'general' && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <CheckCircle className="w-4 h-4" /> Saved successfully
                </span>
              )}
            </div>
          </div>
        </Panel>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Panel title="Security Settings">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Password</h3>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
                <div className="relative">
                  <FormInput
                    icon={KeyRound}
                    label="Current Password"
                    type={showOldPw ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                    {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <FormInput
                    icon={Lock}
                    label="New Password"
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600">
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FormInput label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <div className="flex items-center gap-3">
                  <button type="submit" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all">
                    <KeyRound className="w-4 h-4" /> Update Password
                  </button>
                  {saved === 'security' && (
                    <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                      <CheckCircle className="w-4 h-4" /> Password updated
                    </span>
                  )}
                </div>
              </form>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Two-Factor Authentication</h3>
              <p className="text-xs text-gray-500 mb-3">Add an extra layer of security to your account</p>
              <Toggle
                label="Enable two-factor authentication"
                description="Receive a verification code on your registered email or phone for every login"
                checked={twoFactor}
                onChange={setTwoFactor}
              />
            </div>
          </div>
        </Panel>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Panel title="Notification Preferences">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Channels</h3>
            <div className="divide-y divide-gray-100">
              <Toggle
                label="Email Notifications"
                description="Receive notifications via email"
                checked={emailNotif}
                onChange={setEmailNotif}
              />
              <Toggle
                label="SMS Notifications"
                description="Receive notifications via SMS"
                checked={smsNotif}
                onChange={setSmsNotif}
              />
            </div>

            <h3 className="text-sm font-semibold text-gray-900 mt-4 mb-2">Events</h3>
            <div className="divide-y divide-gray-100">
              <Toggle
                label="New Admission Requests"
                description="Get notified when a new admission request is submitted"
                checked={newAdmissionNotif}
                onChange={setNewAdmissionNotif}
              />
              <Toggle
                label="Results Published"
                description="Get notified when results are published"
                checked={resultNotif}
                onChange={setResultNotif}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => handleSave('notifications')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Save Preferences
              </button>
              {saved === 'notifications' && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <CheckCircle className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          </div>
        </Panel>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <Panel title="System Settings">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Database Backup</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Last Backup</p>
                    <p className="text-xs text-gray-500 mt-0.5">No backup taken yet</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all">
                  Backup Now
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Auto-Backup Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect label="Frequency" defaultValue="weekly">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="never">Never</option>
                </FormSelect>
                <FormSelect label="Retention Period" defaultValue="30">
                  <option value="7">7 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </FormSelect>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Clear Cache</h3>
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">System Cache</p>
                  <p className="text-xs text-gray-500 mt-0.5">Clear temporary data and cached files to free up space</p>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-200 rounded-lg hover:bg-amber-100 transition-all">
                  Clear Now
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleSave('system')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
              {saved === 'system' && (
                <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <CheckCircle className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          </div>
        </Panel>
      )}
    </div>
  )
}

export default Settings
