import { useCallback, useEffect, useRef, useState } from 'react'

export const CONTROLS_IDLE_MS = 2800

interface ControlsVisibilityOptions {
  paused?: boolean
  idleMs?: number
}

export function useControlsVisibility({
  paused = false,
  idleMs = CONTROLS_IDLE_MS,
}: ControlsVisibilityOptions = {}) {
  const [areControlsVisible, setAreControlsVisible] = useState(true)
  const idleTimerRef = useRef<number | undefined>(undefined)

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current !== undefined) window.clearTimeout(idleTimerRef.current)
    idleTimerRef.current = undefined
  }, [])

  const scheduleHide = useCallback(() => {
    clearIdleTimer()
    if (paused) return
    idleTimerRef.current = window.setTimeout(() => setAreControlsVisible(false), idleMs)
  }, [clearIdleTimer, idleMs, paused])

  const showControls = useCallback(() => {
    setAreControlsVisible(true)
    scheduleHide()
  }, [scheduleHide])

  const hideControls = useCallback(() => {
    clearIdleTimer()
    if (!paused) setAreControlsVisible(false)
  }, [clearIdleTimer, paused])

  useEffect(() => {
    if (paused) {
      clearIdleTimer()
      setAreControlsVisible(true)
      return
    }

    scheduleHide()
    return clearIdleTimer
  }, [clearIdleTimer, paused, scheduleHide])

  return { areControlsVisible, showControls, hideControls }
}
