import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function burbuja(arr) {
  let n = arr.length;
  let huboIntercambio = true;
  while (huboIntercambio) {
    huboIntercambio = false;                       //@pasada
    for (let j = 0; j < n - 1; j++) {
      if (arr[j] > arr[j + 1]) {                   //@comparar
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];   //@intercambiar
        huboIntercambio = true;
      }
    }
    n--;                                           //@fijar
  }
  return arr;                                      //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length
  let n = total
  let huboIntercambio = true
  let pasada = 0
  const fijos = () => indices(Math.max(n, 0), total)

  g.paso(arr, 'Arreglo inicial. En cada pasada, el mayor de los que faltan sube hasta el final.')

  while (huboIntercambio) {
    huboIntercambio = false
    pasada++

    g.paso(arr, `Pasada ${pasada}: recorremos las posiciones 0 a ${Math.max(n - 1, 0)} comparando vecinos.`, {
      linea: L.pasada,
      ordenados: fijos(),
    })

    for (let j = 0; j < n - 1; j++) {
      g.comparar()
      const mayorPrimero = arr[j].valor > arr[j + 1].valor

      g.paso(
        arr,
        mayorPrimero
          ? `${arr[j].valor} es mayor que ${arr[j + 1].valor}: están en desorden.`
          : `${arr[j].valor} no es mayor que ${arr[j + 1].valor}: se quedan como están.`,
        { linea: L.comparar, ordenados: fijos(), comparando: [j, j + 1], marcadores: { j } },
      )

      if (mayorPrimero) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        g.intercambiar()
        huboIntercambio = true

        g.paso(arr, `Intercambiamos ${arr[j + 1].valor} y ${arr[j].valor}.`, {
          linea: L.intercambiar,
          ordenados: fijos(),
          activo: [j, j + 1],
          marcadores: { j },
        })
      }
    }

    n--

    if (huboIntercambio) {
      g.paso(arr, `Fin de la pasada ${pasada}: ${arr[n]?.valor ?? ''} ya quedó en su lugar definitivo.`, {
        linea: L.fijar,
        ordenados: fijos(),
      })
    } else {
      g.paso(arr, `En la pasada ${pasada} no hubo ningún intercambio: no hace falta seguir.`, {
        linea: L.fijar,
        ordenados: fijos(),
      })
    }
  }

  g.paso(arr, 'El arreglo está ordenado.', { linea: L.fin, ordenados: indices(0, total) })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'burbuja',
  familia: 'ordenamiento',
  nombreFuncion: 'burbuja',
  codigo,
  entradaPorDefecto: [6, 3, 8, 2, 9, 4, 1],
  leyenda: { activo: 'Recién intercambiados' },
  ejecutar,
}
