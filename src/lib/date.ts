export function todayKey(d = new Date()) {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return tz.toISOString().slice(0, 10)
}

export function toKey(d: Date) { return todayKey(d) }

export function getMonthDays(base: Date) {
  const y = base.getFullYear(); const m = base.getMonth()
  const first = new Date(y, m, 1)
  const days: Date[] = []
  const last = new Date(y, m + 1, 0).getDate()
  for (let i = 1; i <= last; i++) days.push(new Date(y, m, i))
  const startPad = (first.getDay() + 6) % 7 // Monday=0
  const padded: (Date | null)[] = Array(startPad).fill(null).concat(days)
  return padded
}

