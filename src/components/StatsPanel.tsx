import type { MoodEntry, Settings } from '../lib/types'
import { computeRecent, computeStats, computeStreak } from '../lib/stats'

type Props = {
  entries: Record<string, MoodEntry>
  settings: Settings
}

export default function StatsPanel({ entries, settings }: Props) {
  const statsAll = computeStats(entries, settings.positiveThreshold)
  const stats30 = computeRecent(entries, 30, settings.positiveThreshold)
  const stats7 = computeRecent(entries, 7, settings.positiveThreshold)
  const streak = computeStreak(entries, settings.positiveThreshold)

  return (
    <section className="panel">
      <div className="grid2">
        <div className="stat">
          <h3>All-time average</h3>
          <div className="value">{statsAll.avg.toFixed(1)} <span style={{color:'var(--muted)', fontSize:12}}>/10</span></div>
          <div className="sub">{statsAll.count} days tracked</div>
        </div>
        <div className="stat">
          <h3>All-time positive</h3>
          <div className="value">{statsAll.posPct}%</div>
          <div className="sub">≥ {settings.positiveThreshold} considered positive</div>
        </div>
        <div className="stat">
          <h3>Last 30 days</h3>
          <div className="value">{stats30.avg.toFixed(1)} <span style={{color:'var(--muted)', fontSize:12}}>/10</span></div>
          <div className="sub">{stats30.posPct}% positive</div>
        </div>
        <div className="stat">
          <h3>Last 7 days</h3>
          <div className="value">{stats7.avg.toFixed(1)} <span style={{color:'var(--muted)', fontSize:12}}>/10</span></div>
          <div className="sub">{stats7.posPct}% positive</div>
        </div>
      </div>
      <div className="space" />
      <div className="panel" style={{background:'var(--panel-2)'}}>
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <div style={{fontWeight:700}}>Current streak</div>
            <div className="sub">{streak.type ? streak.type : 'none'}</div>
          </div>
          <div className={`scoreBadge ${streak.type === 'positive' ? 'pos' : streak.type === 'negative' ? 'neg' : ''}`}>{streak.current} days</div>
        </div>
      </div>
    </section>
  )
}
