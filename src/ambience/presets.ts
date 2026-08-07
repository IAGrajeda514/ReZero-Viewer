import type { AmbiencePreset } from './types'

/** Generic examples only; private books choose their own ambience mapping. */
export const ambiencePresets: AmbiencePreset[] = [
  {
    id: 'generic-day', location: 'generic', time: 'day', mood: 'neutral',
    visuals: { background: '#26394a', accent: '#8eb8d8', lighting: '#d5e7ef', vignette: 0.2, blur: 12, intensity: 0.5 },
  },
  {
    id: 'generic-night', location: 'generic', time: 'night', mood: 'melancholic',
    visuals: { background: '#121826', accent: '#778db9', lighting: '#4a5878', vignette: 0.45, blur: 18, intensity: 0.65 },
  },
]
