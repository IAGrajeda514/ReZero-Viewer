# Local Content Packs

`content-local/` is reserved for private development Content Packs. It is ignored by Git and must never be moved under `public/`, because Vite copies public assets into production builds.

During `vite serve`, the development middleware exposes individual JSON files from `content-local/` under `/__local-content__/`. It does not provide directory listings and is not registered during production builds.

To enable the local Volume 01 pack, create an ignored `.env.local` file:

```dotenv
VITE_REZERO_VOL01_CONTENT_URL=/__local-content__/rezero-vol-01
```

A clean clone keeps this variable empty and presents Volume 01 as preparing. Production builds ignore this local configuration and do not copy `content-local/`.

`private-books/` remains ignored and outside the application pipeline. Do not place PDFs, source books, or private reading material in the repository.
