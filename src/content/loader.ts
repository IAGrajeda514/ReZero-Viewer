import {
  SUPPORTED_CONTENT_PACK_SCHEMA_VERSION,
  type ContentPackCharacter,
  type ContentPackManifest,
} from './schema'
import type { Book, Chapter, ChapterSummary, Scene } from './types'

export type ContentLoadErrorCode =
  | 'network-error'
  | 'http-error'
  | 'invalid-json'
  | 'invalid-manifest'
  | 'unsupported-schema'
  | 'chapter-not-found'
  | 'invalid-chapter'
  | 'chapter-id-mismatch'

export class ContentLoadError extends Error {
  readonly code: ContentLoadErrorCode
  readonly resource: string
  readonly status?: number

  constructor(
    code: ContentLoadErrorCode,
    message: string,
    resource: string,
    options: { cause?: unknown; status?: number } = {},
  ) {
    super(message, { cause: options.cause })
    this.name = 'ContentLoadError'
    this.code = code
    this.resource = resource
    this.status = options.status
  }
}

export interface ContentLoader {
  loadManifest(): Promise<ContentPackManifest>
  loadBook(): Promise<Book>
  loadChapter(chapterId: string): Promise<Chapter>
}

export type ContentFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function invalidManifest(message: string, resource: string): ContentLoadError {
  return new ContentLoadError('invalid-manifest', message, resource)
}

function parseChapterSummary(value: unknown, resource: string): ChapterSummary {
  if (!isRecord(value)) throw invalidManifest('Manifest chapter entries must be objects.', resource)
  if (typeof value.id !== 'string' || value.id.length === 0) {
    throw invalidManifest('Manifest chapter entries require a non-empty id.', resource)
  }
  if (typeof value.title !== 'string' || typeof value.order !== 'number') {
    throw invalidManifest(`Manifest chapter ${value.id} requires title and numeric order.`, resource)
  }
  return { id: value.id, title: value.title, order: value.order }
}

function parseBook(value: unknown, resource: string): Book {
  if (!isRecord(value)) throw invalidManifest('Manifest book metadata must be an object.', resource)
  if (typeof value.id !== 'string' || value.id.length === 0 || typeof value.title !== 'string') {
    throw invalidManifest('Manifest book metadata requires id and title.', resource)
  }
  if (value.author !== undefined && typeof value.author !== 'string') {
    throw invalidManifest('Manifest book author must be a string when provided.', resource)
  }
  if (!Array.isArray(value.chapters)) {
    throw invalidManifest('Manifest book chapters must be an array.', resource)
  }

  const chapters = value.chapters.map((chapter) => parseChapterSummary(chapter, resource))
  const chapterIds = new Set(chapters.map((chapter) => chapter.id))
  if (chapterIds.size !== chapters.length) {
    throw invalidManifest('Manifest chapter ids must be unique.', resource)
  }

  return {
    id: value.id,
    title: value.title,
    ...(value.author === undefined ? {} : { author: value.author }),
    chapters,
  }
}

function parseCharacters(value: unknown, resource: string): ContentPackCharacter[] | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value)) throw invalidManifest('Manifest characters must be an array.', resource)

  const characters = value.map((character) => {
    if (!isRecord(character) || typeof character.id !== 'string' || typeof character.color !== 'string') {
      throw invalidManifest('Manifest character entries require string id and color.', resource)
    }
    return { id: character.id, color: character.color }
  })
  const characterIds = new Set(characters.map((character) => character.id))
  if (characterIds.size !== characters.length) {
    throw invalidManifest('Manifest character ids must be unique.', resource)
  }
  return characters
}

