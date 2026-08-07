import type { Book, Chapter } from '../types'

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
          {
            id: 'block-008',
            type: 'narration',
            text: 'Al amanecer, las torres devolvían el cielo en miles de reflejos azulados. Desde la terraza de la estación elevada, el viajero observó cómo cada fachada recogía una parte distinta de las nubes y la desplazaba hacia otra calle. Algunas ventanas mostraban un día despejado; otras conservaban todavía la tormenta de la noche anterior. Los tranvías avanzaban sin cables visibles y dejaban tras de sí una vibración tenue, semejante al sonido de una copa de cristal. En las plazas, los comerciantes abrían toldos color arena y colocaban brújulas, mapas plegables y frascos llenos de una luz que parecía líquida. Nadie se detenía a mirar las imágenes imposibles de los edificios. Para los habitantes, una torre que reflejaba el mar en mitad de una ciudad interior era tan normal como el humo de las cocinas. El viajero descendió los escalones con el atlas protegido bajo el abrigo. Había intentado orientarse siguiendo las avenidas, pero el dibujo de las calles cambiaba cada vez que consultaba una superficie pulida. Una fuente indicaba el norte en su reflejo y el sur en la piedra. Un arco conducía a la plaza central cuando se cruzaba de frente, pero desembocaba junto al canal si alguien miraba hacia atrás. Después de perderse tres veces, comprendió que la ciudad no ocultaba sus caminos: simplemente ofrecía demasiados a la vez. Entonces distinguió a una figura inmóvil entre la multitud. Llevaba un tubo de mapas a la espalda y sostenía una lámina opaca, el único objeto de toda la avenida que no devolvía ninguna imagen.'
          },
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
          {
            id: 'block-016',
            type: 'dialogue',
            characterId: 'character-unknown',
            speakerLabel: 'Figura encapuchada',
            text: '—Han tardado demasiado. La marea ya está cambiando y, cuando las campanas de la torre terminen su tercera vuelta, ninguna de las rutas que conocen seguirá en el mismo sitio. Escuchen con atención: deben cruzar el mercado sin mirar los escaparates, bajar por la escalera que parece subir y esperar junto a la puerta sin bisagras. No intenten abrirla. La puerta reconocerá el atlas y decidirá por ustedes. Si ven su propio reflejo antes de llegar, cierren los ojos y cuenten siete pasos; si escuchan una voz conocida, no respondan, aunque pronuncie un nombre que creían olvidado. La ciudad utiliza los recuerdos como señales y los coloca donde pueden causar más daño. Tal vez piensen que exagero, pero ya vi a otros seguir un camino construido con aquello que más deseaban recuperar. Ninguno regresó por la misma calle. Cuando alcancen el canal, busquen las luces que navegan contra la corriente. Solo una conserva una llama azul. Síganla hasta el puente occidental y mantengan el atlas cerrado. Hay mapas que cambian cuando son observados y destinos que únicamente existen mientras nadie intenta nombrarlos.'
          },
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

export const demoSpeakerColors: Readonly<Record<string, string>> = {
  'character-001': '#68aef6',
  'character-002': '#b58cf6',
  'character-unknown': '#aeb4bc',
}
