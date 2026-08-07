import type { CSSProperties } from 'react'
import type { PaginatedBlockFragment } from './pagination/types'

interface ReaderBlockProps {
  fragment: PaginatedBlockFragment
  showSpeakerNames: boolean
  speakerColor?: string
  measurement?: boolean
}

export function ReaderBlock({
  fragment,
  showSpeakerNames,
  speakerColor,
  measurement = false,
}: ReaderBlockProps) {
  const { block } = fragment
  const elementId = !measurement && fragment.isFirstFragment ? fragment.sourceBlockId : undefined
  const fragmentData = {
    'data-source-block-id': fragment.sourceBlockId,
    'data-start-offset': fragment.startOffset,
    'data-end-offset': fragment.endOffset,
  }

  switch (block.type) {
    case 'narration':
      return <p id={elementId} className="reader-block reader-block--narration" {...fragmentData}>{fragment.text}</p>
    case 'dialogue':
      return (
        <div
          id={elementId}
          className={`reader-block reader-block--dialogue${fragment.isFirstFragment ? '' : ' reader-block--continuation'}`}
          data-character-id={block.characterId}
          style={{ '--speaker-color': speakerColor ?? 'var(--speaker-unknown)' } as CSSProperties}
          {...fragmentData}
        >
          {showSpeakerNames && fragment.isFirstFragment && <span className="reader-block__speaker">{block.speakerLabel}</span>}
          <span>{fragment.text}</span>
        </div>
      )
    case 'thought':
      return <p id={elementId} className="reader-block reader-block--thought" {...fragmentData}>{fragment.text}</p>
    case 'memory':
      return <p id={elementId} className="reader-block reader-block--memory" {...fragmentData}>{fragment.text}</p>
    case 'scene-break':
      return (
        <div id={elementId} className="reader-block reader-block--scene-break" role="separator" aria-label={block.label} {...fragmentData}>
          <span aria-hidden="true">&#10022; &#10022; &#10022;</span>
        </div>
      )
  }
}
