import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { AmbientBackground } from '../ambience/AmbientBackground'
import { getAmbiencePreset } from '../ambience/presets'
import { ChapterDrawer } from '../chapters/ChapterDrawer'
import type { Book, Chapter, ReaderBlock, Scene, SceneIntroduction } from '../content/types'
import { ReaderSettings } from '../settings/ReaderSettings'
import { getReadingProgress, saveReadingProgress } from '../storage/progress'
import type { ReaderPreferences } from '../storage/preferences'
import { PageNavigation } from './PageNavigation'
import { ReaderPage } from './ReaderPage'
import { useControlsVisibility } from './hooks/useControlsVisibility'
import { usePagination } from './hooks/usePagination'
import { useReaderNavigation } from './hooks/useReaderNavigation'
import type { ReaderPageDefinition } from './types'

const PAGE_EXIT_MS = 220
const PAGE_ENTER_MS = 480

type DrawerName = 'chapters' | 'settings' | null
type TransitionClass = '' | 'reader-page--exit-next' | 'reader-page--exit-previous' | 'reader-page--enter-next' | 'reader-page--enter-previous'

interface ReaderProps {
  book: Book
  chapters: Chapter[]
  pages: ReaderPageDefinition[]
  speakerColors?: Readonly<Record<string, string>>
  preferences: ReaderPreferences
  onPreferencesChange: (changes: Partial<ReaderPreferences>) => void
}

interface ResolvedPage {
  definition: ReaderPageDefinition
  chapter: Chapter
  scene: Scene
  blocks: ReaderBlock[]
}

function resolvePage(definition: ReaderPageDefinition, chapters: Chapter[]): ResolvedPage {
  const chapter = chapters.find((candidate) => candidate.id === definition.chapterId)
  const scene = chapter?.scenes.find((candidate) => candidate.id === definition.sceneId)
  if (!chapter || !scene) throw new Error(`Reader page ${definition.id} references missing content.`)

  const blocks = definition.blockIds.map((blockId) => {
    const block = scene.blocks.find((candidate) => candidate.id === blockId)
    if (!block) throw new Error(`Reader page ${definition.id} references missing block ${blockId}.`)
    return block
  })

  return { definition, chapter, scene, blocks }
}

function getInitialPageIndex(book: Book, chapters: Chapter[], pages: ReaderPageDefinition[]): number {
  const progress = getReadingProgress()
  if (!progress || progress.bookId !== book.id) return 0

  const index = pages.findIndex((page) => (
    page.chapterId === progress.chapterId &&
    page.sceneId === progress.sceneId &&
    page.blockIds.includes(progress.blockId)
  ))

  if (index < 0) return 0
  const chapterExists = chapters.some((chapter) => chapter.id === progress.chapterId)
  return chapterExists ? index : 0
}

