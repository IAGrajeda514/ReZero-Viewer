import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/base.css'
import './styles/reader.css'
import './styles/ambience.css'
import './styles/themes.css'
import './styles/controls.css'
import './styles/home.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
