import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/*
 * Arte generativo del sitio: fragmentos triangulares en la escala de azules.
 *
 * Todo sale de una semilla, así que el dibujo es el mismo en cada visita y
 * en el servidor de pruebas. La columna se sombrea como un relieve de verdad:
 * cada triángulo tiene una altura en sus vértices y su tono depende de hacia
 * dónde mira respecto a una luz que viene de arriba a la izquierda.
 */

const RAMPA = 8
const tono = (i) => `var(--faceta-${Math.min(RAMPA, Math.max(1, i))})`

function crearAleatorio(semilla) {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LUZ = (() => {
  const v = [-0.55, -0.65, 0.55]
  const largo = Math.hypot(...v)
  return v.map((c) => c / largo)
})()

/** Tono de una cara según su orientación: 1 (sombra) a 8 (brillo). */
function sombrear([a, b, c]) {
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]]
  let n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]]
  const largo = Math.hypot(...n) || 1
  n = n.map((x) => x / largo)
  if (n[2] < 0) n = n.map((x) => -x)
  const luz = n[0] * LUZ[0] + n[1] * LUZ[1] + n[2] * LUZ[2]
  return Math.round(1 + Math.max(0, Math.min(1, (luz - 0.2) / 0.8)) * 6.4)
}

const centroide = (pts) => [
  (pts[0][0] + pts[1][0] + pts[2][0]) / 3,
  (pts[0][1] + pts[1][1] + pts[2][1]) / 3,
]

const aTexto = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

function generarColumna(semilla, ancho, alto) {
  const r = crearAleatorio(semilla)
  const entre = (a, b) => a + r() * (b - a)
  const cx = ancho / 2

  // Filas de la columna: un borde izquierdo, una arista central y un borde derecho.
  const filas = []
  for (let y = -10, i = 0; y < alto + 10; y += entre(46, 84), i++) {
    const media = ancho * entre(0.1, 0.2)
    const desvio = Math.sin(i * 1.25 + semilla) * ancho * 0.07
    const centro = cx + desvio
    const altura = (i % 2 === 0 ? 1 : 0.35) * entre(40, 75)
    filas.push({
      L: [centro - media - entre(0, 16), y + entre(-12, 12), 0],
      C: [centro + entre(-14, 14), y, altura],
      R: [centro + media + entre(0, 16), y + entre(-12, 12), 0],
    })
  }

  const piezas = []
  const agregar = (pts3d, extra = {}) => {
    const pts = pts3d.map(([x, y]) => [x, y])
    const [gx, gy] = centroide(pts)
    const fuera = gx - cx
    piezas.push({
      puntos: aTexto(pts),
      relleno: tono(extra.tono ?? sombrear(pts3d)),
      dx: fuera * entre(0.8, 2.2) + entre(-50, 50),
      dy: entre(-70, 70),
      giro: entre(-140, 140),
      retraso: (gy / alto) * 0.85 + entre(0, 0.2),
    })
  }

  for (let i = 0; i < filas.length - 1; i++) {
    const a = filas[i]
    const b = filas[i + 1]
    agregar([a.L, a.C, b.L])
    agregar([a.C, b.C, b.L])
    agregar([a.C, a.R, b.R])
    agregar([a.C, b.R, b.C])

    // Puntas que sobresalen de los bordes, como en una roca rota.
    for (const lado of ['L', 'R']) {
      if (r() > 0.42) continue
      const signo = lado === 'L' ? -1 : 1
      const base = lado === 'L' ? Math.min(a.L[0], b.L[0]) : Math.max(a.R[0], b.R[0])
      const punta = [base + signo * entre(22, 70), (a[lado][1] + b[lado][1]) / 2 + entre(-22, 22), 0]
      agregar([a[lado], b[lado], punta], { tono: lado === 'L' ? Math.round(entre(4, 7)) : Math.round(entre(2, 4)) })
    }
  }

  // Fragmentos sueltos alrededor de la columna.
  const sueltos = []
  for (let intento = 0; sueltos.length < 26 && intento < 400; intento++) {
    const x = entre(0, ancho)
    const y = entre(0, alto)
    const distancia = Math.abs(x - cx) / (ancho / 2)
    if (distancia < 0.38) continue
    const tamano = entre(7, 26) * (1.2 - distancia * 0.5)
    const inicio = entre(0, Math.PI * 2)
    const pts = [0, 1, 2].map((k) => {
      const angulo = inicio + k * ((Math.PI * 2) / 3) + entre(-0.45, 0.45)
      const radio = tamano * entre(0.65, 1.05)
      return [x + Math.cos(angulo) * radio, y + Math.sin(angulo) * radio]
    })
    sueltos.push({
      puntos: aTexto(pts),
      relleno: tono(Math.round(entre(2, 7))),
      opacidad: entre(0.35, 0.9),
      dx: (x - cx) * entre(0.4, 0.9),
      dy: entre(-60, 60),
      giro: entre(-200, 200),
      retraso: 0.5 + entre(0, 0.9),
    })
  }

  return { piezas, sueltos }
}

