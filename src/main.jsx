import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import './index.css'
import { Layout } from '@/componentes/Layout'
import Inicio from '@/paginas/Inicio'
import FichaAlgoritmo from '@/paginas/FichaAlgoritmo'
import Comparativa from '@/paginas/Comparativa'
import Conceptos from '@/paginas/Conceptos'
import NoEncontrada from '@/paginas/NoEncontrada'
import Entrar from '@/paginas/Entrar'
import Registro from '@/paginas/Registro'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="algoritmos/:id" element={<FichaAlgoritmo />} />
          <Route path="comparativa" element={<Comparativa />} />
          <Route path="conceptos" element={<Conceptos />} />
          <Route path="entrar" element={<Entrar />} />
          <Route path="registro" element={<Registro />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
