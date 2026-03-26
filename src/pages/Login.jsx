// src/pages/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { loginUser, getAuthErrorMessage } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      await loginUser(email, password)
      navigate('/')
    } catch (err) {
      setErrors({ form: getAuthErrorMessage(err.code) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-accent text-4xl shadow-glow mb-4">
            🧠
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
            MindPulse
          </h1>
          <p className="text-gray-500 text-sm mt-2">Your daily mental wellness companion</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Welcome back 👋</h2>

          {errors.form && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 font-medium"
            >
              {errors.form}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 ${
                  errors.email
                    ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none transition-all duration-200 ${
                    errors.password
                      ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
                      : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in…</>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-bold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
