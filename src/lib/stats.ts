import type { MoodEntry, Streak } from './types'

export function computeStats(entries: Record<string, MoodEntry>, threshold: number) {
  const vals = Object.values(entries)
  if (vals.length === 0) return { avg: 0, count: 0, posPct: 0 }
  const avg = vals.reduce((a, b) => a + b.score, 0) / vals.length
  const pos = vals.filter(e => e.score >= threshold).length
  return { avg, count: vals.length, posPct: vals.length ? Math.round((pos / vals.length) * 100) : 0 }
}

export function computeRecent(entries: Record<string, MoodEntry>, days: number, threshold: number) {
  const now = new Date()
  const since = new Date(now)
  since.setDate(now.getDate() - (days - 1))
  const list: MoodEntry[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    const k = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
    const e = entries[k]
    if (e) list.push(e)
  }
  const avg = list.length ? list.reduce((a, b) => a + b.score, 0) / list.length : 0
  const pos = list.filter(e => e.score >= threshold).length
  return { avg, count: list.length, posPct: list.length ? Math.round(pos / list.length * 100) : 0 }
}

export function computeStreak(entries: Record<string, MoodEntry>, threshold: number): Streak {
  let cur = 0
  let type: 'positive' | 'negative' | null = null
  const now = new Date()
  for (let i = 0; i < 4000; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const k = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
    const e = entries[k]
    if (i === 0 && !e) { cur = 0; type = null; break }
    if (!e) break
    const isPos = e.score >= threshold
    if (i === 0) { type = isPos ? 'positive' : 'negative'; cur = 1; continue }
    if ((type === 'positive' && isPos) || (type === 'negative' && !isPos)) cur++
    else break
  }
  return { current: cur, type }
}

export function colorForScore(score: number, threshold: number) {
  const ratio = (score - 1) / 9
  const r = ratio < 0.5 ? 255 : Math.round(255 * (1 - (ratio - 0.5) * 2))
  const g = ratio < 0.5 ? Math.round(255 * (ratio * 2)) : 255
  const b = 120
  const border = score >= threshold ? 'rgba(34,197,94,.35)' : 'rgba(239,68,68,.35)'
  return { bg: `rgba(${r},${g},${b},.18)`, color: `rgb(${r},${g},${b})`, border }
}
