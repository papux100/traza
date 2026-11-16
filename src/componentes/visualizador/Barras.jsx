import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { APARIENCIA, estaAtenuado } from './estados'

const ALTO_ETIQUETA = '1.5rem'

/**
 * Dibuja un paso de la traza. Es una función pura del paso: no guarda
 * estado ni sabe qué algoritmo lo produjo.
 *
 * Cada barra lleva como key el id de su elemento. Por eso, cuando dos
 * elementos cambian de posición entre un paso y el siguiente, Motion
 * desliza las barras en lugar de redibujarlas.
 */
export function Barras({ paso, objetivo, duracion = 0.25, alto = 'h-56' }) {
  const { elementos, estados, marcadores, rango } = paso
  const cantidad = elementos.length
  const hayObjetivo = typeof objetivo === 'number'
  const maximo = Math.max(...elementos.map((e) => e.valor), hayObjetivo ? objetivo : 0, 1)
  const columnas = { gridTemplateColumns: `repeat(${cantidad}, minmax(0, 1fr))` }
  const separacion = cantidad > 12 ? 'gap-1' : 'gap-1.5 sm:gap-2'

  const marcadoresPorIndice = new Map()
  for (const { etiqueta, indice } of marcadores) {
    marcadoresPorIndice.set(indice, [...(marcadoresPorIndice.get(indice) ?? []), etiqueta])
  }

  return (
    <div className="select-none" role="img" aria-label={describir(paso)}>
      <div className={cn('relative', alto)}>
        <div className={cn('grid h-full', separacion)} style={columnas}>
          {elementos.map((elemento, i) => {
            const estado = estados[i]
            return (
              <motion.div
                key={elemento.id}
                layout="position"
                transition={{ layout: { duration: duracion, ease: [0.3, 0, 0.2, 1] } }}
                className="flex h-full min-w-0 flex-col justify-end"
                style={{ zIndex: estado === 'activo' || estado === 'comparando' ? 2 : 1 }}
              >
                <div className="flex min-h-0 flex-1 items-end">
                  <div
                    data-estado={estado}
                    className={cn(
                      'w-full rounded-t-[3px] transition-colors duration-150',
                      APARIENCIA[estado].clase,
                    )}
                    style={{ height: `${Math.max((elemento.valor / maximo) * 100, 4)}%` }}
                  />
                </div>
                <div
                  className={cn(
                    'flex items-center justify-center font-mono text-xs transition-colors duration-150 sm:text-[0.8125rem]',
                    estaAtenuado(estado) ? 'text-tenue' : 'text-foreground',
                  )}
                  style={{ height: ALTO_ETIQUETA }}
                >
                  {elemento.valor}
                </div>
              </motion.div>
            )
          })}
        </div>

        {hayObjetivo && (
          <div
            className="pointer-events-none absolute inset-x-0 z-10 border-t border-dashed border-estado-encontrado/70"
            style={{
              bottom: `calc(${ALTO_ETIQUETA} + (100% - ${ALTO_ETIQUETA}) * ${objetivo / maximo})`,
            }}
          >
            <span className="absolute left-0 -top-5 rounded-sm bg-card px-1 font-mono text-[0.6875rem] leading-4 text-estado-encontrado">
              buscado: {objetivo}
            </span>
          </div>
        )}
      </div>

      {/* Tramo en el que trabaja el algoritmo en este paso. */}
      <div className={cn('grid h-2.5', separacion)} style={columnas} aria-hidden="true">
        {rango && rango[0] <= rango[1] && (
          <div
            className="rounded-b-sm border-x border-b border-primary/60"
            style={{ gridColumn: `${rango[0] + 1} / ${rango[1] + 2}` }}
          />
        )}
      </div>

      {/* Posiciones y marcadores. No se mueven: pertenecen al arreglo, no al elemento. */}
      <div className={cn('grid min-h-[4.25rem] pt-1', separacion)} style={columnas} aria-hidden="true">
        {elementos.map((elemento, i) => (
          <div key={i} className="flex min-w-0 flex-col items-center gap-0.5">
            <span className="font-mono text-[0.6875rem] leading-4 text-tenue">{i}</span>
            {(marcadoresPorIndice.get(i) ?? []).map((etiqueta) => (
              <span
                key={etiqueta}
                className="rounded-sm bg-secondary px-1 font-mono text-[0.6875rem] leading-4 whitespace-nowrap text-primary"
              >
                {etiqueta}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Texto alternativo del gráfico para lectores de pantalla. */
function describir(paso) {
  return `Arreglo: ${paso.elementos.map((e) => e.valor).join(', ')}. ${paso.descripcion}`
}
