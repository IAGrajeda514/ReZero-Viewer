import type { CSSProperties } from 'react'
import type { ReaderBlock as ReaderBlockModel } from '../content/types'

interface ReaderBlockProps {
  block: ReaderBlockModel
  showSpeakerNames: boolean
  speakerColor?: string
}

export function ReaderBlock({ block, showSpeakerNames, speakerColor }: ReaderBlockProps) {
  switch (block.type) {
    case 'narration':
      return <p id={block.id} className="reader-block reader-block--narration">{block.text}</p>
    case 'dialogue':
      return (
        <div
          id={block.id}
          className="reader-block reader-block--dialogue"
          data-character-id={block.characterId}
          style={{ '--speaker-color': speakerColor ?? 'var(--speaker-unknown)' } as CSSProperties}
        >
          {showSpeakerNames && <span className="reader-block__speaker">{block.speakerLabel}</span>}
          <span>{block.text}</span>
        </div>
      )
    case 'thought':
      return <p id={block.id} className="reader-block reader-block--thought">{block.text}</p>
    case 'memory':
      return <p id={block.id} className="reader-block reader-block--memory">{block.text}</p>
    case 'scene-break':
      return (
        <div id={block.id} className="reader-block reader-block--scene-break" role="separator" aria-label={block.label}>
          <span aria-hidden="true">✦ ✦ ✦</span>
        </div>
      )
  }
}
