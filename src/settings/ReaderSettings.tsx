import type { ReaderPreferences } from '../storage/preferences'

interface ReaderSettingsProps {
  preferences: ReaderPreferences
  onChange?: (preferences: ReaderPreferences) => void
}

/** Placeholder contract for the future reader settings interface. */
export function ReaderSettings({ preferences, onChange }: ReaderSettingsProps) {
  return (
    <aside className="reader-settings" aria-label="Reader settings">
      <p>Reader settings</p>
      <button type="button" onClick={() => onChange?.(preferences)}>Save preferences</button>
    </aside>
  )
}
