import { useRef, useState } from 'react'
import type { MoodEntry, Settings } from '../lib/types'
import { getMonthDays, toKey } from '../lib/date'
import { colorForScore } from '../lib/stats'

type Props = {
  month: Date
  setMonth: (d: Date) => void
  entries: Record<string, MoodEntry>
  settings: Settings
  todayKey: string
  onOpenDay: (dateKey: string) => void
}

export default function CalendarPanel({ month, setMonth, entries, settings, todayKey, onOpenDay }: Props) {
  // Swipe gesture
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const [swiping, setSwiping] = useState(false)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; touchStartX.current = t.clientX; touchStartY.current = t.clientY; setSwiping(true)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!swiping || touchStartX.current == null || touchStartY.current == null) return
    // prevent vertical scroll only when horizontal intent is clear
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) e.preventDefault()
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return setSwiping(false)
    const dx = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current
    const threshold = 50
    if (dx <= -threshold) setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
    if (dx >= threshold) setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
    setSwiping(false); touchStartX.current = null; touchStartY.current = null
  }

  const isOtherMonth = month.getMonth() !== new Date().getMonth() || month.getFullYear() !== new Date().getFullYear()

  return (
    <section className="panel" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
        <button className="ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>◀</button>
        <div style={{fontWeight:700}}>{month.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <button className="ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>▶</button>
      </div>
      <div className="space" />
      <div className="legend">
        <span className="pos scoreBadge">positive</span>
        <span className="neg scoreBadge">negative</span>
      </div>
      <div className="space" />
      <div className="calendar">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} style={{textAlign:'center', color:'var(--muted)', fontSize:12}}>{d}</div>
        ))}
        {getMonthDays(month).map((d, i) => {
          if (!d) return <div key={`pad-${i}`} />
          const k = toKey(d)
          const e = entries[k]
          const style: React.CSSProperties = {}
          if (e) {
            const c = colorForScore(e.score, settings.positiveThreshold)
            style.background = c.bg
            style.borderColor = c.border
          }
          return (
            <button key={k} className="dayCell" style={style} onClick={() => {
              if (k === todayKey && !e) return onOpenDay(k) // jump to today page upstream
              if (e) onOpenDay(k)
            }}>
              <div className="date">{d.getDate()}</div>
              <div />
              <div className="note">{e ? `${e.score}` : ''}</div>
            </button>
          )
        })}
      </div>
      {isOtherMonth && (
        <>
          <div className="space" />
          <div className="center">
            <button className="ghost" onClick={() => setMonth(new Date())}>today</button>
          </div>
        </>
      )}
    </section>
  )
}
