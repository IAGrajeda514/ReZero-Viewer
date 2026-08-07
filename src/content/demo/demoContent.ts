import type { Book, Chapter } from '../types'
import type { ReaderPageDefinition } from '../../reader/types'

export const demoChapters: Chapter[] = [
  {
    id: 'chapter-threshold', title: 'El umbral de la estación', order: 1,
    scenes: [
      {
        id: 'scene-storm-platform',
        location: { id: 'north-station', label: 'Estación del Norte', detail: 'Andén cerrado' },
        time: 'night', mood: 'danger', ambience: { presetId: 'danger' },
        blocks: [
          { id: 'block-001', type: 'narration', text: 'La lluvia golpeaba la marquesina vacía con una cadencia demasiado regular para aquella tormenta.' },
          { id: 'block-002', type: 'dialogue', characterId: 'character-001', speakerLabel: 'Viajero', text: '—El último tren ya debería haber pasado.' },
          { id: 'block-003', type: 'dialogue', characterId: 'character-unknown', speakerLabel: 'Voz entre la niebla', text: '—No todos los trenes aparecen en los horarios.' },
          { id: 'block-004', type: 'thought', characterId: 'character-001', text: 'La voz venía de la vía, pero allí no había nadie.' },
        ],
      },
      {
        id: 'scene-observatory',
        location: { id: 'north-observatory', label: 'Observatorio del Norte', detail: 'Sala de mapas' },
        time: 'night', mood: 'melancholic', ambience: { presetId: 'night' },
        intro: { title: 'OBSERVATORIO DEL NORTE', subtitle: 'Sala de mapas · Medianoche' },
        blocks: [
          { id: 'block-005', type: 'memory', text: 'Años atrás, las constelaciones habían ocupado cada rincón de aquellas paredes.' },
          { id: 'block-006', type: 'scene-break', label: 'Cambio de escena' },
          { id: 'block-007', type: 'narration', text: 'Una lámpara solitaria se encendió al otro lado de la cúpula y reveló un mapa extendido sobre el suelo.' },
        ],
      },
    ],
  },
  {
    id: 'chapter-glass-city', title: 'La ciudad de vidrio', order: 2,
    scenes: [
      {
        id: 'scene-glass-promenade',
        location: { id: 'glass-city', label: 'Ciudad de Vidrio', detail: 'Paseo central' },
        time: 'day', mood: 'neutral', ambience: { presetId: 'city-day' },
        intro: { title: 'CIUDAD DE VIDRIO', subtitle: 'Paseo central · Día' },
        blocks: [
          { id: 'block-008', type: 'narration', text: 'Al amanecer, las torres devolvían el cielo en miles de reflejos azulados.' },
          { id: 'block-009', type: 'dialogue', characterId: 'character-002', speakerLabel: 'Cartógrafa', text: '—Si buscas la puerta, empieza por encontrar aquello que no se refleja.' },
          { id: 'block-010', type: 'dialogue', characterId: 'character-001', speakerLabel: 'Viajero', text: '—Eso suena más a acertijo que a indicación.' },
          { id: 'block-011', type: 'thought', characterId: 'character-001', text: 'Sin embargo, era la primera pista que había recibido.' },
          { id: 'block-012', type: 'narration', text: 'Caminaron bajo pasarelas translúcidas mientras el bullicio de los mercados crecía a su alrededor.' },
          { id: 'block-013', type: 'dialogue', characterId: 'character-002', speakerLabel: 'Cartógrafa', text: '—Los nombres cambian. Las rutas, casi nunca.' },
          { id: 'block-014', type: 'memory', text: 'La frase le recordó una nota escrita al margen de un atlas familiar.' },
        ],
      },
      {
        id: 'scene-service-alley',
        location: { id: 'service-alley', label: 'Ciudad de Vidrio', detail: 'Pasaje de servicio' },
        time: 'day', mood: 'tense', ambience: { presetId: 'alley' },
        intro: { title: 'PASAJE DE SERVICIO', subtitle: 'Distrito bajo · Tarde' },
        blocks: [
          { id: 'block-015', type: 'narration', text: 'El pasaje estrecho absorbía el ruido de la avenida hasta convertirlo en un murmullo lejano.' },
          { id: 'block-016', type: 'dialogue', characterId: 'character-unknown', speakerLabel: 'Figura encapuchada', text: '—Han tardado demasiado. La marea ya está cambiando.' },
          { id: 'block-017', type: 'thought', characterId: 'character-001', text: 'Otra voz sin rostro, y esta vez no había niebla donde ocultarse.' },
        ],
      },
    ],
  },
  {
    id: 'chapter-canal-lights', title: 'Luces sobre el canal', order: 3,
    scenes: [
      {
        id: 'scene-sunset-canal',
        location: { id: 'old-canal', label: 'Canal Antiguo', detail: 'Puente occidental' },
        time: 'sunset', mood: 'warm', ambience: { presetId: 'sunset' },
        intro: { title: 'CANAL ANTIGUO', subtitle: 'Puente occidental · Atardecer' },
        blocks: [
          { id: 'block-018', type: 'narration', text: 'El sol descendió entre las cubiertas y dejó una franja de cobre sobre el agua inmóvil.' },
          { id: 'block-019', type: 'dialogue', characterId: 'character-002', speakerLabel: 'Cartógrafa', text: '—Mañana quizá tengas que llamarme de otra manera.' },
          { id: 'block-020', type: 'dialogue', characterId: 'character-001', speakerLabel: 'Viajero', text: '—Mientras sigas señalando el camino, sabré que eres tú.' },
        ],
      },
      {
        id: 'scene-canal-night',
        location: { id: 'old-canal', label: 'Canal Antiguo', detail: 'Escalinata del agua' },
        time: 'night', mood: 'melancholic', ambience: { presetId: 'night' },
        intro: { title: 'BAJO LAS LUCES', subtitle: 'Escalinata del agua · Noche' },
        blocks: [
          { id: 'block-021', type: 'narration', text: 'Cuando llegó la noche, pequeñas luces comenzaron a navegar contra la corriente.' },
          { id: 'block-022', type: 'memory', text: 'Recordó entonces el andén vacío y una promesa que todavía no comprendía.' },
          { id: 'block-023', type: 'scene-break', label: 'Fin de la demostración' },
          { id: 'block-024', type: 'thought', characterId: 'character-001', text: 'La puerta no estaba al final del viaje. Era el viaje mismo.' },
        ],
      },
    ],
  },
]

