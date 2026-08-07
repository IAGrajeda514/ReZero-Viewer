# NovelView

NovelView is a private, immersive web reader for novels. The reader engine is deliberately independent from private book content.

The project is currently in its **foundation** phase: the technical structure and data contracts exist, but the approved final reader design has not yet been integrated.

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
├── app/          # Temporary application entry screen
├── ambience/     # Ambient preset contracts and background base
├── chapters/     # Chapter navigation placeholder
├── content/      # Generic book, chapter, scene, and block models
├── reader/       # Reader placeholders and base hooks
├── settings/     # Preferences placeholder
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
