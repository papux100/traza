import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function busquedaSaltos(arr, objetivo) {
  const n = arr.length;
  const salto = Math.floor(Math.sqrt(n));                    //@salto
  let anterior = 0;
  let actual = salto;
  while (anterior < n && arr[Math.min(actual, n) - 1] < objetivo) {   //@saltar
    anterior = actual;                                       //@avanzar
    actual += salto;
  }
  for (let i = anterior; i < Math.min(actual, n); i++) {
    if (arr[i] === objetivo) {                               //@comparar
      return i;                                              //@encontrado
    }
  }
  return -1;                                                 //@noEncontrado
}
`)

function prepararEntrada(entrada) {
  return [...entrada].sort((a, b) => a - b)
}

function ejecutar(entrada, objetivo) {
  const arr = crearElementos(prepararEntrada(entrada))
  const g = crearGrabador()
  const n = arr.length
  const salto = Math.floor(Math.sqrt(n))
  let anterior = 0
  let actual = salto

  g.paso(arr, `Buscamos el ${objetivo}. Con ${n} elementos, saltaremos de ${salto} en ${salto}: la raíz cuadrada de ${n}, redondeada hacia abajo.`, {
    linea: L.salto,
  })

  while (anterior < n) {
    const fin = Math.min(actual, n) - 1
    g.comparar()
    const sigue = arr[fin].valor < objetivo
    g.paso(
      arr,
      sigue
        ? `El bloque termina en la posición ${fin} con ${arr[fin].valor}, que es menor que ${objetivo}: el valor no puede estar en este bloque.`
        : `El bloque termina en la posición ${fin} con ${arr[fin].valor}, que no es menor que ${objetivo}: si el valor está, está en este bloque.`,
      {
        linea: L.saltar,
        descartados: indices(0, anterior),
        comparando: fin,
        marcadores: { ant: anterior, fin },
      },
    )
    if (!sigue) break
    anterior = actual
    actual += salto
    g.descartar(Math.min(anterior, n))
    if (anterior < n) {
      g.paso(arr, `Saltamos al siguiente bloque, que empieza en la posición ${anterior}.`, {
        linea: L.avanzar,
        descartados: indices(0, anterior),
        marcadores: { ant: anterior },
      })
    }
  }

  if (anterior >= n) {
    g.paso(arr, `Llegamos al final: todos los bloques terminan en valores menores que ${objetivo}, así que no está.`, {
      linea: L.noEncontrado,
      descartados: indices(0, n),
    })
    return { pasos: g.pasos, resultado: -1 }
  }

  for (let i = anterior; i < Math.min(actual, n); i++) {
    g.comparar()
    if (arr[i].valor === objetivo) {
      g.paso(arr, `Dentro del bloque revisamos uno por uno: ${arr[i].valor} es el valor buscado, en la posición ${i}.`, {
        linea: L.encontrado,
        descartados: [...indices(0, i), ...indices(Math.min(actual, n), n)],
        encontrado: i,
        marcadores: { i },
      })
      return { pasos: g.pasos, resultado: i }
    }
    g.paso(arr, `Dentro del bloque revisamos uno por uno: ${arr[i].valor} no es ${objetivo}.`, {
      linea: L.comparar,
      descartados: [...indices(0, i), ...indices(Math.min(actual, n), n)],
      comparando: i,
      marcadores: { i },
    })
    g.descartar(n - (Math.min(actual, n) - i - 1))
  }

  g.paso(arr, `Revisamos el bloque completo y el ${objetivo} no está.`, {
    linea: L.noEncontrado,
    descartados: indices(0, n),
  })
  return { pasos: g.pasos, resultado: -1 }
}

export default {
  id: 'busqueda-saltos',
  familia: 'busqueda',
  nombreFuncion: 'busquedaSaltos',
  codigo,
  entradaPorDefecto: [2, 5, 9, 13, 18, 21, 26, 30, 34, 39, 43, 47, 52, 58, 63, 70],
  objetivoPorDefecto: 43,
  leyenda: {},
  prepararEntrada,
  ejecutar,
}
