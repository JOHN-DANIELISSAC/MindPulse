// src/services/checkin.js
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { isToday } from '../utils/dateUtils'

const CHECKINS = 'checkins'

/**
 * Saves a new check-in to Firestore
 */
export async function submitCheckin(userId, mood, stress, note) {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0] // "2024-03-24"

  const docRef = await addDoc(collection(db, CHECKINS), {
    userId,
    mood,
    stress,
    note: note || '',
    dateStr,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

/**
 * Returns today's check-in for a user, or null if none exists
 */
export async function getTodayCheckin(userId) {
  const today = new Date().toISOString().split('T')[0]
  const q = query(
    collection(db, CHECKINS),
    where('userId', '==', userId),
    where('dateStr', '==', today),
    limit(1)
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const doc = snap.docs[0]
  return { id: doc.id, ...doc.data() }
}

/**
 * Returns last 7 check-ins ordered by date descending
 */
export async function getLast7Days(userId) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)

  const q = query(
    collection(db, CHECKINS),
    where('userId', '==', userId),
    where('createdAt', '>=', Timestamp.fromDate(cutoff)),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Returns last 30 check-ins ordered by date descending
 */
export async function getLast30Days(userId) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 30)

  const q = query(
    collection(db, CHECKINS),
    where('userId', '==', userId),
    where('createdAt', '>=', Timestamp.fromDate(cutoff)),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Returns all check-ins for a user (for stats calculation)
 */
export async function getAllCheckins(userId) {
  const q = query(
    collection(db, CHECKINS),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

/**
 * Computes user stats: total, streak, avgMood (30d), bestDay
 */
export async function getUserStats(userId) {
  const all = await getAllCheckins(userId)

  if (all.length === 0) {
    return { total: 0, streak: 0, avgMood: 0, bestDay: null }
  }

  const total = all.length

  // Average mood over last 30 days
  const cutoff30 = new Date()
  cutoff30.setDate(cutoff30.getDate() - 30)
  const last30 = all.filter(c => {
    const ts = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt)
    return ts >= cutoff30
  })
  const avgMood = last30.length
    ? (last30.reduce((sum, c) => sum + c.mood, 0) / last30.length).toFixed(1)
    : 0

  // Best mood day
  const best = [...all].sort((a, b) => b.mood - a.mood)[0]
  const bestDay = best
    ? {
        date: best.dateStr,
        mood: best.mood,
      }
    : null

  // Streak: consecutive days ending today
  const sortedDates = [...new Set(all.map(c => c.dateStr))].sort((a, b) =>
    b.localeCompare(a)
  )

  let streak = 0
  const today = new Date()
  for (let i = 0; i < sortedDates.length; i++) {
    const expected = new Date(today)
    expected.setDate(today.getDate() - i)
    const expectedStr = expected.toISOString().split('T')[0]
    if (sortedDates[i] === expectedStr) {
      streak++
    } else {
      break
    }
  }

  return { total, streak, avgMood: parseFloat(avgMood), bestDay }
}
