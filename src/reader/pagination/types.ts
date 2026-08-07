import type { Chapter, ReaderBlock, Scene } from '../../content/types'

/** A runtime-only slice of a canonical ReaderBlock. Offsets use UTF-16 string positions. */
export interface PaginatedBlockFragment {
  sourceBlockId: string
  sceneId: string
  block: ReaderBlock
  text: string | null
  startOffset: number
  endOffset: number
  fragmentIndex: number
  isFirstFragment: boolean
  isLastFragment: boolean
  startsScene: boolean
}

export interface PageSceneTransition {
  sceneId: string
  fragmentIndex: number
  startsScene: boolean
}

/** Generated layout. It is never written back into Book, Chapter, Scene, or ReaderBlock. */
export interface ReaderPageModel {
  id: string
  chapterId: string
  activeSceneId: string
  fragments: PaginatedBlockFragment[]
  sceneTransitions: PageSceneTransition[]
  beginsScene: boolean
}

export interface PageMeasurementCandidate {
  chapter: Chapter
  activeScene: Scene
  fragments: PaginatedBlockFragment[]
}

export type PageFits = (candidate: PageMeasurementCandidate) => boolean
