import { useEffect, useRef, useState } from 'react'
import './App.css'
import type { MoodEntry, Settings } from './lib/types'
import { STORAGE_KEY, SETTINGS_KEY } from './lib/types'
import { fromStorage, toStorage } from './lib/storage'
import { todayKey as getTodayKey } from './lib/date'
import Toast from './components/Toast'
import InstallPill from './components/InstallPill'
import TabBar from './components/TabBar'
import ModalEntryDetail from './components/ModalEntryDetail'
import TodayPanel from './components/TodayPanel'
import CalendarPanel from './components/CalendarPanel'
import StatsPanel from './components/StatsPanel'
import SettingsPanel from './components/SettingsPanel'

function useInstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null)
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferred(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  return deferred
}

function App() {
  const [entries, setEntries] = useState<Record<string, MoodEntry>>(() => fromStorage(STORAGE_KEY, {}))
  const [settings, setSettings] = useState<Settings>(() => fromStorage(SETTINGS_KEY, { positiveThreshold: 6, notificationEnabled: false, notificationTime: '21:00' }))
  const [tab, setTab] = useState<'today' | 'calendar' | 'stats' | 'settings'>('today')
  const [month, setMonth] = useState<Date>(new Date())
  const deferredPrompt = useInstallPrompt()
  const notifTimer = useRef<number | null>(null)
  const [dialogDate, setDialogDate] = useState<string | null>(null)

  useEffect(() => { toStorage(STORAGE_KEY, entries) }, [entries])
  useEffect(() => { toStorage(SETTINGS_KEY, settings) }, [settings])

  useEffect(() => {
    if (!settings.notificationEnabled) { if (notifTimer.current) { window.clearTimeout(notifTimer.current) }; return }
    const schedule = () => {
      const [hh, mm] = settings.notificationTime.split(':').map(Number)
      const now = new Date()
      const next = new Date()
      next.setHours(hh, mm, 0, 0)
      if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1)
      const ms = next.getTime() - now.getTime()
      if (notifTimer.current) window.clearTimeout(notifTimer.current)
      notifTimer.current = window.setTimeout(async () => {
        try {
          if (Notification.permission === 'granted') new Notification('How was your day?', { body: 'Record your mood before bed.' })
        } finally { schedule() }
      }, ms)
    }
    schedule()
    return () => { if (notifTimer.current) window.clearTimeout(notifTimer.current) }
  }, [settings.notificationEnabled, settings.notificationTime])

  const today = getTodayKey()
  const todaySavedEntry = entries[today]
  const [todayDraft, setTodayDraft] = useState<MoodEntry>(todaySavedEntry ?? { date: today, score: 7, note: '' })
  useEffect(() => {
    // Reset draft at day change or when no saved entry
    if (!entries[today]) setTodayDraft({ date: today, score: 7, note: '' })
  }, [today, entries])
  const [toast, setToast] = useState<string | null>(null)

  // stats computed inside StatsPanel

  const saveToday = (e: MoodEntry) => setEntries(prev => ({ ...prev, [e.date]: e }))

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ entries, settings }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `mood-tracker-backup-${getTodayKey()}.json`; a.click(); URL.revokeObjectURL(url)
  }
  const importData = (f: File) => {
    const r = new FileReader()
    r.onload = () => {
      try {
        const obj = JSON.parse(String(r.result || '{}'))
        if (obj.entries) setEntries(obj.entries)
        if (obj.settings) setSettings(s => ({ ...s, ...obj.settings }))
      } catch { alert('Invalid backup file') }
    }
    r.readAsText(f)
  }

  const requestNotifications = async () => {
    if (!('Notification' in window)) { alert('Notifications not supported on this device'); return }
    const perm = await Notification.requestPermission()
    if (perm === 'granted') setSettings(s => ({ ...s, notificationEnabled: true }))
  }

  return (
    <div className="app">
      {toast && <Toast message={toast} />}
      <header>
        <h1>Mood Tracker</h1>
        <div className="sub">Each day is special, unique, and unrepeatable.</div>
        <div className="space" />
      </header>

      <main className="container">
        {tab === 'today' && (
          <TodayPanel
            today={today}
            savedEntry={todaySavedEntry}
            draft={todayDraft}
            setDraft={setTodayDraft}
            settings={settings}
            onSubmit={(entry) => { saveToday(entry); setToast('Saved for today ✓'); try{navigator.vibrate?.(80)}catch{}; window.setTimeout(() => setToast(null), 1500) }}
            onInstallClick={deferredPrompt ? async () => { deferredPrompt.prompt(); await deferredPrompt.userChoice } : undefined}
          />
        )}

        {tab === 'calendar' && (
          <CalendarPanel
            month={month}
            setMonth={(d) => setMonth(d)}
            entries={entries}
            settings={settings}
            todayKey={today}
            onOpenDay={(k) => { if (k === today && !entries[k]) setTab('today'); else setDialogDate(k) }}
          />
        )}

        {tab === 'stats' && (<StatsPanel entries={entries} settings={settings} />)}

        {tab === 'settings' && (
          <SettingsPanel
            settings={settings}
            setSettings={(fn) => setSettings(fn)}
            exportData={exportData}
            importData={importData}
            clearAll={() => setEntries({})}
            requestNotifications={requestNotifications}
          />
        )}

      </main>

      <footer className="footer">
        {deferredPrompt && <InstallPill onInstall={async () => { deferredPrompt.prompt(); await deferredPrompt.userChoice }} />}
      </footer>

      <TabBar tab={tab} setTab={setTab} />

      {dialogDate && (() => {
        const e = entries[dialogDate]
        const isToday = dialogDate === today
        if (!e) return null
        return (
          <ModalEntryDetail
            dateKey={dialogDate}
            entry={e}
            isToday={isToday}
            positiveThreshold={settings.positiveThreshold}
            onClose={() => setDialogDate(null)}
            onDeleteToday={isToday ? () => { setEntries(prev => { const cp = { ...prev }; delete cp[dialogDate!]; return cp }); setDialogDate(null); setTab('today') } : undefined}
          />
        )
      })()}
    </div>
  )
}

export default App
