import { STORAGE_KEYS } from './keys'

export type ReaderTheme = 'dark-immersive' | 'night-sepia' | 'light-atmospheric'

export interface ReaderPreferences {
  theme: ReaderTheme
  fontSize: number
  lineHeight: number
  readerWidth: number
  ambienceIntensity: number
  glassOpacity: number
  showSpeakerNames: boolean
  reducedMotion: boolean
}

export const DEFAULT_READER_PREFERENCES: ReaderPreferences = {
  theme: 'dark-immersive', fontSize: 18, lineHeight: 1.7, readerWidth: 720,
  ambienceIntensity: 0.7, glassOpacity: 0.7, showSpeakerNames: true, reducedMotion: false,
}

function createDefaultPreferences(): ReaderPreferences {
  return { ...DEFAULT_READER_PREFERENCES }
}

function isReaderPreferences(value: unknown): value is ReaderPreferences {
  if (!value || typeof value !== 'object') return false

  const preferences = value as Record<string, unknown>
  return (
    (preferences.theme === 'dark-immersive' || preferences.theme === 'night-sepia' || preferences.theme === 'light-atmospheric') &&
    typeof preferences.fontSize === 'number' &&
    typeof preferences.lineHeight === 'number' &&
    typeof preferences.readerWidth === 'number' &&
    typeof preferences.ambienceIntensity === 'number' &&
    typeof preferences.glassOpacity === 'number' &&
    typeof preferences.showSpeakerNames === 'boolean' &&
    typeof preferences.reducedMotion === 'boolean'
  )
}

export function getReaderPreferences(): ReaderPreferences {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.readerPreferences)
    if (!stored) return createDefaultPreferences()
    const parsed: unknown = JSON.parse(stored)
    return isReaderPreferences(parsed) ? parsed : createDefaultPreferences()
  } catch {
    return createDefaultPreferences()
  }
}

export function saveReaderPreferences(preferences: ReaderPreferences): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEYS.readerPreferences, JSON.stringify(preferences))
    return true
  } catch {
    return false
  }
}

export function resetReaderPreferences(): ReaderPreferences {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.readerPreferences)
  } catch {
    // Returning defaults keeps the reader usable when storage is unavailable.
  }

  return createDefaultPreferences()
}
