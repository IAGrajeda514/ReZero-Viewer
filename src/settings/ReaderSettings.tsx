import type { ReaderPreferences, ReaderTheme } from '../storage/preferences'

interface ReaderSettingsProps {
  preferences: ReaderPreferences
  isOpen: boolean
  onChange: (changes: Partial<ReaderPreferences>) => void
  onClose: () => void
}

const themeOptions: { id: ReaderTheme; label: string; name: string }[] = [
  { id: 'dark-immersive', label: 'Dark', name: 'Dark immersive' },
  { id: 'night-sepia', label: 'Sepia', name: 'Night sepia' },
  { id: 'light-atmospheric', label: 'Claro', name: 'Light atmospheric' },
]

interface ToggleProps {
  checked: boolean
  label: string
  onChange: () => void
}

function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <button
      className={`settings-switch${checked ? ' settings-switch--on' : ''}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    />
  )
}

export function ReaderSettings({ preferences, isOpen, onChange, onClose }: ReaderSettingsProps) {
  const themeName = themeOptions.find((theme) => theme.id === preferences.theme)?.name

  return (
    <aside className={`drawer drawer--right${isOpen ? ' drawer--open' : ''}`} aria-label="Ajustes" aria-hidden={!isOpen}>
      <div className="drawer__inner">
        <header className="drawer__header">
          <div><p>Lectura</p><h2>Ajustes</h2></div>
          <button className="drawer__close" type="button" onClick={onClose} aria-label="Cerrar ajustes">×</button>
        </header>

        <section className="settings-section">
          <div className="settings-label"><span>Tema</span><span>{themeName}</span></div>
          <div className="theme-grid">
            {themeOptions.map((theme) => (
              <button
                key={theme.id}
                className={`theme-choice${preferences.theme === theme.id ? ' theme-choice--active' : ''}`}
                type="button"
                onClick={() => onChange({ theme: theme.id })}
              >{theme.label}</button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <label className="settings-label" htmlFor="font-size"><span>Tamaño del texto</span><span>{preferences.fontSize} px</span></label>
          <input id="font-size" className="settings-range" type="range" min="16" max="25" step="1" value={preferences.fontSize} onChange={(event) => onChange({ fontSize: Number(event.target.value) })} />
        </section>

        <section className="settings-section">
          <label className="settings-label" htmlFor="line-height"><span>Interlineado</span><span>{preferences.lineHeight.toFixed(2)}</span></label>
          <input id="line-height" className="settings-range" type="range" min="1.45" max="2" step="0.03" value={preferences.lineHeight} onChange={(event) => onChange({ lineHeight: Number(event.target.value) })} />
        </section>

        <section className="settings-section">
          <label className="settings-label" htmlFor="glass-opacity"><span>Transparencia de hoja</span><span>{Math.round(preferences.glassOpacity * 100)}%</span></label>
          <input id="glass-opacity" className="settings-range" type="range" min="0.48" max="0.92" step="0.01" value={preferences.glassOpacity} onChange={(event) => onChange({ glassOpacity: Number(event.target.value) })} />
        </section>

        <section className="settings-section">
          <label className="settings-label" htmlFor="ambience-intensity"><span>Intensidad ambiente</span><span>{Math.round(preferences.ambienceIntensity * 100)}%</span></label>
          <input id="ambience-intensity" className="settings-range" type="range" min="0" max="1.2" step="0.05" value={preferences.ambienceIntensity} onChange={(event) => onChange({ ambienceIntensity: Number(event.target.value) })} />
        </section>

        <section className="settings-section">
          <div className="settings-toggle"><span>Mostrar nombres</span><Toggle label="Mostrar nombres" checked={preferences.showSpeakerNames} onChange={() => onChange({ showSpeakerNames: !preferences.showSpeakerNames })} /></div>
          <div className="settings-toggle"><span>Cambio con rueda</span><Toggle label="Cambio con rueda" checked={preferences.wheelNavigation} onChange={() => onChange({ wheelNavigation: !preferences.wheelNavigation })} /></div>
          <div className="settings-toggle"><span>Reducir animaciones</span><Toggle label="Reducir animaciones" checked={preferences.reducedMotion} onChange={() => onChange({ reducedMotion: !preferences.reducedMotion })} /></div>
        </section>
      </div>
    </aside>
  )
}
