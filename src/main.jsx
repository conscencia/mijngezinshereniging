import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// De pagina's worden bij het bouwen al als HTML opgeleverd (zie scripts/prerender.mjs).
// Is die HTML aanwezig, dan neemt React ze over in plaats van alles opnieuw te tekenen.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
