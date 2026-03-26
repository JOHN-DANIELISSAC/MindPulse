// src/components/ResourceCard.jsx
import { motion } from 'framer-motion'

export default function ResourceCard({ icon, title, description, buttonLabel, onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl p-5 shadow-card border border-purple-100 flex flex-col gap-4 hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-base mb-1">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="mt-auto w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-600 to-accent text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md"
      >
        {buttonLabel}
      </button>
    </motion.div>
  )
}
