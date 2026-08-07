import type { Book } from './types'

export const SUPPORTED_CONTENT_PACK_SCHEMA_VERSION = 1 as const

export interface ContentPackCharacter {
  id: string
  color: string
}

/** Transport metadata. Chapter file locations intentionally remain outside Book. */
export interface ContentPackManifest {
  schemaVersion: typeof SUPPORTED_CONTENT_PACK_SCHEMA_VERSION
  book: Book
  chapterFiles: Readonly<Record<string, string>>
  characters?: ContentPackCharacter[]
}

// Full recursive ReaderBlock validation is intentionally deferred to a dedicated strategy.
