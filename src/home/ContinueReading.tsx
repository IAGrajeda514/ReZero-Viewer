import type { Book, ChapterSummary } from '../content/types'

interface ContinueReadingProps {
  book: Book
  chapter: ChapterSummary
  hasProgress: boolean
  onOpen: () => void
}

export function ContinueReading({ book, chapter, hasProgress, onOpen }: ContinueReadingProps) {
  const chapterLabel = `Capítulo ${String(chapter.order).padStart(2, '0')} · ${chapter.title}`

  return (
    <section className="continue-reading" aria-labelledby="continue-reading-title">
      <p className="home-eyebrow">{hasProgress ? 'Última lectura' : 'Tu próxima historia'}</p>
      <h2 id="continue-reading-title">{hasProgress ? 'Continuar leyendo' : 'Comenzar a leer'}</h2>
      <div className="continue-reading__book">
        <p>{book.title}</p>
        <span>{chapterLabel}</span>
      </div>
      <button className="home-primary-action" type="button" onClick={onOpen}>
        {hasProgress ? 'Continuar' : 'Comenzar'} <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}
