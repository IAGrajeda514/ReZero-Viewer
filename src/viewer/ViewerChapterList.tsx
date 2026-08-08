import type { ChapterSummary } from '../content/types'

interface ViewerChapterListProps {
  chapters: readonly ChapterSummary[]
  emptyMessage: string
  lastReadChapterId: string | null
  onOpenChapter: (chapterId: string) => void
}

export function ViewerChapterList({
  chapters,
  emptyMessage,
  lastReadChapterId,
  onOpenChapter,
}: ViewerChapterListProps) {
  if (chapters.length === 0) return <p>{emptyMessage}</p>

  return (
    <div className="viewer-chapter-list">
      {chapters.map((chapter) => {
        const isLastRead = chapter.id === lastReadChapterId

        return (
          <button
            key={chapter.id}
            className="viewer-chapter-list__item"
            type="button"
            data-chapter-id={chapter.id}
            onClick={() => onOpenChapter(chapter.id)}
          >
            <span className="viewer-chapter-list__number">{String(chapter.order).padStart(2, '0')}</span>
            <span className="viewer-chapter-list__copy">
              <strong>{chapter.title}</strong>
              {isLastRead && <small>Última lectura</small>}
            </span>
            <span className="viewer-chapter-list__arrow" aria-hidden="true">→</span>
          </button>
        )
      })}
    </div>
  )
}
