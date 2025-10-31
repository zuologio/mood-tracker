# Mood Tracker – Daily Score & Journal

Track your daily mood (1–10) and journal what made it that way. Built as a mobile-first PWA with install + offline support.

Features

- Daily mood entry with slider and notes
- Calendar view with color gradient per score and quick note peek
- Streaks: current positive/negative run (threshold configurable)
- Stats: all-time, last 30/7 days averages and positive rates
- Reminders: optional daily notification at a chosen time
- Offline-first PWA with install prompt
- Backup/restore to JSON

Getting Started

- Install deps: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build` then `npm run preview`

PWA & Notifications

- Install prompt appears via the in-app Install button (or browser UI).
- Enable reminders under Settings; grant notification permission when prompted.
- Browsers cannot guarantee background scheduled notifications without a push service; the app schedules local notifications while it’s opened. For best results, add to Home Screen.

Data

- Stored locally in `localStorage`. Use Backup to export/import JSON.

## Demo app

You can use the app here: <http://mood-tracker-beta.vercel.app>
