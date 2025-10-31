export function fromStorage<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback } catch { return fallback }
}

export function toStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

