import { useMemo } from 'react'
import { cn } from '@/lib/utils'

/*
 * Arte del sitio: triángulos que se fragmentan.
 *
 * Todo sale de una semilla, así que el dibujo es el mismo en cada visita.
 * Las piezas se dibujan primero enteras y una animación CSS las lleva a su
 * posición final (separadas, giradas, más pequeñas). Si el sistema pide
 * reducir el movimiento, aparecen directamente en la posición final.
 */

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

const aTexto = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
const centro = (pts) => [
  pts.reduce((s, p) => s + p[0], 0) / pts.length,
  pts.reduce((s, p) => s + p[1], 0) / pts.length,
]
const mezclar = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const distancia = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

/** Tonos de las piezas: los tres azules de la paleta, con algunos negros y pocos brillos. */
function elegirTono(r) {
  const x = r()
  if (x < 0.26) return 'var(--faceta-1)'
  if (x < 0.5) return 'var(--faceta-2)'
  if (x < 0.7) return 'var(--faceta-3)'
  if (x < 0.86) return 'var(--card)'
  if (x < 0.95) return 'var(--faceta-4)'
  return 'var(--faceta-5)'
}

/** Parte un triángulo por su lado más largo, varias veces. */
function partir(tri, niveles, r) {
  if (niveles <= 0) return [tri]
  const lados = [0, 1, 2].map((i) => distancia(tri[i], tri[(i + 1) % 3]))
  const i = lados.indexOf(Math.max(...lados))
  const a = tri[i]
  const b = tri[(i + 1) % 3]
  const c = tri[(i + 2) % 3]
  const m = mezclar(a, b, 0.3 + r() * 0.4)
  return [...partir([a, m, c], niveles - 1, r), ...partir([m, b, c], niveles - 1, r)]
}

