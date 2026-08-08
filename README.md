# Re:Zero Viewer

Re:Zero Viewer es un lector web inmersivo, experimental y fan-made.

El shell actual presenta un catálogo de volúmenes preparado para conectar Content Packs. Todavía no incluye texto narrativo ni contenido real de Re:Zero: `Volumen 01` aparece únicamente como en preparación.

## Stack

- Vite
- React + TypeScript (strict)
- Pure CSS
- React hooks
- ES Modules
- npm
- localStorage para preferencias y progreso del Reader

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Structure

```text
src/
├── app/       # Application composition
├── ambience/  # Ambient presets and crossfade background
├── chapters/  # Chapter navigation drawer
├── content/   # Domain contracts and runtime Content Pack loader
├── reader/    # Reader, automatic pagination, rendering, and navigation
├── settings/  # Persistent reader settings
├── storage/   # Safe localStorage helpers
├── styles/    # Base, reader, ambience, themes, and controls
└── viewer/    # Re:Zero Viewer catalog and Home shell
```

## Content separation

Los Content Packs se mantienen separados de la aplicación. Cuando un volumen esté disponible, su selección conectará deliberadamente el `contentPackBaseUrl` con el cargador de contenido; el lector y sus contratos permanecen desacoplados del contenido narrativo.
