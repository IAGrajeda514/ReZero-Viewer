import { useCallback, useEffect, useRef, useState, type RefObject, type TouchEvent } from 'react'

export const WHEEL_GESTURE_IDLE_MS = 240
export const WHEEL_TRIGGER_THRESHOLD = 48
export const PAGE_TRANSITION_COOLDOWN_MS = 700

const EDGE_TOLERANCE_PX = 2
const EDGE_RELEASE_DISTANCE_PX = 24
const SWIPE_THRESHOLD_PX = 60
const SWIPE_AXIS_RATIO = 1.2

export type ArmedEdge = 'top' | 'bottom' | null

interface ReaderNavigationOptions {
  readingRef: RefObject<HTMLDivElement | null>
  pageKey: string
  enabled: boolean
  wheelNavigation: boolean
  canGoNext: boolean
  canGoPrevious: boolean
  onNext: () => void
  onPrevious: () => void
  onEscape: () => void
  onInteraction: () => void
}

interface WheelSession {
  active: boolean
  direction: -1 | 0 | 1
  accumulatedDelta: number
  startedAtArmedEdge: boolean
  consumed: boolean
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (
    target.isContentEditable ||
    target.matches('input, textarea, select, button, [role="slider"]')
  )
}

export function useReaderNavigation({
  readingRef,
  pageKey,
  enabled,
  wheelNavigation,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onEscape,
  onInteraction,
}: ReaderNavigationOptions) {
  const [armedEdge, setArmedEdge] = useState<ArmedEdge>(null)
  const armedEdgeRef = useRef<ArmedEdge>(null)
  const cooldownUntilRef = useRef(0)
  const wheelIdleTimerRef = useRef<number | undefined>(undefined)
  const wheelSessionRef = useRef<WheelSession>({
    active: false,
    direction: 0,
    accumulatedDelta: 0,
    startedAtArmedEdge: false,
    consumed: false,
  })
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const updateArmedEdge = useCallback((edge: ArmedEdge) => {
    armedEdgeRef.current = edge
    setArmedEdge(edge)
  }, [])

  useEffect(() => {
    updateArmedEdge(null)
    wheelSessionRef.current = {
      active: false,
      direction: 0,
      accumulatedDelta: 0,
      startedAtArmedEdge: false,
      consumed: false,
    }
    if (wheelIdleTimerRef.current !== undefined) window.clearTimeout(wheelIdleTimerRef.current)
  }, [pageKey, updateArmedEdge])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      onInteraction()
      if (event.key === 'Escape') {
        onEscape()
        return
      }
      if (!enabled || event.repeat || isInteractiveTarget(event.target)) return

      if ((event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') && canGoNext) {
        event.preventDefault()
        onNext()
      }
      if ((event.key === 'ArrowLeft' || event.key === 'PageUp') && canGoPrevious) {
        event.preventDefault()
        onPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canGoNext, canGoPrevious, enabled, onEscape, onInteraction, onNext, onPrevious])

  useEffect(() => {
    const reading = readingRef.current
    if (!reading) return

    const atTop = () => reading.scrollTop <= EDGE_TOLERANCE_PX
    const atBottom = () => reading.scrollTop + reading.clientHeight >= reading.scrollHeight - EDGE_TOLERANCE_PX
    const releaseDistantEdge = () => {
      if (armedEdgeRef.current === 'top' && reading.scrollTop > EDGE_RELEASE_DISTANCE_PX) updateArmedEdge(null)
      const bottomDistance = reading.scrollHeight - reading.clientHeight - reading.scrollTop
      if (armedEdgeRef.current === 'bottom' && bottomDistance > EDGE_RELEASE_DISTANCE_PX) updateArmedEdge(null)
    }
    const armReachedEdge = () => {
      const session = wheelSessionRef.current
      releaseDistantEdge()
      if (!session.active || session.startedAtArmedEdge) return
      if (session.direction > 0 && atBottom()) updateArmedEdge('bottom')
      if (session.direction < 0 && atTop()) updateArmedEdge('top')
    }
    const finishWheelGesture = () => {
      armReachedEdge()
      wheelSessionRef.current.active = false
      wheelSessionRef.current.accumulatedDelta = 0
      wheelIdleTimerRef.current = undefined
    }
    const scheduleGestureEnd = () => {
      if (wheelIdleTimerRef.current !== undefined) window.clearTimeout(wheelIdleTimerRef.current)
      wheelIdleTimerRef.current = window.setTimeout(finishWheelGesture, WHEEL_GESTURE_IDLE_MS)
    }
    const handleScroll = () => {
      releaseDistantEdge()
      armReachedEdge()
    }
    const handleWheel = (event: WheelEvent) => {
      onInteraction()
      if (!enabled || !wheelNavigation || event.ctrlKey || event.deltaY === 0) return

      const direction: -1 | 1 = event.deltaY > 0 ? 1 : -1
      const session = wheelSessionRef.current
      releaseDistantEdge()

      if (!session.active) {
        const startsAtRequestedEdge = direction > 0 ? atBottom() : atTop()
        const requestedEdge: ArmedEdge = direction > 0 ? 'bottom' : 'top'
        session.active = true
        session.direction = direction
        session.accumulatedDelta = 0
        session.startedAtArmedEdge = startsAtRequestedEdge && armedEdgeRef.current === requestedEdge
        session.consumed = false
      } else if (session.direction !== direction) {
        session.direction = direction
        session.accumulatedDelta = 0
        session.startedAtArmedEdge = false
      }

      session.accumulatedDelta += Math.abs(event.deltaY)
      scheduleGestureEnd()

      const requestedEdgeReached = direction > 0 ? atBottom() : atTop()
      const canNavigate = direction > 0 ? canGoNext : canGoPrevious
      const cooldownComplete = Date.now() >= cooldownUntilRef.current

      if (
        session.startedAtArmedEdge &&
        requestedEdgeReached &&
        canNavigate &&
        cooldownComplete &&
        !session.consumed &&
        session.accumulatedDelta >= WHEEL_TRIGGER_THRESHOLD
      ) {
        event.preventDefault()
        session.consumed = true
        cooldownUntilRef.current = Date.now() + PAGE_TRANSITION_COOLDOWN_MS
        updateArmedEdge(null)
        if (direction > 0) onNext()
        else onPrevious()
        return
      }

      window.requestAnimationFrame(armReachedEdge)
    }

    reading.addEventListener('scroll', handleScroll, { passive: true })
    reading.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      reading.removeEventListener('scroll', handleScroll)
      reading.removeEventListener('wheel', handleWheel)
      if (wheelIdleTimerRef.current !== undefined) window.clearTimeout(wheelIdleTimerRef.current)
    }
  }, [canGoNext, canGoPrevious, enabled, onInteraction, onNext, onPrevious, readingRef, updateArmedEdge, wheelNavigation])

  const handleTouchStart = useCallback((event: TouchEvent<HTMLElement>) => {
    onInteraction()
    const touch = event.changedTouches[0]
    if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [onInteraction])

  const handleTouchEnd = useCallback((event: TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current
    const touch = event.changedTouches[0]
    touchStartRef.current = null
    if (!enabled || !start || !touch || Date.now() < cooldownUntilRef.current) return

    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY) * SWIPE_AXIS_RATIO) return

    cooldownUntilRef.current = Date.now() + PAGE_TRANSITION_COOLDOWN_MS
    updateArmedEdge(null)
    if (deltaX < 0 && canGoNext) onNext()
    if (deltaX > 0 && canGoPrevious) onPrevious()
  }, [canGoNext, canGoPrevious, enabled, onNext, onPrevious, updateArmedEdge])

  return { armedEdge, handleTouchStart, handleTouchEnd }
}
