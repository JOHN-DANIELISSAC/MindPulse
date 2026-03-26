// src/components/CheckinList.jsx
import { motion } from 'framer-motion'
import { getMoodEmoji, getMoodLabel } from '../utils/moodUtils'
import { formatDateStr } from '../utils/dateUtils'

const STRESS_COLORS = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
}

export default function CheckinList({ checkins }) {
  if (!checkins || checkins.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <span className="text-4xl block mb-2">📭</span>
        <p className="text-sm font-medium">No check-ins yet</p>
        <p className="text-xs mt-1">Start tracking your mood daily!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {checkins.slice(0, 10).map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.35 }}
          className="bg-white rounded-2xl p-4 shadow-card border border-purple-50 flex gap-4 items-start"
        >
          {/* Mood emoji + score */}
          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-purple-50 flex-shrink-0">
            <span className="text-xl leading-none">{getMoodEmoji(c.mood)}</span>
            <span className="text-xs font-bold text-primary-600 mt-0.5">{c.mood}/10</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-700">
                {formatDateStr(c.dateStr)}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STRESS_COLORS[c.stress] || 'bg-gray-100 text-gray-500'}`}>
                {c.stress || 'N/A'} stress
              </span>
            </div>
            {c.note ? (
              <p className="text-sm text-gray-500 truncate">{c.note}</p>
            ) : (
              <p className="text-xs text-gray-300 italic">No note added</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
