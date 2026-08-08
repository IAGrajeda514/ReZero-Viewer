import type { ChapterSummary } from '../content/types'
import { ViewerChapterList } from './ViewerChapterList'
import type { ViewerVolume } from './types'

interface ViewerSidebarProps {
  volumes: readonly ViewerVolume[]
  selectedVolumeId: string | null
  chapters: readonly ChapterSummary[]
  chapterMessage: string
  lastReadChapterId: string | null
  onSelectVolume: (volumeId: string) => void
  onOpenChapter: (chapterId: string) => void
}

function volumeStatus(volume: ViewerVolume): string {
  return volume.status === 'available' ? 'Disponible' : 'En preparación'
}

export function ViewerSidebar({
  volumes,
  selectedVolumeId,
  chapters,
  chapterMessage,
  lastReadChapterId,
  onSelectVolume,
  onOpenChapter,
}: ViewerSidebarProps) {
  const selectedVolume = volumes.find((volume) => volume.id === selectedVolumeId) ?? null

  return (
    <aside className="viewer-sidebar" aria-label="Navegación del archivo">
      <div className="viewer-sidebar__brand">
        <div className="viewer-sidebar__seal" aria-hidden="true">
          <span />
        </div>
        <p>Witch's Archive</p>
        <div className="viewer-sidebar__rule" aria-hidden="true"><span /></div>
      </div>

      <nav className="viewer-sidebar__navigation" aria-label="Secciones">
        <button className="viewer-sidebar__library" type="button" aria-current="page">
          <span className="viewer-sidebar__library-mark" aria-hidden="true" />
          Biblioteca
        </button>
      </nav>

      <section className="viewer-sidebar__section viewer-sidebar__volumes" aria-labelledby="sidebar-volumes-title">
        <h2 id="sidebar-volumes-title">Volúmenes</h2>
        <div className="viewer-sidebar__volume-list">
          {volumes.map((volume) => {
            const isSelected = volume.id === selectedVolumeId

            return (
              <button
                key={volume.id}
                className="viewer-sidebar__volume"
                type="button"
                data-selected={isSelected}
                aria-pressed={isSelected}
                onClick={() => onSelectVolume(volume.id)}
              >
                <span>{volume.label}</span>
                <small>{volumeStatus(volume)}</small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="viewer-sidebar__section viewer-sidebar__chapters" aria-labelledby="sidebar-chapters-title">
        <h2 id="sidebar-chapters-title">Capítulos</h2>
        <ViewerChapterList
          chapters={chapters}
          emptyMessage={selectedVolume === null ? 'Selecciona un volumen' : chapterMessage}
          lastReadChapterId={lastReadChapterId}
          onOpenChapter={onOpenChapter}
        />
      </section>
    </aside>
  )
}
