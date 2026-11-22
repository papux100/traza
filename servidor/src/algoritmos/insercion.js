import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function insercion(arr) {
  for (let i = 1; i < arr.length; i++) {
    const clave = arr[i];                    //@tomar
    let j = i - 1;
    while (j >= 0 && arr[j] > clave) {       //@comparar
      arr[j + 1] = arr[j];                   //@desplazar
      j--;
    }
    arr[j + 1] = clave;                      //@colocar
  }
  return arr;                                //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()

  g.paso(arr, 'Arreglo inicial. El primer elemento, por sí solo, ya es una parte ordenada.', {
    ordenados: [0],
  })

  for (let i = 1; i < arr.length; i++) {
    const clave = arr[i]
    let j = i - 1
    // La clave "flota" sobre el hueco que van dejando los desplazamientos.
    let hueco = i
    const vista = () => {
      const copia = arr.slice()
      copia[hueco] = clave
      return copia
    }
    const ordenados = indices(0, i + 1)

    g.paso(vista(), `Tomamos ${clave.valor} y buscamos su lugar en la parte ordenada.`, {
      linea: L.tomar,
      ordenados: indices(0, i),
      activo: hueco,
      marcadores: { i },
    })

    while (j >= 0) {
      g.comparar()
      if (arr[j].valor <= clave.valor) {
        g.paso(vista(), `${arr[j].valor} no es mayor que ${clave.valor}: aquí termina la búsqueda.`, {
          linea: L.comparar,
          ordenados,
          activo: hueco,
          comparando: j,
          marcadores: { i, j },
        })
        break
      }

      g.paso(vista(), `${arr[j].valor} es mayor que ${clave.valor}: hay que recorrerlo.`, {
        linea: L.comparar,
        ordenados,
        activo: hueco,
        comparando: j,
        marcadores: { i, j },
      })

      arr[j + 1] = arr[j]
      g.escribir()
      hueco = j

      g.paso(vista(), `Desplazamos ${arr[j + 1].valor} una posición a la derecha.`, {
        linea: L.desplazar,
        ordenados,
        activo: hueco,
        marcadores: { i, j },
      })
      j--
    }

    arr[j + 1] = clave
    g.escribir()

    g.paso(arr, `Colocamos ${clave.valor} en la posición ${j + 1}.`, {
      linea: L.colocar,
      ordenados,
      marcadores: { i },
    })
  }

  g.paso(arr, 'No queda nada por insertar: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, arr.length),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'insercion',
  familia: 'ordenamiento',
  nombreFuncion: 'insercion',
  codigo,
  entradaPorDefecto: [5, 2, 9, 1, 7, 3, 8],
  leyenda: { activo: 'Elemento que se inserta', ordenado: 'Parte ordenada' },
  ejecutar,
}
