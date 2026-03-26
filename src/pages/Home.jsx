// src/pages/Home.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import MoodSlider from '../components/MoodSlider'
import StressSelector from '../components/StressSelector'
import { submitCheckin, getTodayCheckin } from '../services/checkin'
import { getGreeting, getTodayFormatted } from '../utils/dateUtils'
import { getMoodEmoji, getMoodLabel } from '../utils/moodUtils'

const QUOTES = [
  "Every day is a fresh start. Keep going! 🌱",
  "You showed up — that's already a win. ✨",
  "Small steps lead to big changes. 🚀",
  "Self-awareness is the beginning of growth. 🌿",
  "You matter. Your feelings matter. 💜",
]

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 60, scale: 0.9 }}
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl text-white font-semibold text-sm shadow-2xl flex items-center gap-2 ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : '⚠️'}
      {message}
    </motion.div>
  )
}

export default function Home() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [mood, setMood] = useState(7)
  const [stress, setStress] = useState('Low')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingToday, setCheckingToday] = useState(true)
  const [todayEntry, setTodayEntry] = useState(null)
  const [toast, setToast] = useState(null)

  const firstName = profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there'
  const greeting = getGreeting()
  const todayFormatted = getTodayFormatted()
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  useEffect(() => {
    if (!user) return
    getTodayCheckin(user.uid)
      .then(entry => setTodayEntry(entry))
      .catch(() => setTodayEntry(null))
      .finally(() => setCheckingToday(false))
  }, [user])

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stress) { showToast('Please select a stress level.', 'error'); return }
    setLoading(true)
    try {
      await submitCheckin(user.uid, mood, stress, note.trim())
      showToast('Check-in saved! Great job 🎉', 'success')
      setTimeout(() => navigate('/suggestions'), 1500)
    } catch (err) {
      showToast('Failed to save. Please try again.', 'error')
      setLoading(false)
    }
  }

  if (checkingToday) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading your day…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 pb-24 lg:pb-8 px-4 py-6 max-w-lg mx-auto w-full">
      <AnimatePresence>
        {toast && (
          <Toast
            key="toast"
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-extrabold text-gray-800">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">{todayFormatted}</p>
      </motion.div>

      {/* Already checked in */}
      {todayEntry ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-primary-600 to-accent rounded-3xl p-7 text-white shadow-glow text-center"
        >
          <div className="text-6xl mb-4">{getMoodEmoji(todayEntry.mood)}</div>
          <h2 className="text-xl font-extrabold mb-1">Already checked in today!</h2>
          <p className="text-purple-200 text-sm mb-4">
            You logged a <span className="font-bold text-white">{todayEntry.mood}/10</span> mood · {getMoodLabel(todayEntry.mood)} wellbeing
          </p>
          <div className="bg-white/15 rounded-2xl px-5 py-4 backdrop-blur-sm">
            <p className="text-sm text-purple-100 italic">"{quote}"</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="mt-5 bg-white text-primary-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-purple-50 active:scale-95 transition-all duration-200 shadow"
          >
            View History →
          </button>
        </motion.div>
      ) : (
        /* Check-in form */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-3xl shadow-card border border-purple-100 overflow-hidden">
            {/* Header strip */}
            <div className="bg-gradient-to-r from-primary-600 to-accent px-6 py-4">
              <h2 className="text-white font-bold text-lg">Daily Check-in ✍️</h2>
              <p className="text-purple-200 text-xs mt-0.5">How are you doing today?</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-7">
              {/* Mood slider */}
              <MoodSlider value={mood} onChange={setMood} />

              <div className="border-t border-purple-50" />

              {/* Stress selector */}
              <StressSelector value={stress} onChange={setStress} />

              <div className="border-t border-purple-50" />

              {/* Note */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-500">What's on your mind?</label>
                  <span className={`text-xs font-medium ${note.length > 180 ? 'text-red-400' : 'text-gray-400'}`}>
                    {note.length}/200
                  </span>
                </div>
                <textarea
                  id="checkin-note"
                  value={note}
                  onChange={e => e.target.value.length <= 200 && setNote(e.target.value)}
                  placeholder="Optional — Write anything on your mind..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none resize-none transition-all duration-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 placeholder:text-gray-300"
                />
              </div>

              {/* Submit */}
              <button
                id="checkin-submit"
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent text-white font-bold text-base shadow-md hover:opacity-92 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Saving…</>
                ) : (
                  <><Send size={18} /> Submit Check-in</>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  )
}
