import { useCallback, useEffect, useRef, useState } from 'react'
import { createHttpContentLoader, type ContentLoader } from '../content/loader'
import type { ContentPackManifest } from '../content/schema'
import type { Book, Chapter } from '../content/types'
import { Reader } from '../reader/Reader'
import { getReadingProgress, type ReadingProgress } from '../storage/progress'
import {
  getReaderPreferences,
  saveReaderPreferences,
  type ReaderPreferences,
} from '../storage/preferences'
import { ReZeroHome } from '../viewer/ReZeroHome'
import '../viewer/WitchArchiveReader.css'
import { VIEWER_VOLUMES } from '../viewer/catalog'
import type { ViewerVolume, ViewerVolumeLoadState } from '../viewer/types'

const VIEWER_LABEL = "Witch's Archive"

interface VolumeLoaderEntry {
  baseUrl: string
  loader: ContentLoader
}

interface LoadedVolume {
  volumeId: string
  baseUrl: string
  book: Book
  speakerColors: Readonly<Record<string, string>>
}

interface ReaderSession {
  volumeId: string
  chapter: Chapter
}

type ChapterRequestState =
  | { status: 'idle'; volumeId: null; chapterId: null }
  | { status: 'loading' | 'error'; volumeId: string; chapterId: string }

interface AppStatusProps {
  message: string
  preferences: ReaderPreferences
  onRetry?: () => void
  onHome: () => void
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
        <h1>{VIEWER_LABEL}</h1>
        <p>{message}</p>
        <div className="app-status__actions">
          {onRetry && <button type="button" onClick={onRetry}>Reintentar</button>}
          <button type="button" onClick={onHome}>Volver al archivo</button>
        </div>
      </div>
    </main>
  )
}

function App() {
  const [preferences, setPreferences] = useState(getReaderPreferences)
  const [progress, setProgress] = useState<ReadingProgress | null>(getReadingProgress)
  const [loadedVolume, setLoadedVolume] = useState<LoadedVolume | null>(null)
  const [volumeLoadState, setVolumeLoadState] = useState<ViewerVolumeLoadState>({
    status: 'idle',
    volumeId: null,
  })
  const [chapterRequest, setChapterRequest] = useState<ChapterRequestState>({
    status: 'idle',
    volumeId: null,
    chapterId: null,
  })
  const [readerSession, setReaderSession] = useState<ReaderSession | null>(null)
  const loadersRef = useRef(new Map<string, VolumeLoaderEntry>())
  const volumeRequestIdRef = useRef(0)
  const chapterRequestIdRef = useRef(0)

  useEffect(() => {
    saveReaderPreferences(preferences)
  }, [preferences])

  useEffect(() => () => {
    volumeRequestIdRef.current += 1
    chapterRequestIdRef.current += 1
  }, [])

  const updatePreferences = useCallback((changes: Partial<ReaderPreferences>) => {
    setPreferences((current) => ({ ...current, ...changes }))
  }, [])

  const getVolumeLoader = useCallback((volume: ViewerVolume): ContentLoader | null => {
    const baseUrl = volume.contentPackBaseUrl
    if (!baseUrl) return null

    const existing = loadersRef.current.get(volume.id)
    if (existing?.baseUrl === baseUrl) return existing.loader

    const loader = createHttpContentLoader(baseUrl)
    loadersRef.current.set(volume.id, { baseUrl, loader })
    return loader
  }, [])

  const openVolume = useCallback(async (volume: ViewerVolume) => {
    const baseUrl = volume.contentPackBaseUrl
    if (volume.status !== 'available' || !baseUrl) return

    if (loadedVolume?.volumeId === volume.id && loadedVolume.baseUrl === baseUrl) {
      setVolumeLoadState({ status: 'ready', volumeId: volume.id })
      return
    }

    const loader = getVolumeLoader(volume)
    if (!loader) return

    const requestId = ++volumeRequestIdRef.current
    chapterRequestIdRef.current += 1
    setChapterRequest({ status: 'idle', volumeId: null, chapterId: null })
    setVolumeLoadState({ status: 'loading', volumeId: volume.id })

    try {
      const manifest = await loader.loadManifest()
      if (requestId !== volumeRequestIdRef.current) return

      setLoadedVolume({
        volumeId: volume.id,
        baseUrl,
        book: sortBookChapters(manifest.book),
        speakerColors: createSpeakerColors(manifest),
      })
      setProgress(getReadingProgress())
      setVolumeLoadState({ status: 'ready', volumeId: volume.id })
    } catch (error) {
      if (requestId !== volumeRequestIdRef.current) return
      console.error('The configured content manifest could not be loaded.', error)
      setVolumeLoadState({ status: 'error', volumeId: volume.id })
    }
  }, [getVolumeLoader, loadedVolume])

  const openChapter = useCallback(async (chapterId: string) => {
    const targetVolume = loadedVolume
    if (!targetVolume?.book.chapters.some((chapter) => chapter.id === chapterId)) return

    const loaderEntry = loadersRef.current.get(targetVolume.volumeId)
    if (!loaderEntry || loaderEntry.baseUrl !== targetVolume.baseUrl) return

    const requestId = ++chapterRequestIdRef.current
    setChapterRequest({ status: 'loading', volumeId: targetVolume.volumeId, chapterId })

    try {
      const chapter = await loaderEntry.loader.loadChapter(chapterId)
      if (requestId !== chapterRequestIdRef.current) return

      setReaderSession({ volumeId: targetVolume.volumeId, chapter })
      setChapterRequest({ status: 'idle', volumeId: null, chapterId: null })
    } catch (error) {
      if (requestId !== chapterRequestIdRef.current) return
      console.error('The selected chapter could not be loaded.', error)
      setChapterRequest({ status: 'error', volumeId: targetVolume.volumeId, chapterId })
    }
  }, [loadedVolume])

  const returnToViewer = useCallback(() => {
    chapterRequestIdRef.current += 1
    setReaderSession(null)
    setChapterRequest({ status: 'idle', volumeId: null, chapterId: null })
    setProgress(getReadingProgress())
  }, [])

  if (chapterRequest.status === 'loading') {
    return <AppStatus message="Preparando lectura…" preferences={preferences} onHome={returnToViewer} />
  }

  if (chapterRequest.status === 'error') {
    return (
      <AppStatus
        message="No se pudo preparar la lectura."
        preferences={preferences}
        onRetry={() => { void openChapter(chapterRequest.chapterId) }}
        onHome={returnToViewer}
      />
    )
  }

  if (readerSession && loadedVolume?.volumeId === readerSession.volumeId) {
    return (
      <Reader
        key={`${readerSession.volumeId}:${readerSession.chapter.id}`}
        className="witch-archive-reader"
        appLabel={VIEWER_LABEL}
        book={loadedVolume.book}
        chapter={readerSession.chapter}
        speakerColors={loadedVolume.speakerColors}
        preferences={preferences}
        onPreferencesChange={updatePreferences}
        onChapterSelect={(chapterId) => { void openChapter(chapterId) }}
        onHome={returnToViewer}
      />
    )
  }

  return (
    <ReZeroHome
      preferences={preferences}
      volumes={VIEWER_VOLUMES}
      loadedBook={loadedVolume?.book ?? null}
      loadState={volumeLoadState}
      progress={progress}
      onOpenVolume={(volume) => { void openVolume(volume) }}
      onOpenChapter={(chapterId) => { void openChapter(chapterId) }}
    />
  )
}

export default App
