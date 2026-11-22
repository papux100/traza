import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Barras } from './Barras'
import { APARIENCIA, TEXTO_SOBRE } from './estados'

/**
 * Zona extra que algunos algoritmos necesitan además del arreglo:
 * cubetas, un arreglo de conteos o un árbol. Igual que las barras, es una
 * función pura del paso que recibe.
 */
export function Auxiliar({ paso, maximo, duracion }) {
  const aux = paso.auxiliar
  if (!aux) return null
  const props = { aux, estadosPorId: paso.estadosPorId, maximo, duracion }
  return (
    <div className="border-t border-dashed pt-4">
      {aux.tipo === 'cubetas' && <ZonaCubetas {...props} />}
      {aux.tipo === 'conteo' && <ZonaConteo {...props} />}
      {aux.tipo === 'arbol' && <ZonaArbol {...props} />}
    </div>
  )
}

function Titulo({ children }) {
  return <p className="mb-2 text-xs text-muted-foreground">{children}</p>
}

/* ---------- Cubetas ---------- */

/** Escribe el valor con ceros a la izquierda y resalta la cifra que decide la cubeta. */
function ValorConCifra({ valor, cifra, cifras }) {
  if (!cifra) return valor
  const texto = String(valor).padStart(cifras, '0')
  const indice = texto.length - 1 - Math.round(Math.log10(cifra))
  return (
    <>
      {texto.slice(0, indice)}
      <span className="underline decoration-2 underline-offset-2">{texto[indice]}</span>
      {texto.slice(indice + 1)}
    </>
  )
}

