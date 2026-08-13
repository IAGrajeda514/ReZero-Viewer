import { useState } from 'react'
import type { Book } from '../content/types'
import type { ReadingProgress } from '../storage/progress'
import type { ReaderPreferences } from '../storage/preferences'
import { ViewerChapterList } from './ViewerChapterList'
import { ViewerSidebar } from './ViewerSidebar'
import type { ViewerVolume, ViewerVolumeLoadState } from './types'
import './ReZeroHome.css'

interface ReZeroHomeProps {
  preferences: ReaderPreferences
  volumes: readonly ViewerVolume[]
  loadedBook: Book | null
  loadState: ViewerVolumeLoadState
  progress: ReadingProgress | null
  onOpenVolume: (volume: ViewerVolume) => void
  onOpenChapter: (chapterId: string) => void
}

function volumeMark(order: number): string {
  return `VOL. ${String(order).padStart(2, '0')}`
}

function volumeStatus(volume: ViewerVolume): string {
  return volume.status === 'available' ? 'Disponible' : 'En preparación'
}

export function ReZeroHome({
  preferences,
  volumes,
  loadedBook,
  loadState,
  progress,
  onOpenVolume,
  onOpenChapter,
}: ReZeroHomeProps) {
  const sortedVolumes = [...volumes].sort((left, right) => left.order - right.order)
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(() => sortedVolumes[0]?.id ?? null)
  const selectedVolume = sortedVolumes.find((volume) => volume.id === selectedVolumeId)
    ?? sortedVolumes[0]
    ?? null
  const selectedLoadStatus = selectedVolume && loadState.volumeId === selectedVolume.id
    ? loadState.status
    : 'idle'
  const selectedBook = selectedLoadStatus === 'ready' ? loadedBook : null
  const chapters = selectedBook
    ? [...selectedBook.chapters].sort((left, right) => left.order - right.order)
    : []
  const lastReadChapterId = progress !== null && selectedBook !== null &&
    progress.bookId === selectedBook.id && chapters.some(
    (chapter) => chapter.id === progress.chapterId,
  )
    ? progress.chapterId
    : null

  const statusLabel = selectedLoadStatus === 'loading'
    ? 'Abriendo archivo'
    : selectedLoadStatus === 'error'
      ? 'No se pudo abrir'
      : selectedLoadStatus === 'ready'
        ? 'Disponible'
        : selectedVolume
          ? volumeStatus(selectedVolume)
          : ''

  const contentLabel = selectedLoadStatus === 'loading'
    ? 'Cargando contenido'
    : selectedLoadStatus === 'error'
      ? 'No disponible'
      : selectedLoadStatus === 'ready'
        ? `${chapters.length} ${chapters.length === 1 ? 'capítulo' : 'capítulos'}`
        : selectedVolume?.status === 'available'
          ? 'Disponible'
          : 'Próximamente'

  const chapterMessage = selectedVolume?.status === 'preparing'
    ? 'Contenido en preparación'
    : selectedLoadStatus === 'loading'
      ? 'Abriendo archivo…'
      : selectedLoadStatus === 'error'
        ? 'No se pudo abrir el archivo.'
        : selectedLoadStatus === 'ready'
          ? 'El archivo no contiene capítulos.'
          : 'Abre el archivo para consultar sus capítulos.'

  const actionLabel = selectedVolume?.status === 'preparing'
    ? 'Próximamente'
    : selectedLoadStatus === 'loading'
      ? 'Abriendo archivo…'
      : selectedLoadStatus === 'error'
        ? 'Reintentar'
        : selectedLoadStatus === 'ready'
          ? lastReadChapterId === null ? 'Selecciona un capítulo' : 'Continuar'
          : 'Abrir archivo'
  const actionDisabled = selectedVolume === null || selectedVolume.status === 'preparing' ||
    selectedLoadStatus === 'loading' || (selectedLoadStatus === 'ready' && lastReadChapterId === null)

  return (
    <main
      className="reader-app viewer-home"
      data-theme={preferences.theme}
      data-reduced-motion={preferences.reducedMotion}
      data-view="witch-archive-home"
    >
      <div className="viewer-home__backdrop" aria-hidden="true" />

      <div className="viewer-home__shell">
        <ViewerSidebar
          volumes={sortedVolumes}
          selectedVolumeId={selectedVolume?.id ?? null}
          onSelectVolume={setSelectedVolumeId}
        />

        <div className="viewer-home__workspace">
          <header className="archive-header">
            <div className="archive-header__seal" aria-hidden="true"><span /></div>
            <h1>Witch's Archive</h1>
            <div className="archive-header__tagline" aria-label="Crónicas de lo prohibido">
              <span aria-hidden="true" />
              <p>Crónicas de lo prohibido</p>
              <span aria-hidden="true" />
            </div>
          </header>

          {selectedVolume ? (
            <article className="archive-volume" data-status={selectedVolume.status}>
              <div className="archive-volume__art" aria-hidden="true">
                <div className="archive-volume__art-frame">
                  <span className="archive-volume__corner archive-volume__corner--top-left" />
                  <span className="archive-volume__corner archive-volume__corner--top-right" />
                  <span className="archive-volume__corner archive-volume__corner--bottom-left" />
                  <span className="archive-volume__corner archive-volume__corner--bottom-right" />
                  <p>{volumeMark(selectedVolume.order)}</p>
                  <div className="archive-volume__art-sigil"><span /></div>
                </div>
              </div>

              <div className="archive-volume__details">
                <p className="archive-volume__status">
                  <span aria-hidden="true" />
                  {statusLabel}
                </p>
                <h2>{selectedVolume.label}</h2>
                <div className="archive-volume__divider" aria-hidden="true"><span /></div>

                <dl className="archive-volume__facts">
                  <div>
                    <dt>Estado del archivo</dt>
                    <dd>{statusLabel}</dd>
                  </div>
                  <div>
                    <dt>Contenido</dt>
                    <dd>{contentLabel}</dd>
                  </div>
                </dl>

                {(selectedLoadStatus === 'loading' || selectedLoadStatus === 'error') && (
                  <p className="archive-volume__feedback" role="status" aria-live="polite">
                    {selectedLoadStatus === 'loading' ? 'Abriendo archivo…' : 'No se pudo abrir el archivo.'}
                  </p>
                )}

                {selectedLoadStatus === 'ready' ? (
                  <section className="archive-volume__chapters" aria-labelledby="volume-chapters-title">
                    <div className="archive-volume__chapters-heading">
                      <h3 id="volume-chapters-title">Capítulos</h3>
                      {lastReadChapterId !== null && (
                        <button type="button" onClick={() => onOpenChapter(lastReadChapterId)}>
                          Continuar
                        </button>
                      )}
                    </div>
                    <ViewerChapterList
                      chapters={chapters}
                      emptyMessage={chapterMessage}
                      lastReadChapterId={lastReadChapterId}
                      onOpenChapter={onOpenChapter}
                    />
                  </section>
                ) : (
                  <button
                    className="archive-volume__action"
                    type="button"
                    disabled={actionDisabled}
                    onClick={() => {
                      if (!selectedVolume || actionDisabled) return
                      onOpenVolume(selectedVolume)
                    }}
                  >
                    {actionLabel}
                  </button>
                )}
              </div>
            </article>
          ) : (
            <section className="archive-volume archive-volume--empty">
              <p>El archivo todavía no contiene volúmenes.</p>
            </section>
          )}

        </div>
      </div>
    </main>
  )
}
