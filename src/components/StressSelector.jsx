// src/components/StressSelector.jsx
import { motion } from 'framer-motion'

const OPTIONS = [
  { label: 'Low', emoji: '🟢', value: 'Low', color: 'bg-green-500', ring: 'ring-green-400', text: 'text-green-700', bg: 'bg-green-50' },
  { label: 'Medium', emoji: '🟡', value: 'Medium', color: 'bg-yellow-400', ring: 'ring-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50' },
  { label: 'High', emoji: '🔴', value: 'High', color: 'bg-red-500', ring: 'ring-red-400', text: 'text-red-700', bg: 'bg-red-50' },
]

export default function StressSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-500">Stress level today?</p>
      <div className="flex gap-3">
        {OPTIONS.map(opt => {
          const isSelected = value === opt.value
          return (
            <motion.button
              key={opt.value}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${
                isSelected
                  ? `${opt.color} text-white border-transparent shadow-lg`
                  : `bg-white border-gray-200 ${opt.text} hover:${opt.bg}`
              }`}
            >
              <span className="text-base">{opt.emoji}</span>
              <span>{opt.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
