import type { AmbiencePreset } from './types'

export const ambiencePresets: AmbiencePreset[] = [
  {
    id: 'city-day', location: 'city', time: 'day', mood: 'neutral',
    visuals: {
      background: 'radial-gradient(circle at 72% 5%, rgb(255 218 154 / 34%), transparent 29%), radial-gradient(circle at 20% 20%, rgb(202 220 231 / 14%), transparent 28%), linear-gradient(160deg, #1e2a35 0%, #121b24 45%, #070b10 100%)',
      texture: 'linear-gradient(90deg, transparent 0 9%, rgb(157 169 179 / 9%) 10% 20%, transparent 21% 32%, rgb(184 170 142 / 8%) 33% 45%, transparent 46% 61%, rgb(124 145 161 / 9%) 62% 76%, transparent 77%), linear-gradient(180deg, rgb(255 239 203 / 8%), transparent 46%)',
      shade: 'linear-gradient(180deg, transparent 45%, rgb(4 7 10 / 72%) 100%)',
      accent: '#8eb8d8', lighting: '#d5e7ef', vignette: 0.2, blur: 18, intensity: 0.98,
    },
  },
  {
    id: 'alley', location: 'alley', time: 'day', mood: 'tense',
    visuals: {
      background: 'radial-gradient(circle at 18% 20%, rgb(120 139 115 / 17%), transparent 30%), radial-gradient(circle at 75% 78%, rgb(82 95 84 / 13%), transparent 28%), linear-gradient(160deg, #2d342f 0%, #151b1a 42%, #080b0c 100%)',
      texture: 'linear-gradient(90deg, rgb(0 0 0 / 72%), transparent 24% 71%, rgb(0 0 0 / 72%)), repeating-linear-gradient(101deg, transparent 0 70px, rgb(154 161 146 / 5%) 72px 102px, transparent 106px 190px)',
      shade: 'radial-gradient(ellipse at center, transparent 34%, rgb(0 0 0 / 58%) 88%)',
      accent: '#879889', lighting: '#a6b4a1', vignette: 0.58, blur: 9, intensity: 0.96,
    },
  },
  {
    id: 'sunset', location: 'waterside', time: 'sunset', mood: 'warm',
    visuals: {
      background: 'radial-gradient(circle at 76% 13%, rgb(255 183 107 / 39%), transparent 29%), radial-gradient(circle at 30% 28%, rgb(205 107 113 / 18%), transparent 37%), linear-gradient(155deg, #4d5168 0%, #654855 30%, #9a6651 56%, #17202e 100%)',
      texture: 'linear-gradient(90deg, transparent 0 7%, rgb(14 20 27 / 25%) 8% 18%, transparent 19% 52%, rgb(13 18 25 / 21%) 53% 68%, transparent 69% 81%, rgb(11 16 22 / 22%) 82% 94%, transparent 95%)',
      shade: 'linear-gradient(180deg, rgb(255 206 150 / 5%), transparent 35%, rgb(3 7 12 / 53%))',
      accent: '#e6a473', lighting: '#ffd09b', vignette: 0.35, blur: 14, intensity: 1,
    },
  },
  {
    id: 'danger', location: 'unknown', time: 'unknown', mood: 'danger',
    visuals: {
      background: 'radial-gradient(circle at 50% 72%, rgb(156 35 50 / 32%), transparent 34%), radial-gradient(circle at 22% 16%, rgb(117 44 56 / 16%), transparent 27%), linear-gradient(155deg, #281c22, #0d0a0e 58%, #050608)',
      texture: 'linear-gradient(115deg, transparent 38%, rgb(170 53 66 / 8%) 46%, transparent 54%)',
      shade: 'radial-gradient(ellipse at center, transparent 30%, rgb(0 0 0 / 76%) 88%)',
      accent: '#db7580', lighting: '#943b49', vignette: 0.76, blur: 13, intensity: 1,
    },
  },
  {
    id: 'night', location: 'generic', time: 'night', mood: 'melancholic',
    visuals: {
      background: 'radial-gradient(circle at 72% 77%, rgb(74 126 177 / 14%), transparent 23%), radial-gradient(circle at 18% 12%, rgb(112 87 160 / 12%), transparent 25%), linear-gradient(155deg, #152032, #0b111c 48%, #05070d)',
      texture: 'radial-gradient(circle at 18% 26%, rgb(235 217 164 / 18%) 0 2px, transparent 4px), radial-gradient(circle at 78% 35%, rgb(181 210 245 / 16%) 0 3px, transparent 7px), radial-gradient(circle at 61% 64%, rgb(230 220 185 / 12%) 0 2px, transparent 6px), radial-gradient(circle at 34% 76%, rgb(175 203 246 / 12%) 0 2px, transparent 5px)',
      shade: 'radial-gradient(ellipse at center, transparent 42%, rgb(0 0 0 / 55%) 90%)',
      accent: '#778db9', lighting: '#4a5878', vignette: 0.55, blur: 2, intensity: 0.98,
    },
  },
]

export function getAmbiencePreset(presetId?: string): AmbiencePreset {
  return ambiencePresets.find((preset) => preset.id === presetId) ?? ambiencePresets[0]
}
