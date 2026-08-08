export const STORAGE_KEYS = {
  readingProgress: 'witch-archive.reading-progress',
  readerPreferences: 'witch-archive.reader-preferences',
} as const

type StorageKeyName = keyof typeof STORAGE_KEYS

export function readStoredValue(keyName: StorageKeyName): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEYS[keyName])
  } catch {
    return null
  }
}

export function removeStoredValue(keyName: StorageKeyName): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEYS[keyName])
    return true
  } catch {
    return false
  }
}
