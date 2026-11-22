import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function shell(arr) {
  let salto = Math.floor(arr.length / 2);
  while (salto > 0) {                              //@salto
    for (let i = salto; i < arr.length; i++) {
      const clave = arr[i];                        //@tomar
      let j = i;
      while (j >= salto && arr[j - salto] > clave) {   //@comparar
        arr[j] = arr[j - salto];                   //@desplazar
        j -= salto;
      }
      arr[j] = clave;                              //@colocar
    }
    salto = Math.floor(salto / 2);
  }
  return arr;                                      //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length

  g.paso(arr, 'Arreglo inicial. Empezamos comparando elementos lejanos y vamos acortando la distancia.')

  let salto = Math.floor(total / 2)
  while (salto > 0) {
    g.paso(
      arr,
      salto === 1
        ? 'Salto de 1: esta última vuelta es un ordenamiento por inserción normal, sobre un arreglo casi ordenado.'
        : `Salto de ${salto}: comparamos elementos separados por ${salto} posiciones.`,
      { linea: L.salto },
    )

    for (let i = salto; i < total; i++) {
      const clave = arr[i]
      let j = i
      let hueco = i
      const vista = () => {
        const copia = arr.slice()
        copia[hueco] = clave
        return copia
      }
      // Sólo participan las posiciones que están a múltiplos del salto de i.
      const fuera = indices(0, total).filter((k) => (k - i) % salto !== 0)

      g.paso(vista(), `Tomamos ${clave.valor} y lo comparamos con los que están ${salto} posiciones atrás.`, {
        linea: L.tomar,
        fuera,
        activo: hueco,
        marcadores: { i },
      })

      while (j >= salto) {
        g.comparar()
        const anterior = arr[j - salto]
        if (anterior.valor <= clave.valor) {
          g.paso(vista(), `${anterior.valor} no es mayor que ${clave.valor}: aquí se queda.`, {
            linea: L.comparar,
            fuera,
            activo: hueco,
            comparando: j - salto,
            marcadores: { i, j },
          })
          break
        }

        g.paso(vista(), `${anterior.valor} es mayor que ${clave.valor}: lo adelantamos ${salto} posiciones.`, {
          linea: L.comparar,
          fuera,
          activo: hueco,
          comparando: j - salto,
          marcadores: { i, j },
        })

        arr[j] = anterior
        g.escribir()
        hueco = j - salto
        j -= salto

        g.paso(vista(), `${anterior.valor} avanza a la posición ${j + salto}.`, {
          linea: L.desplazar,
          fuera,
          activo: hueco,
          marcadores: { i, j },
        })
      }

      arr[j] = clave
      g.escribir()

      g.paso(arr, `Colocamos ${clave.valor} en la posición ${j}.`, {
        linea: L.colocar,
        fuera,
        activo: j,
        marcadores: { i },
      })
    }

    salto = Math.floor(salto / 2)
  }

  g.paso(arr, 'Terminó la vuelta con salto de 1: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, total),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'shell',
  familia: 'ordenamiento',
  nombreFuncion: 'shell',
  codigo,
  entradaPorDefecto: [8, 3, 9, 1, 6, 2, 7, 4],
  leyenda: { activo: 'Elemento que se inserta', fuera: 'No participa en este salto' },
  ejecutar,
}
