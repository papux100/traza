import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function busquedaInterpolacion(arr, objetivo) {
  let inf = 0;
  let sup = arr.length - 1;
  while (inf <= sup && objetivo >= arr[inf] && objetivo <= arr[sup]) {   //@rango
    if (arr[sup] === arr[inf]) {
      return arr[inf] === objetivo ? inf : -1;                           //@iguales
    }
    const pos = inf + Math.floor(
      ((objetivo - arr[inf]) * (sup - inf)) / (arr[sup] - arr[inf])     //@estimar
    );
    if (arr[pos] === objetivo) {                                         //@comparar
      return pos;                                                        //@encontrado
    }
    if (arr[pos] < objetivo) {
      inf = pos + 1;                                                     //@derecha
    } else {
      sup = pos - 1;                                                     //@izquierda
    }
  }
  return -1;                                                             //@noEncontrado
}
`)

function prepararEntrada(entrada) {
  return [...entrada].sort((a, b) => a - b)
}

function ejecutar(entrada, objetivo) {
  const arr = crearElementos(prepararEntrada(entrada))
  const g = crearGrabador()
  const n = arr.length
  let inf = 0
  let sup = n - 1
  const descartados = () => [...indices(0, inf), ...indices(sup + 1, n)]
  const noEsta = (motivo) => {
    g.paso(arr, `${motivo ? `${motivo} ` : ''}El ${objetivo} no está en el arreglo.`, {
      linea: L.noEncontrado,
      descartados: indices(0, n),
    })
    return { pasos: g.pasos, resultado: -1 }
  }

  g.paso(arr, `Buscamos el ${objetivo}. En vez de ir al medio, estimaremos dónde debería estar según su valor.`, {
    marcadores: { inf, sup },
  })

  while (inf <= sup) {
    g.comparar(2)
    if (objetivo < arr[inf].valor || objetivo > arr[sup].valor) {
      g.paso(arr, `El ${objetivo} queda fuera del intervalo de valores del rango, de ${arr[inf].valor} a ${arr[sup].valor}.`, {
        linea: L.rango,
        descartados: descartados(),
        comparando: [inf, sup],
        marcadores: { inf, sup },
      })
      return noEsta('No puede estar en el rango.')
    }

    if (arr[sup].valor === arr[inf].valor) {
      g.comparar(2)
      const esta = arr[inf].valor === objetivo
      g.paso(arr, `Todos los valores del rango son iguales a ${arr[inf].valor}: no hay nada que estimar.`, {
        linea: L.iguales,
        descartados: descartados(),
        comparando: inf,
        marcadores: { inf, sup },
      })
      if (!esta) return noEsta('')
      g.paso(arr, `${arr[inf].valor} es el valor buscado: encontrado en la posición ${inf}.`, {
        linea: L.iguales,
        descartados: [...indices(0, inf), ...indices(inf + 1, n)],
        encontrado: inf,
        marcadores: { inf },
      })
      return { pasos: g.pasos, resultado: inf }
    }

    const pos = inf + Math.floor(((objetivo - arr[inf].valor) * (sup - inf)) / (arr[sup].valor - arr[inf].valor))
    const fraccion = Math.round(((objetivo - arr[inf].valor) / (arr[sup].valor - arr[inf].valor)) * 100)
    g.paso(
      arr,
      `En el rango, los valores van de ${arr[inf].valor} a ${arr[sup].valor}. El ${objetivo} está a un ${fraccion} % de ese recorrido, así que estimamos la posición ${pos}.`,
      {
        linea: L.estimar,
        descartados: descartados(),
        comparando: pos,
        marcadores: { inf, pos, sup },
      },
    )

    g.comparar()
    if (arr[pos].valor === objetivo) {
      g.paso(arr, `${arr[pos].valor} es el valor buscado: encontrado en la posición ${pos}.`, {
        linea: L.encontrado,
        descartados: descartados(),
        encontrado: pos,
        marcadores: { inf, pos, sup },
      })
      return { pasos: g.pasos, resultado: pos }
    }

    g.comparar()
    if (arr[pos].valor < objetivo) {
      inf = pos + 1
      g.descartar(n - Math.max(sup - inf + 1, 0))
      g.paso(arr, `${arr[pos].valor} es menor que ${objetivo}: descartamos hasta la posición ${pos}.`, {
        linea: L.derecha,
        descartados: descartados(),
        marcadores: { inf, sup },
      })
    } else {
      sup = pos - 1
      g.descartar(n - Math.max(sup - inf + 1, 0))
      g.paso(arr, `${arr[pos].valor} es mayor que ${objetivo}: descartamos desde la posición ${pos}.`, {
        linea: L.izquierda,
        descartados: descartados(),
        marcadores: { inf, sup },
      })
    }
  }

  return noEsta('El rango quedó vacío.')
}

export default {
  id: 'busqueda-interpolacion',
  familia: 'busqueda',
  nombreFuncion: 'busquedaInterpolacion',
  codigo,
  entradaPorDefecto: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
  objetivoPorDefecto: 65,
  leyenda: {},
  prepararEntrada,
  ejecutar,
}
