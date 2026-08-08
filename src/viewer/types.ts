export type ViewerVolumeStatus = 'available' | 'preparing'

/** Viewer-owned metadata that maps one future volume to one Content Pack. */
export interface ViewerVolume {
  id: string
  label: string
  order: number
  contentPackBaseUrl?: string
  status: ViewerVolumeStatus
}
