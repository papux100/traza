import { useEffect, useState } from 'react'
import { APARIENCIA } from '@/componentes/visualizador/estados'
import { obtenerVistasPrevias } from '@/servicios/api'
import { cn } from '@/lib/utils'
import { useSesion } from '@/stores/sesion'

/*
 * Miniatura animada de un algoritmo para el catálogo. Todas las vistas llegan
 * en una sola petición que se comparte entre las filas. La API sólo entrega
 * las de los algoritmos públicos si no hay sesión, así que se guarda una
 * petición por usuario (o una para "sin sesión").
 */
const pedidos = new Map()
export function cargarVistasPrevias(usuarioId = null) {
  const clave = usuarioId ?? 'sin-sesion'
  if (!pedidos.has(clave)) {
    pedidos.set(
      clave,
      obtenerVistasPrevias().catch(() => {
        pedidos.delete(clave) // si falla, se reintenta en el siguiente hover
        return null
      }),
    )
  }
  return pedidos.get(clave)
}

const prefiereSinMovimiento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Milisegundos por cuadro: las búsquedas tienen pocos pasos y van más lento. */
const ritmo = (familia) => (familia === 'busqueda' ? 420 : 110)
const PAUSA_FINAL = 1100

export function VistaPrevia({ id, activa, className }) {
  const usuarioId = useSesion((s) => s.usuario?.id ?? null)
  const [vista, setVista] = useState(null)
  const [cuadro, setCuadro] = useState(0)

  useEffect(() => {
    if (!activa || vista) return
    let vigente = true
    cargarVistasPrevias(usuarioId).then((vistas) => vigente && vistas?.[id] && setVista(vistas[id]))
    return () => {
      vigente = false
    }
  }, [activa, id, vista, usuarioId])

  useEffect(() => {
    if (!activa || !vista) return
    // Con movimiento reducido no se anima: se muestra el resultado final (abajo).
    if (prefiereSinMovimiento()) return
    const total = vista.cuadros.length
    let i = 0
    let reloj
    const avanzar = () => {
      i = i + 1 >= total ? 0 : i + 1
      setCuadro(i)
      reloj = setTimeout(avanzar, i === total - 1 ? PAUSA_FINAL : ritmo(vista.familia))
    }
    reloj = setTimeout(avanzar, ritmo(vista.familia))
    return () => clearTimeout(reloj)
  }, [activa, vista])

  // La fila sólo monta este componente mientras está activa, así que cada hover empieza en el cuadro 0.
  const indice = vista && prefiereSinMovimiento() ? vista.cuadros.length - 1 : cuadro
  const actual = vista?.cuadros[Math.min(indice, vista.cuadros.length - 1)]
  const maximo = actual ? Math.max(1, ...vista.cuadros[0].v.filter((x) => x !== null)) : 1

  return (
    <span aria-hidden="true" className={cn('flex h-9 items-end gap-[2px]', className)}>
      {actual?.v.map((valor, i) => (
        <span
          key={i}
          className={cn('min-w-0 flex-1 transition-[height] duration-100', APARIENCIA[actual.e[i]]?.clase ?? 'bg-estado-normal')}
          style={{ height: valor === null ? 0 : `${Math.max(8, (valor / maximo) * 100)}%` }}
        />
      ))}
    </span>
  )
}