function transformar({ dx = 0, dy = 0, giro = 0, escala = 1 }) {
  return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${giro.toFixed(1)}deg) scale(${escala.toFixed(3)})`
}

/**
 * Una orilla que estalla en fragmentos. Se dibuja el lado izquierdo; el
 * derecho es el mismo dibujo reflejado (con otra semilla).
 */
function generarEstallido(semilla, ancho, alto) {
  const r = crearAleatorio(semilla)
  const entre = (a, b) => a + r() * (b - a)

  // Franja inicial pegada a la orilla, en filas: orilla, medio y frente.
  const filas = []
  for (let y = -40; y < alto + 40; y += entre(70, 130)) {
    filas.push({
      O: [-20, y + entre(-15, 15)],
      M: [entre(40, 95), y + entre(-25, 25)],
      F: [entre(120, 215), y + entre(-30, 30)],
    })
  }
  const grandes = []
  for (let i = 0; i < filas.length - 1; i++) {
    const a = filas[i]
    const b = filas[i + 1]
    grandes.push([a.O, a.M, b.O], [a.M, b.M, b.O], [a.M, a.F, b.M], [a.F, b.F, b.M])
    // Una punta que se adelanta hacia el centro.
    if (r() < 0.55) {
      const punta = [Math.max(a.F[0], b.F[0]) + entre(30, 110), (a.F[1] + b.F[1]) / 2 + entre(-30, 30)]
      grandes.push([a.F, punta, b.F])
    }
  }

  const piezas = []
  for (const tri of grandes) {
    const [gx] = centro(tri)
    const niveles = gx < 45 ? 1 : gx < 110 ? 2 + Math.round(r()) : 3 + Math.round(r() * 1.4)
    for (const pieza of partir(tri, niveles, r)) {
      const [px, py] = centro(pieza)
      // d: 0 en la orilla, 1 en el frente de la franja. Más lejos, más suelta.
      const d = Math.max(0, px / 190)
      const suelta = Math.max(0, d - 0.32)
      const final = {
        dx: suelta ** 1.5 * entre(40, 230),
        dy: (py - alto / 2) * suelta * entre(0, 0.12) + entre(-1, 1) * suelta * 30,
        giro: entre(-1, 1) * suelta * 95,
        escala: 1 - Math.min(0.6, suelta * entre(0.2, 0.7)),
      }
      piezas.push({
        puntos: aTexto(pieza),
        relleno: elegirTono(r),
        final: transformar(final),
        retraso: 0.15 + d * 0.35 + entre(0, 0.15),
      })
    }
  }

  // Esquirlas: más densas cerca de la orilla, cada vez más escasas hacia el centro.
  const esquirlas = []
  for (let i = 0; i < 80; i++) {
    const x = 60 + r() ** 1.6 * (ancho - 50)
    const y = entre(0, alto)
    const lejos = x / ancho
    const tamano = entre(2.5, 13) * (1.15 - lejos * 0.7)
    const inicio = entre(0, Math.PI * 2)
    const pts = [0, 1, 2].map((k) => {
      const angulo = inicio + k * ((Math.PI * 2) / 3) + entre(-0.5, 0.5)
      const radio = tamano * entre(0.55, 1.1)
      return [x + Math.cos(angulo) * radio, y + Math.sin(angulo) * radio]
    })
    esquirlas.push({
      puntos: aTexto(pts),
      relleno: elegirTono(r),
      opacidad: entre(0.55, 1) * (1.1 - lejos * 0.5),
      inicio: transformar({ dx: -(x - entre(60, 140)), dy: entre(-20, 20), giro: entre(-90, 90), escala: 0.4 }),
      final: transformar({ giro: entre(-40, 40) }),
      retraso: 0.3 + lejos * 0.45 + entre(0, 0.2),
    })
  }
  return { piezas, esquirlas }
}

export function Estallido({ semilla = 1, lado = 'izquierdo', ancho = 440, alto = 640, className }) {
  const { piezas, esquirlas } = useMemo(() => generarEstallido(semilla, ancho, alto), [semilla, ancho, alto])
  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      preserveAspectRatio="xMinYMid slice"
      className={cn('h-full overflow-visible', lado === 'derecho' && '-scale-x-100', className)}
      aria-hidden="true"
      focusable="false"
    >
      {esquirlas.map((e, i) => (
        <polygon
          key={`e${i}`}
          points={e.puntos}
          fill={e.relleno}
          fillOpacity={e.opacidad}
          className="esquirla"
          style={{ '--inicio': e.inicio, '--final': e.final, '--retraso': `${e.retraso}s` }}
        />
      ))}
      {piezas.map((p, i) => (
        <polygon
          key={`p${i}`}
          points={p.puntos}
          fill={p.relleno}
          stroke="var(--background)"
          strokeWidth="2"
          strokeLinejoin="round"
          className="pieza"
          style={{ '--final': p.final, '--retraso': `${p.retraso}s` }}
        />
      ))}
    </svg>
  )
}

/*
 * Triángulo partido por grietas (el logotipo). En un lienzo de 100 × 100:
 * vértices A (arriba), B (abajo a la izquierda) y C (abajo a la derecha),
 * y tres grietas que lo dividen en cuatro piezas.
 */
const A = [50, 5]
const B = [4, 91]
const C = [96, 91]
const P1 = mezclar(A, B, 0.5)
const Q1 = mezclar(A, C, 0.33)
const R = mezclar(P1, Q1, 0.42)
const Q2 = mezclar(A, C, 0.84)
const P3 = mezclar(A, B, 0.9)
const Q3 = mezclar(R, Q2, 0.86)

const PIEZAS_LOGO = [
  { puntos: [A, Q1, P1], tono: 'var(--faceta-6)' },
  { puntos: [Q1, Q2, R], tono: 'var(--faceta-4)' },
  { puntos: [P1, R, Q3, P3], tono: 'var(--faceta-5)' },
  { puntos: [P3, Q3, Q2, C, B], tono: 'var(--faceta-3)' },
]
const CENTRO_LOGO = centro([A, B, C])

/**
 * Triángulo partido. Con `separacion` 0 es el logotipo; con más, las piezas
 * se apartan del centro y sueltan esquirlas por las grietas.
 */
export function TrianguloRoto({ separacion = 0, esquirlas = 0, semilla = 5, fondo = 'var(--background)', className }) {
  const dibujo = useMemo(() => {
    const r = crearAleatorio(semilla)
    const entre = (a, b) => a + r() * (b - a)
    const piezas = PIEZAS_LOGO.map((p) => {
      const [cx, cy] = centro(p.puntos)
      return {
        puntos: aTexto(p.puntos),
        tono: p.tono,
        final: transformar({
          dx: (cx - CENTRO_LOGO[0]) * separacion,
          dy: (cy - CENTRO_LOGO[1]) * separacion,
          giro: separacion * entre(-14, 14),
        }),
        retraso: 0.1 + entre(0, 0.15),
      }
    })
    // Esquirlas que salen de las grietas.
    const grietas = [
      [P1, Q1],
      [R, Q2],
      [P3, Q3],
    ]
    const sueltas = []
    for (let i = 0; i < esquirlas; i++) {
      const [a, b] = grietas[i % grietas.length]
      const [x, y] = mezclar(a, b, entre(0.1, 0.9))
      const angulo = Math.atan2(y - CENTRO_LOGO[1], x - CENTRO_LOGO[0]) + entre(-0.8, 0.8)
      const viaje = separacion * entre(8, 40)
      const t = entre(0.8, 2.6)
      const inicio = entre(0, Math.PI * 2)
      const pts = [0, 1, 2].map((k) => {
        const ang = inicio + k * ((Math.PI * 2) / 3) + entre(-0.4, 0.4)
        return [x + Math.cos(ang) * t, y + Math.sin(ang) * t]
      })
      sueltas.push({
        puntos: aTexto(pts),
        tono: ['var(--faceta-3)', 'var(--faceta-4)', 'var(--faceta-5)', 'var(--faceta-6)'][Math.floor(r() * 4)],
        inicio: transformar({ escala: 0.2 }),
        final: transformar({ dx: Math.cos(angulo) * viaje, dy: Math.sin(angulo) * viaje, giro: entre(-120, 120) }),
        retraso: 0.2 + entre(0, 0.3),
      })
    }
    return { piezas, sueltas }
  }, [separacion, esquirlas, semilla])

  const animado = separacion > 0
  return (
    <svg viewBox="0 0 100 100" className={cn('overflow-visible', className)} aria-hidden="true" focusable="false">
      {dibujo.sueltas.map((e, i) => (
        <polygon
          key={`e${i}`}
          points={e.puntos}
          fill={e.tono}
          className="esquirla"
          style={{ '--inicio': e.inicio, '--final': e.final, '--retraso': `${e.retraso}s` }}
        />
      ))}
      <g stroke={fondo} strokeWidth={animado ? 1.4 : 4.5} strokeLinejoin="miter">
        {dibujo.piezas.map((p, i) => (
          <polygon
            key={i}
            points={p.puntos}
            fill={p.tono}
            className={animado ? 'pieza' : undefined}
            style={animado ? { '--final': p.final, '--retraso': `${p.retraso}s` } : undefined}
          />
        ))}
      </g>
    </svg>
  )
}

export function Logotipo({ className }) {
  return <TrianguloRoto fondo="var(--sidebar)" className={cn('size-7', className)} />
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
        relleno: `var(--faceta-${Math.round(entre(2, 5))})`,
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
