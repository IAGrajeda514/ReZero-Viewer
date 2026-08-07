import { STORAGE_KEYS } from './keys'

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
    const stored = window.localStorage.getItem(STORAGE_KEYS.readingProgress)
    if (!stored) return null
    const parsed: unknown = JSON.parse(stored)
    return isReadingProgress(parsed) ? parsed : null
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
  try {
    window.localStorage.removeItem(STORAGE_KEYS.readingProgress)
    return true
  } catch {
    return false
  }
}
