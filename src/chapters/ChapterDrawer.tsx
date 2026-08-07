import type { ChapterSummary } from '../content/types'

interface ChapterDrawerProps {
  chapters: ChapterSummary[]
  activeChapterId: string
  isOpen: boolean
  progressForChapter: (chapterId: string) => number | null
  onSelect: (chapterId: string) => void
  onClose: () => void
}

export function ChapterDrawer({
  chapters,
  activeChapterId,
  isOpen,
  progressForChapter,
  onSelect,
  onClose,
}: ChapterDrawerProps) {
  return (
    <aside className={`drawer drawer--left${isOpen ? ' drawer--open' : ''}`} aria-label="Índice" aria-hidden={!isOpen}>
      <div className="drawer__inner">
        <header className="drawer__header">
          <div><p>Navegación</p><h2>Índice</h2></div>
          <button className="drawer__close" type="button" onClick={onClose} aria-label="Cerrar índice">×</button>
        </header>
        <div className="chapter-list">
          {chapters.map((chapter) => {
            const progress = progressForChapter(chapter.id)
            const isCurrent = chapter.id === activeChapterId
            return (
              <button
                key={chapter.id}
                className={`chapter-item${isCurrent ? ' chapter-item--current' : ''}`}
                type="button"
                aria-current={isCurrent ? 'page' : undefined}
                disabled={progress === null}
                onClick={() => onSelect(chapter.id)}
              >
                <span className="chapter-item__number">{String(chapter.order).padStart(2, '0')}</span>
                <span className="chapter-item__copy">
                  <span className="chapter-item__title">{chapter.title}</span>
                  {isCurrent && <span className="chapter-item__status">Leyendo ahora</span>}
                </span>
                <span className="chapter-item__progress">{progress === null ? '—' : `${progress}%`}</span>
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
