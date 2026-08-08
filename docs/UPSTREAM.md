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

- **Configurable storage namespace.** Las claves heredadas usan el prefijo `scryveil.*`. Hoy los despliegues son independientes, pero un namespace configurable evitaría colisiones si varios viewers comparten un origen. RZ-001 no modifica esta infraestructura.
