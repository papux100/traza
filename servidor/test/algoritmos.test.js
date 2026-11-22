import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { listarAlgoritmos } from '../src/algoritmos/registro.js'
import { ESTADOS, elementosDelPaso, marcarCodigo } from '../src/motor/traza.js'

/** Generador pseudoaleatorio con semilla, para que las pruebas sean repetibles. */
function crearAleatorio(semilla) {
  let estado = semilla
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296
    return estado / 4294967296
  }
}

const aleatorio = crearAleatorio(321321)
const entero = (min, max) => min + Math.floor(aleatorio() * (max - min + 1))

const ENTRADAS = [
  [1],
  [2, 1],
  [1, 2, 3, 4, 5, 6],
  [6, 5, 4, 3, 2, 1],
  [3, 3, 3, 3],
  [5, 1, 5, 1, 5, 1, 2],
  ...Array.from({ length: 40 }, () => Array.from({ length: entero(2, 16) }, () => entero(1, 99))),
]

const ascendente = (a, b) => a - b

/** Ajusta las entradas al rango que admite cada algoritmo. */
function entradasPara(algoritmo) {
  if (!algoritmo.valorMax) return ENTRADAS
  return ENTRADAS.map((entrada) => entrada.map((v) => 1 + ((v - 1) % algoritmo.valorMax)))
}

/** Evalúa el código que se muestra en la ficha, para comprobar que es real. */
function compilar(algoritmo) {
  return new Function(`${algoritmo.codigo}\nreturn ${algoritmo.nombreFuncion};`)()
}

const valores = (elementos) => elementos.map((e) => e.valor)

function revisarTraza(algoritmo, pasos, entrada) {
  const lineas = algoritmo.codigo.split('\n').length
  const idsEsperados = entrada.map((_, i) => `e${i}`).sort()
  let anterior = null

  assert.ok(pasos.length > 1)

  for (const paso of pasos) {
    // Cada paso conserva los mismos elementos, sin repetidos, estén en el
    // arreglo o en una zona auxiliar.
    assert.deepEqual(elementosDelPaso(paso).map((e) => e.id).sort(), idsEsperados)
    assert.equal(paso.estados.length, entrada.length)
    for (const estado of paso.estados) assert.ok(ESTADOS.includes(estado), estado)

    assert.ok(paso.descripcion.length > 0)
    assert.doesNotMatch(paso.descripcion, /undefined|NaN/)

    if (paso.linea !== null) {
      assert.ok(paso.linea >= 1 && paso.linea <= lineas, `línea ${paso.linea}`)
    }
    for (const marcador of paso.marcadores) {
      assert.ok(marcador.indice >= 0 && marcador.indice < entrada.length)
    }

    if (anterior) {
      // Cada paso es una copia: ninguno comparte arreglo con el anterior.
      assert.notEqual(paso.elementos, anterior.elementos)
      for (const clave of Object.keys(paso.contadores)) {
        assert.ok(paso.contadores[clave] >= anterior.contadores[clave], clave)
      }
    }
    anterior = paso
  }
}

for (const algoritmo of listarAlgoritmos().filter((a) => a.familia === 'ordenamiento')) {
  describe(`ordenamiento: ${algoritmo.id}`, () => {
    const entradas = entradasPara(algoritmo)

    it('deja el arreglo ordenado y conserva los elementos', () => {
      for (const entrada of entradas) {
        const { pasos, resultado } = algoritmo.ejecutar(entrada)
        const esperado = [...entrada].sort(ascendente)
        assert.deepEqual(resultado, esperado)
        assert.deepEqual(valores(pasos.at(-1).elementos), esperado)
        assert.ok(pasos.at(-1).estados.every((estado) => estado === 'ordenado'))
      }
    })

    it('no modifica la entrada y el primer paso la muestra intacta', () => {
      for (const entrada of entradas) {
        const copia = [...entrada]
        const { pasos } = algoritmo.ejecutar(entrada)
        assert.deepEqual(entrada, copia)
        assert.deepEqual(valores(pasos[0].elementos), copia)
      }
    })

    it('genera una traza bien formada', () => {
      for (const entrada of entradas) revisarTraza(algoritmo, algoritmo.ejecutar(entrada).pasos, entrada)
    })

    it('el código mostrado en la ficha ordena de verdad', () => {
      const funcion = compilar(algoritmo)
      for (const entrada of entradas) assert.deepEqual(funcion([...entrada]), [...entrada].sort(ascendente))
    })

    it('la traza y el código mostrado coinciden en el orden final de elementos iguales', () => {
      const funcion = compilar(algoritmo)
      for (const entrada of entradas) {
        const etiquetados = entrada.map((valor, i) => ({
          valor,
          id: `e${i}`,
          valueOf: () => valor,
          toString: () => String(valor),
        }))
        const final = funcion(etiquetados).map((e) => e.id)
        assert.deepEqual(algoritmo.ejecutar(entrada).pasos.at(-1).elementos.map((e) => e.id), final)
      }
    })
  })
}

for (const algoritmo of listarAlgoritmos().filter((a) => a.familia === 'busqueda')) {
  describe(`búsqueda: ${algoritmo.id}`, () => {
    const preparar = algoritmo.prepararEntrada ?? ((entrada) => entrada)

    it('encuentra los valores presentes e informa los ausentes', () => {
      const funcion = compilar(algoritmo)
      for (const entrada of ENTRADAS) {
        const preparada = preparar(entrada)
        for (const objetivo of [...new Set(entrada), 0, 100, entero(1, 99)]) {
          const { pasos, resultado } = algoritmo.ejecutar(entrada, objetivo)
          const ultimo = pasos.at(-1)

          if (preparada.includes(objetivo)) {
            assert.equal(preparada[resultado], objetivo)
            assert.equal(ultimo.estados[resultado], 'encontrado')
          } else {
            assert.equal(resultado, -1)
            assert.ok(!ultimo.estados.includes('encontrado'))
            assert.ok(ultimo.estados.every((estado) => estado === 'descartado'))
          }

          // El código mostrado devuelve lo mismo que la traza.
          assert.equal(funcion([...preparada], objetivo), resultado)
          revisarTraza(algoritmo, pasos, entrada)
        }
      }
    })
  })
}

describe('marcarCodigo', () => {
  it('quita las marcas y recuerda en qué línea estaban', () => {
    const { codigo, L } = marcarCodigo('\nfunction f() {\n  return 1;   //@fin\n}\n')
    assert.equal(codigo, 'function f() {\n  return 1;\n}')
    assert.deepEqual(L, { fin: 2 })
  })
})
