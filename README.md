# NovelView

NovelView is a private, immersive web reader for novels. The reader engine is deliberately independent from private book content.

The project currently includes the first React integration of the approved Reader V2 experience over the established foundation.

## Stack

- Vite
- React + TypeScript
- CSS puro
- React hooks
- ES Modules
- npm
- localStorage (initial reader preferences and progress)

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run lint` runs the TypeScript static check used in this foundation.

## Structure

```text
src/
├── app/          # Application composition
├── ambience/     # Ambient presets and crossfade background
├── chapters/     # Chapter navigation drawer
├── content/      # Generic book, chapter, scene, and block models
├── reader/       # Reader experience, page rendering, and navigation hooks
├── settings/     # Persistent reader settings drawer
├── storage/      # localStorage helpers
└── styles/       # Base, reader, ambience, theme, and control CSS
```

## Private content convention

Private content is never versioned with the reader engine. Local packs will live in the ignored `content-local/` directory:

```text
content-local/
└── book-id/
    ├── metadata.json
    ├── prologue.json
    ├── chapter-01.json
    └── chapter-02.json
```

The loading strategy for these packs is intentionally deferred until a later iteration.
