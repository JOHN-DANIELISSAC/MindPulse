// src/pages/Signup.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react'
import { signupUser, getAuthErrorMessage } from '../services/auth'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!name.trim()) e.name = 'Full name is required'
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address'
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (confirm !== password) e.confirm = 'Passwords do not match'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      await signupUser(name.trim(), email, password)
      navigate('/')
    } catch (err) {
      setErrors({ form: getAuthErrorMessage(err.code) })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ id, label, type, value, onChange, error, placeholder, toggle, onToggle, showToggle }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={showToggle ? (toggle ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={type === 'email' ? 'email' : type === 'password' ? 'new-password' : 'name'}
          className={`w-full px-4 py-3 ${showToggle ? 'pr-11' : ''} rounded-xl border text-sm outline-none transition-all duration-200 ${
            error
              ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-300'
              : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100'
          }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {toggle ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  )

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
          <h2 className="text-xl font-bold text-gray-800 mb-6">Create your account 🚀</h2>

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
            <Field
              id="signup-name" label="Full name" type="text"
              value={name} onChange={e => setName(e.target.value)}
              error={errors.name} placeholder="Jane Doe"
            />
            <Field
              id="signup-email" label="Email address" type="email"
              value={email} onChange={e => setEmail(e.target.value)}
              error={errors.email} placeholder="you@example.com"
            />
            <Field
              id="signup-password" label="Password" type="password"
              value={password} onChange={e => setPassword(e.target.value)}
              error={errors.password} placeholder="Min. 6 characters"
              showToggle toggle={showPass} onToggle={() => setShowPass(v => !v)}
            />
            <Field
              id="signup-confirm" label="Confirm password" type="password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              error={errors.confirm} placeholder="Re-enter password"
              showToggle toggle={showConfirm} onToggle={() => setShowConfirm(v => !v)}
            />

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Creating account…</>
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
