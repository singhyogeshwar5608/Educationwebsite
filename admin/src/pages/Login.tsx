import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'

interface LoginProps {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 800)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center px-12 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0A2647 0%, #050e1f 60%, #0A2647 100%)',
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #FFC107 0%, transparent 70%)' }}
          />
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-gold opacity-30"
          />
          <div
            className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-gold-light opacity-20"
          />
          <div
            className="absolute bottom-1/3 left-1/2 w-2.5 h-2.5 rounded-full bg-gold opacity-25"
          />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,193,7,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,193,7,0.3) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 text-center animate-fade-in">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
                boxShadow: '0 20px 60px rgba(255, 193, 7, 0.3)',
              }}
            >
              <img
                src="/logo.svg"
                alt="Z-Tech Career Academy Logo"
                className="w-16 h-16"
              />
            </div>
          </div>

          {/* Institute Name */}
          <h1
            className="text-4xl font-bold text-white mb-2 tracking-tight"
          >
            Z-Tech Career Academy
          </h1>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-gold" />
            <Shield className="w-5 h-5 text-gold" />
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-gold" />
          </div>

          {/* Tagline */}
          <p className="text-lg font-medium text-gold mb-2">
            Education ERP
          </p>
          <p className="text-sm text-white/60 tracking-widest uppercase">
            Admin Panel
          </p>

          {/* Feature highlights */}
          <div className="mt-12 space-y-4">
            {[
              'Comprehensive Student Management',
              'Course & Curriculum Control',
              'Results & Certificate Management',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/70">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-white/30">
            Powered by Z-Tech Technologies
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 bg-white">
        <div className="w-full max-w-md mx-auto animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0A2647, #144272)' }}
            >
              <img
                src="/logo.svg"
                alt="Z-Tech Logo"
                className="w-8 h-8"
              />
            </div>
            <div>
              <p className="text-navy font-bold text-lg leading-tight">Z-Tech</p>
              <p className="text-text-gray text-xs">Career Academy</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-navy mb-2">
              Welcome Back
            </h2>
            <p className="text-text-gray text-sm">
              Sign in to your admin panel
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  className="form-input pl-10"
                  placeholder="admin@ztech.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-navy focus:ring-navy/20 cursor-pointer accent-navy"
                />
                <span className="text-sm text-text-gray group-hover:text-navy transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-navy-light hover:text-gold font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: isLoading
                  ? '#e0a800'
                  : 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
                color: '#0A2647',
                boxShadow: isLoading
                  ? 'none'
                  : '0 4px 15px rgba(255, 193, 7, 0.4)',
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-4.5 h-4.5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-text-gray">
              &copy; 2024 Z-Tech Career Academy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
