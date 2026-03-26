// src/components/Navbar.jsx
import { NavLink, useLocation } from 'react-router-dom'
import { Home, CalendarDays, Lightbulb, User } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { to: '/',            label: 'Home',        Icon: Home        },
  { to: '/history',     label: 'History',     Icon: CalendarDays},
  { to: '/suggestions', label: 'Suggestions', Icon: Lightbulb   },
  { to: '/profile',     label: 'Profile',     Icon: User        },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <>
      {/* ── MOBILE: fixed bottom bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-purple-100 shadow-[0_-4px_20px_rgba(124,58,237,0.08)] lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map(({ to, label, Icon }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute -top-0.5 w-8 h-1 rounded-full bg-gradient-to-r from-primary-600 to-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  size={22}
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-400'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold transition-colors duration-200 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-400'
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* ── DESKTOP: left sidebar ── */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 flex-col bg-white border-r border-purple-100 shadow-[4px_0_20px_rgba(124,58,237,0.06)] z-50 py-8 px-5">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <span className="text-3xl">🧠</span>
          <span className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
            MindPulse
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-accent text-white shadow-md'
                    : 'text-gray-500 hover:bg-purple-50 hover:text-primary-600'
                }`}
              >
                <Icon size={20} />
                {label}
              </NavLink>
            )
          })}
        </nav>

        {/* Footer branding */}
        <div className="mt-auto pt-4 border-t border-purple-100">
          <p className="text-xs text-gray-400 text-center">Your wellness, every day ✨</p>
        </div>
      </aside>
    </>
  )
}
