import { describe, expect, it } from 'vitest'
import { ESTADOS } from '@/motor/traza'
import { listarAlgoritmos } from './registro'

/** Generador pseudoaleatorio con semilla, para que las pruebas sean repetibles. */
function crearAleatorio(semilla) {
  let estado = semilla
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296
    return estado / 4294967296
  }
}

const aleatorio = crearAleatorio(377864)
const entero = (min, max) => min + Math.floor(aleatorio() * (max - min + 1))

const entradas = [
  [1],
  [2, 1],
  [1, 2, 3, 4, 5, 6],
  [6, 5, 4, 3, 2, 1],
  [3, 3, 3, 3],
  [5, 1, 5, 1, 5, 1, 2],
  ...Array.from({ length: 40 }, () => Array.from({ length: entero(2, 16) }, () => entero(1, 99))),
]

const ascendente = (a, b) => a - b

/** Evalúa el código que se muestra en la ficha, para comprobar que es real. */
function compilar(algoritmo) {
  return new Function(`${algoritmo.codigo}\nreturn ${algoritmo.nombreFuncion};`)()
}

function revisarTraza(algoritmo, pasos, entrada) {
  const lineas = algoritmo.codigo.split('\n').length
  const idsEsperados = entrada.map((_, i) => `e${i}`).sort()
  let anterior = null

  expect(pasos.length).toBeGreaterThan(1)

  for (const paso of pasos) {
    // Cada paso conserva exactamente los mismos elementos, sin repetidos.
    expect(paso.elementos.map((e) => e.id).sort()).toEqual(idsEsperados)
    expect(paso.estados).toHaveLength(entrada.length)
    for (const estado of paso.estados) expect(ESTADOS).toContain(estado)

    expect(paso.descripcion.length).toBeGreaterThan(0)
    expect(paso.descripcion).not.toMatch(/undefined|NaN/)

    if (paso.linea !== null) {
      expect(paso.linea).toBeGreaterThanOrEqual(1)
      expect(paso.linea).toBeLessThanOrEqual(lineas)
    }

    for (const marcador of paso.marcadores) {
      expect(marcador.indice).toBeGreaterThanOrEqual(0)
      expect(marcador.indice).toBeLessThan(entrada.length)
    }

    if (anterior) {
      // Cada paso es una copia: ninguno comparte arreglo con el anterior.
      expect(paso.elementos).not.toBe(anterior.elementos)
      for (const clave of Object.keys(paso.contadores)) {
        expect(paso.contadores[clave]).toBeGreaterThanOrEqual(anterior.contadores[clave])
      }
    }
    anterior = paso
  }
}

describe.each(listarAlgoritmos().filter((a) => a.familia === 'ordenamiento'))(
  'ordenamiento: $id',
  (algoritmo) => {

    it('deja el arreglo ordenado y conserva los elementos', () => {
      for (const entrada of entradas) {
        const { pasos, resultado } = algoritmo.ejecutar(entrada)
        const esperado = [...entrada].sort(ascendente)
        expect(resultado).toEqual(esperado)
        expect(pasos.at(-1).elementos.map((e) => e.valor)).toEqual(esperado)
        expect(pasos.at(-1).estados.every((estado) => estado === 'ordenado')).toBe(true)
      }
    })

    it('no modifica la entrada y el primer paso la muestra intacta', () => {
      for (const entrada of entradas) {
        const copia = [...entrada]
        const { pasos } = algoritmo.ejecutar(entrada)
        expect(entrada).toEqual(copia)
        expect(pasos[0].elementos.map((e) => e.valor)).toEqual(copia)
      }
    })

    it('genera una traza bien formada', () => {
      for (const entrada of entradas) {
        revisarTraza(algoritmo, algoritmo.ejecutar(entrada).pasos, entrada)
      }
    })

    it('el código mostrado en la ficha ordena de verdad', () => {
      const funcion = compilar(algoritmo)
      for (const entrada of entradas) {
        expect(funcion([...entrada])).toEqual([...entrada].sort(ascendente))
      }
    })

    it('la traza y el código mostrado coinciden en el orden final de elementos iguales', () => {
      // Con valores repetidos, la traza no debe inventar un orden distinto
      // al que produce el código que el visitante lee.
      const funcion = compilar(algoritmo)
      for (const entrada of entradas) {
        const etiquetados = entrada.map((valor, i) => ({ valor, id: `e${i}`, valueOf: () => valor }))
        const final = funcion(etiquetados).map((e) => e.id)
        expect(algoritmo.ejecutar(entrada).pasos.at(-1).elementos.map((e) => e.id)).toEqual(final)
      }
    })
  },
)
