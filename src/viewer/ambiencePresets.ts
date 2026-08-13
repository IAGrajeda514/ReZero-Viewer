import type { AmbiencePreset } from '../ambience/types'

export const WITCH_ARCHIVE_AMBIENCE_PRESETS: readonly AmbiencePreset[] = [
  {
    id: 'slums-entry-afternoon', location: 'slums-entry', time: 'afternoon', mood: 'uneasy',
    visuals: {
      background: 'radial-gradient(circle at 78% 3%, rgb(255 210 142 / 48%), transparent 29%), linear-gradient(180deg, #75625b 0%, #504449 38%, #252930 67%, #11151b 100%)',
      texture: 'linear-gradient(100deg, rgb(12 12 16 / 78%) 0 13%, transparent 13% 28%, rgb(30 25 28 / 64%) 28% 43%, transparent 43% 62%, rgb(16 15 20 / 72%) 62% 80%, transparent 80%), repeating-linear-gradient(0deg, transparent 0 62px, rgb(222 181 132 / 7%) 63px 65px, transparent 66px 104px), linear-gradient(176deg, transparent 0 63%, rgb(9 10 14 / 55%) 64% 100%)',
      shade: 'linear-gradient(90deg, rgb(3 4 7 / 45%), transparent 30% 68%, rgb(3 4 8 / 34%)), linear-gradient(180deg, transparent 38%, rgb(4 5 8 / 58%) 100%)',
      accent: '#b68a72', lighting: '#f1c184', vignette: 0.42, blur: 9, intensity: 1,
    },
  },
  {
    id: 'slums-sunset', location: 'slums', time: 'sunset', mood: 'investigative',
    visuals: {
      background: 'radial-gradient(ellipse at 70% 4%, rgb(255 156 78 / 54%), transparent 32%), linear-gradient(180deg, #755260 0%, #a15e49 25%, #49343a 48%, #141820 100%)',
      texture: 'linear-gradient(102deg, rgb(7 8 12 / 82%) 0 13%, transparent 13% 30%, rgb(24 20 24 / 70%) 30% 45%, transparent 45% 61%, rgb(12 13 18 / 76%) 61% 78%, transparent 78% 88%, rgb(7 8 12 / 76%) 88%), repeating-linear-gradient(0deg, transparent 0 55px, rgb(235 171 115 / 7%) 56px 58px, transparent 59px 93px), linear-gradient(180deg, transparent 0 57%, rgb(4 5 8 / 65%) 58%)',
      shade: 'radial-gradient(ellipse at 60% 22%, transparent 10%, rgb(4 5 9 / 18%) 48%, rgb(2 3 6 / 67%) 100%)',
      accent: '#c67257', lighting: '#efad73', vignette: 0.52, blur: 8, intensity: 1,
    },
  },
  {
    id: 'slums-dusk', location: 'slums', time: 'dusk', mood: 'vulnerable',
    visuals: {
      background: 'radial-gradient(ellipse at 71% 18%, rgb(223 118 66 / 24%), transparent 27%), linear-gradient(180deg, #30334b 0%, #483947 28%, #1a202c 55%, #080b11 100%)',
      texture: 'linear-gradient(100deg, rgb(4 5 9 / 86%) 0 15%, transparent 15% 31%, rgb(15 15 23 / 76%) 31% 46%, transparent 46% 64%, rgb(8 9 15 / 82%) 64% 81%, transparent 81%), repeating-linear-gradient(0deg, transparent 0 68px, rgb(153 132 126 / 6%) 69px 71px, transparent 72px 112px), radial-gradient(circle at 82% 29%, rgb(235 206 157 / 22%) 0 1px, transparent 4px)',
      shade: 'linear-gradient(180deg, transparent 18%, rgb(3 5 9 / 62%) 100%), radial-gradient(ellipse at center, transparent 24%, rgb(1 2 5 / 56%) 92%)',
      accent: '#766d9b', lighting: '#bd795e', vignette: 0.61, blur: 7, intensity: 1,
    },
  },
  {
    id: 'slums-night', location: 'slums', time: 'night', mood: 'focused',
    visuals: {
      background: 'radial-gradient(circle at 75% 23%, rgb(177 126 80 / 12%), transparent 13%), radial-gradient(ellipse at 37% 12%, rgb(68 82 130 / 19%), transparent 33%), linear-gradient(155deg, #151b2a 0%, #0c111c 48%, #04060a 100%)',
      texture: 'linear-gradient(96deg, rgb(2 3 6 / 88%) 0 16%, transparent 16% 32%, rgb(8 10 16 / 82%) 32% 47%, transparent 47% 67%, rgb(4 5 9 / 87%) 67% 82%, transparent 82%), repeating-linear-gradient(0deg, transparent 0 72px, rgb(109 119 139 / 6%) 73px 75px, transparent 76px 118px), radial-gradient(circle at 84% 25%, rgb(225 170 105 / 22%) 0 2px, transparent 5px)',
      shade: 'linear-gradient(180deg, transparent 18%, rgb(1 2 5 / 65%) 100%), radial-gradient(ellipse at center, transparent 28%, rgb(0 1 3 / 67%) 94%)',
      accent: '#536487', lighting: '#747d9b', vignette: 0.68, blur: 6, intensity: 1,
    },
  },
  {
    id: 'loot-house-exterior-night', location: 'loot-house-exterior', time: 'night', mood: 'suspense',
    visuals: {
      background: 'radial-gradient(ellipse at 70% 2%, rgb(113 132 174 / 24%), transparent 30%), linear-gradient(180deg, #171b29 0 23%, #0b0d14 24% 100%)',
      texture: 'linear-gradient(90deg, rgb(2 3 7 / 78%) 0 12%, transparent 12% 23%, rgb(19 19 27 / 76%) 23% 35%, transparent 35% 67%, rgb(12 13 20 / 82%) 67% 82%, transparent 82%), repeating-linear-gradient(0deg, transparent 0 46px, rgb(173 157 132 / 7%) 47px 49px, transparent 50px 82px), linear-gradient(180deg, transparent 0 19%, rgb(7 8 13 / 32%) 20% 68%, rgb(1 2 4 / 64%) 69%)',
      shade: 'linear-gradient(90deg, rgb(0 1 3 / 57%), transparent 24% 72%, rgb(0 1 3 / 61%)), radial-gradient(ellipse at 50% 30%, transparent 18%, rgb(0 1 4 / 42%) 66%, rgb(0 0 2 / 74%) 100%)',
      accent: '#716d80', lighting: '#a59b89', vignette: 0.7, blur: 4, intensity: 1,
    },
  },
  {
    id: 'loot-house-exterior-lagmite', location: 'loot-house-exterior', time: 'night', mood: 'suspense',
    visuals: {
      background: 'radial-gradient(circle at 86% 34%, rgb(248 225 180 / 31%) 0%, rgb(187 159 113 / 12%) 8%, transparent 22%), radial-gradient(ellipse at 70% 2%, rgb(103 121 162 / 18%), transparent 30%), linear-gradient(180deg, #151925 0 23%, #080a10 24% 100%)',
      texture: 'linear-gradient(90deg, rgb(1 2 5 / 80%) 0 12%, transparent 12% 24%, rgb(17 17 24 / 76%) 24% 36%, transparent 36% 67%, rgb(9 10 16 / 80%) 67% 82%, transparent 82%), repeating-linear-gradient(0deg, transparent 0 46px, rgb(186 166 133 / 8%) 47px 49px, transparent 50px 82px)',
      shade: 'linear-gradient(90deg, rgb(0 1 3 / 62%), transparent 28% 76%, rgb(0 1 3 / 30%)), radial-gradient(ellipse at 86% 34%, transparent 4%, rgb(0 1 3 / 25%) 34%, rgb(0 0 2 / 73%) 100%)',
      accent: '#a39174', lighting: '#ead5a8', vignette: 0.7, blur: 4, intensity: 1,
    },
  },
  {
    id: 'loot-house-lagmite', location: 'loot-house-interior', time: 'night', mood: 'dread',
    visuals: {
      background: 'radial-gradient(circle at 14% 42%, rgb(248 225 181 / 38%) 0%, rgb(165 143 108 / 13%) 10%, transparent 27%), linear-gradient(155deg, #111117 0%, #07080c 56%, #020307 100%)',
      texture: 'linear-gradient(90deg, rgb(2 2 5 / 64%) 0 15%, transparent 15% 32%, rgb(23 20 21 / 46%) 32% 44%, transparent 44% 70%, rgb(5 5 8 / 72%) 70% 83%, transparent 83%), repeating-linear-gradient(0deg, transparent 0 54px, rgb(191 167 127 / 6%) 55px 57px, transparent 58px 88px), radial-gradient(circle at 12% 39%, rgb(245 231 200 / 31%) 0 1px, transparent 3px)',
      shade: 'radial-gradient(ellipse at 14% 42%, transparent 6%, rgb(0 1 3 / 34%) 34%, rgb(0 0 2 / 82%) 100%)',
      accent: '#a89b84', lighting: '#eee0c1', vignette: 0.82, blur: 3, intensity: 1,
    },
  },
  {
    id: 'loot-house-horror', location: 'loot-house-interior', time: 'night', mood: 'horror',
    visuals: {
      background: 'radial-gradient(circle at 51% 53%, rgb(215 192 159 / 13%), transparent 20%), radial-gradient(ellipse at 20% 72%, rgb(117 20 35 / 28%), transparent 38%), radial-gradient(ellipse at 84% 31%, rgb(94 16 31 / 23%), transparent 34%), linear-gradient(155deg, #10080d, #040306 61%, #010102)',
      texture: 'radial-gradient(circle at 48% 44%, rgb(229 212 184 / 15%) 0 1px, transparent 3px), linear-gradient(117deg, transparent 35%, rgb(102 17 30 / 10%) 48%, transparent 59%)',
      shade: 'radial-gradient(ellipse at center, transparent 18%, rgb(19 1 7 / 46%) 61%, rgb(0 0 1 / 89%) 100%)',
      accent: '#7e2838', lighting: '#a5746e', vignette: 0.91, blur: 4, intensity: 1,
    },
  },
  {
    id: 'loot-house-dying', location: 'loot-house-interior', time: 'night', mood: 'dying',
    visuals: {
      background: 'radial-gradient(ellipse at 82% 66%, rgb(124 16 32 / 34%), transparent 34%), linear-gradient(150deg, #13080d 0%, #060306 52%, #010103 100%)',
      texture: 'linear-gradient(125deg, transparent 39%, rgb(91 18 29 / 8%) 50%, transparent 61%)',
      shade: 'linear-gradient(100deg, rgb(0 0 1 / 87%), rgb(7 0 3 / 54%) 62%, rgb(0 0 1 / 77%)), radial-gradient(ellipse at center, transparent 8%, rgb(6 0 3 / 62%) 52%, rgb(0 0 1 / 92%) 100%)',
      accent: '#702536', lighting: '#80595f', vignette: 0.94, blur: 6, intensity: 1,
    },
  },
  {
    id: 'death-black', location: 'loot-house-interior', time: 'night', mood: 'death',
    visuals: {
      background: 'radial-gradient(ellipse at 82% 72%, rgb(49 8 16 / 14%), transparent 28%), linear-gradient(160deg, #050407, #010103 66%, #000 100%)',
      texture: 'linear-gradient(120deg, transparent 42%, rgb(90 22 32 / 4%) 50%, transparent 58%)',
      shade: 'radial-gradient(ellipse at 55% 48%, rgb(0 0 0 / 28%) 0%, rgb(0 0 0 / 82%) 78%)',
      accent: '#2d1820', lighting: '#34262a', vignette: 0.98, blur: 8, intensity: 1,
    },
  },
  {
    id: 'capital-main-street-day', location: 'capital-main-street', time: 'day', mood: 'disoriented',
    visuals: {
      background: 'radial-gradient(circle at 76% 0%, rgb(255 234 183 / 68%), transparent 32%), linear-gradient(180deg, #b8c8ce 0%, #91aab5 34%, #b5a88f 64%, #59606a 100%)',
      texture: 'linear-gradient(102deg, rgb(72 73 75 / 18%) 0 9%, transparent 9% 25%, rgb(241 222 184 / 18%) 25% 37%, transparent 37% 62%, rgb(74 77 81 / 17%) 62% 72%, transparent 72% 87%, rgb(63 66 71 / 18%) 87%), linear-gradient(180deg, rgb(255 243 211 / 14%), transparent 54%, rgb(31 35 41 / 24%) 100%)',
      shade: 'linear-gradient(90deg, rgb(18 20 24 / 14%), transparent 25% 75%, rgb(16 18 22 / 13%)), linear-gradient(180deg, transparent 56%, rgb(17 20 24 / 25%) 100%)',
      accent: '#aabcc1', lighting: '#f6dfb2', vignette: 0.2, blur: 12, intensity: 1.06,
    },
  },
]
