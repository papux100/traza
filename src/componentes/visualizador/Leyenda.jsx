import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { APARIENCIA, ORDEN_LEYENDA } from './estados'

/** Muestra sólo los estados que este algoritmo llega a usar con esta entrada. */
export function Leyenda({ pasos, etiquetas = {} }) {
  const usados = useMemo(() => {
    const vistos = new Set()
    for (const paso of pasos) for (const estado of paso.estados) vistos.add(estado)
    return ORDEN_LEYENDA.filter((estado) => vistos.has(estado))
  }, [pasos])

  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
      {usados.map((estado) => (
        <li key={estado} className="flex items-center gap-1.5">
          <span className={cn('size-2.5 rounded-[2px]', APARIENCIA[estado].clase)} aria-hidden="true" />
          {etiquetas[estado] ?? APARIENCIA[estado].etiqueta}
        </li>
      ))}
    </ul>
  )
}
