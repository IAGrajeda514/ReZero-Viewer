import { useState } from 'react'
import type { ReaderPreferences } from '../storage/preferences'
import { ViewerSidebar } from './ViewerSidebar'
import type { ViewerVolume } from './types'
import './ReZeroHome.css'

interface ReZeroHomeProps {
  preferences: ReaderPreferences
  volumes: readonly ViewerVolume[]
  onOpenVolume?: (volume: ViewerVolume) => void
}

function volumeMark(order: number): string {
  return `VOL. ${String(order).padStart(2, '0')}`
}

function volumeStatus(volume: ViewerVolume): string {
  return volume.status === 'available' ? 'Disponible' : 'En preparación'
}

export function ReZeroHome({ preferences, volumes, onOpenVolume }: ReZeroHomeProps) {
  const sortedVolumes = [...volumes].sort((left, right) => left.order - right.order)
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(() => sortedVolumes[0]?.id ?? null)
  const selectedVolume = sortedVolumes.find((volume) => volume.id === selectedVolumeId)
    ?? sortedVolumes[0]
    ?? null
  const canOpenVolume = selectedVolume?.status === 'available' && onOpenVolume !== undefined

  return (
    <main
      className="reader-app viewer-home"
      data-theme={preferences.theme}
      data-reduced-motion={preferences.reducedMotion}
      data-view="witch-archive-home"
    >
      <div className="viewer-home__backdrop" aria-hidden="true" />

      <div className="viewer-home__shell">
        <ViewerSidebar
          volumes={sortedVolumes}
          selectedVolumeId={selectedVolume?.id ?? null}
          onSelectVolume={setSelectedVolumeId}
        />

        <div className="viewer-home__workspace">
          <header className="archive-header">
            <div className="archive-header__seal" aria-hidden="true"><span /></div>
            <h1>Witch's Archive</h1>
            <div className="archive-header__tagline" aria-label="Crónicas de lo prohibido">
              <span aria-hidden="true" />
              <p>Crónicas de lo prohibido</p>
              <span aria-hidden="true" />
            </div>
          </header>

          {selectedVolume ? (
            <article className="archive-volume" data-status={selectedVolume.status}>
              <div className="archive-volume__art" aria-hidden="true">
                <div className="archive-volume__art-frame">
                  <span className="archive-volume__corner archive-volume__corner--top-left" />
                  <span className="archive-volume__corner archive-volume__corner--top-right" />
                  <span className="archive-volume__corner archive-volume__corner--bottom-left" />
                  <span className="archive-volume__corner archive-volume__corner--bottom-right" />
                  <p>{volumeMark(selectedVolume.order)}</p>
                  <div className="archive-volume__art-sigil"><span /></div>
                </div>
              </div>

              <div className="archive-volume__details">
                <p className="archive-volume__status">
                  <span aria-hidden="true" />
                  {volumeStatus(selectedVolume)}
                </p>
                <h2>{selectedVolume.label}</h2>
                <div className="archive-volume__divider" aria-hidden="true"><span /></div>

                <dl className="archive-volume__facts">
                  <div>
                    <dt>Estado del archivo</dt>
                    <dd>{volumeStatus(selectedVolume)}</dd>
                  </div>
                  <div>
                    <dt>Contenido</dt>
                    <dd>{selectedVolume.status === 'available' ? 'Disponible' : 'Próximamente'}</dd>
                  </div>
                </dl>

                <button
                  className="archive-volume__action"
                  type="button"
                  disabled={!canOpenVolume}
                  onClick={() => {
                    if (canOpenVolume) onOpenVolume(selectedVolume)
                  }}
                >
                  {canOpenVolume ? 'Abrir volumen' : 'Próximamente'}
                </button>
              </div>
            </article>
          ) : (
            <section className="archive-volume archive-volume--empty">
              <p>El archivo todavía no contiene volúmenes.</p>
            </section>
          )}

          <section className="viewer-home__mobile-chapters" aria-labelledby="mobile-chapters-title">
            <h2 id="mobile-chapters-title">Capítulos</h2>
            <p>Contenido en preparación</p>
          </section>
        </div>
      </div>
    </main>
  )
}