export const demoBook: Book = {
  id: 'novelview-demo',
  title: 'Atlas de puertas quietas',
  author: 'Contenido ficticio de demostración',
  chapters: demoChapters.map(({ id, title, order }) => ({ id, title, order })),
}

export const demoPages: ReaderPageDefinition[] = [
  { id: 'page-001', chapterId: 'chapter-threshold', sceneId: 'scene-storm-platform', title: 'El tren fuera del horario', blockIds: ['block-001', 'block-002', 'block-003', 'block-004'] },
  { id: 'page-002', chapterId: 'chapter-threshold', sceneId: 'scene-observatory', title: 'El mapa bajo la cúpula', blockIds: ['block-005', 'block-006', 'block-007'] },
  { id: 'page-003', chapterId: 'chapter-glass-city', sceneId: 'scene-glass-promenade', title: 'La ciudad que devuelve el cielo', blockIds: ['block-008', 'block-009', 'block-010', 'block-011'] },
  { id: 'page-004', chapterId: 'chapter-glass-city', sceneId: 'scene-glass-promenade', title: 'Aquello que no se refleja', blockIds: ['block-012', 'block-013', 'block-014'] },
  { id: 'page-005', chapterId: 'chapter-glass-city', sceneId: 'scene-service-alley', title: 'El pasaje sin ecos', blockIds: ['block-015', 'block-016', 'block-017'] },
  { id: 'page-006', chapterId: 'chapter-canal-lights', sceneId: 'scene-sunset-canal', title: 'Una ruta bajo el cobre', blockIds: ['block-018', 'block-019', 'block-020'] },
  { id: 'page-007', chapterId: 'chapter-canal-lights', sceneId: 'scene-canal-night', title: 'Luces contra la corriente', blockIds: ['block-021', 'block-022', 'block-023', 'block-024'] },
]

export const demoSpeakerColors: Readonly<Record<string, string>> = {
  'character-001': '#68aef6',
  'character-002': '#b58cf6',
  'character-unknown': '#aeb4bc',
}
