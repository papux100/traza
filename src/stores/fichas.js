import { create } from 'zustand'
import { obtenerFicha } from '@/servicios/api'

/**
 * Fichas ya descargadas, por id de algoritmo.
 * Cada entrada es { estado: 'cargando' | 'lista' | 'bloqueada' | 'error', ficha, error }.
 */
export const useFichas = create((set, get) => ({
  porId: {},

  async cargar(id) {
    const actual = get().porId[id]
    if (actual && actual.estado !== 'error') return
    const guardar = (entrada) => set((s) => ({ porId: { ...s.porId, [id]: entrada } }))

    guardar({ estado: 'cargando' })
    try {
      const ficha = await obtenerFicha(id)
      // Sin fila significa que las reglas de acceso no la dejaron ver.
      guardar(ficha ? { estado: 'lista', ficha } : { estado: 'bloqueada' })
    } catch (error) {
      guardar({ estado: 'error', error: error.message })
    }
  },

  /** Al iniciar o cerrar sesión cambian los permisos: se descarta lo guardado. */
  limpiar() {
    set({ porId: {} })
  },
}))
