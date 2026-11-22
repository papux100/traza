import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function mezcla(arr, inicio = 0, fin = arr.length - 1) {
  if (inicio >= fin) return arr;
  const medio = Math.floor((inicio + fin) / 2);   //@dividir
  mezcla(arr, inicio, medio);
  mezcla(arr, medio + 1, fin);

  const izq = arr.slice(inicio, medio + 1);       //@copiar
  const der = arr.slice(medio + 1, fin + 1);
  let i = 0, j = 0, k = inicio;
  while (i < izq.length && j < der.length) {
    if (izq[i] <= der[j]) {                       //@comparar
      arr[k++] = izq[i++];                        //@tomarIzq
    } else {
      arr[k++] = der[j++];                        //@tomarDer
    }
  }
  while (i < izq.length) arr[k++] = izq[i++];     //@restoIzq
  while (j < der.length) arr[k++] = der[j++];     //@restoDer
  return arr;                                     //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length

  g.paso(arr, 'Arreglo inicial. Lo partimos a la mitad una y otra vez, y luego combinamos las mitades ya ordenadas.')

  function mezclar(inicio, fin) {
    if (inicio >= fin) return
    const medio = Math.floor((inicio + fin) / 2)

    g.paso(arr, `Dividimos el tramo ${inicio} a ${fin} en dos mitades: ${inicio} a ${medio} y ${medio + 1} a ${fin}.`, {
      linea: L.dividir,
      rango: [inicio, fin],
      marcadores: { ini: inicio, med: medio, fin },
    })

    mezclar(inicio, medio)
    mezclar(medio + 1, fin)

    const izq = arr.slice(inicio, medio + 1)
    const der = arr.slice(medio + 1, fin + 1)
    let i = 0
    let j = 0
    let k = inicio
    const esUltima = inicio === 0 && fin === total - 1

    // El algoritmo real escribe sobre arr. Para dibujarlo sin elementos
    // repetidos, la vista muestra lo ya combinado seguido de lo que falta
    // de cada mitad.
    const vista = () => {
      const copia = arr.slice()
      const tramo = [...arr.slice(inicio, k), ...izq.slice(i), ...der.slice(j)]
      for (let p = 0; p < tramo.length; p++) copia[inicio + p] = tramo[p]
      return copia
    }
    const combinados = () => indices(inicio, k)
    const detalle = (extra = {}) => ({
      rango: [inicio, fin],
      [esUltima ? 'ordenados' : 'activo']: combinados(),
      marcadores: { ini: inicio, fin },
      ...extra,
    })

    g.paso(vista(), `Combinamos las mitades ${inicio} a ${medio} y ${medio + 1} a ${fin}, que ya están ordenadas.`, detalle({ linea: L.copiar }))

    while (i < izq.length && j < der.length) {
      g.comparar()
      const posIzq = k
      const posDer = k + (izq.length - i)
      const tomaIzq = izq[i].valor <= der[j].valor

      g.paso(
        vista(),
        tomaIzq
          ? `${izq[i].valor} no es mayor que ${der[j].valor}: tomamos el de la mitad izquierda.`
          : `${der[j].valor} es menor que ${izq[i].valor}: tomamos el de la mitad derecha.`,
        detalle({ linea: L.comparar, comparando: [posIzq, posDer] }),
      )

      const tomado = tomaIzq ? izq[i++] : der[j++]
      arr[k++] = tomado
      g.escribir()

      g.paso(vista(), `Escribimos ${tomado.valor} en la posición ${k - 1}.`, detalle({ linea: tomaIzq ? L.tomarIzq : L.tomarDer }))
    }

    if (i < izq.length) {
      const resto = izq.length - i
      while (i < izq.length) {
        arr[k++] = izq[i++]
        g.escribir()
      }
      g.paso(vista(), `La mitad derecha se acabó: copiamos ${resto === 1 ? 'el elemento que queda' : `los ${resto} elementos que quedan`} de la izquierda.`, detalle({ linea: L.restoIzq }))
    }

    if (j < der.length) {
      const resto = der.length - j
      while (j < der.length) {
        arr[k++] = der[j++]
        g.escribir()
      }
      g.paso(vista(), `La mitad izquierda se acabó: copiamos ${resto === 1 ? 'el elemento que queda' : `los ${resto} elementos que quedan`} de la derecha.`, detalle({ linea: L.restoDer }))
    }
  }

  mezclar(0, total - 1)

  g.paso(arr, 'La última combinación abarcó todo el arreglo: está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, total),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'mezcla',
  familia: 'ordenamiento',
  nombreFuncion: 'mezcla',
  codigo,
  entradaPorDefecto: [6, 2, 8, 4, 9, 1, 7, 3],
  leyenda: { activo: 'Ya combinado', fuera: 'Fuera del tramo actual' },
  ejecutar,
}
