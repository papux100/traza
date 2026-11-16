import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function conteo(arr) {
  const max = Math.max(...arr);
  const conteos = new Array(max + 1).fill(0);        //@crear
  for (let i = 0; i < arr.length; i++) {
    conteos[arr[i]]++;                               //@contar
  }
  for (let v = 1; v <= max; v++) {
    conteos[v] += conteos[v - 1];                    //@acumular
  }
  const salida = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    conteos[arr[i]]--;                               //@ubicar
    salida[conteos[arr[i]]] = arr[i];                //@colocar
  }
  for (let i = 0; i < arr.length; i++) {
    arr[i] = salida[i];                              //@copiar
  }
  return arr;                                        //@fin
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const n = arr.length
  const max = Math.max(...entrada)
  const conteos = new Array(max + 1).fill(0)
  let salida = new Array(n).fill(null)
  let titulo = 'Conteos: cuántas veces aparece cada valor'

  const aux = (resaltar = {}) => ({
    tipo: 'conteo',
    titulo,
    celdas: conteos.map((valor, v) => ({ etiqueta: String(v), valor, estado: resaltar[v] ?? 'normal' })),
    salida: salida.slice(),
  })

  g.paso(arr, `Arreglo inicial. El mayor valor es ${max}, así que preparamos ${max + 1} casillas de conteo, de la 0 a la ${max}. No vamos a comparar ningún par de elementos.`, {
    linea: L.crear,
    auxiliar: aux(),
  })

  // Fase 1: contar.
  for (let i = 0; i < n; i++) {
    const v = arr[i].valor
    conteos[v]++
    g.paso(arr, `Leemos ${v}: sumamos uno a la casilla ${v}, que ahora vale ${conteos[v]}.`, {
      linea: L.contar,
      activo: i,
      auxiliar: aux({ [v]: 'activo' }),
      marcadores: { i },
    })
  }

  // Fase 2: acumular.
  titulo = 'Posiciones: cuántos elementos son menores o iguales a cada valor'
  for (let v = 1; v <= max; v++) {
    const antes = conteos[v]
    conteos[v] += conteos[v - 1]
    g.paso(
      arr,
      `Acumulamos: la casilla ${v} pasa de ${antes} a ${conteos[v]}. Hay ${conteos[v]} ${conteos[v] === 1 ? 'elemento menor o igual' : 'elementos menores o iguales'} a ${v}.`,
      { linea: L.acumular, auxiliar: aux({ [v]: 'activo', [v - 1]: 'comparando' }) },
    )
  }

  // Fase 3: colocar, de derecha a izquierda para conservar la estabilidad.
  for (let i = n - 1; i >= 0; i--) {
    const elemento = arr[i]
    const v = elemento.valor
    conteos[v]--
    const destino = conteos[v]
    salida[destino] = elemento
    arr[i] = null
    g.escribir()
    g.paso(
      arr,
      `Tomamos ${v} desde el final. Su casilla indica que va en la posición ${destino} de la salida; la casilla baja a ${conteos[v]} para el próximo ${v}.`,
      {
        linea: L.colocar,
        auxiliar: aux({ [v]: 'activo' }),
        porId: { [elemento.id]: 'activo' },
        marcadores: { i },
      },
    )
  }

  // Fase 4: copiar la salida al arreglo original.
  for (let i = 0; i < n; i++) {
    arr[i] = salida[i]
    g.escribir()
  }
  salida = new Array(n).fill(null)
  g.paso(arr, 'Copiamos el arreglo de salida sobre el original.', {
    linea: L.copiar,
    ordenados: indices(0, n),
    auxiliar: aux(),
  })

  g.paso(arr, 'El arreglo está ordenado, y sin haber hecho una sola comparación entre elementos.', {
    linea: L.fin,
    ordenados: indices(0, n),
    auxiliar: aux(),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'conteo',
  familia: 'ordenamiento',
  nombreFuncion: 'conteo',
  codigo,
  entradaPorDefecto: [4, 1, 3, 4, 2, 6, 1, 3],
  valorMax: 15,
  leyenda: { activo: 'Elemento o casilla en uso', comparando: 'Casilla que se suma' },
  ejecutar,
}
