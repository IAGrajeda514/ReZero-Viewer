import { readStoredValue, removeStoredValue, STORAGE_KEYS } from './keys'

export type ReaderTheme = 'dark-immersive' | 'night-sepia' | 'light-atmospheric'

export interface ReaderPreferences {
  theme: ReaderTheme
  fontSize: number
  lineHeight: number
  readerWidth: number
  ambienceIntensity: number
  glassOpacity: number
  showSpeakerNames: boolean
  wheelNavigation: boolean
  reducedMotion: boolean
}

export const DEFAULT_READER_PREFERENCES: ReaderPreferences = {
  theme: 'dark-immersive', fontSize: 19, lineHeight: 1.72, readerWidth: 820,
  ambienceIntensity: 1, glassOpacity: 0.7, showSpeakerNames: true,
  wheelNavigation: true, reducedMotion: false,
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
    typeof preferences.wheelNavigation === 'boolean' &&
    typeof preferences.reducedMotion === 'boolean'
  )
}

export function getReaderPreferences(): ReaderPreferences {
  try {
    const stored = readStoredValue('readerPreferences')
    if (!stored) return createDefaultPreferences()
    const parsed: unknown = JSON.parse(stored)
    if (!isReaderPreferences(parsed)) return createDefaultPreferences()
    return parsed
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
  removeStoredValue('readerPreferences')

  return createDefaultPreferences()
}