function ZonaCubetas({ aux, estadosPorId, duracion }) {
  return (
    <div>
      <Titulo>{aux.titulo}</Titulo>
      <div
        className="grid grid-cols-5 gap-1.5 sm:[grid-template-columns:repeat(var(--columnas),minmax(0,1fr))] sm:gap-2"
        style={{ '--columnas': aux.cubetas.length }}
      >
        {aux.cubetas.map((cubeta, c) => (
          <div
            key={c}
            className={cn(
              'flex min-h-36 min-w-0 flex-col rounded-md border bg-background/40 transition-colors',
              aux.activa === c && 'border-primary/70 bg-primary/5',
            )}
          >
            <div className="flex flex-1 flex-col gap-1 p-1.5">
              {cubeta.elementos.map((elemento) => {
                const estado = estadosPorId[elemento.id] ?? 'normal'
                return (
                  <motion.div
                    key={elemento.id}
                    layout="position"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: duracion }}
                    data-estado={estado}
                    className={cn(
                      'rounded-[3px] py-0.5 text-center font-mono text-xs transition-colors duration-150',
                      APARIENCIA[estado].clase,
                      TEXTO_SOBRE[estado],
                    )}
                  >
                    <ValorConCifra valor={elemento.valor} cifra={aux.cifra} cifras={aux.cifras} />
                  </motion.div>
                )
              })}
            </div>
            <div className="truncate border-t px-1 py-1 text-center font-mono text-[0.6875rem] text-muted-foreground">
              {cubeta.etiqueta}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- Conteo ---------- */

const CELDA = {
  normal: 'border-border text-foreground',
  activo: 'border-estado-activo bg-estado-activo text-background',
  comparando: 'border-estado-comparando bg-estado-comparando text-background',
  ordenado: 'border-primary/60 text-enlace',
}

function ZonaConteo({ aux, estadosPorId, maximo, duracion }) {
  const columnas = { gridTemplateColumns: `repeat(${aux.celdas.length}, minmax(0, 1fr))` }
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Titulo>{aux.titulo}</Titulo>
        <div className="grid gap-1" style={columnas}>
          {aux.celdas.map((celda, i) => (
            <div key={i} className="flex min-w-0 flex-col items-center gap-1">
              <div
                data-estado={celda.estado}
                className={cn(
                  'flex h-9 w-full items-center justify-center rounded-md border font-mono text-sm tabular-nums transition-colors duration-150',
                  CELDA[celda.estado] ?? CELDA.normal,
                )}
              >
                {celda.valor}
              </div>
              <span className="font-mono text-[0.6875rem] text-tenue">{celda.etiqueta}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Titulo>Arreglo de salida</Titulo>
        <Barras
          paso={{
            elementos: aux.salida,
            estados: aux.salida.map((e) => (e ? (estadosPorId[e.id] ?? 'normal') : 'vacio')),
          }}
          maximo={maximo}
          duracion={duracion}
          alto="h-28"
          etiqueta={`Arreglo de salida: ${aux.salida.map((e) => (e ? e.valor : 'vacío')).join(', ')}`}
        />
      </div>
    </div>
  )
}

/* ---------- Árbol ---------- */

const ANCHO_NODO = 44
const RADIO = 16
/** Con muchos niveles, los niveles se juntan para que los nodos no se vuelvan diminutos. */
const altoNivel = (niveles) => (niveles > 7 ? 38 : 54)

const TEXTO_NODO = {
  normal: 'var(--foreground)',
  descartado: 'var(--tenue)',
  ordenado: 'var(--primary-foreground)',
}

/** Coloca cada nodo: x según su orden en el recorrido en orden, y según su profundidad. */
function calcularPosiciones(nodos, raiz) {
  const ubicacion = new Map()
  let orden = 0
  let profundidad = 0
  function visitar(indice, nivel) {
    if (indice === null) return
    visitar(nodos[indice].izq, nivel + 1)
    ubicacion.set(indice, { columna: orden, nivel })
    orden++
    profundidad = Math.max(profundidad, nivel)
    visitar(nodos[indice].der, nivel + 1)
  }
  visitar(raiz, 0)

  const niveles = profundidad + 1
  const alto = altoNivel(niveles)
  const posiciones = new Map()
  for (const [indice, { columna, nivel }] of ubicacion) {
    posiciones.set(indice, { x: columna * ANCHO_NODO + ANCHO_NODO / 2, y: nivel * alto + alto / 2 })
  }
  return { posiciones, columnas: orden, niveles, altoTotal: niveles * alto }
}

function ZonaArbol({ aux, estadosPorId, duracion }) {
  const { nodos, raiz } = aux

  if (raiz === null) {
    return (
      <div>
        <Titulo>{aux.titulo}</Titulo>
        <p className="flex h-24 items-center justify-center rounded-md border border-dashed text-sm text-tenue">
          El árbol todavía está vacío.
        </p>
      </div>
    )
  }

  const { posiciones, columnas, niveles, altoTotal: alto } = calcularPosiciones(nodos, raiz)
  const ancho = Math.max(columnas, 3) * ANCHO_NODO
  const transicion = { duration: duracion, ease: [0.3, 0, 0.2, 1] }

  const aristas = []
  nodos.forEach((nodo, i) => {
    for (const hijo of [nodo.izq, nodo.der]) {
      if (hijo !== null) aristas.push({ desde: posiciones.get(i), hasta: posiciones.get(hijo), clave: `${i}-${hijo}` })
    }
  })

  return (
    <div>
      <Titulo>{aux.titulo}</Titulo>
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        preserveAspectRatio="xMidYMin meet"
        className="w-full"
        style={{ height: Math.min(Math.max(alto, 110), 460) }}
        role="img"
        aria-label={`Árbol con ${nodos.length} nodos y ${niveles} niveles`}
      >
        {aristas.map(({ desde, hasta, clave }) => (
          <motion.line
            key={clave}
            initial={{ x1: desde.x, y1: desde.y, x2: desde.x, y2: desde.y }}
            animate={{ x1: desde.x, y1: desde.y, x2: hasta.x, y2: hasta.y }}
            transition={transicion}
            stroke="var(--input)"
            strokeWidth="1.5"
          />
        ))}
        {nodos.map((nodo, i) => {
          const { x, y } = posiciones.get(i)
          const estado = nodo.devuelto ? 'descartado' : (estadosPorId[nodo.elemento.id] ?? 'normal')
          return (
            <motion.g
              key={nodo.elemento.id}
              data-estado={estado}
              initial={{ x, y: y - 14, opacity: 0 }}
              animate={{ x, y, opacity: 1 }}
              transition={transicion}
            >
              <circle
                r={RADIO}
                style={{
                  fill: `var(--estado-${estado})`,
                  stroke: estado === 'descartado' ? 'var(--input)' : 'transparent',
                  transition: 'fill 150ms',
                }}
                strokeWidth="1.5"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fill: TEXTO_NODO[estado] ?? 'var(--background)', fontFamily: 'var(--font-mono)', fontSize: 12 }}
              >
                {nodo.elemento.valor}
              </text>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
