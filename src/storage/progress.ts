import { readStoredValue, removeStoredValue, STORAGE_KEYS } from './keys'

const LEGACY_DEMO_BOOK_ID = 'novelview-demo'
const SCRYVEIL_DEMO_BOOK_ID = 'scryveil-demo'

export interface ReadingProgress {
  bookId: string
  chapterId: string
  sceneId: string
  blockId: string
  updatedAt: string
}

function isReadingProgress(value: unknown): value is ReadingProgress {
  if (!value || typeof value !== 'object') return false

  const progress = value as Record<string, unknown>
  return (
    typeof progress.bookId === 'string' &&
    typeof progress.chapterId === 'string' &&
    typeof progress.sceneId === 'string' &&
    typeof progress.blockId === 'string' &&
    typeof progress.updatedAt === 'string'
  )
}

export function getReadingProgress(): ReadingProgress | null {
  try {
    const stored = readStoredValue('readingProgress')
    if (!stored) return null
    const parsed: unknown = JSON.parse(stored.serialized)
    if (!isReadingProgress(parsed)) return null

    const progress = parsed.bookId === LEGACY_DEMO_BOOK_ID
      ? { ...parsed, bookId: SCRYVEIL_DEMO_BOOK_ID }
      : parsed

    if (stored.source === 'legacy' || progress !== parsed) saveReadingProgress(progress)
    return progress
  } catch {
    return null
  }
}

export function saveReadingProgress(progress: ReadingProgress): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEYS.readingProgress, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

export function clearReadingProgress(): boolean {
  return removeStoredValue('readingProgress')
}
