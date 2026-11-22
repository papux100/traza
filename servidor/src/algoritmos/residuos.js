import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function residuos(arr) {
  const max = Math.max(...arr);
  for (let cifra = 1; Math.floor(max / cifra) > 0; cifra *= 10) {   //@pasada
    const cubetas = Array.from({ length: 10 }, () => []);
    for (let i = 0; i < arr.length; i++) {
      const digito = Math.floor(arr[i] / cifra) % 10;
      cubetas[digito].push(arr[i]);                                   //@repartir
    }
    let k = 0;
    for (const cubeta of cubetas) {
      for (const valor of cubeta) {
        arr[k++] = valor;                                             //@recoger
      }
    }
  }
  return arr;                                                         //@fin
}
`)

const NOMBRE_CIFRA = { 1: 'las unidades', 10: 'las decenas', 100: 'las centenas' }

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const n = arr.length
  const max = Math.max(...entrada)
  const cifras = String(max).length
  let cubetas = Array.from({ length: 10 }, () => [])
  let cifra = 1

  const aux = (activa = null) => ({
    tipo: 'cubetas',
    titulo: `Cubetas según la cifra de ${NOMBRE_CIFRA[cifra]}`,
    cifra,
    cifras,
    activa,
    cubetas: cubetas.map((elementos, d) => ({ etiqueta: String(d), elementos: elementos.slice() })),
  })

  g.paso(
    arr,
    `Arreglo inicial. El mayor valor, ${max}, tiene ${cifras} ${cifras === 1 ? 'cifra' : 'cifras'}: haremos ${cifras} ${cifras === 1 ? 'pasada' : 'pasadas'}, empezando por las unidades.`,
    { auxiliar: aux() },
  )

  let pasada = 0
  for (; Math.floor(max / cifra) > 0; cifra *= 10) {
    pasada++
    cubetas = Array.from({ length: 10 }, () => [])
    g.paso(arr, `Pasada ${pasada}: repartimos según la cifra de ${NOMBRE_CIFRA[cifra]}. Hay una cubeta por cada dígito, del 0 al 9.`, {
      linea: L.pasada,
      auxiliar: aux(),
    })

    for (let i = 0; i < n; i++) {
      const elemento = arr[i]
      const digito = Math.floor(elemento.valor / cifra) % 10
      cubetas[digito].push(elemento)
      arr[i] = null
      g.escribir()
      g.paso(arr, `${elemento.valor}: su cifra de ${NOMBRE_CIFRA[cifra]} es ${digito}. Va al final de la cubeta ${digito}.`, {
        linea: L.repartir,
        auxiliar: aux(digito),
        porId: { [elemento.id]: 'activo' },
        marcadores: { i },
      })
    }

    let k = 0
    for (let d = 0; d < 10; d++) {
      if (cubetas[d].length === 0) continue
      const desde = k
      const recogidos = cubetas[d].map((e) => e.valor)
      for (const elemento of cubetas[d]) {
        arr[k++] = elemento
        g.escribir()
      }
      cubetas[d] = []
      const ultimaPasada = Math.floor(max / (cifra * 10)) === 0
      g.paso(
        arr,
        `Vaciamos la cubeta ${d} en orden de llegada: ${recogidos.join(', ')} ${recogidos.length === 1 ? 'pasa a la posición' : 'pasan a las posiciones'} ${desde}${recogidos.length > 1 ? ` a ${k - 1}` : ''}.`,
        {
          linea: L.recoger,
          ...(ultimaPasada ? { ordenados: indices(0, k) } : {}),
          activo: ultimaPasada ? [] : indices(desde, k),
          auxiliar: aux(d),
        },
      )
    }
  }

  g.paso(
    arr,
    'Después de ordenar por la última cifra, el arreglo está ordenado. Cada pasada respetó el orden de la anterior entre los que empataban: por eso funciona.',
    { linea: L.fin, ordenados: indices(0, n), auxiliar: aux() },
  )

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'residuos',
  familia: 'ordenamiento',
  nombreFuncion: 'residuos',
  codigo,
  entradaPorDefecto: [53, 7, 81, 26, 4, 39, 70, 18, 56],
  leyenda: { activo: 'Elemento que se mueve' },
  ejecutar,
}
