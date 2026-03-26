// src/components/MoodCalendar.jsx
import { motion } from 'framer-motion'
import { getHeatmapColor } from '../utils/moodUtils'
import { getLast30DaysDates } from '../utils/dateUtils'
import { useState } from 'react'

export default function MoodCalendar({ checkins }) {
  const [tooltip, setTooltip] = useState(null)
  const dates = getLast30DaysDates() // newest first, so we reverse for display

  // Build a map: dateStr -> mood
  const moodMap = {}
  checkins.forEach(c => {
    moodMap[c.dateStr] = c.mood
  })

  const displayDates = [...dates].reverse() // oldest first for grid

  return (
    <div className="space-y-4">
      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 pb-1">
            {d}
          </div>
        ))}

        {/* Empty cells to align first date to correct weekday */}
        {(() => {
          const firstDate = new Date(displayDates[0] + 'T00:00:00')
          const startDay = firstDate.getDay() // 0 = Sunday
          return Array.from({ length: startDay }, (_, i) => (
            <div key={`empty-${i}`} />
          ))
        })()}

        {/* Day cells */}
        {displayDates.map((dateStr, i) => {
          const mood = moodMap[dateStr]
          const bg = getHeatmapColor(mood)
          const isToday = dateStr === new Date().toISOString().split('T')[0]

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              onMouseEnter={() => setTooltip({ dateStr, mood })}
              onMouseLeave={() => setTooltip(null)}
              className={`aspect-square rounded-lg cursor-pointer relative transition-transform duration-150 hover:scale-110 ${
                isToday ? 'ring-2 ring-primary-500 ring-offset-1' : ''
              }`}
              style={{ backgroundColor: bg }}
              title={mood ? `${dateStr}: ${mood}/10` : dateStr}
            />
          )
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="text-center text-sm text-gray-600 font-medium bg-white rounded-xl px-4 py-2 shadow-card border border-purple-100">
          {tooltip.dateStr} —{' '}
          {tooltip.mood !== undefined
            ? `Mood: ${tooltip.mood}/10`
            : 'No data'}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-500">Legend:</span>
        {[
          { color: '#E5E7EB', label: 'No data' },
          { color: '#FCA5A5', label: 'Low (1–3)' },
          { color: '#FCD34D', label: 'Medium (4–6)' },
          { color: '#FDE68A', label: 'Fair (7)' },
          { color: '#6EE7B7', label: 'High (8–10)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
