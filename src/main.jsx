import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl">Traza</h1>
      <p className="mt-4 text-muted-foreground">Algoritmos de ordenamiento y búsqueda, paso a paso.</p>
    </main>
  </StrictMode>,
)
