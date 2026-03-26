// src/pages/History.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getLast7Days, getLast30Days } from '../services/checkin'
import { getLast7DayLabels } from '../utils/dateUtils'
import MoodCalendar from '../components/MoodCalendar'
import CheckinList from '../components/CheckinList'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Dot,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-purple-100 rounded-xl px-3 py-2 shadow-card text-sm">
        <p className="font-bold text-primary-600">{label}</p>
        <p className="text-gray-600">Mood: <span className="font-bold">{payload[0].value}/10</span></p>
      </div>
    )
  }
  return null
}

export default function History() {
  const { user } = useAuth()
  const [last7, setLast7] = useState([])
  const [last30, setLast30] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([getLast7Days(user.uid), getLast30Days(user.uid)])
      .then(([d7, d30]) => {
        setLast7(d7)
        setLast30(d30)
      })
      .finally(() => setLoading(false))
  }, [user])

  // Build 7-day chart data — one entry per day label
  const dayLabels = getLast7DayLabels()
  const moodByDay = {}
  last7.forEach(c => {
    const d = new Date(c.dateStr + 'T00:00:00')
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    moodByDay[label] = c.mood
  })
  const chartData = dayLabels.map(day => ({
    day,
    mood: moodByDay[day] ?? null,
  }))

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 pb-24 lg:pb-8 px-4 py-6 max-w-2xl mx-auto w-full space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-extrabold text-gray-800"
      >
        Mood History 📅
      </motion.h1>

      {/* ── 7-Day Line Chart ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-card border border-purple-100 p-5"
      >
        <h2 className="text-base font-bold text-gray-800 mb-4">7-Day Mood Trend</h2>
        {last7.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No data yet — start checking in daily!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F0FF" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[1, 10]}
                ticks={[1, 3, 5, 7, 10]}
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#7C3AED"
                strokeWidth={3}
                dot={<Dot r={5} fill="#7C3AED" stroke="white" strokeWidth={2} />}
                activeDot={{ r: 7, fill: '#4F46E5' }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── 30-Day Heatmap ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-card border border-purple-100 p-5"
      >
        <h2 className="text-base font-bold text-gray-800 mb-4">30-Day Mood Calendar</h2>
        <MoodCalendar checkins={last30} />
      </motion.div>

      {/* ── Recent check-ins list ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card border border-purple-100 p-5"
      >
        <h2 className="text-base font-bold text-gray-800 mb-4">Recent Check-ins</h2>
        <CheckinList checkins={last30} />
      </motion.div>
    </div>
  )
}
