import type { ReaderBlock as ReaderBlockModel } from '../content/types'

interface ReaderBlockProps {
  block: ReaderBlockModel
  showSpeakerNames?: boolean
}

export function ReaderBlock({ block, showSpeakerNames = true }: ReaderBlockProps) {
  switch (block.type) {
    case 'narration':
      return <p className="reader-block reader-block--narration">{block.text}</p>
    case 'dialogue':
      return <p className="reader-block reader-block--dialogue" data-character-id={block.characterId}>
        {showSpeakerNames && <strong>{block.speakerLabel}: </strong>}{block.text}
      </p>
    case 'thought':
      return <p className="reader-block reader-block--thought">{block.text}</p>
    case 'memory':
      return <p className="reader-block reader-block--memory">{block.text}</p>
    case 'scene-break':
      return <hr className="reader-block reader-block--scene-break" aria-label={block.label} />
  }
}
