# Scryveil

_See beyond the veil._

Scryveil is a private, immersive narrative reader. Its reader engine remains independent from book content so private content packs do not need to be versioned with the application.

The project currently includes the approved Reader V2 experience, semantic narrative blocks, dynamic ambience, automatic DOM-measured pagination, persistent reader preferences and content-anchored progress, responsive navigation, and runtime JSON Content Packs loaded one chapter at a time.

## Stack

- Vite
- React + TypeScript (strict)
- Pure CSS
- React hooks
- ES Modules
- npm
- localStorage for reader preferences and progress

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
public/content-packs/  # Versionable fictional/demo Content Packs
src/
├── app/              # Application composition and content selection
├── ambience/         # Ambient presets and crossfade background
├── chapters/         # Chapter navigation drawer
├── content/          # Domain contracts and runtime Content Pack loader
├── reader/           # Reader, automatic pagination, rendering, and navigation
├── settings/         # Persistent reader settings
├── storage/          # Safe localStorage helpers
└── styles/           # Base, reader, ambience, themes, and controls
```

## Content separation

The runtime loader reads a lightweight manifest and fetches only the selected chapter. The included `public/content-packs/scryveil-demo/` pack contains original fictional material solely for exercising the engine.

Private content belongs in ignored locations such as `content-local/` or `private-books/`; PDFs and EPUBs are also excluded from version control. Scryveil does not currently import or parse those formats.
