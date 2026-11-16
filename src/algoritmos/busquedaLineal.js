import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function busquedaLineal(arr, objetivo) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === objetivo) {     //@comparar
      return i;                    //@encontrado
    }
  }
  return -1;                       //@noEncontrado
}
`)

function ejecutar(entrada, objetivo) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()

  g.paso(arr, `Buscamos el ${objetivo}. No sabemos nada del orden, así que revisamos uno por uno desde el inicio.`)

  for (let i = 0; i < arr.length; i++) {
    g.comparar()
    const descartados = indices(0, i)

    if (arr[i].valor === objetivo) {
      g.paso(arr, `${arr[i].valor} es el valor buscado: encontrado en la posición ${i}, después de revisar ${i + 1} ${i === 0 ? 'elemento' : 'elementos'}.`, {
        linea: L.encontrado,
        descartados,
        encontrado: i,
        marcadores: { i },
      })
      return { pasos: g.pasos, resultado: i }
    }

    g.paso(arr, `${arr[i].valor} no es ${objetivo}: seguimos con el siguiente.`, {
      linea: L.comparar,
      descartados,
      comparando: i,
      marcadores: { i },
    })
    g.descartar(i + 1)
  }

  g.paso(arr, `Revisamos los ${arr.length} elementos y el ${objetivo} no está.`, {
    linea: L.noEncontrado,
    descartados: indices(0, arr.length),
  })

  return { pasos: g.pasos, resultado: -1 }
}

export default {
  id: 'busqueda-lineal',
  familia: 'busqueda',
  nombreFuncion: 'busquedaLineal',
  codigo,
  entradaPorDefecto: [14, 3, 27, 8, 21, 5, 17, 11],
  objetivoPorDefecto: 21,
  leyenda: {},
  ejecutar,
}
