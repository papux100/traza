import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Visualizador } from '@/componentes/visualizador/Visualizador'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl">Traza</h1>
      <p className="mt-3 mb-8 text-muted-foreground">Primera prueba del visualizador con ordenamiento por inserción.</p>
      <Visualizador algoritmoId="insercion" />
    </main>
  </StrictMode>,
)
