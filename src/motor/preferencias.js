import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const VELOCIDAD_MIN = 1
export const VELOCIDAD_MAX = 12

/**
 * Preferencias del visitante. Se guardan en su navegador (localStorage),
 * así que no hace falta servidor ni cuenta para recordarlas.
 */
export const usePreferencias = create(
  persist(
    (set) => ({
      /** Pasos por segundo durante la reproducción automática. */
      velocidad: 3,
      setVelocidad: (velocidad) =>
        set({ velocidad: Math.min(Math.max(velocidad, VELOCIDAD_MIN), VELOCIDAD_MAX) }),
    }),
    { name: 'traza-preferencias' },
  ),
)
