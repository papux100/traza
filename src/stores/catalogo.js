import { create } from 'zustand'
import { obtenerAlgoritmos } from '@/servicios/api'

/**
 * Catálogo de algoritmos traído de la base de datos.
 * Mismo patrón que el store de la Pokédex: datos, estado de carga y error.
 */
export const useCatalogo = create((set, get) => ({
  algoritmos: [],
  cargando: false,
  error: null,
  cargado: false,

  async cargar({ forzar = false } = {}) {
    const { cargando, cargado } = get()
    if (cargando || (cargado && !forzar)) return
    set({ cargando: true, error: null })
    try {
      const algoritmos = await obtenerAlgoritmos()
      set({ algoritmos, cargando: false, cargado: true })
    } catch (error) {
      set({ error: error.message, cargando: false })
    }
  },
}))

export const buscarAlgoritmo = (algoritmos, id) => algoritmos.find((a) => a.id === id) ?? null
