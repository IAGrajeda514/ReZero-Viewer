import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { AmbientBackground } from '../ambience/AmbientBackground'
import { getAmbiencePreset } from '../ambience/presets'
import { ChapterDrawer } from '../chapters/ChapterDrawer'
import type { Book, Chapter, Scene, SceneIntroduction } from '../content/types'
import { ReaderSettings } from '../settings/ReaderSettings'
import { getReadingProgress, saveReadingProgress } from '../storage/progress'
import type { ReaderPreferences } from '../storage/preferences'
import { PageNavigation } from './PageNavigation'
import { ReaderPage } from './ReaderPage'
import { useControlsVisibility } from './hooks/useControlsVisibility'
import { usePagination } from './hooks/usePagination'
import { useReaderNavigation } from './hooks/useReaderNavigation'
import { useAutomaticPagination } from './pagination/useAutomaticPagination'
import type { ReaderPageModel } from './pagination/types'

const PAGE_EXIT_MS = 220
const PAGE_ENTER_MS = 480
const EMPTY_SPEAKER_COLORS: Readonly<Record<string, string>> = {}

type DrawerName = 'chapters' | 'settings' | null
type NavigationDirection = 'next' | 'previous' | null
type TransitionClass = '' | 'reader-page--exit-next' | 'reader-page--exit-previous' | 'reader-page--enter-next' | 'reader-page--enter-previous'

interface ReaderProps {
  book: Book
  chapters: Chapter[]
  speakerColors?: Readonly<Record<string, string>>
  preferences: ReaderPreferences
  onPreferencesChange: (changes: Partial<ReaderPreferences>) => void
}

interface ResolvedPage {
  model: ReaderPageModel
  chapter: Chapter
  scene: Scene
}

interface RuntimeContentAnchor {
  chapterId: string
  sceneId: string
  blockId: string
  offset: number
}

function resolvePage(model: ReaderPageModel, chapters: Chapter[]): ResolvedPage {
  const chapter = chapters.find((candidate) => candidate.id === model.chapterId)
  const scene = chapter?.scenes.find((candidate) => candidate.id === model.activeSceneId)
  if (!chapter || !scene) throw new Error(`Generated page ${model.id} references missing content.`)
  return { model, chapter, scene }
}

