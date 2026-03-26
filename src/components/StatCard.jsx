// src/components/StatCard.jsx
import { motion } from 'framer-motion'

export default function StatCard({ icon, label, value, sub, color = 'purple', delay = 0 }) {
  const colors = {
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100'  },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100'  },
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100'   },
  }
  const c = colors[color] || colors.purple

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`bg-white rounded-2xl p-5 border ${c.border} shadow-card flex flex-col gap-3`}
    >
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.icon} text-xl`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-800 leading-none">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
    </motion.div>
  )
}
