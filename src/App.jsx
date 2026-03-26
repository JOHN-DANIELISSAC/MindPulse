// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import History from './pages/History'
import Suggestions from './pages/Suggestions'
import Profile from './pages/Profile'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function AppRoutes() {
  const location = useLocation()
  const isAuth = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className={`min-h-screen bg-surface flex flex-col ${!isAuth ? 'lg:pl-64' : ''}`}>
      {!isAuth && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col flex-1"
        >
          <Routes location={location}>
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute><History /></ProtectedRoute>
            } />
            <Route path="/suggestions" element={
              <ProtectedRoute><Suggestions /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
