import type { Chapter, ReaderBlock, Scene } from '../../content/types'
import type {
  PageFits,
  PageSceneTransition,
  PaginatedBlockFragment,
  ReaderPageModel,
} from './types'

const SENTENCE_FILL_RATIO = 0.55

type TextBlock = Exclude<ReaderBlock, { type: 'scene-break' }>

function isTextBlock(block: ReaderBlock): block is TextBlock {
  return block.type !== 'scene-break'
}

function createFragment(
  block: ReaderBlock,
  scene: Scene,
  startOffset: number,
  endOffset: number,
  fragmentIndex: number,
  startsScene: boolean,
): PaginatedBlockFragment {
  const text = isTextBlock(block) ? block.text.slice(startOffset, endOffset) : null
  const sourceLength = isTextBlock(block) ? block.text.length : 0

  return {
    sourceBlockId: block.id,
    sceneId: scene.id,
    block,
    text,
    startOffset,
    endOffset,
    fragmentIndex,
    isFirstFragment: startOffset === 0,
    isLastFragment: endOffset >= sourceLength,
    startsScene,
  }
}

function collectWordBoundaries(text: string, startOffset: number): number[] {
  const boundaries: number[] = []
  const remaining = text.slice(startOffset)
  const words = /\S+(?:\s+|$)/gu
  let match = words.exec(remaining)

  while (match) {
    boundaries.push(startOffset + match.index + match[0].length)
    match = words.exec(remaining)
  }

  if (boundaries.at(-1) !== text.length) boundaries.push(text.length)
  return boundaries
}

