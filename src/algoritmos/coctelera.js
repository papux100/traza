import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function coctelera(arr) {
  let inicio = 0;
  let fin = arr.length - 1;
  let huboIntercambio = true;
  while (huboIntercambio) {
    huboIntercambio = false;
    for (let i = inicio; i < fin; i++) {             //@ida
      if (arr[i] > arr[i + 1]) {                     //@compararIda
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]; //@intercambiarIda
        huboIntercambio = true;
      }
    }
    if (!huboIntercambio) break;                     //@sinCambiosIda
    fin--;
    huboIntercambio = false;
    for (let i = fin; i > inicio; i--) {             //@vuelta
      if (arr[i - 1] > arr[i]) {                     //@compararVuelta
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; //@intercambiarVuelta
        huboIntercambio = true;
      }
    }
    inicio++;                                        //@fijarInicio
  }
  return arr;                                        //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length
  let inicio = 0
  let fin = total - 1
  let huboIntercambio = true
  const fijos = () => [...indices(0, inicio), ...indices(fin + 1, total)]

  g.paso(arr, 'Arreglo inicial. Recorremos como en burbuja, pero alternando el sentido: de ida subimos el mayor y de vuelta bajamos el menor.')

  function comparar(a, b, lineaComparar, lineaIntercambiar, sentido) {
    g.comparar()
    const desorden = arr[a].valor > arr[b].valor
    g.paso(
      arr,
      desorden
        ? `${arr[a].valor} es mayor que ${arr[b].valor}: están en desorden.`
        : `${arr[a].valor} no es mayor que ${arr[b].valor}: se quedan como están.`,
      { linea: lineaComparar, ordenados: fijos(), comparando: [a, b], marcadores: { i: sentido === 'ida' ? a : b } },
    )
    if (desorden) {
      ;[arr[a], arr[b]] = [arr[b], arr[a]]
      g.intercambiar()
      huboIntercambio = true
      g.paso(arr, `Intercambiamos ${arr[b].valor} y ${arr[a].valor}.`, {
        linea: lineaIntercambiar,
        ordenados: fijos(),
        activo: [a, b],
        marcadores: { i: sentido === 'ida' ? a : b },
      })
    }
  }

  while (huboIntercambio) {
    huboIntercambio = false
    g.paso(arr, `Ida: recorremos de la posición ${inicio} a la ${fin}, de izquierda a derecha.`, {
      linea: L.ida,
      ordenados: fijos(),
    })
    for (let i = inicio; i < fin; i++) comparar(i, i + 1, L.compararIda, L.intercambiarIda, 'ida')

    if (!huboIntercambio) {
      g.paso(arr, 'En la ida no hubo ningún intercambio: el arreglo ya está ordenado.', {
        linea: L.sinCambiosIda,
        ordenados: fijos(),
      })
      break
    }

    fin--
    huboIntercambio = false
    g.paso(arr, `${arr[fin + 1].valor} llegó al final y queda fijo. Vuelta: recorremos de la posición ${fin} a la ${inicio}, de derecha a izquierda.`, {
      linea: L.vuelta,
      ordenados: fijos(),
    })
    for (let i = fin; i > inicio; i--) comparar(i - 1, i, L.compararVuelta, L.intercambiarVuelta, 'vuelta')

    inicio++
    g.paso(
      arr,
      huboIntercambio
        ? `${arr[inicio - 1].valor} llegó al principio y queda fijo.`
        : `En la vuelta no hubo intercambios: ya no queda nada en desorden.`,
      { linea: L.fijarInicio, ordenados: fijos() },
    )
  }

  g.paso(arr, 'El arreglo está ordenado.', { linea: L.fin, ordenados: indices(0, total) })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'coctelera',
  familia: 'ordenamiento',
  nombreFuncion: 'coctelera',
  codigo,
  entradaPorDefecto: [3, 5, 6, 7, 8, 9, 2, 1],
  leyenda: { activo: 'Recién intercambiados' },
  ejecutar,
}
