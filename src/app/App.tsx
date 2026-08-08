import { useState } from 'react'
import { getReaderPreferences } from '../storage/preferences'
import { ReZeroHome } from '../viewer/ReZeroHome'
import { VIEWER_VOLUMES } from '../viewer/catalog'

function App() {
  const [preferences] = useState(getReaderPreferences)

  return <ReZeroHome preferences={preferences} volumes={VIEWER_VOLUMES} />
}

export default App