export function Reader({
  book,
  chapters,
  pages,
  speakerColors = {},
  preferences,
  onPreferencesChange,
}: ReaderProps) {
  const [initialPageIndex] = useState(() => getInitialPageIndex(book, chapters, pages))
  const { currentIndex, canGoNext, canGoPrevious, goTo } = usePagination(pages.length, initialPageIndex)
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

  const currentPage = useMemo(
    () => resolvePage(pages[currentIndex], chapters),
    [chapters, currentIndex, pages],
  )
  const previousSceneIdRef = useRef(currentPage.scene.id)
  const isDrawerOpen = openDrawer !== null
  const reducedMotion = preferences.reducedMotion || systemReducedMotion
  const { areControlsVisible, showControls } = useControlsVisibility({ paused: isDrawerOpen })

  const closeDrawers = useCallback(() => setOpenDrawer(null), [])

  const navigateTo = useCallback((targetIndex: number) => {
    if (isTransitioning || targetIndex === currentIndex || targetIndex < 0 || targetIndex >= pages.length) return
    const direction = targetIndex > currentIndex ? 'next' : 'previous'

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
  }, [currentIndex, goTo, isTransitioning, pages.length, reducedMotion])

  const nextPage = useCallback(() => navigateTo(currentIndex + 1), [currentIndex, navigateTo])
  const previousPage = useCallback(() => navigateTo(currentIndex - 1), [currentIndex, navigateTo])

  const { armedEdge, handleTouchStart, handleTouchEnd } = useReaderNavigation({
    readingRef,
    pageKey: currentPage.definition.id,
    enabled: !isDrawerOpen && !isTransitioning,
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
    readingRef.current?.scrollTo({ top: 0, behavior: 'instant' })
    const firstBlockId = currentPage.definition.blockIds[0]
    if (firstBlockId) {
      saveReadingProgress({
        bookId: book.id,
        chapterId: currentPage.chapter.id,
        sceneId: currentPage.scene.id,
        blockId: firstBlockId,
        updatedAt: new Date().toISOString(),
      })
    }

    if (previousSceneIdRef.current !== currentPage.scene.id && currentPage.scene.intro) {
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
    () => getAmbiencePreset(currentPage.scene.ambience?.presetId),
    [currentPage.scene.ambience?.presetId],
  )
  const sceneAmbienceIntensity = currentPage.scene.ambience?.intensity ?? currentPreset.visuals.intensity
  const ambienceIntensity = Math.min(1.2, Math.max(0, preferences.ambienceIntensity * sceneAmbienceIntensity))
  const readerStyle = {
    '--reader-font-size': `${preferences.fontSize}px`,
    '--reader-line-height': preferences.lineHeight,
    '--reader-width': `${preferences.readerWidth}px`,
    '--glass-alpha': preferences.glassOpacity,
  } as CSSProperties

  const resolveSpeakerColor = useCallback(
    (characterId: string) => speakerColors[characterId],
    [speakerColors],
  )

  const progressForChapter = useCallback((chapterId: string): number | null => {
    const chapterPageIndexes = pages
      .map((page, index) => page.chapterId === chapterId ? index : -1)
      .filter((index) => index >= 0)
    if (chapterPageIndexes.length === 0) return null
    if (currentIndex < chapterPageIndexes[0]) return 0
    const reached = chapterPageIndexes.filter((index) => index <= currentIndex).length
    return Math.round((reached / chapterPageIndexes.length) * 100)
  }, [currentIndex, pages])

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
        <span>Capítulo {String(currentPage.chapter.order).padStart(2, '0')} · {currentPage.scene.location.label}</span>
      </header>

      <section className="reader-stage" aria-label={book.title}>
        <button
          className={`reader-side-button${areControlsVisible ? '' : ' reading-ui--quiet'}`}
          type="button"
          onClick={previousPage}
          disabled={!canGoPrevious || isTransitioning}
          aria-label="Página anterior"
        >‹</button>

        <div className="reader-sheet-wrap">
          <ReaderPage
            key={currentPage.definition.id}
            pageNumber={currentIndex + 1}
            chapter={currentPage.chapter}
            title={currentPage.definition.title}
            scene={currentPage.scene}
            blocks={currentPage.blocks}
            showSpeakerNames={preferences.showSpeakerNames}
            resolveSpeakerColor={resolveSpeakerColor}
            readingRef={readingRef}
            transitionClass={transitionClass}
            armedEdge={armedEdge}
          />
        </div>

        <button
          className={`reader-side-button${areControlsVisible ? '' : ' reading-ui--quiet'}`}
          type="button"
          onClick={nextPage}
          disabled={!canGoNext || isTransitioning}
          aria-label="Página siguiente"
        >›</button>
      </section>

      <PageNavigation
        currentPage={currentIndex}
        pageCount={pages.length}
        controlsVisible={areControlsVisible}
        isTransitioning={isTransitioning}
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
        activeChapterId={currentPage.chapter.id}
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
