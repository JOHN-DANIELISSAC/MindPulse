// src/pages/Suggestions.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getLast7Days } from '../services/checkin'
import { analyzeStress } from '../utils/moodUtils'
import NudgeCard from '../components/NudgeCard'
import ResourceCard from '../components/ResourceCard'

// ──────────────────────────────────────────
// Breathing Exercise Widget
// ──────────────────────────────────────────
const PHASES = [
  { label: 'Inhale...', duration: 4000, scale: 1.35 },
  { label: 'Hold...', duration: 4000, scale: 1.35 },
  { label: 'Exhale...', duration: 4000, scale: 1 },
]

function BreathingWidget() {
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  function tick() {
    const now = Date.now()
    const elapsed = now - startTimeRef.current
    const phase = PHASES[phaseIdx]

    if (elapsed >= phase.duration) {
      startTimeRef.current = now
      setPhaseIdx(prev => (prev + 1) % PHASES.length)
      setProgress(0)
    } else {
      setProgress(elapsed / phase.duration)
    }
  }

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now()
      intervalRef.current = setInterval(tick, 50)
    } else {
      clearInterval(intervalRef.current)
      setPhaseIdx(0)
      setProgress(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, phaseIdx])

  const phase = PHASES[phaseIdx]
  const size = 140 + (phase.scale - 1) * 140 * progress

  const colors = [
    '#7C3AED', // inhale — purple
    '#4F46E5', // hold — indigo
    '#10B981', // exhale — green
  ]
  const color = colors[phaseIdx]

  return (
    <div className="bg-white rounded-2xl shadow-card border border-purple-100 p-6 text-center">
      <h3 className="text-base font-bold text-gray-800 mb-1">4-4-4 Breathing Exercise</h3>
      <p className="text-xs text-gray-400 mb-6">Box breathing reduces anxiety in minutes</p>

      <div className="flex items-center justify-center h-48 mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={phaseIdx + '-' + running}
            className="rounded-full flex items-center justify-center shadow-lg"
            animate={{ width: running ? size : 140, height: running ? size : 140 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            style={{ backgroundColor: color }}
          >
            <div className="text-center px-3">
              <span className="text-white font-extrabold text-lg block">
                {running ? phase.label : '🫁'}
              </span>
              {running && (
                <span className="text-white/70 text-xs">
                  {Math.ceil(phase.duration / 1000 - (progress * phase.duration / 1000))}s
                </span>
              )}
              {!running && (
                <span className="text-white/80 text-xs block mt-1">Press Start</span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => setRunning(v => !v)}
        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95 ${
          running
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gradient-to-r from-primary-600 to-accent text-white shadow-md hover:opacity-90'
        }`}
      >
        {running ? '⏹ Stop' : '▶ Start'}
      </button>
    </div>
  )
}

// ──────────────────────────────────────────
// Main Page
// ──────────────────────────────────────────
export default function Suggestions() {
  const { user } = useAuth()
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  const [rule, setRule] = useState(3)
  const [avgMood, setAvgMood] = useState(null)

  useEffect(() => {
    if (!user) return
    getLast7Days(user.uid)
      .then(data => {
        setCheckins(data)
        const r = analyzeStress(data)
        setRule(r)
        if (data.length > 0) {
          const avg = (data.reduce((s, c) => s + c.mood, 0) / data.length).toFixed(1)
          setAvgMood(parseFloat(avg))
        }
      })
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 pb-24 lg:pb-8 px-4 py-6 max-w-lg mx-auto w-full space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-gray-800">Suggestions 💡</h1>
        <p className="text-sm text-gray-400 mt-0.5">Based on your last 7 days</p>
      </motion.div>

      {/* Nudge card */}
      <NudgeCard rule={rule} avgMood={avgMood} />

      {/* Breathing widget — only for rule 1 or 2 */}
      {(rule === 1 || rule === 2) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <BreathingWidget />
        </motion.div>
      )}

      {/* Campus resources */}
      <motion.div
        id="resources"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h2 className="text-base font-bold text-gray-800">Campus Resources 🏫</h2>
        <div className="grid grid-cols-1 gap-4">
          <ResourceCard
            icon="🧠"
            title="Student Counselor"
            description="Book a free, confidential one-on-one session with a trained counselor. Available Monday–Friday."
            buttonLabel="Book Now"
            onClick={() => alert('Redirecting to counselor booking portal...')}
            delay={0.25}
          />
          <ResourceCard
            icon="🧘"
            title="Meditation Room"
            description="Open daily 8am–8pm · Block C, Room 12 · No booking needed. Drop in anytime."
            buttonLabel="Get Directions"
            onClick={() => window.open('https://maps.google.com', '_blank')}
            delay={0.3}
          />
          <ResourceCard
            icon="📞"
            title="Mental Health Helpline"
            description="iCall: 9152987821 · Available 8am–10pm · Free, anonymous, and confidential."
            buttonLabel="Call Now"
            onClick={() => window.open('tel:9152987821')}
            delay={0.35}
          />
        </div>
      </motion.div>
    </div>
  )
}
