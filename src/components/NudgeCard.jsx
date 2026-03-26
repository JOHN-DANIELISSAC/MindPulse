// src/components/NudgeCard.jsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const RULES = {
  1: {
    icon: '❤️',
    heading: "We're here for you",
    message:
      "We've noticed you've been going through a tough streak lately. It's completely okay to not be okay. Your feelings are valid, and taking small steps toward support can make a real difference. You don't have to face this alone.",
    action: 'Talk to a counselor →',
    actionColor: 'bg-red-500 hover:bg-red-600',
    border: 'border-red-200',
    bg: 'bg-red-50',
    badge: 'text-red-700 bg-red-100',
    badgeText: 'Needs Attention',
    iconBg: 'bg-red-100',
  },
  2: {
    icon: '⚠️',
    heading: 'Take a breather',
    message:
      "Your mood has been a bit lower than usual this week. That's a signal worth listening to. Try stepping away from your work for a few minutes, breathing slowly, or talking to a friend. Small resets can create big shifts.",
    action: 'Try this breathing exercise →',
    actionColor: 'bg-yellow-500 hover:bg-yellow-600',
    border: 'border-yellow-200',
    bg: 'bg-yellow-50',
    badge: 'text-yellow-700 bg-yellow-100',
    badgeText: 'Feeling Moderate',
    iconBg: 'bg-yellow-100',
  },
  3: {
    icon: '🌟',
    heading: "You're doing great!",
    message:
      "Your mood has been consistently positive — that's worth celebrating! Keep nurturing your wellbeing with the same energy. Whether it's sleep, exercise, or meaningful connections, whatever you're doing is clearly working.",
    action: 'Keep the streak going →',
    actionColor: 'bg-green-500 hover:bg-green-600',
    border: 'border-green-200',
    bg: 'bg-green-50',
    badge: 'text-green-700 bg-green-100',
    badgeText: 'Feeling Great',
    iconBg: 'bg-green-100',
  },
}

export default function NudgeCard({ rule = 3, avgMood, streak }) {
  const r = RULES[rule] || RULES[3]
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border-2 ${r.border} ${r.bg} p-6 shadow-card`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl ${r.iconBg} flex items-center justify-center text-3xl flex-shrink-0 shadow-sm`}>
          {r.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.badge}`}>
              {r.badgeText}
            </span>
            {avgMood !== undefined && (
              <span className="text-xs text-gray-500">Avg mood: {avgMood}/10</span>
            )}
          </div>
          <h3 className="text-xl font-extrabold text-gray-800 mb-2">{r.heading}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">{r.message}</p>
          <button
            onClick={() => {
              if (rule === 1) navigate('/suggestions#resources')
            }}
            className={`${r.actionColor} text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95`}
          >
            {r.action}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
