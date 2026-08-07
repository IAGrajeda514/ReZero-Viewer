import { useCallback, useState } from 'react'

export function useControlsVisibility(initiallyVisible = true) {
  const [areControlsVisible, setAreControlsVisible] = useState(initiallyVisible)
  const showControls = useCallback(() => setAreControlsVisible(true), [])
  const hideControls = useCallback(() => setAreControlsVisible(false), [])
  const toggleControls = useCallback(() => setAreControlsVisible((visible) => !visible), [])

  return { areControlsVisible, showControls, hideControls, toggleControls }
}
