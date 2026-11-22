import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function seleccion(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;                               //@inicio
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {                 //@comparar
        min = j;                               //@nuevoMin
      }
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]]; //@intercambiar
    }
  }
  return arr;                                  //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length

  g.paso(arr, 'Arreglo inicial. En cada vuelta buscamos el menor de los que faltan.')

  for (let i = 0; i < total - 1; i++) {
    let min = i
    const ordenados = indices(0, i)

    g.paso(arr, `Vuelta ${i + 1}: suponemos que el menor es ${arr[min].valor}, el primero sin ordenar.`, {
      linea: L.inicio,
      ordenados,
      activo: min,
      marcadores: { i, min },
    })

    for (let j = i + 1; j < total; j++) {
      g.comparar()
      const esMenor = arr[j].valor < arr[min].valor

      g.paso(
        arr,
        esMenor
          ? `${arr[j].valor} es menor que ${arr[min].valor}: tenemos un nuevo mínimo.`
          : `${arr[j].valor} no es menor que ${arr[min].valor}: el mínimo no cambia.`,
        { linea: L.comparar, ordenados, activo: min, comparando: j, marcadores: { i, j, min } },
      )

      if (esMenor) {
        min = j
        g.paso(arr, `Ahora el mínimo es ${arr[min].valor}.`, {
          linea: L.nuevoMin,
          ordenados,
          activo: min,
          marcadores: { i, j, min },
        })
      }
    }

    if (min !== i) {
      const saliente = arr[i].valor
      ;[arr[i], arr[min]] = [arr[min], arr[i]]
      g.intercambiar()
      g.paso(arr, `Intercambiamos ${arr[i].valor} con ${saliente}: ${arr[i].valor} queda en la posición ${i}.`, {
        linea: L.intercambiar,
        ordenados: indices(0, i + 1),
        activo: min,
        marcadores: { i, min },
      })
    } else {
      g.paso(arr, `${arr[i].valor} ya estaba en la posición ${i}: no hace falta intercambiar.`, {
        linea: L.intercambiar,
        ordenados: indices(0, i + 1),
        marcadores: { i },
      })
    }
  }

  g.paso(arr, 'El último elemento queda en su lugar por descarte: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, total),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'seleccion',
  familia: 'ordenamiento',
  nombreFuncion: 'seleccion',
  codigo,
  entradaPorDefecto: [7, 4, 9, 2, 6, 1, 5],
  leyenda: { activo: 'Mínimo actual' },
  ejecutar,
}
