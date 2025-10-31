export type MoodEntry = {
  date: string // YYYY-MM-DD
  score: number // 1..10
  note?: string
}

export type Settings = {
  positiveThreshold: number
  notificationEnabled: boolean
  notificationTime: string // HH:MM 24h
}

export type Streak = { current: number; type: 'positive' | 'negative' | null }

export const STORAGE_KEY = 'mood.entries.v1'
export const SETTINGS_KEY = 'mood.settings.v1'

