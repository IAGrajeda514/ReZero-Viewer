import type { ViewerVolume } from './types'

function configuredContentUrl(value: string | undefined): string | undefined {
  const candidate = value?.trim()
  if (!candidate) return undefined

  if (candidate.startsWith('/') && !candidate.startsWith('//')) {
    return candidate.replace(/\/+$/u, '')
  }

  try {
    const url = new URL(candidate)
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? candidate.replace(/\/+$/u, '')
      : undefined
  } catch {
    return undefined
  }
}

const volume01ContentUrl = import.meta.env.DEV
  ? configuredContentUrl(import.meta.env.VITE_REZERO_VOL01_CONTENT_URL)
  : undefined

/** Viewer-owned catalog. Local content configuration is deliberately development-only. */
export const VIEWER_VOLUMES: readonly ViewerVolume[] = [
  {
    id: 'rezero-vol-01',
    label: 'Volumen 01',
    order: 1,
    ...(volume01ContentUrl === undefined ? {} : { contentPackBaseUrl: volume01ContentUrl }),
    status: volume01ContentUrl === undefined ? 'preparing' : 'available',
  },
]
