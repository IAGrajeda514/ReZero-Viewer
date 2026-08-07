/** A private book loaded by the reader engine. */
export interface Book {
  id: string
  title: string
  author?: string
  chapters: ChapterSummary[]
}

/** Lightweight chapter index stored with book metadata. */
export interface ChapterSummary {
  id: string
  title: string
  order: number
}

/** Full chapter content loaded separately from book metadata. */
export interface Chapter extends ChapterSummary {
  scenes: Scene[]
}

export interface Scene {
  id: string
  location: SceneLocation
  time: SceneTime
  mood: SceneMood
  ambience?: SceneAmbience
  intro?: SceneIntroduction
  blocks: ReaderBlock[]
}

export interface SceneIntroduction {
  title: string
  subtitle: string
}

export interface SceneLocation {
  id: string
  label: string
  detail?: string
  certainty?: 'confirmed' | 'uncertain' | 'unknown'
}

/** Known values are suggestions; custom values remain valid for future content packs. */
export type SceneTime = 'day' | 'sunset' | 'night' | 'dawn' | 'unknown' | (string & {})

/** Known values are suggestions; custom values remain valid for future content packs. */
export type SceneMood =
  | 'neutral'
  | 'warm'
  | 'melancholic'
  | 'tense'
  | 'danger'
  | (string & {})

export interface SceneAmbience {
  presetId?: string
  intensity?: number
}

interface BaseReaderBlock {
  id: string
}

export interface NarrationBlock extends BaseReaderBlock {
  type: 'narration'
  text: string
}

export interface DialogueBlock extends BaseReaderBlock {
  type: 'dialogue'
  characterId: string
  /** Reader-facing label that can change as knowledge of the story changes. */
  speakerLabel: string
  text: string
}

export interface ThoughtBlock extends BaseReaderBlock {
  type: 'thought'
  characterId?: string
  text: string
}

export interface MemoryBlock extends BaseReaderBlock {
  type: 'memory'
  text: string
}

export interface SceneBreakBlock extends BaseReaderBlock {
  type: 'scene-break'
  label?: string
}

export type ReaderBlock =
  | NarrationBlock
  | DialogueBlock
  | ThoughtBlock
  | MemoryBlock
  | SceneBreakBlock