export function Reader({
  book,
  chapters,
  speakerColors,
  preferences,
  onPreferencesChange,
}: ReaderProps) {
  const colorMap = speakerColors ?? EMPTY_SPEAKER_COLORS
  const resolveSpeakerColor = useCallback((characterId: string) => colorMap[characterId], [colorMap])
  const layoutKey = `${preferences.fontSize}:${preferences.lineHeight}:${preferences.readerWidth}`
  const {
    pages,
    isPreparing,
    isRepaginating,
    paginationRevision,
    measurementHostRef,
    measurementCandidate,
  } = useAutomaticPagination({
    chapters,
    showSpeakerNames: preferences.showSpeakerNames,
    layoutKey,
  })

  const { currentIndex, goTo } = usePagination(pages.length)
  const safeCurrentIndex = pages.length === 0 ? 0 : Math.min(currentIndex, pages.length - 1)
  const currentPage = useMemo(
    () => pages.length > 0 ? resolvePage(pages[safeCurrentIndex], chapters) : null,
    [chapters, pages, safeCurrentIndex],
  )
  const [openDrawer, setOpenDrawer] = useState<DrawerName>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionClass, setTransitionClass] = useState<TransitionClass>('')
  const [sceneIntroduction, setSceneIntroduction] = useState<SceneIntroduction | null>(null)
  const [systemReducedMotion, setSystemReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const readingRef = useRef<HTMLDivElement>(null)
  const transitionTimerRef = useRef<number | undefined>(undefined)
  const sceneTimerRef = useRef<number | undefined>(undefined)
  const navigationDirectionRef = useRef<NavigationDirection>(null)
  const previousSceneIdRef = useRef<string | null>(null)
  const hasRenderedPageRef = useRef(false)
  const storedProgressRef = useRef(getReadingProgress())
  const initialProgress = storedProgressRef.current?.bookId === book.id ? storedProgressRef.current : null
  const contentAnchorRef = useRef<RuntimeContentAnchor | null>(initialProgress ? {
    chapterId: initialProgress.chapterId,
    sceneId: initialProgress.sceneId,
    blockId: initialProgress.blockId,
    offset: 0,
  } : null)

  const isDrawerOpen = openDrawer !== null
  const reducedMotion = preferences.reducedMotion || systemReducedMotion
  const { areControlsVisible, showControls } = useControlsVisibility({ paused: isDrawerOpen })
  const closeDrawers = useCallback(() => setOpenDrawer(null), [])

  useLayoutEffect(() => {
    if (pages.length === 0) return
    const anchor = contentAnchorRef.current
    let anchoredIndex = anchor ? pages.findIndex((page) => (
      page.chapterId === anchor.chapterId && page.fragments.some((fragment) => (
        fragment.sceneId === anchor.sceneId &&
        fragment.sourceBlockId === anchor.blockId &&
        (fragment.text === null || (fragment.startOffset <= anchor.offset && anchor.offset < fragment.endOffset))
      ))
    )) : 0
    if (anchoredIndex < 0 && anchor) {
      anchoredIndex = pages.findIndex((page) => (
        page.chapterId === anchor.chapterId && page.fragments.some((fragment) => (
          fragment.sceneId === anchor.sceneId && fragment.sourceBlockId === anchor.blockId
        ))
      ))
    }

    if (transitionTimerRef.current !== undefined) window.clearTimeout(transitionTimerRef.current)
    navigationDirectionRef.current = null
    setTransitionClass('')
    setIsTransitioning(false)
    goTo(anchoredIndex >= 0 ? anchoredIndex : 0)
  }, [goTo, pages, paginationRevision])

  const navigateTo = useCallback((targetIndex: number) => {
    if (isTransitioning || targetIndex === safeCurrentIndex || targetIndex < 0 || targetIndex >= pages.length) return
    const direction: Exclude<NavigationDirection, null> = targetIndex > safeCurrentIndex ? 'next' : 'previous'
    navigationDirectionRef.current = direction

    if (reducedMotion) {
      goTo(targetIndex)
      return
    }

    setIsTransitioning(true)
    setTransitionClass(direction === 'next' ? 'reader-page--exit-next' : 'reader-page--exit-previous')
    transitionTimerRef.current = window.setTimeout(() => {
      goTo(targetIndex)
      setTransitionClass(direction === 'next' ? 'reader-page--enter-next' : 'reader-page--enter-previous')
      transitionTimerRef.current = window.setTimeout(() => {
        setTransitionClass('')
        setIsTransitioning(false)
      }, PAGE_ENTER_MS)
    }, PAGE_EXIT_MS)
  }, [goTo, isTransitioning, pages.length, reducedMotion, safeCurrentIndex])

  const nextPage = useCallback(() => navigateTo(safeCurrentIndex + 1), [navigateTo, safeCurrentIndex])
  const previousPage = useCallback(() => navigateTo(safeCurrentIndex - 1), [navigateTo, safeCurrentIndex])
  const canGoNext = currentPage !== null && safeCurrentIndex < pages.length - 1
  const canGoPrevious = currentPage !== null && safeCurrentIndex > 0

  const { armedEdge, handleTouchStart, handleTouchEnd } = useReaderNavigation({
    readingRef,
    pageKey: `${currentPage?.model.id ?? 'preparing'}:${paginationRevision}`,
    enabled: currentPage !== null && !isDrawerOpen && !isTransitioning && !isRepaginating,
    wheelNavigation: preferences.wheelNavigation,
    canGoNext,
    canGoPrevious,
    onNext: nextPage,
    onPrevious: previousPage,
    onEscape: closeDrawers,
    onInteraction: showControls,
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateSystemMotionPreference = () => setSystemReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', updateSystemMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateSystemMotionPreference)
  }, [])

  useEffect(() => {
    const revealControls = () => showControls()
    window.addEventListener('mousemove', revealControls, { passive: true })
    window.addEventListener('pointerdown', revealControls, { passive: true })
    return () => {
      window.removeEventListener('mousemove', revealControls)
      window.removeEventListener('pointerdown', revealControls)
    }
  }, [showControls])

  useEffect(() => {
    if (!currentPage) return
    const reading = readingRef.current
    if (reading) {
      reading.scrollTop = navigationDirectionRef.current === 'previous'
        ? Math.max(0, reading.scrollHeight - reading.clientHeight)
        : 0
    }
    navigationDirectionRef.current = null

    const firstFragment = currentPage.model.fragments[0]
    if (firstFragment) {
      contentAnchorRef.current = {
        chapterId: currentPage.chapter.id,
        sceneId: firstFragment.sceneId,
        blockId: firstFragment.sourceBlockId,
        offset: firstFragment.startOffset,
      }
      saveReadingProgress({
        bookId: book.id,
        chapterId: currentPage.chapter.id,
        sceneId: firstFragment.sceneId,
        blockId: firstFragment.sourceBlockId,
        updatedAt: new Date().toISOString(),
      })
    }

    if (!hasRenderedPageRef.current) {
      previousSceneIdRef.current = currentPage.scene.id
      hasRenderedPageRef.current = true
      return
    }

    if (
      previousSceneIdRef.current !== currentPage.scene.id &&
      currentPage.model.beginsScene &&
      currentPage.scene.intro
    ) {
      setSceneIntroduction(currentPage.scene.intro)
      if (sceneTimerRef.current !== undefined) window.clearTimeout(sceneTimerRef.current)
      sceneTimerRef.current = window.setTimeout(() => setSceneIntroduction(null), 1250)
    }
    previousSceneIdRef.current = currentPage.scene.id
  }, [book.id, currentPage])

  useEffect(() => () => {
    if (transitionTimerRef.current !== undefined) window.clearTimeout(transitionTimerRef.current)
    if (sceneTimerRef.current !== undefined) window.clearTimeout(sceneTimerRef.current)
  }, [])

  const currentPreset = useMemo(
    () => getAmbiencePreset(currentPage?.scene.ambience?.presetId),
    [currentPage?.scene.ambience?.presetId],
  )
  const sceneAmbienceIntensity = currentPage?.scene.ambience?.intensity ?? currentPreset.visuals.intensity
  const ambienceIntensity = Math.min(1.2, Math.max(0, preferences.ambienceIntensity * sceneAmbienceIntensity))
  const readerStyle = {
    '--reader-font-size': `${preferences.fontSize}px`,
    '--reader-line-height': preferences.lineHeight,
    '--reader-width': `${preferences.readerWidth}px`,
    '--glass-alpha': preferences.glassOpacity,
  } as CSSProperties

  const progressForChapter = useCallback((chapterId: string): number | null => {
    const chapterPageIndexes = pages
      .map((page, index) => page.chapterId === chapterId ? index : -1)
      .filter((index) => index >= 0)
    if (chapterPageIndexes.length === 0) return null
    if (safeCurrentIndex < chapterPageIndexes[0]) return 0
    const reached = chapterPageIndexes.filter((index) => index <= safeCurrentIndex).length
    return Math.round((reached / chapterPageIndexes.length) * 100)
  }, [pages, safeCurrentIndex])

  const selectChapter = useCallback((chapterId: string) => {
    const targetIndex = pages.findIndex((page) => page.chapterId === chapterId)
    closeDrawers()
    if (targetIndex >= 0) navigateTo(targetIndex)
  }, [closeDrawers, navigateTo, pages])

  return (
    <main
      className="reader-app"
      data-theme={preferences.theme}
      data-reduced-motion={reducedMotion}
      style={readerStyle}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AmbientBackground preset={currentPreset} intensity={ambienceIntensity} reducedMotion={reducedMotion} />

      <header className={`reader-meta${areControlsVisible ? '' : ' reading-ui--quiet'}`}>
        <strong>NovelView</strong>
        <span>{currentPage ? `Cap\u00edtulo ${String(currentPage.chapter.order).padStart(2, '0')} \u00b7 ${currentPage.scene.location.label}` : book.title}</span>
      </header>

      <section className="reader-stage" aria-label={book.title}>
        <button
          className={`reader-side-button${areControlsVisible ? '' : ' reading-ui--quiet'}`}
          type="button"
          onClick={previousPage}
          disabled={!canGoPrevious || isTransitioning || isRepaginating}
          aria-label="Página anterior"
        >&lsaquo;</button>

        <div className="reader-sheet-wrap">
          <div className="pagination-measurement-host" ref={measurementHostRef} aria-hidden="true">
            {measurementCandidate && (
              <ReaderPage
                pageNumber={1}
                chapter={measurementCandidate.chapter}
                scene={measurementCandidate.activeScene}
                fragments={measurementCandidate.fragments}
                showSpeakerNames={preferences.showSpeakerNames}
                resolveSpeakerColor={resolveSpeakerColor}
                measurement
              />
            )}
          </div>
          {currentPage ? (
            <ReaderPage
              key={currentPage.model.id}
              pageNumber={safeCurrentIndex + 1}
              chapter={currentPage.chapter}
              scene={currentPage.scene}
              fragments={currentPage.model.fragments}
              showSpeakerNames={preferences.showSpeakerNames}
              resolveSpeakerColor={resolveSpeakerColor}
              readingRef={readingRef}
              transitionClass={transitionClass}
              armedEdge={armedEdge}
            />
          ) : (
            <article className="reader-page pagination-preparing" aria-live="polite">
              <p>Preparando lectura&hellip;</p>
            </article>
          )}
        </div>

        <button
          className={`reader-side-button${areControlsVisible ? '' : ' reading-ui--quiet'}`}
          type="button"
          onClick={nextPage}
          disabled={!canGoNext || isTransitioning || isRepaginating}
          aria-label="Página siguiente"
        >&rsaquo;</button>
      </section>

      <PageNavigation
        currentPage={safeCurrentIndex}
        pageCount={pages.length}
        controlsVisible={areControlsVisible}
        isTransitioning={isTransitioning || isRepaginating || isPreparing}
        onNext={nextPage}
        onPrevious={previousPage}
        onOpenChapters={() => setOpenDrawer('chapters')}
        onOpenSettings={() => setOpenDrawer('settings')}
      />

      <div className={`scene-overlay${sceneIntroduction ? ' scene-overlay--visible' : ''}`} aria-hidden="true">
        {sceneIntroduction && <div><strong>{sceneIntroduction.title}</strong><span>{sceneIntroduction.subtitle}</span></div>}
      </div>

      <button
        className={`drawer-backdrop${isDrawerOpen ? ' drawer-backdrop--visible' : ''}`}
        type="button"
        onClick={closeDrawers}
        aria-label="Cerrar panel"
        tabIndex={isDrawerOpen ? 0 : -1}
      />

      <ChapterDrawer
        chapters={book.chapters}
        activeChapterId={currentPage?.chapter.id ?? ''}
        isOpen={openDrawer === 'chapters'}
        progressForChapter={progressForChapter}
        onSelect={selectChapter}
        onClose={closeDrawers}
      />
      <ReaderSettings
        preferences={preferences}
        isOpen={openDrawer === 'settings'}
        onChange={onPreferencesChange}
        onClose={closeDrawers}
      />
    </main>
  )
}
