// src/pages/Profile.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../services/auth'
import { getUserStats, getLast30Days } from '../services/checkin'
import StatCard from '../components/StatCard'
import { getMemberSince, formatDateStr } from '../utils/dateUtils'
import { getMoodDistribution } from '../utils/moodUtils'

function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center px-5"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl text-center"
      >
        <div className="text-5xl mb-4">👋</div>
        <h3 className="text-xl font-extrabold text-gray-800 mb-2">Log out?</h3>
        <p className="text-sm text-gray-500 mb-6">You'll need to sign in again to access your check-ins.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 active:scale-95 transition"
          >
            Log Out
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Profile() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [distribution, setDistribution] = useState({ Low: 0, Medium: 0, Good: 0 })
  const [showConfirm, setShowConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [loading, setLoading] = useState(true)

  const name = profile?.name || user?.displayName || 'User'
  const email = user?.email || ''
  const initial = name.charAt(0).toUpperCase()
  const memberSince = getMemberSince(profile?.createdAt)

  useEffect(() => {
    if (!user) return
    Promise.all([getUserStats(user.uid), getLast30Days(user.uid)])
      .then(([s, d30]) => {
        setStats(s)
        setDistribution(getMoodDistribution(d30))
      })
      .finally(() => setLoading(false))
  }, [user])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logoutUser()
      navigate('/login')
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex-1 pb-24 lg:pb-8 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal onConfirm={handleLogout} onCancel={() => setShowConfirm(false)} />
        )}
      </AnimatePresence>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-extrabold text-gray-800"
      >
        Profile 👤
      </motion.h1>

      {/* Avatar + info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl shadow-card border border-purple-100 p-6 flex flex-col items-center text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-600 to-accent flex items-center justify-center text-white text-4xl font-extrabold shadow-glow mb-4">
          {initial}
        </div>
        <h2 className="text-xl font-extrabold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-400 mt-0.5">{email}</p>
        <div className="mt-3 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
          <p className="text-xs text-primary-600 font-semibold">Member since {memberSince}</p>
        </div>
      </motion.div>

      {/* Stat cards */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              icon="✅"
              label="Total Check-ins"
              value={stats?.total ?? 0}
              color="purple"
              delay={0.1}
            />
            <StatCard
              icon="🔥"
              label="Current Streak"
              value={`${stats?.streak ?? 0} day${stats?.streak !== 1 ? 's' : ''}`}
              color="amber"
              delay={0.15}
            />
            <StatCard
              icon="😊"
              label="Avg Mood (30d)"
              value={`${stats?.avgMood ?? 0}/10`}
              color="green"
              delay={0.2}
            />
            <StatCard
              icon="🏆"
              label="Best Mood Day"
              value={stats?.bestDay?.mood ? `${stats.bestDay.mood}/10` : 'N/A'}
              sub={stats?.bestDay?.date ? formatDateStr(stats.bestDay.date) : undefined}
              color="blue"
              delay={0.25}
            />
          </div>

          {/* Mood distribution */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-card border border-purple-100 p-5"
          >
            <h3 className="text-base font-bold text-gray-800 mb-4">Mood Distribution (30 days)</h3>
            <div className="space-y-3">
              {[
                { label: 'Low', pct: distribution.Low, color: 'bg-red-400' },
                { label: 'Medium', pct: distribution.Medium, color: 'bg-yellow-400' },
                { label: 'Good', pct: distribution.Good, color: 'bg-green-500' },
              ].map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.35 }}
                      className={`h-full rounded-full ${color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          id="logout-btn"
          onClick={() => setShowConfirm(true)}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-red-400 text-red-500 font-bold text-sm hover:bg-red-50 active:scale-[0.98] transition-all duration-200"
        >
          {loggingOut ? (
            <><Loader2 size={18} className="animate-spin" /> Logging out…</>
          ) : (
            <><LogOut size={18} /> Log Out</>
          )}
        </button>
      </motion.div>
    </div>
  )
}
