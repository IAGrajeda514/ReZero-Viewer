import { useCallback } from 'react'

interface ReaderNavigationOptions {
  enabled?: boolean
  onNext?: () => void
  onPrevious?: () => void
}

export function useReaderNavigation({ enabled = true, onNext, onPrevious }: ReaderNavigationOptions) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!enabled) return
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault()
      onNext?.()
    }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault()
      onPrevious?.()
    }
  }, [enabled, onNext, onPrevious])

  // TODO: Add the future scroll guard: one gesture arms pagination; a later gesture changes page.
  return { handleKeyDown }
}
