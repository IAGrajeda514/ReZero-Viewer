import { useMemo } from 'react'
import { AmbientBackground } from '../ambience/AmbientBackground'
import { getAmbiencePreset } from '../ambience/presets'
import type { Book } from '../content/types'
import type { ReadingProgress } from '../storage/progress'
import type { ReaderPreferences } from '../storage/preferences'
import { ContinueReading } from './ContinueReading'

interface HomeScreenProps {
  book: Book
  progress: ReadingProgress | null
  preferences: ReaderPreferences
  onOpenChapter: (chapterId: string) => void
}

const homeAmbience = getAmbiencePreset('home')

export function HomeScreen({ book, progress, preferences, onOpenChapter }: HomeScreenProps) {
  const chapters = useMemo(
    () => [...book.chapters].sort((left, right) => left.order - right.order),
    [book.chapters],
  )
  const progressChapter = progress?.bookId === book.id
    ? chapters.find((chapter) => chapter.id === progress.chapterId) ?? null
    : null
  const primaryChapter = progressChapter ?? chapters[0] ?? null
  const ambienceIntensity = Math.min(
    1.1,
    Math.max(0, preferences.ambienceIntensity * homeAmbience.visuals.intensity),
  )

  return (
    <main
      className="reader-app home-screen"
      data-theme={preferences.theme}
      data-reduced-motion={preferences.reducedMotion}
      data-view="home"
    >
      <AmbientBackground
        preset={homeAmbience}
        intensity={ambienceIntensity}
        reducedMotion={preferences.reducedMotion}
      />

      <div className="home-shell">
        <header className="home-brand">
          <h1>Scryveil</h1>
          <p>See beyond the veil.</p>
        </header>

        <div className="home-layout">
          {primaryChapter && (
            <ContinueReading
              book={book}
              chapter={primaryChapter}
              hasProgress={progressChapter !== null}
              onOpen={() => onOpenChapter(primaryChapter.id)}
            />
          )}

          <section className="home-library" aria-labelledby="library-title">
            <header className="home-library__header">
              <div>
                <p className="home-eyebrow">Biblioteca</p>
                <h2 id="library-title">Libro actual</h2>
              </div>
              <span>{chapters.length} {chapters.length === 1 ? 'capítulo' : 'capítulos'}</span>
            </header>

            <article className="home-book">
              <div className="home-book__mark" aria-hidden="true"><span>✦</span></div>
              <div className="home-book__copy">
                <h3>{book.title}</h3>
                {book.author && <p>{book.author}</p>}
              </div>
            </article>

            <div className="home-chapters" aria-label={`Capítulos de ${book.title}`}>
              {chapters.map((chapter) => {
                const isLastRead = progressChapter?.id === chapter.id
                return (
                  <button
                    key={chapter.id}
                    className="home-chapter"
                    type="button"
                    data-chapter-id={chapter.id}
                    onClick={() => onOpenChapter(chapter.id)}
                    aria-label={`Abrir capítulo ${chapter.order}: ${chapter.title}`}
                  >
                    <span className="home-chapter__number">{String(chapter.order).padStart(2, '0')}</span>
                    <span className="home-chapter__title">{chapter.title}</span>
                    {isLastRead && <span className="home-chapter__status">Última lectura</span>}
                    <span className="home-chapter__arrow" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
