# Upstream

> INTERNAL DEVELOPMENT DOCUMENT  
> NOT FOR PUBLIC DISTRIBUTION

ReZero Viewer desciende de Scryveil. Scryveil conserva el Reader Engine, la paginación, el motor ambiental, el cargador de contenido, los bloques narrativos, progreso y preferencias; este repositorio añade la experiencia y el contenido específicos del Viewer.

## Remotes y baseline

```text
origin    → https://github.com/IAGrajeda514/ReZero-Viewer.git
scryveil  → https://github.com/IAGrajeda514/Scryveil.git
```

El baseline compartido actual es `7913b2e133abb2084707fb22cc01d5f6184d5522` (`feat: add Scryveil home and library`).

## Flujo recomendado

```text
Problema encontrado en ReZero Viewer
        ↓
¿Es genérico para cualquier novela?
        ↓ sí
Feature branch en Scryveil
        ↓
Merge a Scryveil/main
        ↓
fetch scryveil desde ReZero Viewer
        ↓
merge o cherry-pick consciente
```

Los cambios específicos —catálogo de volúmenes, branding, Content Packs y rutas futuras del Viewer— permanecen en ReZero Viewer. La sincronización desde `scryveil` siempre es deliberada; no hay automatización ni scripts de sync.

## Core candidates

- **Configurable Reader branding.** El Reader y el Chapter Drawer necesitan recibir una etiqueta pública desde la aplicación consumidora en vez de incluir una marca fija. ReZero Viewer aplica la parametrización mínima local; debe evaluarse como contrato genérico upstream.
- **Configurable storage namespace.** ReZero Viewer usa el namespace `witch-archive.*` para evitar revelar o compartir claves con el motor heredado. El Core upstream debería permitir que cada consumidor configure su propio namespace.