function parseManifest(value: unknown, resource: string): ContentPackManifest {
  if (!isRecord(value)) throw invalidManifest('Content pack manifest must be an object.', resource)
  if (value.schemaVersion !== SUPPORTED_CONTENT_PACK_SCHEMA_VERSION) {
    throw new ContentLoadError(
      'unsupported-schema',
      `Unsupported content pack schema version: ${String(value.schemaVersion)}.`,
      resource,
    )
  }

  const book = parseBook(value.book, resource)
  if (!isRecord(value.chapterFiles)) {
    throw invalidManifest('Manifest chapterFiles must be an object.', resource)
  }

  const chapterFiles: Record<string, string> = {}
  for (const [chapterId, path] of Object.entries(value.chapterFiles)) {
    if (typeof path !== 'string' || path.length === 0) {
      throw invalidManifest(`Chapter file path for ${chapterId} must be a non-empty string.`, resource)
    }
    chapterFiles[chapterId] = path
  }
  for (const chapter of book.chapters) {
    if (!chapterFiles[chapter.id]) {
      throw invalidManifest(`Manifest has no chapter file for ${chapter.id}.`, resource)
    }
  }

  const characters = parseCharacters(value.characters, resource)
  return {
    schemaVersion: SUPPORTED_CONTENT_PACK_SCHEMA_VERSION,
    book,
    chapterFiles,
    ...(characters === undefined ? {} : { characters }),
  }
}

function parseChapter(value: unknown, resource: string): Chapter {
  if (!isRecord(value)) {
    throw new ContentLoadError('invalid-chapter', 'Chapter content must be an object.', resource)
  }
  if (
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.order !== 'number' ||
    !Array.isArray(value.scenes)
  ) {
    throw new ContentLoadError(
      'invalid-chapter',
      'Chapter content requires id, title, numeric order, and scenes.',
      resource,
    )
  }
  const scenesAreStructurallyUsable = value.scenes.every((scene) => (
    isRecord(scene) && typeof scene.id === 'string' && Array.isArray(scene.blocks)
  ))
  if (!scenesAreStructurallyUsable) {
    throw new ContentLoadError('invalid-chapter', 'Chapter scenes require id and blocks.', resource)
  }

  return {
    id: value.id,
    title: value.title,
    order: value.order,
    scenes: value.scenes as Scene[],
  }
}

function joinContentUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/u, '')}/${path.replace(/^\/+/u, '')}`
}

export function createHttpContentLoader(
  baseUrl: string,
  fetchContent: ContentFetch = globalThis.fetch.bind(globalThis),
): ContentLoader {
  const manifestUrl = joinContentUrl(baseUrl, 'manifest.json')
  let manifestCache: Promise<ContentPackManifest> | null = null
  const chapterCache = new Map<string, Promise<Chapter>>()

  const fetchJson = async (resource: string): Promise<unknown> => {
    let response: Response
    try {
      response = await fetchContent(resource)
    } catch (cause) {
      throw new ContentLoadError('network-error', `Unable to request ${resource}.`, resource, { cause })
    }
    if (!response.ok) {
      throw new ContentLoadError(
        'http-error',
        `Content request failed with HTTP ${response.status}.`,
        resource,
        { status: response.status },
      )
    }
    try {
      return await response.json() as unknown
    } catch (cause) {
      throw new ContentLoadError('invalid-json', `Content at ${resource} is not valid JSON.`, resource, { cause })
    }
  }

  const loadManifest = (): Promise<ContentPackManifest> => {
    if (manifestCache) return manifestCache
    manifestCache = fetchJson(manifestUrl)
      .then((value) => parseManifest(value, manifestUrl))
      .catch((error: unknown) => {
        manifestCache = null
        throw error
      })
    return manifestCache
  }

  const loadChapter = (chapterId: string): Promise<Chapter> => {
    const cached = chapterCache.get(chapterId)
    if (cached) return cached

    const request = loadManifest().then(async (manifest) => {
      const chapterExists = manifest.book.chapters.some((chapter) => chapter.id === chapterId)
      const chapterPath = manifest.chapterFiles[chapterId]
      if (!chapterExists || !chapterPath) {
        throw new ContentLoadError(
          'chapter-not-found',
          `Chapter ${chapterId} is not declared by this content pack.`,
          manifestUrl,
        )
      }

      const chapterUrl = joinContentUrl(baseUrl, chapterPath)
      const chapter = parseChapter(await fetchJson(chapterUrl), chapterUrl)
      if (chapter.id !== chapterId) {
        throw new ContentLoadError(
          'chapter-id-mismatch',
          `Requested chapter ${chapterId}, but the file declares ${chapter.id}.`,
          chapterUrl,
        )
      }
      return chapter
    }).catch((error: unknown) => {
      chapterCache.delete(chapterId)
      throw error
    })

    chapterCache.set(chapterId, request)
    return request
  }

  return {
    loadManifest,
    loadBook: () => loadManifest().then((manifest) => manifest.book),
    loadChapter,
  }
}
