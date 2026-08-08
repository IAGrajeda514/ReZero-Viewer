import type { ViewerVolume } from './types'

/**
 * Viewer catalog only. A volume becomes selectable once its Content Pack exists
 * and its status changes to `available` in a future iteration.
 */
export const VIEWER_VOLUMES: readonly ViewerVolume[] = [
  {
    id: 'rezero-vol-01',
    label: 'Volumen 01',
    order: 1,
    contentPackBaseUrl: '/content-packs/rezero-vol-01',
    status: 'preparing',
  },
]
