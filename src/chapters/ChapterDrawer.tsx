import type { ChapterSummary } from '../content/types'

interface ChapterDrawerProps {
  chapters: ChapterSummary[]
  activeChapterId?: string
  onSelect?: (chapterId: string) => void
}

export function ChapterDrawer({ chapters, activeChapterId, onSelect }: ChapterDrawerProps) {
  return (
    <aside className="chapter-drawer" aria-label="Chapters">
      {chapters.map((chapter) => (
        <button key={chapter.id} type="button" aria-current={chapter.id === activeChapterId ? 'page' : undefined} onClick={() => onSelect?.(chapter.id)}>
          {chapter.title}
        </button>
      ))}
    </aside>
  )
}
