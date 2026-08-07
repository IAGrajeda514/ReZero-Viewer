import type { RefObject } from 'react'
import type { Chapter, ReaderBlock as ReaderBlockModel, Scene } from '../content/types'
import type { ArmedEdge } from './hooks/useReaderNavigation'
import { ReaderBlock } from './ReaderBlock'

interface ReaderPageProps {
  pageNumber: number
  chapter: Chapter
  title: string
  scene: Scene
  blocks: ReaderBlockModel[]
  showSpeakerNames: boolean
  resolveSpeakerColor: (characterId: string) => string | undefined
  readingRef: RefObject<HTMLDivElement | null>
  transitionClass: string
  armedEdge: ArmedEdge
}

const timeLabels: Readonly<Record<string, string>> = {
  day: 'Día', sunset: 'Atardecer', night: 'Noche', dawn: 'Amanecer', unknown: 'Hora desconocida',
}

export function ReaderPage({
  pageNumber,
  chapter,
  title,
  scene,
  blocks,
  showSpeakerNames,
  resolveSpeakerColor,
  readingRef,
  transitionClass,
  armedEdge,
}: ReaderPageProps) {
  const timeLabel = timeLabels[scene.time] ?? scene.time
  const sceneLabel = `${scene.location.detail ?? scene.location.label} · ${timeLabel}`

  return (
    <article className={`reader-page ${transitionClass}`} data-page-number={pageNumber}>
      <div className="reader-page__inner">
        <header className="reader-page__header">
          <p className="reader-page__kicker">Capítulo {String(chapter.order).padStart(2, '0')}</p>
          <h1>{title}</h1>
        </header>

        <div className="reader-page__scene-line"><span>{sceneLabel}</span></div>

        <div className="reading" ref={readingRef} tabIndex={0} aria-label={`Contenido de ${title}`}>
          {blocks.map((block) => (
            <ReaderBlock
              key={block.id}
              block={block}
              showSpeakerNames={showSpeakerNames}
              speakerColor={block.type === 'dialogue' ? resolveSpeakerColor(block.characterId) : undefined}
            />
          ))}
        </div>

        <footer className="reader-page__footer">
          <span>{scene.location.label}</span>
          <span>Página {pageNumber}</span>
          <span>{timeLabel}</span>
        </footer>
      </div>

      <div className={`edge-guard edge-guard--top${armedEdge === 'top' ? ' edge-guard--armed' : ''}`} aria-hidden="true">
        <span>↑</span>
      </div>
      <div className={`edge-guard edge-guard--bottom${armedEdge === 'bottom' ? ' edge-guard--armed' : ''}`} aria-hidden="true">
        <span>↓</span>
      </div>
    </article>
  )
}
