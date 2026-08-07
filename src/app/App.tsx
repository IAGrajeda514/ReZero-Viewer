import { useCallback, useEffect, useState } from 'react'
import { demoBook, demoChapters, demoSpeakerColors } from '../content/demo/demoContent'
import { Reader } from '../reader/Reader'
import {
  getReaderPreferences,
  saveReaderPreferences,
  type ReaderPreferences,
} from '../storage/preferences'

function App() {
  const [preferences, setPreferences] = useState(getReaderPreferences)

  useEffect(() => {
    saveReaderPreferences(preferences)
  }, [preferences])

  const updatePreferences = useCallback((changes: Partial<ReaderPreferences>) => {
    setPreferences((current) => ({ ...current, ...changes }))
  }, [])

  return (
    <Reader
      book={demoBook}
      chapters={demoChapters}
      speakerColors={demoSpeakerColors}
      preferences={preferences}
      onPreferencesChange={updatePreferences}
    />
  )
}

export default App
