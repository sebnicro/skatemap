import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// CSS de MapLibre GL: importar desde el paquete npm instalado (v6.16.0)
// para que coincida exactamente con la versión JS
import 'maplibre-gl/dist/maplibre-gl.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
