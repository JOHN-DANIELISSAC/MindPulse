// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { getUserProfile } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        try {
          const prof = await getUserProfile(firebaseUser.uid)
          setProfile(prof)
        } catch {
          setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const refreshProfile = async () => {
    if (user) {
      const prof = await getUserProfile(user.uid)
      setProfile(prof)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