/**
 * Columna de fragmentos facetados. Con `armada` (por defecto) las piezas
 * vuelan a su lugar al montarse; sin ella se quedan dispersas.
 */
export function Fragmentos({ semilla = 7, ancho = 360, alto = 560, armada = true, className }) {
  const { piezas, sueltos } = useMemo(() => generarColumna(semilla, ancho, alto), [semilla, ancho, alto])

  const estilo = (p) =>
    armada
      ? { '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--giro': `${p.giro}deg`, '--retraso': `${p.retraso}s` }
      : { transform: `translate(${p.dx * 0.55}px, ${p.dy * 0.8}px) rotate(${p.giro * 0.6}deg)` }

  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      className={cn('h-full w-full overflow-visible', className)}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <g className={armada ? undefined : 'opacity-60'}>
        {sueltos.map((p, i) => (
          <polygon
            key={`s${i}`}
            points={p.puntos}
            fill={p.relleno}
            fillOpacity={p.opacidad}
            className={armada ? 'fragmento' : 'fragmento-quieto'}
            style={estilo(p)}
          />
        ))}
        {piezas.map((p, i) => (
          <polygon
            key={`p${i}`}
            points={p.puntos}
            fill={p.relleno}
            stroke="var(--background)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className={armada ? 'fragmento' : 'fragmento-quieto'}
            style={estilo(p)}
          />
        ))}
      </g>
    </svg>
  )
}

/** Separador horizontal: una grieta que suelta algunas esquirlas. */
export function Grieta({ semilla = 3, className }) {
  const { linea, esquirlas } = useMemo(() => {
    const r = crearAleatorio(semilla)
    const entre = (a, b) => a + r() * (b - a)
    const ancho = 1200
    const puntos = []
    for (let x = 0; x <= ancho; x += entre(18, 60)) puntos.push([x, 16 + entre(-7, 7)])
    puntos.push([ancho, 16])
    const esquirlas = []
    for (let i = 1; i < puntos.length - 1; i++) {
      if (r() > 0.4) continue
      const [x, y] = puntos[i]
      const arriba = r() > 0.5 ? -1 : 1
      const t = entre(3, 8)
      const cy = y + arriba * entre(6, 12)
      const cx = x + entre(-10, 10)
      esquirlas.push({
        puntos: aTexto([
          [cx - t, cy + entre(-2, 2)],
          [cx + t * entre(0.3, 1), cy - arriba * t * entre(0.6, 1.2)],
          [cx + t, cy + entre(-2, 3)],
        ]),
        relleno: tono(Math.round(entre(3, 7))),
      })
    }
    return { linea: aTexto(puntos), esquirlas }
  }, [semilla])

  return (
    <svg
      viewBox="0 0 1200 32"
      preserveAspectRatio="xMidYMid slice"
      className={cn('block h-8 w-full', className)}
      aria-hidden="true"
      focusable="false"
    >
      <polyline points={linea} fill="none" stroke="var(--border)" strokeWidth="1.5" strokeLinejoin="bevel" />
      {esquirlas.map((e, i) => (
        <polygon key={i} points={e.puntos} fill={e.relleno} />
      ))}
    </svg>
  )
}

/** Logotipo: un triángulo partido en cuatro caras. */
export function Logotipo({ className }) {
  return (
    <svg viewBox="0 0 28 28" className={cn('size-7', className)} aria-hidden="true" focusable="false">
      <g stroke="var(--sidebar)" strokeWidth="1.4" strokeLinejoin="round">
        <polygon points="14,2.5 8,13.5 20,13.5" fill="var(--faceta-7)" />
        <polygon points="2,25 8,13.5 14,25" fill="var(--faceta-5)" />
        <polygon points="8,13.5 20,13.5 14,25" fill="var(--faceta-6)" />
        <polygon points="14,25 20,13.5 26,25" fill="var(--faceta-3)" />
      </g>
    </svg>
  )
}
