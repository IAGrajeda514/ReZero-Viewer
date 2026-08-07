import { useEffect, useRef, useState, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import type { Chapter } from '../../content/types'
import { paginateChapter } from './paginateChapter'
import type { PageMeasurementCandidate, ReaderPageModel } from './types'

const RESIZE_DEBOUNCE_MS = 140
const OVERFLOW_TOLERANCE_PX = 1

interface AutomaticPaginationOptions {
  chapter: Chapter
  showSpeakerNames: boolean
  layoutKey: string
}

interface AutomaticPaginationResult {
  pages: ReaderPageModel[]
  isPreparing: boolean
  isRepaginating: boolean
  paginationRevision: number
  measurementHostRef: RefObject<HTMLDivElement | null>
  measurementCandidate: PageMeasurementCandidate | null
}

export function useAutomaticPagination({
  chapter,
  showSpeakerNames,
  layoutKey,
}: AutomaticPaginationOptions): AutomaticPaginationResult {
  const measurementHostRef = useRef<HTMLDivElement>(null)
  const [measurementCandidate, setMeasurementCandidate] = useState<PageMeasurementCandidate | null>(null)
  const [measurementRevision, setMeasurementRevision] = useState(0)
  const [paginationRevision, setPaginationRevision] = useState(0)
  const [pages, setPages] = useState<ReaderPageModel[]>([])
  const [paginatedChapterId, setPaginatedChapterId] = useState<string | null>(null)
  const [isRepaginating, setIsRepaginating] = useState(false)

  useEffect(() => {
    const host = measurementHostRef.current
    if (!host) return
    let resizeTimer: number | undefined
    let previousWidth = 0
    let previousHeight = 0

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const { width, height } = entry.contentRect
      if (Math.abs(width - previousWidth) < 1 && Math.abs(height - previousHeight) < 1) return
      previousWidth = width
      previousHeight = height
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        setMeasurementRevision((revision) => revision + 1)
      }, RESIZE_DEBOUNCE_MS)
    })

    observer.observe(host)
    return () => {
      observer.disconnect()
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer)
    }
  }, [])

  useEffect(() => {
    const host = measurementHostRef.current
    if (!host) return
    let cancelled = false
    let calculationTimer: number | undefined
    setIsRepaginating(true)

    const runPagination = () => {
      calculationTimer = window.setTimeout(() => {
        if (cancelled) return

        const fits = ({ chapter, activeScene, fragments }: PageMeasurementCandidate): boolean => {
          flushSync(() => {
            setMeasurementCandidate({ chapter, activeScene, fragments })
          })

          const readingElement = host.querySelector<HTMLDivElement>('[data-pagination-reading="true"]')
          if (!readingElement || readingElement.clientHeight <= 0) {
            throw new Error('Pagination measurement surface has no available reading height.')
          }
          return readingElement.scrollHeight <= readingElement.clientHeight + OVERFLOW_TOLERANCE_PX
        }

        const nextPages = paginateChapter(chapter, fits)
        if (cancelled) return
        setPages(nextPages)
        setPaginatedChapterId(chapter.id)
        setPaginationRevision((revision) => revision + 1)
        setIsRepaginating(false)
      }, 0)
    }

    void document.fonts.ready.then(runPagination)
    return () => {
      cancelled = true
      if (calculationTimer !== undefined) window.clearTimeout(calculationTimer)
    }
  }, [chapter, layoutKey, measurementRevision, showSpeakerNames])

  const activePages = paginatedChapterId === chapter.id ? pages : []
  const activeMeasurementCandidate = measurementCandidate?.chapter.id === chapter.id
    ? measurementCandidate
    : null

  return {
    pages: activePages,
    isPreparing: activePages.length === 0,
    isRepaginating,
    paginationRevision,
    measurementHostRef,
    measurementCandidate: activeMeasurementCandidate,
  }
}
