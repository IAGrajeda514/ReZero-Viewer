import { AmbientBackground } from '../ambience/AmbientBackground'
import { getAmbiencePreset } from '../ambience/presets'
import type { ReaderPreferences } from '../storage/preferences'
import type { ViewerVolume } from './types'
import './ReZeroHome.css'

interface ReZeroHomeProps {
  preferences: ReaderPreferences
  volumes: readonly ViewerVolume[]
  onOpenVolume?: (volume: ViewerVolume) => void
}

const homeAmbience = getAmbiencePreset('home')

function volumeMark(order: number): string {
  return `VOL. ${String(order).padStart(2, '0')}`
}

export function ReZeroHome({ preferences, volumes, onOpenVolume }: ReZeroHomeProps) {
  const sortedVolumes = [...volumes].sort((left, right) => left.order - right.order)
  const ambienceIntensity = Math.min(
    1.1,
    Math.max(0, preferences.ambienceIntensity * homeAmbience.visuals.intensity),
  )

  return (
    <main
      className="reader-app viewer-home"
      data-theme={preferences.theme}
      data-reduced-motion={preferences.reducedMotion}
      data-view="rezero-viewer-home"
    >
      <AmbientBackground
        preset={homeAmbience}
        intensity={ambienceIntensity}
        reducedMotion={preferences.reducedMotion}
      />

      <div className="viewer-home__shell">
        <header className="viewer-home__brand">
          <div>
            <p className="viewer-home__eyebrow">Viewer de lectura</p>
            <h1>Re:Zero Viewer</h1>
          </div>
        </header>

        <section className="viewer-home__catalog" aria-labelledby="volumes-title">
          <header className="viewer-home__catalog-header">
            <div>
              <p className="viewer-home__eyebrow">Catálogo</p>
              <h2 id="volumes-title">Volúmenes</h2>
            </div>
            <span>{sortedVolumes.length} {sortedVolumes.length === 1 ? 'volumen' : 'volúmenes'}</span>
          </header>

          <div className="viewer-home__volumes">
            {sortedVolumes.map((volume) => {
              const isAvailable = volume.status === 'available' && onOpenVolume !== undefined
              const content = (
                <>
                  <span className="viewer-volume__mark" aria-hidden="true">{volumeMark(volume.order)}</span>
                  <span className="viewer-volume__copy">
                    <strong>{volume.label}</strong>
                    <small>{volume.status === 'preparing' ? 'En preparación' : 'Disponible'}</small>
                  </span>
                  {isAvailable && <span className="viewer-volume__arrow" aria-hidden="true">→</span>}
                </>
              )

              return isAvailable ? (
                <button
                  key={volume.id}
                  className="viewer-volume viewer-volume--available"
                  type="button"
                  onClick={() => onOpenVolume(volume)}
                >
                  {content}
                </button>
              ) : (
                <article key={volume.id} className="viewer-volume" aria-label={`${volume.label}: En preparación`}>
                  {content}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
