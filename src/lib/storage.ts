// localStorage can throw (private mode, blocked storage), so every access is guarded.

export function readBoolean(key: string, fallback: boolean): boolean {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? fallback : value === "1"
  } catch {
    return fallback
  }
}

export function writeBoolean(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0")
  } catch {
    // Preference simply won't persist.
  }
}

export function readString(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeString(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Preference simply won't persist.
  }
}
