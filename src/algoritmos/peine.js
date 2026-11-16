import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function peine(arr) {
  let salto = arr.length;
  let ordenado = false;
  while (!ordenado) {
    salto = Math.floor(salto / 1.3);                     //@salto
    if (salto <= 1) {
      salto = 1;
      ordenado = true;                                   //@ultimo
    }
    for (let i = 0; i + salto < arr.length; i++) {
      if (arr[i] > arr[i + salto]) {                     //@comparar
        [arr[i], arr[i + salto]] = [arr[i + salto], arr[i]];   //@intercambiar
        ordenado = false;
      }
    }
  }
  return arr;                                            //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length
  let salto = total
  let ordenado = false
  let pasadasConSaltoUno = 0

  g.paso(arr, 'Arreglo inicial. Compararemos elementos separados por un salto que se va encogiendo, dividiéndolo entre 1.3 cada vez.')

  while (!ordenado) {
    salto = Math.floor(salto / 1.3)
    if (salto <= 1) {
      salto = 1
      ordenado = true
      pasadasConSaltoUno++
      g.paso(
        arr,
        pasadasConSaltoUno === 1
          ? 'Salto de 1: ahora es burbuja normal. Si en esta pasada no hay intercambios, terminamos.'
          : 'Hubo intercambios en la pasada anterior: damos otra con salto de 1.',
        { linea: L.ultimo },
      )
    } else {
      g.paso(arr, `Nuevo salto: ${salto}. Comparamos cada elemento con el que está ${salto} posiciones adelante.`, {
        linea: L.salto,
      })
    }

    for (let i = 0; i + salto < total; i++) {
      const j = i + salto
      const otros = indices(0, total).filter((k) => k !== i && k !== j)
      g.comparar()
      const desorden = arr[i].valor > arr[j].valor

      g.paso(
        arr,
        desorden
          ? `${arr[i].valor} es mayor que ${arr[j].valor}, que está ${salto} ${salto === 1 ? 'posición' : 'posiciones'} adelante: están en desorden.`
          : `${arr[i].valor} no es mayor que ${arr[j].valor}: se quedan como están.`,
        { linea: L.comparar, fuera: salto > 1 ? otros : [], comparando: [i, j], marcadores: { i, 'i+s': j } },
      )

      if (desorden) {
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        g.intercambiar()
        ordenado = false
        g.paso(arr, `Intercambiamos ${arr[j].valor} y ${arr[i].valor}: el pequeño avanza ${salto} ${salto === 1 ? 'posición' : 'posiciones'} de un solo golpe.`, {
          linea: L.intercambiar,
          fuera: salto > 1 ? otros : [],
          activo: [i, j],
          marcadores: { i, 'i+s': j },
        })
      }
    }

  }

  g.paso(arr, 'Una pasada completa con salto de 1 sin intercambios: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, total),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'peine',
  familia: 'ordenamiento',
  nombreFuncion: 'peine',
  codigo,
  entradaPorDefecto: [8, 4, 1, 9, 6, 2, 7, 3, 5],
  leyenda: { activo: 'Recién intercambiados', fuera: 'No participa en esta comparación' },
  ejecutar,
}
