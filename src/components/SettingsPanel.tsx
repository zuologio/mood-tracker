import type { Settings } from '../lib/types'

type Props = {
  settings: Settings
  setSettings: (updater: (s: Settings) => Settings) => void
  exportData: () => void
  importData: (f: File) => void
  clearAll: () => void
  requestNotifications: () => Promise<void>
}

export default function SettingsPanel({ settings, setSettings, exportData, importData, clearAll, requestNotifications }: Props) {
  return (
    <section className="panel">
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700}}>Positive threshold</div>
          <div className="sub">Days with score ≥ threshold count as positive.</div>
        </div>
        <select value={settings.positiveThreshold} onChange={e => setSettings(s => ({ ...s, positiveThreshold: Number(e.target.value) }))}>
          {Array.from({length:10}, (_,i)=>i+1).map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="space" />
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700}}>Daily reminder</div>
          <div className="sub">Get a notification near bedtime.</div>
        </div>
        <div className="row">
          <input type="time" value={settings.notificationTime} onChange={e => setSettings(s => ({ ...s, notificationTime: e.target.value }))} />
          {settings.notificationEnabled
            ? <button className="ghost" onClick={() => setSettings(s => ({ ...s, notificationEnabled: false }))}>Disable</button>
            : <button className="primary" onClick={requestNotifications}>Enable</button>
          }
        </div>
      </div>
      <div className="space" />
      <div className="row" style={{justifyContent:'space-between'}}>
        <div>
          <div style={{fontWeight:700}}>Backup</div>
          <div className="sub">Export or import your data offline.</div>
        </div>
        <div className="row">
          <button className="ghost" onClick={exportData}>Export</button>
          <label className="ghost" htmlFor="importFile" style={{display:'inline-block', cursor:'pointer', padding:'10px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,.12)'}}>
            Import
            <input id="importFile" type="file" accept="application/json" style={{display:'none'}} onChange={e => { const f = e.target.files?.[0]; if (f) importData(f) }} />
          </label>
        </div>
      </div>
      <div className="space" />
      <button className="warn" onClick={() => { if (confirm('Clear all entries?')) clearAll() }}>Clear all data</button>
    </section>
  )
}
