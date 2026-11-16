import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function quicksort(arr, inicio = 0, fin = arr.length - 1) {
  if (inicio >= fin) return arr;               //@base
  const pivote = arr[fin];                     //@pivote
  let i = inicio;
  for (let j = inicio; j < fin; j++) {
    if (arr[j] < pivote) {                     //@comparar
      [arr[i], arr[j]] = [arr[j], arr[i]];     //@intercambiar
      i++;
    }
  }
  [arr[i], arr[fin]] = [arr[fin], arr[i]];     //@colocar
  quicksort(arr, inicio, i - 1);               //@recursion
  quicksort(arr, i + 1, fin);
  return arr;                                  //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length
  const fijos = new Set()
  const ordenados = () => [...fijos]

  g.paso(arr, 'Arreglo inicial. Elegimos un pivote, dejamos los menores a su izquierda y repetimos en cada lado.')

  function ordenar(inicio, fin) {
    if (inicio > fin) return
    if (inicio === fin) {
      fijos.add(inicio)
      g.paso(arr, `El tramo ${inicio} tiene un solo elemento (${arr[inicio].valor}): ya está en su lugar.`, {
        linea: L.base,
        rango: [inicio, fin],
        ordenados: ordenados(),
      })
      return
    }

    const pivote = arr[fin]
    let i = inicio

    g.paso(arr, `Tramo ${inicio} a ${fin}: tomamos como pivote el último elemento, ${pivote.valor}.`, {
      linea: L.pivote,
      rango: [inicio, fin],
      ordenados: ordenados(),
      pivote: fin,
      marcadores: { i },
    })

    for (let j = inicio; j < fin; j++) {
      g.comparar()
      const esMenor = arr[j].valor < pivote.valor

      g.paso(
        arr,
        esMenor
          ? `${arr[j].valor} es menor que el pivote ${pivote.valor}: va a la zona de menores.`
          : `${arr[j].valor} no es menor que el pivote ${pivote.valor}: se queda donde está.`,
        {
          linea: L.comparar,
          rango: [inicio, fin],
          ordenados: ordenados(),
          activo: indices(inicio, i),
          pivote: fin,
          comparando: j,
          marcadores: { i, j },
        },
      )

      if (esMenor) {
        const a = arr[i].valor
        const b = arr[j].valor
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        g.intercambiar()
        i++

        g.paso(
          arr,
          i - 1 === j
            ? `${b} ya estaba al final de la zona de menores, que ahora crece una posición.`
            : `Intercambiamos ${b} con ${a} para sumarlo a la zona de menores.`,
          {
            linea: L.intercambiar,
            rango: [inicio, fin],
            ordenados: ordenados(),
            activo: indices(inicio, i),
            pivote: fin,
            marcadores: { i, j },
          },
        )
      }
    }

    ;[arr[i], arr[fin]] = [arr[fin], arr[i]]
    g.intercambiar()
    fijos.add(i)

    g.paso(arr, `Colocamos el pivote ${pivote.valor} en la posición ${i}: los menores quedan a su izquierda y ya no se moverá.`, {
      linea: L.colocar,
      rango: [inicio, fin],
      ordenados: ordenados(),
      marcadores: { i },
    })

    ordenar(inicio, i - 1)
    ordenar(i + 1, fin)
  }

  ordenar(0, total - 1)

  g.paso(arr, 'Todos los elementos fueron pivote o quedaron solos en su tramo: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, total),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'quicksort',
  familia: 'ordenamiento',
  nombreFuncion: 'quicksort',
  codigo,
  entradaPorDefecto: [6, 2, 9, 4, 8, 1, 7, 5],
  leyenda: { activo: 'Menores que el pivote', fuera: 'Fuera del tramo actual' },
  ejecutar,
}
