export const STORAGE_KEYS = {
  readingProgress: 'scryveil.reading-progress',
  readerPreferences: 'scryveil.reader-preferences',
} as const

export const LEGACY_STORAGE_KEYS = {
  readingProgress: 'novelview.reading-progress',
  readerPreferences: 'novelview.reader-preferences',
} as const

type StorageKeyName = keyof typeof STORAGE_KEYS

export interface StoredValue {
  serialized: string
  source: 'current' | 'legacy'
}

export function readStoredValue(keyName: StorageKeyName): StoredValue | null {
  try {
    const currentValue = window.localStorage.getItem(STORAGE_KEYS[keyName])
    if (currentValue !== null) return { serialized: currentValue, source: 'current' }

    const legacyValue = window.localStorage.getItem(LEGACY_STORAGE_KEYS[keyName])
    return legacyValue === null ? null : { serialized: legacyValue, source: 'legacy' }
  } catch {
    return null
  }
}

export function removeStoredValue(keyName: StorageKeyName): boolean {
  try {
    window.localStorage.removeItem(STORAGE_KEYS[keyName])
    window.localStorage.removeItem(LEGACY_STORAGE_KEYS[keyName])
    return true
  } catch {
    return false
  }
}
