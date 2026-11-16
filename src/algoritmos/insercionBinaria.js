import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function insercionBinaria(arr) {
  for (let i = 1; i < arr.length; i++) {
    const clave = arr[i];                          //@tomar
    let inf = 0;
    let sup = i;
    while (inf < sup) {
      const medio = Math.floor((inf + sup) / 2);   //@medio
      if (arr[medio] <= clave) {                   //@comparar
        inf = medio + 1;                           //@derecha
      } else {
        sup = medio;                               //@izquierda
      }
    }
    for (let j = i; j > inf; j--) {
      arr[j] = arr[j - 1];                         //@desplazar
    }
    arr[inf] = clave;                              //@colocar
  }
  return arr;                                      //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()

  g.paso(arr, 'Arreglo inicial. Como en inserción, el primer elemento ya es una parte ordenada.', {
    ordenados: [0],
  })

  for (let i = 1; i < arr.length; i++) {
    const clave = arr[i]
    let inf = 0
    let sup = i
    const ordenados = indices(0, i)
    // Mientras buscamos, sólo cuenta el tramo [inf, sup) de la parte ordenada.
    const fueraDelTramo = () => indices(0, i).filter((k) => k < inf || k >= sup)

    g.paso(arr, `Tomamos ${clave.valor}. En lugar de recorrer la parte ordenada, buscamos su lugar partiéndola a la mitad.`, {
      linea: L.tomar,
      ordenados,
      activo: i,
      marcadores: { i },
    })

    while (inf < sup) {
      const medio = Math.floor((inf + sup) / 2)
      g.paso(arr, `El lugar de ${clave.valor} está entre las posiciones ${inf} y ${sup}. Miramos el medio: posición ${medio}, con ${arr[medio].valor}.`, {
        linea: L.medio,
        ordenados,
        fuera: fueraDelTramo(),
        activo: i,
        comparando: medio,
        marcadores: { inf, med: medio, sup },
      })

      g.comparar()
      if (arr[medio].valor <= clave.valor) {
        inf = medio + 1
        g.paso(arr, `${arr[medio].valor} no es mayor que ${clave.valor}: el lugar está a la derecha de la posición ${medio}.`, {
          linea: L.derecha,
          ordenados,
          fuera: fueraDelTramo(),
          activo: i,
          marcadores: { inf, sup },
        })
      } else {
        sup = medio
        g.paso(arr, `${arr[medio].valor} es mayor que ${clave.valor}: el lugar está en la posición ${medio} o antes.`, {
          linea: L.izquierda,
          ordenados,
          fuera: fueraDelTramo(),
          activo: i,
          marcadores: { inf, sup },
        })
      }
    }

    const desplazados = i - inf
    for (let j = i; j > inf; j--) {
      arr[j] = arr[j - 1]
      g.escribir()
    }
    arr[inf] = clave
    g.escribir()

    g.paso(
      arr,
      desplazados === 0
        ? `${clave.valor} ya estaba en su lugar, la posición ${inf}: no hay que mover nada.`
        : `Su lugar es la posición ${inf}. Para abrir espacio hay que desplazar ${desplazados} ${desplazados === 1 ? 'elemento' : 'elementos'}: la búsqueda fue rápida, pero los movimientos son los mismos que en inserción.`,
      {
        linea: desplazados === 0 ? L.colocar : L.desplazar,
        ordenados: indices(0, i + 1),
        activo: inf,
        marcadores: { i },
      },
    )
  }

  g.paso(arr, 'No queda nada por insertar: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, arr.length),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'insercion-binaria',
  familia: 'ordenamiento',
  nombreFuncion: 'insercionBinaria',
  codigo,
  entradaPorDefecto: [6, 2, 8, 3, 9, 1, 7, 4, 5],
  leyenda: { activo: 'Elemento que se inserta', fuera: 'Fuera del tramo de búsqueda' },
  ejecutar,
}
