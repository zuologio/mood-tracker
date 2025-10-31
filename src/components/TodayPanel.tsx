import type { MoodEntry, Settings } from '../lib/types'

type Props = {
  today: string
  savedEntry?: MoodEntry
  draft: MoodEntry
  setDraft: (e: MoodEntry) => void
  settings: Settings
  onSubmit: (e: MoodEntry) => void
  onInstallClick?: () => void
}

export default function TodayPanel({ today, savedEntry, draft, setDraft, settings, onSubmit, onInstallClick }: Props) {
  const todayScore = savedEntry?.score ?? draft.score
  const todaySaved = !!savedEntry
  return (
    <section className="panel today" aria-label="today entry">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div className="leftText" style={{flex:1}}>
          <div style={{fontWeight:700}}>How was your day?</div>
          <div className="sub">Slide to rate and add a note.</div>
        </div>
        <div className={`scoreBadge ${todayScore >= settings.positiveThreshold ? 'pos':'neg'}`}>{todayScore}/10</div>
      </div>
      <div className="space" />
      <input
        className="slider"
        aria-label="Mood score"
        type="range" min={1} max={10} value={todaySaved ? savedEntry!.score : draft.score}
        onChange={e => !todaySaved && setDraft({ ...draft, score: Number(e.target.value) })}
        disabled={todaySaved}
      />
      <div className="space" />
      <label>Notes</label>
      <textarea rows={5} placeholder="What made it that way?" value={todaySaved ? (savedEntry?.note || '') : (draft.note || '')}
        onChange={e => !todaySaved && setDraft({ ...draft, note: e.target.value })}
        disabled={todaySaved}
      />
      <div className="space" />
      <div className="center">
        {!todaySaved ? (
          <button className="primary btn-cta" onClick={() => onSubmit({ ...draft, date: today })}>Submit</button>
        ) : (
          <span className="sub">Saved — manage from Calendar</span>
        )}
      </div>
      {onInstallClick && (
        <>
          <div className="spacerSm" />
          <div className="center"><button className="ghost" onClick={onInstallClick}>Install App</button></div>
        </>
      )}
      
    </section>
  )
}