function collectSentenceBoundaries(text: string, startOffset: number): number[] {
  const boundaries: number[] = []
  const remaining = text.slice(startOffset)
  const sentences = /[.!?\u2026]+(?:["'\u00bb\u201d)]*)\s+/gu
  let match = sentences.exec(remaining)

  while (match) {
    boundaries.push(startOffset + match.index + match[0].length)
    match = sentences.exec(remaining)
  }

  boundaries.push(text.length)
  return boundaries
}

function collectCodePointBoundaries(text: string, startOffset: number): number[] {
  const boundaries: number[] = []
  let offset = startOffset
  for (const character of text.slice(startOffset)) {
    offset += character.length
    boundaries.push(offset)
  }
  return boundaries
}

function largestFittingBoundary(
  boundaries: number[],
  fitsAt: (endOffset: number) => boolean,
): number | null {
  let low = 0
  let high = boundaries.length - 1
  let result: number | null = null

  while (low <= high) {
    const middle = Math.floor((low + high) / 2)
    const boundary = boundaries[middle]
    if (fitsAt(boundary)) {
      result = boundary
      low = middle + 1
    } else {
      high = middle - 1
    }
  }

  return result
}

function chooseSplitOffset(
  block: TextBlock,
  scene: Scene,
  startOffset: number,
  fragmentIndex: number,
  startsScene: boolean,
  currentFragments: PaginatedBlockFragment[],
  fits: PageFits,
  chapter: Chapter,
): number {
  const fitsAt = (endOffset: number) => fits({
    chapter,
    activeScene: sceneForFirstFragment(chapter, currentFragments[0] ?? createFragment(block, scene, startOffset, endOffset, fragmentIndex, startsScene)),
    fragments: [
      ...currentFragments,
      createFragment(block, scene, startOffset, endOffset, fragmentIndex, startsScene),
    ],
  })

  const wordBoundary = largestFittingBoundary(collectWordBoundaries(block.text, startOffset), fitsAt)
  if (wordBoundary !== null) {
    const sentenceBoundary = collectSentenceBoundaries(block.text, startOffset)
      .filter((boundary) => boundary <= wordBoundary)
      .at(-1)
    if (
      sentenceBoundary !== undefined &&
      sentenceBoundary - startOffset >= (wordBoundary - startOffset) * SENTENCE_FILL_RATIO
    ) {
      return sentenceBoundary
    }
    return wordBoundary
  }

  // Extraordinary fallback for a single unbreakable token wider/taller than the page.
  return largestFittingBoundary(collectCodePointBoundaries(block.text, startOffset), fitsAt)
    ?? collectCodePointBoundaries(block.text, startOffset)[0]
    ?? block.text.length
}

function sceneForFirstFragment(chapter: Chapter, fragment: PaginatedBlockFragment): Scene {
  const scene = chapter.scenes.find((candidate) => candidate.id === fragment.sceneId)
  if (!scene) throw new Error(`Missing scene ${fragment.sceneId} in chapter ${chapter.id}.`)
  return scene
}

function createPage(chapter: Chapter, fragments: PaginatedBlockFragment[]): ReaderPageModel {
  const firstFragment = fragments[0]
  if (!firstFragment) throw new Error(`Cannot create an empty page for chapter ${chapter.id}.`)

  const sceneTransitions: PageSceneTransition[] = []
  let previousSceneId: string | null = null
  fragments.forEach((fragment, fragmentIndex) => {
    if (fragment.sceneId === previousSceneId) return
    sceneTransitions.push({ sceneId: fragment.sceneId, fragmentIndex, startsScene: fragment.startsScene })
    previousSceneId = fragment.sceneId
  })

  return {
    id: `${chapter.id}:${firstFragment.sourceBlockId}:${firstFragment.startOffset}`,
    chapterId: chapter.id,
    activeSceneId: firstFragment.sceneId,
    fragments: [...fragments],
    sceneTransitions,
    beginsScene: firstFragment.startsScene,
  }
}

export function paginateChapter(chapter: Chapter, fits: PageFits): ReaderPageModel[] {
  const pages: ReaderPageModel[] = []
  let currentFragments: PaginatedBlockFragment[] = []

  const finishPage = () => {
    if (currentFragments.length === 0) return
    pages.push(createPage(chapter, currentFragments))
    currentFragments = []
  }

  for (const scene of chapter.scenes) {
    if (scene.intro && currentFragments.length > 0) finishPage()

    for (const [blockIndex, block] of scene.blocks.entries()) {
      const startsScene = blockIndex === 0

      if (!isTextBlock(block)) {
        const fragment = createFragment(block, scene, 0, 0, 0, startsScene)
        const activeScene = currentFragments.length > 0
          ? sceneForFirstFragment(chapter, currentFragments[0])
          : scene
        if (currentFragments.length > 0 && !fits({ chapter, activeScene, fragments: [...currentFragments, fragment] })) {
          finishPage()
        }
        currentFragments.push(fragment)
        continue
      }

      let startOffset = 0
      let fragmentIndex = 0
      while (startOffset < block.text.length) {
        const wholeFragment = createFragment(
          block,
          scene,
          startOffset,
          block.text.length,
          fragmentIndex,
          startsScene && startOffset === 0,
        )
        const activeScene = currentFragments.length > 0
          ? sceneForFirstFragment(chapter, currentFragments[0])
          : scene

        if (fits({ chapter, activeScene, fragments: [...currentFragments, wholeFragment] })) {
          currentFragments.push(wholeFragment)
          break
        }

        if (currentFragments.length > 0) {
          const lastFragment = currentFragments.at(-1)
          if (lastFragment?.block.type === 'scene-break' && currentFragments.length > 1) {
            currentFragments.pop()
            finishPage()
            currentFragments.push(lastFragment)
            continue
          }
          if (lastFragment?.block.type !== 'scene-break') {
            finishPage()
            continue
          }
        }

        const endOffset = chooseSplitOffset(
          block,
          scene,
          startOffset,
          fragmentIndex,
          startsScene && startOffset === 0,
          currentFragments,
          fits,
          chapter,
        )
        currentFragments.push(createFragment(
          block,
          scene,
          startOffset,
          endOffset,
          fragmentIndex,
          startsScene && startOffset === 0,
        ))
        finishPage()
        startOffset = endOffset
        fragmentIndex += 1
      }
    }
  }

  finishPage()
  return pages
}
