import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Lock } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import { useStore } from 'zustand'
import { EstadoCarga } from '@/componentes/EstadoCarga'
import { buttonVariants } from '@/componentes/ui/button'
import { usePreferencias } from '@/motor/preferencias'
import { crearReproductor } from '@/motor/reproductor'
import { cn } from '@/lib/utils'
import { Auxiliar } from './Auxiliar'
import { Barras } from './Barras'
import { Contadores } from './Contadores'
import { Controles } from './Controles'
import { EditorEntrada } from './EditorEntrada'
import { Leyenda } from './Leyenda'
import { PanelCodigo } from './PanelCodigo'

const prefiereMenosMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Pide al servidor la traza del algoritmo y, cuando llega, la reproduce.
 *
 * `compacto` oculta el código y el editor (se usa en la portada).
 */
export function Visualizador({ algoritmoId, compacto = false, autoReproducir = false, className }) {
  const [reproductor] = useState(() => crearReproductor(algoritmoId))
  const estado = useStore(reproductor, (s) => s.estado)
  const error = useStore(reproductor, (s) => s.error)

  useEffect(() => {
    reproductor.getState().cargar()
  }, [reproductor])

  const marco = cn('facetado overflow-hidden border bg-card [--corte:22px]', className)

  if (estado === 'listo') {
    return (
      <VisualizadorListo reproductor={reproductor} compacto={compacto} autoReproducir={autoReproducir} className={marco} />
    )
  }

  return (
    <section aria-label="Visualizador" className={cn(marco, 'flex items-center px-6', compacto ? 'min-h-72' : 'min-h-96')}>
      {estado === 'bloqueado' ? (
        <Bloqueado />
      ) : (
        <EstadoCarga
          error={estado === 'error' ? error : null}
          texto="Ejecutando el algoritmo en el servidor…"
          alReintentar={() => reproductor.getState().cargar()}
        />
      )}
    </section>
  )
}

function Bloqueado() {
  const { pathname } = useLocation()
  return (
    <div className="max-w-md">
      <Lock className="size-5 text-enlace" aria-hidden="true" />
      <p className="mt-2 font-medium">Este algoritmo es para usuarios registrados</p>
      <p className="mt-1 text-sm text-foreground/85">Crea una cuenta gratis para ejecutarlo paso a paso.</p>
      <Link to="/registro" state={{ desde: pathname }} className={cn(buttonVariants({ size: 'sm' }), 'mt-3')}>
        Crear cuenta
      </Link>
    </div>
  )
}

function VisualizadorListo({ reproductor, compacto, autoReproducir, className }) {
  const algoritmo = useStore(reproductor, (s) => s.algoritmo)
  const paso = useStore(reproductor, (s) => s.pasos[s.indice])
  const pasos = useStore(reproductor, (s) => s.pasos)
  const objetivo = useStore(reproductor, (s) => s.objetivo)
  const reproduciendo = useStore(reproductor, (s) => s.reproduciendo)
  const recalculando = useStore(reproductor, (s) => s.recalculando)
  const velocidad = usePreferencias((s) => s.velocidad)
  const esBusqueda = algoritmo.familia === 'busqueda'

  // Escala común para todas las zonas, tomada del primer paso (que siempre
  // tiene el arreglo completo). Así una barra mide lo mismo en cualquier zona.
  const maximo = Math.max(...pasos[0].elementos.map((e) => e.valor), esBusqueda ? objetivo : 0, 1)

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
        aria-busy={recalculando || undefined}
        onKeyDown={alPulsarTecla}
        className={className}
      >
        <div className={cn('grid', !compacto && 'xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]')}>
          <div className={cn('flex min-w-0 flex-col gap-4 p-4 transition-opacity sm:p-6', recalculando && 'opacity-50')}>
            <Barras
              paso={paso}
              objetivo={esBusqueda ? objetivo : undefined}
              maximo={maximo}
              duracion={duracion}
              alto={compacto ? 'h-48' : pasos[0].auxiliar ? 'h-40' : 'h-56'}
            />

            <Auxiliar paso={paso} maximo={maximo} duracion={duracion} />

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
