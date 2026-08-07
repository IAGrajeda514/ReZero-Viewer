import type { CSSProperties } from 'react'
import type { AmbiencePreset } from './types'

interface AmbientBackgroundProps {
  preset?: AmbiencePreset
  intensity?: number
}

export function AmbientBackground({ preset, intensity }: AmbientBackgroundProps) {
  const visuals = preset?.visuals
  const style = {
    '--ambience-background': visuals?.background,
    '--ambience-accent': visuals?.accent,
    '--ambience-lighting': visuals?.lighting,
    '--ambience-vignette': visuals?.vignette,
    '--ambience-blur': visuals?.blur ? `${visuals.blur}px` : undefined,
    '--ambience-intensity': intensity ?? visuals?.intensity,
  } as CSSProperties

  return <div className="ambient-background" style={style} aria-hidden="true" />
}
