import type { Book, Chapter } from './types'

/** Adapter boundary for the future private content-pack loading strategy. */
export interface ContentLoader {
  loadBook(bookId: string): Promise<Book | null>
  loadChapter(bookId: string, chapterId: string): Promise<Chapter | null>
}

export type ContentLoaderFactory = () => ContentLoader
