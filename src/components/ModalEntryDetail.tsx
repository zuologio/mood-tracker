import type { MoodEntry } from '../lib/types'

type Props = {
  dateKey: string
  entry: MoodEntry
  isToday: boolean
  positiveThreshold: number
  onClose: () => void
  onDeleteToday?: () => void
}

export default function ModalEntryDetail({ dateKey, entry, isToday, positiveThreshold, onClose, onDeleteToday }: Props) {
  return (
    <div className="modalBackdrop" role="dialog" aria-modal="true" aria-labelledby="entryTitle" onClick={(ev) => { if (ev.currentTarget === ev.target) onClose() }}>
      <div className="modal" role="document">
        <div className="row">
          <h2 id="entryTitle">{new Date(dateKey).toLocaleDateString(undefined, { weekday:'short', year:'numeric', month:'short', day:'numeric' })}</h2>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        <div className="space" />
        <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
          <div className="meta">Score</div>
          <div className={`scoreBadge ${entry.score >= positiveThreshold ? 'pos':'neg'}`}>{entry.score}/10</div>
        </div>
        <div className="space" />
        <div className="meta">Notes</div>
        <div className="noteBox">{entry.note || 'No note'}</div>
        <div className="space" />
        <div className="row" style={{justifyContent:'flex-end', gap: '8px'}}>
          {isToday && onDeleteToday && (
            <button className="warn" onClick={onDeleteToday}>Delete today</button>
          )}
          {!isToday && <button className="ghost" onClick={onClose}>Close</button>}
        </div>
      </div>
    </div>
  )
}
