import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function busquedaExponencial(arr, objetivo) {
  const n = arr.length;
  if (arr[0] === objetivo) return 0;               //@primero
  let i = 1;
  while (i < n && arr[i] <= objetivo) {            //@duplicar
    i *= 2;                                        //@avanzar
  }
  let inf = Math.floor(i / 2);                     //@tramo
  let sup = Math.min(i, n - 1);
  while (inf <= sup) {
    const medio = inf + Math.floor((sup - inf) / 2);   //@medio
    if (arr[medio] === objetivo) return medio;     //@comparar
    if (arr[medio] < objetivo) {
      inf = medio + 1;                             //@derecha
    } else {
      sup = medio - 1;                             //@izquierda
    }
  }
  return -1;                                       //@noEncontrado
}
`)

function prepararEntrada(entrada) {
  return [...entrada].sort((a, b) => a - b)
}

function ejecutar(entrada, objetivo) {
  const arr = crearElementos(prepararEntrada(entrada))
  const g = crearGrabador()
  const n = arr.length

  g.paso(arr, `Buscamos el ${objetivo}. Primero averiguamos hasta dónde llegar, duplicando la posición: 1, 2, 4, 8…`)

  g.comparar()
  if (arr[0].valor === objetivo) {
    g.paso(arr, `El primer elemento ya es el ${objetivo}: encontrado en la posición 0.`, {
      linea: L.primero,
      encontrado: 0,
      descartados: indices(1, n),
    })
    return { pasos: g.pasos, resultado: 0 }
  }
  g.paso(arr, `El primer elemento, ${arr[0].valor}, no es el ${objetivo}.`, {
    linea: L.primero,
    comparando: 0,
  })

  let i = 1
  while (i < n) {
    g.comparar()
    const sigue = arr[i].valor <= objetivo
    g.paso(
      arr,
      sigue
        ? `En la posición ${i} hay ${arr[i].valor}, que no es mayor que ${objetivo}: hay que ir más lejos.`
        : `En la posición ${i} hay ${arr[i].valor}, mayor que ${objetivo}: ya nos pasamos.`,
      { linea: L.duplicar, descartados: indices(0, Math.floor(i / 2)), comparando: i, marcadores: { i } },
    )
    if (!sigue) break
    i *= 2
    if (i < n) {
      g.paso(arr, `Duplicamos: ahora miramos la posición ${i}.`, {
        linea: L.avanzar,
        descartados: indices(0, Math.floor(i / 2)),
        marcadores: { i },
      })
    }
  }

  let inf = Math.floor(i / 2)
  let sup = Math.min(i, n - 1)
  const descartados = () => [...indices(0, inf), ...indices(sup + 1, n)]
  g.descartar(n - (sup - inf + 1))

  g.paso(
    arr,
    i >= n
      ? `La posición ${i} queda fuera del arreglo. Si el ${objetivo} está, está entre la ${inf} y el final: ahí aplicamos búsqueda binaria.`
      : `Si el ${objetivo} está, está entre las posiciones ${inf} y ${sup}. Ahí aplicamos búsqueda binaria.`,
    { linea: L.tramo, descartados: descartados(), marcadores: { inf, sup } },
  )

  while (inf <= sup) {
    const medio = inf + Math.floor((sup - inf) / 2)
    g.paso(arr, `Punto medio del tramo: posición ${medio}, con ${arr[medio].valor}.`, {
      linea: L.medio,
      descartados: descartados(),
      comparando: medio,
      marcadores: { inf, med: medio, sup },
    })

    g.comparar()
    if (arr[medio].valor === objetivo) {
      g.paso(arr, `${arr[medio].valor} es el valor buscado: encontrado en la posición ${medio}.`, {
        linea: L.comparar,
        descartados: descartados(),
        encontrado: medio,
        marcadores: { inf, med: medio, sup },
      })
      return { pasos: g.pasos, resultado: medio }
    }

    g.comparar()
    if (arr[medio].valor < objetivo) {
      inf = medio + 1
      g.descartar(n - Math.max(sup - inf + 1, 0))
      g.paso(arr, `${arr[medio].valor} es menor que ${objetivo}: seguimos por la derecha.`, {
        linea: L.derecha,
        descartados: descartados(),
        marcadores: { inf, sup },
      })
    } else {
      sup = medio - 1
      g.descartar(n - Math.max(sup - inf + 1, 0))
      g.paso(arr, `${arr[medio].valor} es mayor que ${objetivo}: seguimos por la izquierda.`, {
        linea: L.izquierda,
        descartados: descartados(),
        marcadores: { inf, sup },
      })
    }
  }

  g.paso(arr, `El tramo quedó vacío: el ${objetivo} no está en el arreglo.`, {
    linea: L.noEncontrado,
    descartados: indices(0, n),
  })
  return { pasos: g.pasos, resultado: -1 }
}

export default {
  id: 'busqueda-exponencial',
  familia: 'busqueda',
  nombreFuncion: 'busquedaExponencial',
  codigo,
  entradaPorDefecto: [3, 6, 11, 14, 19, 23, 28, 31, 37, 42, 46, 51, 55, 60, 66, 72],
  objetivoPorDefecto: 46,
  leyenda: {},
  prepararEntrada,
  ejecutar,
}
