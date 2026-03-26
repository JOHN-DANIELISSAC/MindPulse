// src/utils/dateUtils.js

/**
 * Returns a time-aware greeting string
 */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Formats a Firestore Timestamp or Date into "Mon, 24 Mar"
 */
export function formatDate(timestamp) {
  if (!timestamp) return ''
  let date
  if (timestamp?.toDate) {
    date = timestamp.toDate()
  } else if (timestamp instanceof Date) {
    date = timestamp
  } else {
    date = new Date(timestamp)
  }
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Formats a dateStr ("2024-03-24") into "Mon, 24 Mar"
 */
export function formatDateStr(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Checks whether a Firestore Timestamp is today
 */
export function isToday(timestamp) {
  if (!timestamp) return false
  let date
  if (timestamp?.toDate) {
    date = timestamp.toDate()
  } else {
    date = new Date(timestamp)
  }
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Returns array of last 30 date strings in "YYYY-MM-DD" format, newest first
 */
export function getLast30DaysDates() {
  const dates = []
  for (let i = 0; i < 30; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

/**
 * Returns array of last 7 days as short weekday labels (e.g. "Mon")
 */
export function getLast7DayLabels() {
  const labels = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    labels.push(
      d.toLocaleDateString('en-US', { weekday: 'short' })
    )
  }
  return labels
}

/**
 * Returns current date formatted as "Thursday, 24 March 2024"
 */
export function getTodayFormatted() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Returns a "member since" string from a Firestore Timestamp
 */
export function getMemberSince(timestamp) {
  if (!timestamp) return 'Recently'
  let date
  if (timestamp?.toDate) {
    date = timestamp.toDate()
  } else {
    date = new Date(timestamp)
  }
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
