import { createStore } from 'zustand/vanilla'

/**
 * Fábrica de reproductores.
 *
 * Cada visualizador crea el suyo, en lugar de compartir un store global.
 * Así pueden convivir varios en una misma página (por ejemplo, para comparar
 * dos algoritmos lado a lado) sin pisarse.
 *
 * El reproductor no sabe qué algoritmo ejecutó ni cómo se dibuja: sólo
 * guarda una lista de pasos y la posición actual dentro de ella.
 */
export function crearReproductor(algoritmo, inicial = {}) {
  function generar(entrada, objetivo) {
    const { pasos, resultado } = algoritmo.ejecutar(entrada, objetivo)
    return { entrada, objetivo, pasos, resultado }
  }

  return createStore((set, get) => ({
    ...generar(
      inicial.entrada ?? algoritmo.entradaPorDefecto,
      inicial.objetivo ?? algoritmo.objetivoPorDefecto,
    ),
    indice: 0,
    reproduciendo: false,

    /** Ejecuta el algoritmo con una entrada nueva y vuelve al primer paso. */
    cargar(entrada, objetivo = get().objetivo) {
      set({ ...generar(entrada, objetivo), indice: 0, reproduciendo: false })
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
      set({ indice: Math.min(indice + 1, pasos.length - 1), reproduciendo: false })
    },

    retroceder() {
      set({ indice: Math.max(get().indice - 1, 0), reproduciendo: false })
    },

    irA(posicion) {
      const ultimo = get().pasos.length - 1
      set({ indice: Math.min(Math.max(Math.round(posicion), 0), ultimo), reproduciendo: false })
    },

    alternar() {
      const { reproduciendo, indice, pasos } = get()
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
