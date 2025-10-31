type Tab = 'today' | 'calendar' | 'stats' | 'settings'
type Props = { tab: Tab, setTab: (t: Tab) => void }
export default function TabBar({ tab, setTab }: Props) {
  return (
    <nav className="tabbar" role="tablist" aria-label="Primary">
      <button role="tab" aria-selected={tab==='today'} onClick={() => setTab('today')}>
        <span className="ico">📝</span>
        Today
      </button>
      <button role="tab" aria-selected={tab==='calendar'} onClick={() => setTab('calendar')}>
        <span className="ico">📅</span>
        Calendar
      </button>
      <button role="tab" aria-selected={tab==='stats'} onClick={() => setTab('stats')}>
        <span className="ico">📈</span>
        Stats
      </button>
      <button role="tab" aria-selected={tab==='settings'} onClick={() => setTab('settings')}>
        <span className="ico">⚙️</span>
        Settings
      </button>
    </nav>
  )
}

