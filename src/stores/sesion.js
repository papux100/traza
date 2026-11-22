import { create } from 'zustand'
import * as api from '@/servicios/api'
import { useFichas } from './fichas'

/** Sesión del usuario: quién es, su perfil y las acciones de la cuenta. */
export const useSesion = create((set, get) => ({
  usuario: null,
  perfil: null,
  /** false hasta saber si había una sesión guardada en el navegador. */
  lista: false,

  /** Empieza a seguir los cambios de sesión. Devuelve la función para dejar de hacerlo. */
  escuchar() {
    return api.escucharSesion((sesion) => {
      const usuario = sesion?.user ?? null
      const cambioDeUsuario = usuario?.id !== get().usuario?.id
      set({ usuario, lista: true, ...(cambioDeUsuario ? { perfil: null } : {}) })
      if (!cambioDeUsuario) return

      useFichas.getState().limpiar()
      if (usuario) {
        // Supabase recomienda no llamar a la API dentro del aviso de sesión.
        setTimeout(() => get().cargarPerfil(), 0)
      }
    })
  },

  async cargarPerfil() {
    const usuario = get().usuario
    if (!usuario) return
    try {
      const perfil = await api.obtenerPerfil()
      if (get().usuario?.id === usuario.id) set({ perfil })
    } catch {
      // Sin perfil se muestra el correo; no hace falta interrumpir al usuario.
    }
  },

  registrar: (datos) => api.registrar(datos),
  iniciarSesion: (datos) => api.iniciarSesion(datos),
  cerrarSesion: () => api.cerrarSesion(),
}))

/** Nombre a mostrar: el del perfil o, mientras carga, la parte inicial del correo. */
export function nombreVisible({ usuario, perfil }) {
  return perfil?.nombre ?? usuario?.user_metadata?.nombre ?? usuario?.email?.split('@')[0] ?? ''
}
