import { useCallback, useEffect, useState } from 'react'

export function usePagination(itemCount: number, initialIndex = 0) {
  const maximumIndex = Math.max(itemCount - 1, 0)
  const [currentIndex, setCurrentIndex] = useState(() => Math.min(Math.max(initialIndex, 0), maximumIndex))

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maximumIndex))
  }, [maximumIndex])

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.min(Math.max(index, 0), maximumIndex))
  }, [maximumIndex])

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const previous = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  return { currentIndex, canGoNext: currentIndex < maximumIndex, canGoPrevious: currentIndex > 0, goTo, next, previous }
}
