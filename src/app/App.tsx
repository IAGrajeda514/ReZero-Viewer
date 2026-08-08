import { useCallback, useEffect, useRef, useState } from 'react'
import { createHttpContentLoader } from '../content/loader'
import type { ContentPackManifest } from '../content/schema'
import type { Book, Chapter } from '../content/types'
import { HomeScreen } from '../home/HomeScreen'
import { Reader } from '../reader/Reader'
import { getReadingProgress, type ReadingProgress } from '../storage/progress'
import {
  getReaderPreferences,
  saveReaderPreferences,
  type ReaderPreferences,
} from '../storage/preferences'

const demoContentLoader = createHttpContentLoader('/content-packs/scryveil-demo')

type AppView =
  | { type: 'loading-library' }
  | { type: 'home' }
  | { type: 'loading-chapter'; chapterId: string }
  | { type: 'reader'; chapter: Chapter }
  | { type: 'library-error' }
  | { type: 'chapter-error'; chapterId: string }

interface LoadedLibrary {
  book: Book
  speakerColors: Readonly<Record<string, string>>
}

interface AppStatusProps {
  message: string
  preferences: ReaderPreferences
  onRetry?: () => void
  onHome?: () => void
}

function createSpeakerColors(manifest: ContentPackManifest): Readonly<Record<string, string>> {
  return Object.fromEntries((manifest.characters ?? []).map((character) => [character.id, character.color]))
}

function sortBookChapters(book: Book): Book {
  return { ...book, chapters: [...book.chapters].sort((left, right) => left.order - right.order) }
}

function AppStatus({ message, preferences, onRetry, onHome }: AppStatusProps) {
  return (
    <main
      className="reader-app app-status"
      data-theme={preferences.theme}
      data-reduced-motion={preferences.reducedMotion}
    >
      <div className="app-status__content">
        <h1>Scryveil</h1>
        <p>{message}</p>
        {(onRetry || onHome) && (
          <div className="app-status__actions">
            {onRetry && <button type="button" onClick={onRetry}>Reintentar</button>}
            {onHome && <button type="button" onClick={onHome}>Volver a inicio</button>}
          </div>
        )}
      </div>
    </main>
  )
}

function App() {
  const [preferences, setPreferences] = useState(getReaderPreferences)
  const [progress, setProgress] = useState<ReadingProgress | null>(getReadingProgress)
  const [library, setLibrary] = useState<LoadedLibrary | null>(null)
  const [view, setView] = useState<AppView>({ type: 'loading-library' })
  const requestIdRef = useRef(0)

  useEffect(() => {
    saveReaderPreferences(preferences)
  }, [preferences])

  const updatePreferences = useCallback((changes: Partial<ReaderPreferences>) => {
    setPreferences((current) => ({ ...current, ...changes }))
  }, [])

  const loadLibrary = useCallback(async () => {
    const requestId = ++requestIdRef.current
    setLibrary(null)
    setView({ type: 'loading-library' })

    try {
      const manifest = await demoContentLoader.loadManifest()
      const book = sortBookChapters(manifest.book)
      if (book.chapters.length === 0) throw new Error('The content pack does not declare any chapters.')
      if (requestId !== requestIdRef.current) return

      setLibrary({ book, speakerColors: createSpeakerColors(manifest) })
      setProgress(getReadingProgress())
      setView({ type: 'home' })
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      console.error('Scryveil failed to load its content pack.', error)
      setView({ type: 'library-error' })
    }
  }, [])

  useEffect(() => {
    void loadLibrary()
    return () => {
      requestIdRef.current += 1
    }
  }, [loadLibrary])

  const openChapter = useCallback(async (chapterId: string) => {
    if (!library?.book.chapters.some((chapter) => chapter.id === chapterId)) return

    const requestId = ++requestIdRef.current
    setView({ type: 'loading-chapter', chapterId })

    try {
      const chapter = await demoContentLoader.loadChapter(chapterId)
      if (requestId !== requestIdRef.current) return
      setView({ type: 'reader', chapter })
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      console.error(`Scryveil failed to load chapter ${chapterId}.`, error)
      setView({ type: 'chapter-error', chapterId })
    }
  }, [library])

  const returnHome = useCallback(() => {
    requestIdRef.current += 1
    setProgress(getReadingProgress())
    setView({ type: 'home' })
  }, [])

  if (view.type === 'library-error') {
    return <AppStatus message="No se pudo cargar la biblioteca." preferences={preferences} onRetry={loadLibrary} />
  }
  if (view.type === 'loading-library' || !library) {
    return <AppStatus message="Preparando biblioteca…" preferences={preferences} />
  }
  if (view.type === 'chapter-error') {
    return (
      <AppStatus
        message="No se pudo cargar el capítulo."
        preferences={preferences}
        onRetry={() => { void openChapter(view.chapterId) }}
        onHome={returnHome}
      />
    )
  }
  if (view.type === 'loading-chapter') {
    return <AppStatus message="Preparando capítulo…" preferences={preferences} onHome={returnHome} />
  }
  if (view.type === 'home') {
    return (
      <HomeScreen
        book={library.book}
        progress={progress}
        preferences={preferences}
        onOpenChapter={(chapterId) => { void openChapter(chapterId) }}
      />
    )
  }

  return (
    <Reader
      key={view.chapter.id}
      book={library.book}
      chapter={view.chapter}
      speakerColors={library.speakerColors}
      preferences={preferences}
      onPreferencesChange={updatePreferences}
      onChapterSelect={(chapterId) => { void openChapter(chapterId) }}
      onHome={returnHome}
    />
  )
}

export default App
