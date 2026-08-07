import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { AmbiencePreset } from './types'

interface AmbientBackgroundProps {
  preset: AmbiencePreset
  intensity: number
  reducedMotion: boolean
}

function layerStyle(preset: AmbiencePreset): CSSProperties {
  return {
    '--ambient-layer-background': preset.visuals.background,
    '--ambient-layer-texture': preset.visuals.texture,
    '--ambient-layer-shade': preset.visuals.shade,
    '--ambient-layer-blur': `${preset.visuals.blur}px`,
    '--ambient-layer-accent': preset.visuals.accent,
    '--ambient-layer-lighting': preset.visuals.lighting,
    '--ambient-layer-vignette': preset.visuals.vignette,
  } as CSSProperties
}

export function AmbientBackground({ preset, intensity, reducedMotion }: AmbientBackgroundProps) {
  const [layers, setLayers] = useState<[AmbiencePreset, AmbiencePreset]>(() => [preset, preset])
  const [activeSlot, setActiveSlot] = useState(0)
  const activeSlotRef = useRef(0)
  const activePresetIdRef = useRef(preset.id)

  useEffect(() => {
    if (activePresetIdRef.current === preset.id) return

    const nextSlot = activeSlotRef.current === 0 ? 1 : 0
    setLayers((current) => {
      const nextLayers: [AmbiencePreset, AmbiencePreset] = [...current]
      nextLayers[nextSlot] = preset
      return nextLayers
    })

    const frame = window.requestAnimationFrame(() => {
      activeSlotRef.current = nextSlot
      activePresetIdRef.current = preset.id
      setActiveSlot(nextSlot)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [preset])

  return (
    <div
      className="ambient-background"
      data-reduced-motion={reducedMotion}
      style={{ '--ambient-strength': intensity } as CSSProperties}
      aria-hidden="true"
    >
      {layers.map((layer, slot) => (
        <div
          key={slot}
          className={`ambient-layer${activeSlot === slot ? ' ambient-layer--active' : ''}`}
          data-ambience={layer.id}
          style={layerStyle(layer)}
        />
      ))}
      <div className="ambient-grain" />
      <div className="ambient-shade" />
    </div>
  )
}
