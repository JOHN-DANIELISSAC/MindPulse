// src/utils/moodUtils.js

/**
 * Returns an emoji for a mood score 1-10
 */
export function getMoodEmoji(score) {
  if (score <= 2) return '😭'
  if (score <= 4) return '😢'
  if (score <= 6) return '😐'
  if (score <= 8) return '😊'
  return '🤩'
}

/**
 * Returns a Tailwind CSS color class based on mood score
 */
export function getMoodColor(score) {
  if (score <= 3) return 'text-red-500'
  if (score <= 5) return 'text-orange-500'
  if (score <= 7) return 'text-yellow-500'
  return 'text-green-500'
}

/**
 * Returns a CSS hex color for chart rendering based on mood score
 */
export function getMoodHexColor(score) {
  if (score <= 3) return '#EF4444'
  if (score <= 5) return '#F97316'
  if (score <= 7) return '#EAB308'
  return '#10B981'
}

/**
 * Returns a label string (Low / Medium / Good) for a mood score
 */
export function getMoodLabel(score) {
  if (score <= 3) return 'Low'
  if (score <= 6) return 'Medium'
  return 'Good'
}

/**
 * Returns slider track color class based on score
 */
export function getSliderColor(score) {
  if (score <= 3) return '#EF4444'
  if (score <= 5) return '#F97316'
  if (score <= 7) return '#EAB308'
  return '#10B981'
}

/**
 * Returns heatmap background color for calendar
 */
export function getHeatmapColor(score) {
  if (score === null || score === undefined) return '#E5E7EB'
  if (score <= 3) return '#FCA5A5'
  if (score <= 6) return '#FCD34D'
  if (score <= 7) return '#FDE68A'
  return '#6EE7B7'
}

/**
 * Analyzes check-ins and returns nudge rule: 1 (critical), 2 (moderate), 3 (good)
 */
export function analyzeStress(checkins) {
  if (!checkins || checkins.length === 0) return 3

  const last7 = checkins.slice(0, 7)

  // Average mood
  const avgMood = last7.reduce((sum, c) => sum + c.mood, 0) / last7.length

  // Dominant stress level
  const stressCounts = { Low: 0, Medium: 0, High: 0 }
  last7.forEach(c => {
    if (c.stress && stressCounts[c.stress] !== undefined) {
      stressCounts[c.stress]++
    }
  })

  // Consecutive high stress days
  let consecutiveHigh = 0
  for (const c of last7) {
    if (c.stress === 'High') consecutiveHigh++
    else break
  }

  // Consecutive medium stress days
  let consecutiveMedium = 0
  for (const c of last7) {
    if (c.stress === 'Medium') consecutiveMedium++
    else break
  }

  // Rule 1 — CRITICAL
  if (avgMood < 5 || consecutiveHigh >= 2) return 1

  // Rule 2 — MODERATE
  if ((avgMood >= 5 && avgMood < 7) || consecutiveMedium >= 3) return 2

  // Rule 3 — GOOD
  return 3
}

/**
 * Returns mood distribution percentages for Low / Medium / Good
 */
export function getMoodDistribution(checkins) {
  if (!checkins || checkins.length === 0) {
    return { Low: 0, Medium: 0, Good: 0 }
  }
  const counts = { Low: 0, Medium: 0, Good: 0 }
  checkins.forEach(c => {
    const label = getMoodLabel(c.mood)
    counts[label]++
  })
  const total = checkins.length
  return {
    Low: Math.round((counts.Low / total) * 100),
    Medium: Math.round((counts.Medium / total) * 100),
    Good: Math.round((counts.Good / total) * 100),
  }
}
