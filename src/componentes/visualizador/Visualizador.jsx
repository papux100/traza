import { useEffect, useState } from 'react'
import { MotionConfig } from 'motion/react'
import { useStore } from 'zustand'
import { obtenerAlgoritmo } from '@/algoritmos/registro'
import { usePreferencias } from '@/motor/preferencias'
import { crearReproductor } from '@/motor/reproductor'
import { cn } from '@/lib/utils'
import { Barras } from './Barras'
import { Contadores } from './Contadores'
import { Controles } from './Controles'
import { EditorEntrada } from './EditorEntrada'
import { Leyenda } from './Leyenda'
import { PanelCodigo } from './PanelCodigo'

const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Une las tres capas: pide la traza al algoritmo, la entrega a un reproductor
 * propio y dibuja el paso actual.
 *
 * `compacto` oculta el código y el editor (se usa en la portada).
 */
export function Visualizador({ algoritmoId, compacto = false, autoReproducir = false, className }) {
  const algoritmo = obtenerAlgoritmo(algoritmoId)
  const [reproductor] = useState(() => crearReproductor(algoritmo))

  const paso = useStore(reproductor, (s) => s.pasos[s.indice])
  const pasos = useStore(reproductor, (s) => s.pasos)
  const objetivo = useStore(reproductor, (s) => s.objetivo)
  const reproduciendo = useStore(reproductor, (s) => s.reproduciendo)
  const velocidad = usePreferencias((s) => s.velocidad)

  // El temporizador sólo avanza el índice; no sabe nada del algoritmo.
  useEffect(() => {
    if (!reproduciendo) return
    const intervalo = setInterval(() => reproductor.getState().avanzar(), 1000 / velocidad)
    return () => clearInterval(intervalo)
  }, [reproduciendo, velocidad, reproductor])

  useEffect(() => {
    if (!autoReproducir || prefiereMenosMovimiento()) return
    const espera = setTimeout(() => reproductor.getState().alternar(), 700)
    return () => clearTimeout(espera)
  }, [autoReproducir, reproductor])

  function alPulsarTecla(evento) {
    if (evento.target.closest('input, textarea, [role="slider"]')) return
    const estado = reproductor.getState()
    const atajos = {
      ArrowRight: estado.siguiente,
      ArrowLeft: estado.retroceder,
      Home: estado.reiniciar,
      End: () => estado.irA(estado.pasos.length - 1),
    }
    if (atajos[evento.key]) {
      evento.preventDefault()
      atajos[evento.key]()
    } else if (evento.key === ' ' && !evento.target.closest('button, a')) {
      evento.preventDefault()
      estado.alternar()
    }
  }

  // La animación nunca dura más que el tiempo entre dos pasos.
  const duracion = reproduciendo ? Math.min(0.3, 0.75 / velocidad) : 0.25

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-label={`Visualizador: ${algoritmo.nombreFuncion}`}
        onKeyDown={alPulsarTecla}
        className={cn('overflow-hidden rounded-xl border bg-card', className)}
      >
        <div className={cn('grid', !compacto && 'xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]')}>
          <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-6">
            <Barras
              paso={paso}
              objetivo={algoritmo.familia === 'busqueda' ? objetivo : undefined}
              duracion={duracion}
              alto={compacto ? 'h-48' : 'h-56'}
            />

            <p aria-live="polite" className="min-h-[3.3em] text-[0.9375rem] leading-relaxed text-foreground">
              {paso.descripcion}
            </p>

            <Controles reproductor={reproductor} />

            <div className="flex flex-col gap-3 border-t pt-4">
              <Contadores familia={algoritmo.familia} contadores={paso.contadores} />
              <Leyenda pasos={pasos} etiquetas={algoritmo.leyenda} />
            </div>
          </div>

          {!compacto && (
            <div className="min-w-0 border-t bg-background/40 xl:border-t-0 xl:border-l">
              <PanelCodigo codigo={algoritmo.codigo} lineaActiva={paso.linea} />
            </div>
          )}
        </div>

        {!compacto && (
          <div className="border-t p-4 sm:px-6">
            <EditorEntrada reproductor={reproductor} algoritmo={algoritmo} />
          </div>
        )}
      </section>
    </MotionConfig>
  )
}
