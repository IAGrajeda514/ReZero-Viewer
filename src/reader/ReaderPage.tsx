import type { Ref } from 'react'
import type { Chapter, Scene } from '../content/types'
import type { ArmedEdge } from './hooks/useReaderNavigation'
import type { PaginatedBlockFragment } from './pagination/types'
import { ReaderBlock } from './ReaderBlock'

interface ReaderPageProps {
  pageNumber: number
  chapter: Chapter
  scene: Scene
  fragments: PaginatedBlockFragment[]
  showSpeakerNames: boolean
  resolveSpeakerColor: (characterId: string) => string | undefined
  readingRef?: Ref<HTMLDivElement>
  transitionClass?: string
  armedEdge?: ArmedEdge
  measurement?: boolean
}

const timeLabels: Readonly<Record<string, string>> = {
  day: 'D\u00eda', sunset: 'Atardecer', night: 'Noche', dawn: 'Amanecer', unknown: 'Hora desconocida',
}

export function ReaderPage({
  pageNumber,
  chapter,
  scene,
  fragments,
  showSpeakerNames,
  resolveSpeakerColor,
  readingRef,
  transitionClass = '',
  armedEdge = null,
  measurement = false,
}: ReaderPageProps) {
  const timeLabel = timeLabels[scene.time] ?? scene.time
  const sceneLabel = `${scene.location.detail ?? scene.location.label} \u00b7 ${timeLabel}`

  return (
    <article className={`reader-page ${transitionClass}`} data-page-number={pageNumber} aria-hidden={measurement || undefined}>
      <div className="reader-page__inner">
        <header className="reader-page__header">
          <p className="reader-page__kicker">Cap&iacute;tulo {String(chapter.order).padStart(2, '0')}</p>
          <h1>{chapter.title}</h1>
        </header>

        <div className="reader-page__scene-line"><span>{sceneLabel}</span></div>

        <div
          className="reading"
          ref={readingRef}
          tabIndex={measurement ? -1 : 0}
          aria-label={measurement ? undefined : `Contenido de ${chapter.title}`}
          data-pagination-reading={measurement ? 'true' : undefined}
        >
          {fragments.map((fragment) => (
            <ReaderBlock
              key={`${fragment.sourceBlockId}:${fragment.startOffset}:${fragment.endOffset}`}
              fragment={fragment}
              showSpeakerNames={showSpeakerNames}
              speakerColor={fragment.block.type === 'dialogue' ? resolveSpeakerColor(fragment.block.characterId) : undefined}
              measurement={measurement}
            />
          ))}
        </div>

        <footer className="reader-page__footer">
          <span>{scene.location.label}</span>
          <span>P&aacute;gina {pageNumber}</span>
          <span>{timeLabel}</span>
        </footer>
      </div>

      {!measurement && (
        <>
          <div className={`edge-guard edge-guard--top${armedEdge === 'top' ? ' edge-guard--armed' : ''}`} aria-hidden="true"><span>&uarr;</span></div>
          <div className={`edge-guard edge-guard--bottom${armedEdge === 'bottom' ? ' edge-guard--armed' : ''}`} aria-hidden="true"><span>&darr;</span></div>
        </>
      )}
    </article>
  )
}
