import { createStore } from 'zustand/vanilla'

import { ejecutarAlgoritmo } from '@/servicios/api'

/**
 * Fábrica de reproductores.
 *
 * Cada visualizador crea el suyo, en lugar de compartir un store global.
 * Así pueden convivir varios en una misma página sin pisarse.
 *
 * El algoritmo se ejecuta en el servidor: el reproductor le manda la entrada,
 * recibe la traza (la lista de pasos) y desde ahí sólo se mueve por ella.
 * No sabe cómo se calculó cada paso ni cómo se dibuja.
 *
 * `ejecutar` se puede sustituir en las pruebas por una versión falsa.
 */
export function crearReproductor(algoritmoId, { ejecutar = ejecutarAlgoritmo } = {}) {
  // Si el usuario pide dos ejecuciones seguidas, sólo cuenta la última respuesta.
  let ultimaPeticion = 0

  return createStore((set, get) => ({
    /** Datos que manda el servidor: código, familia, leyenda, valor máximo. */
    algoritmo: null,
    entrada: [],
    objetivo: null,
    pasos: [],
    resultado: null,
    indice: 0,
    reproduciendo: false,
    /** 'inicial' | 'cargando' | 'listo' | 'error' | 'bloqueado' */
    estado: 'inicial',
    error: null,
    /** true mientras se vuelve a ejecutar con una entrada nueva. */
    recalculando: false,

    /**
     * Pide al servidor la traza para una entrada. Sin entrada, el servidor usa
     * los datos de ejemplo. Devuelve { ok, error } para que el editor pueda
     * mostrar el mensaje junto al campo.
     */
    async cargar(entrada, objetivo) {
      const numero = ++ultimaPeticion
      const primeraVez = get().pasos.length === 0
      set(primeraVez ? { estado: 'cargando', error: null } : { recalculando: true, reproduciendo: false })

      try {
        const traza = await ejecutar(algoritmoId, { entrada, objetivo })
        if (numero !== ultimaPeticion) return { ok: false }
        set({
          algoritmo: traza.algoritmo,
          entrada: traza.entrada,
          objetivo: traza.objetivo,
          pasos: traza.pasos,
          resultado: traza.resultado,
          indice: 0,
          reproduciendo: false,
          estado: 'listo',
          error: null,
          recalculando: false,
        })
        return { ok: true }
      } catch (error) {
        if (numero !== ultimaPeticion) return { ok: false }
        if (primeraVez) {
          set({ estado: error.codigo === 'requiere_cuenta' ? 'bloqueado' : 'error', error: error.message })
        } else {
          set({ recalculando: false })
        }
        return { ok: false, error: error.message }
      }
    },

    avanzar() {
      const { indice, pasos } = get()
      const ultimo = pasos.length - 1
      if (indice >= ultimo) {
        set({ reproduciendo: false })
        return
      }
      const siguiente = indice + 1
      set({ indice: siguiente, reproduciendo: get().reproduciendo && siguiente < ultimo })
    },

    /** Paso manual hacia adelante: detiene la reproducción automática. */
    siguiente() {
      const { indice, pasos } = get()
      set({ indice: Math.max(Math.min(indice + 1, pasos.length - 1), 0), reproduciendo: false })
    },

    retroceder() {
      set({ indice: Math.max(get().indice - 1, 0), reproduciendo: false })
    },

    irA(posicion) {
      const ultimo = get().pasos.length - 1
      set({ indice: Math.max(Math.min(Math.round(posicion), ultimo), 0), reproduciendo: false })
    },

    alternar() {
      const { reproduciendo, indice, pasos } = get()
      if (pasos.length === 0) return
      if (reproduciendo) {
        set({ reproduciendo: false })
        return
      }
      // Si ya terminó, reproducir de nuevo empieza desde el principio.
      set({ reproduciendo: true, indice: indice >= pasos.length - 1 ? 0 : indice })
    },

    reiniciar() {
      set({ indice: 0, reproduciendo: false })
    },
  }))
}
