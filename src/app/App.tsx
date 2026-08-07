import { useCallback, useEffect, useRef, useState } from 'react'
import { createHttpContentLoader } from '../content/loader'
import type { ContentPackManifest } from '../content/schema'
import type { Book, Chapter } from '../content/types'
import { Reader } from '../reader/Reader'
import { getReadingProgress } from '../storage/progress'
import {
  getReaderPreferences,
  saveReaderPreferences,
  type ReaderPreferences,
} from '../storage/preferences'

const demoContentLoader = createHttpContentLoader('/content-packs/novelview-demo')

type ContentStatus = 'loading-content' | 'loading-chapter' | 'ready' | 'error'

interface LoadedContent {
  manifest: ContentPackManifest
  book: Book
  chapter: Chapter
  speakerColors: Readonly<Record<string, string>>
}

interface AppStatusProps {
  message: string
  preferences: ReaderPreferences
  onRetry?: () => void
}

function createSpeakerColors(manifest: ContentPackManifest): Readonly<Record<string, string>> {
  return Object.fromEntries((manifest.characters ?? []).map((character) => [character.id, character.color]))
}

function sortBookChapters(book: Book): Book {
  return { ...book, chapters: [...book.chapters].sort((left, right) => left.order - right.order) }
}

function AppStatus({ message, preferences, onRetry }: AppStatusProps) {
  return (
    <main className="reader-app app-status" data-theme={preferences.theme}>
      <div className="app-status__content">
        <h1>NovelView</h1>
        <p>{message}</p>
        {onRetry && <button type="button" onClick={onRetry}>Reintentar</button>}
      </div>
    </main>
  )
}

function App() {
  const [preferences, setPreferences] = useState(getReaderPreferences)
  const [content, setContent] = useState<LoadedContent | null>(null)
  const [contentStatus, setContentStatus] = useState<ContentStatus>('loading-content')
  const requestIdRef = useRef(0)
  const failedChapterIdRef = useRef<string | null>(null)

  useEffect(() => {
    saveReaderPreferences(preferences)
  }, [preferences])

  const updatePreferences = useCallback((changes: Partial<ReaderPreferences>) => {
    setPreferences((current) => ({ ...current, ...changes }))
  }, [])

  const loadInitialContent = useCallback(async () => {
    const requestId = ++requestIdRef.current
    failedChapterIdRef.current = null
    setContent(null)
    setContentStatus('loading-content')

    try {
      const manifest = await demoContentLoader.loadManifest()
      const book = sortBookChapters(await demoContentLoader.loadBook())
      const firstChapter = book.chapters[0]
      if (!firstChapter) throw new Error('The content pack does not declare any chapters.')

      const progress = getReadingProgress()
      const progressChapterExists = progress?.bookId === book.id && book.chapters.some(
        (chapter) => chapter.id === progress.chapterId,
      )
      const chapterId = progressChapterExists && progress ? progress.chapterId : firstChapter.id
      failedChapterIdRef.current = chapterId
      const chapter = await demoContentLoader.loadChapter(chapterId)
      if (requestId !== requestIdRef.current) return

      setContent({
        manifest,
        book,
        chapter,
        speakerColors: createSpeakerColors(manifest),
      })
      failedChapterIdRef.current = null
      setContentStatus('ready')
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      console.error('NovelView failed to load its content pack.', error)
      setContentStatus('error')
    }
  }, [])

  useEffect(() => {
    void loadInitialContent()
    return () => {
      requestIdRef.current += 1
    }
  }, [loadInitialContent])

  const loadSelectedChapter = useCallback(async (chapterId: string) => {
    if (!content || chapterId === content.chapter.id) return
    const requestId = ++requestIdRef.current
    failedChapterIdRef.current = chapterId
    setContentStatus('loading-chapter')

    try {
      const chapter = await demoContentLoader.loadChapter(chapterId)
      if (requestId !== requestIdRef.current) return
      setContent((current) => current ? { ...current, chapter } : current)
      failedChapterIdRef.current = null
      setContentStatus('ready')
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      console.error(`NovelView failed to load chapter ${chapterId}.`, error)
      setContentStatus('error')
    }
  }, [content])

  const retry = useCallback(() => {
    const failedChapterId = failedChapterIdRef.current
    if (content && failedChapterId) {
      void loadSelectedChapter(failedChapterId)
      return
    }
    void loadInitialContent()
  }, [content, loadInitialContent, loadSelectedChapter])

  if (contentStatus === 'error') {
    return <AppStatus message="No se pudo cargar el contenido." preferences={preferences} onRetry={retry} />
  }
  if (contentStatus === 'loading-chapter') {
    return <AppStatus message="Preparando capítulo…" preferences={preferences} />
  }
  if (contentStatus !== 'ready' || !content) {
    return <AppStatus message="Preparando lectura…" preferences={preferences} />
  }

  return (
    <Reader
      key={content.chapter.id}
      book={content.book}
      chapter={content.chapter}
      speakerColors={content.speakerColors}
      preferences={preferences}
      onPreferencesChange={updatePreferences}
      onChapterSelect={(chapterId) => { void loadSelectedChapter(chapterId) }}
    />
  )
}

export default App
