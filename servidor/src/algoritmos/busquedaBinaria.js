import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function busquedaBinaria(arr, objetivo) {
  let inf = 0;
  let sup = arr.length - 1;                    //@inicio
  while (inf <= sup) {
    const medio = inf + Math.floor((sup - inf) / 2);   //@medio
    if (arr[medio] === objetivo) {             //@comparar
      return medio;                            //@encontrado
    }
    if (arr[medio] < objetivo) {
      inf = medio + 1;                         //@derecha
    } else {
      sup = medio - 1;                         //@izquierda
    }
  }
  return -1;                                   //@noEncontrado
}
`)

/** La búsqueda binaria sólo funciona sobre datos ordenados. */
function prepararEntrada(entrada) {
  return [...entrada].sort((a, b) => a - b)
}

function ejecutar(entrada, objetivo) {
  const arr = crearElementos(prepararEntrada(entrada))
  const g = crearGrabador()
  const total = arr.length
  let inf = 0
  let sup = total - 1
  const descartados = () => [...indices(0, inf), ...indices(sup + 1, total)]

  g.paso(arr, `Buscamos el ${objetivo} en un arreglo ordenado. El rango de búsqueda es todo el arreglo.`, {
    linea: L.inicio,
    marcadores: { inf, sup },
  })

  while (inf <= sup) {
    const medio = inf + Math.floor((sup - inf) / 2)

    g.paso(arr, `El punto medio entre ${inf} y ${sup} es la posición ${medio}, donde está el ${arr[medio].valor}.`, {
      linea: L.medio,
      descartados: descartados(),
      comparando: medio,
      marcadores: { inf, med: medio, sup },
    })

    g.comparar()
    if (arr[medio].valor === objetivo) {
      g.paso(arr, `${arr[medio].valor} es el valor buscado: encontrado en la posición ${medio}.`, {
        linea: L.encontrado,
        descartados: descartados(),
        encontrado: medio,
        marcadores: { inf, med: medio, sup },
      })
      return { pasos: g.pasos, resultado: medio }
    }

    g.comparar()
    if (arr[medio].valor < objetivo) {
      const eliminados = medio - inf + 1
      inf = medio + 1
      g.descartar(total - (sup - inf + 1))
      g.paso(arr, `${arr[medio].valor} es menor que ${objetivo}: el valor sólo puede estar a la derecha. Descartamos ${eliminados} ${eliminados === 1 ? 'elemento' : 'elementos'} de un golpe.`, {
        linea: L.derecha,
        descartados: descartados(),
        marcadores: { inf, sup },
      })
    } else {
      const eliminados = sup - medio + 1
      sup = medio - 1
      g.descartar(total - (sup - inf + 1))
      g.paso(arr, `${arr[medio].valor} es mayor que ${objetivo}: el valor sólo puede estar a la izquierda. Descartamos ${eliminados} ${eliminados === 1 ? 'elemento' : 'elementos'} de un golpe.`, {
        linea: L.izquierda,
        descartados: descartados(),
        marcadores: { inf, sup },
      })
    }
  }

  g.paso(arr, `El rango de búsqueda quedó vacío: el ${objetivo} no está en el arreglo.`, {
    linea: L.noEncontrado,
    descartados: indices(0, total),
  })

  return { pasos: g.pasos, resultado: -1 }
}

export default {
  id: 'busqueda-binaria',
  familia: 'busqueda',
  nombreFuncion: 'busquedaBinaria',
  codigo,
  entradaPorDefecto: [3, 8, 12, 17, 21, 26, 30, 34, 41, 47, 52],
  objetivoPorDefecto: 41,
  leyenda: {},
  prepararEntrada,
  ejecutar,
}
