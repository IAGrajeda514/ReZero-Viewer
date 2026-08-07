import type { SceneMood, SceneTime } from '../content/types'

export interface AmbienceVisuals {
  background: string
  accent: string
  lighting: string
  vignette: number
  blur: number
  intensity: number
}

export interface AmbiencePreset {
  id: string
  location: string
  time: SceneTime
  mood: SceneMood
  visuals: AmbienceVisuals
}
