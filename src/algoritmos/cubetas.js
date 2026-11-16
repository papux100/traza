import { crearElementos, crearGrabador, indices, marcarCodigo } from '@/motor/traza'

const { codigo, L } = marcarCodigo(`
function cubetas(arr) {
  const k = 5;
  const max = Math.max(...arr);
  const cubetas = Array.from({ length: k }, () => []);
  for (let i = 0; i < arr.length; i++) {
    const c = Math.floor((arr[i] * k) / (max + 1));
    cubetas[c].push(arr[i]);                         //@repartir
  }
  for (const cubeta of cubetas) {
    for (let i = 1; i < cubeta.length; i++) {
      const clave = cubeta[i];                       //@tomar
      let j = i - 1;
      while (j >= 0 && cubeta[j] > clave) {          //@comparar
        cubeta[j + 1] = cubeta[j];                   //@desplazar
        j--;
      }
      cubeta[j + 1] = clave;                         //@colocar
    }
  }
  let pos = 0;
  for (const cubeta of cubetas) {
    for (const valor of cubeta) {
      arr[pos++] = valor;                            //@recoger
    }
  }
  return arr;                                        //@fin
}
`)

const K = 5

/** Valores que caen en cada cubeta: c = floor(v * k / (max + 1)). */
function etiquetas(max) {
  return Array.from({ length: K }, (_, c) => {
    const desde = Math.max(Math.ceil((c * (max + 1)) / K), 1)
    const hasta = Math.ceil(((c + 1) * (max + 1)) / K) - 1
    if (hasta < desde) return 'vacía'
    return desde === hasta ? String(desde) : `${desde} a ${hasta}`
  })
}

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const n = arr.length
  const max = Math.max(...entrada)
  const rangos = etiquetas(max)
  const cubetas = Array.from({ length: K }, () => [])

  const aux = (activa = null, cubetaVista = null, vista = null) => ({
    tipo: 'cubetas',
    titulo: `${K} cubetas que reparten el intervalo de 1 a ${max} en partes iguales`,
    activa,
    cubetas: cubetas.map((elementos, c) => ({
      etiqueta: rangos[c],
      elementos: c === cubetaVista ? vista : elementos.slice(),
    })),
  })

  g.paso(arr, `Arreglo inicial. Repartiremos los valores en ${K} cubetas según su magnitud, y luego ordenaremos cada cubeta por separado.`, {
    auxiliar: aux(),
  })

  // Fase 1: repartir.
  for (let i = 0; i < n; i++) {
    const elemento = arr[i]
    const c = Math.floor((elemento.valor * K) / (max + 1))
    cubetas[c].push(elemento)
    arr[i] = null
    g.escribir()
    g.paso(arr, `${elemento.valor} cae en el intervalo ${rangos[c]}: va a la cubeta ${c + 1}.`, {
      linea: L.repartir,
      auxiliar: aux(c),
      porId: { [elemento.id]: 'activo' },
      marcadores: { i },
    })
  }

  // Fase 2: ordenar cada cubeta con inserción.
  for (let c = 0; c < K; c++) {
    const cubeta = cubetas[c]
    if (cubeta.length < 2) continue

    for (let i = 1; i < cubeta.length; i++) {
      const clave = cubeta[i]
      let j = i - 1
      let hueco = i
      const vista = () => {
        const copia = cubeta.slice()
        copia[hueco] = clave
        return copia
      }

      while (j >= 0) {
        g.comparar()
        const mayor = cubeta[j].valor > clave.valor
        g.paso(
          arr,
          mayor
            ? `Cubeta ${c + 1}, ordenando por inserción: ${cubeta[j].valor} es mayor que ${clave.valor}, sube un lugar.`
            : `Cubeta ${c + 1}, ordenando por inserción: ${cubeta[j].valor} no es mayor que ${clave.valor}, se queda.`,
          {
            linea: L.comparar,
            auxiliar: aux(c, c, vista()),
            porId: { [clave.id]: 'activo', [cubeta[j].id]: 'comparando' },
          },
        )
        if (!mayor) break
        cubeta[j + 1] = cubeta[j]
        g.escribir()
        hueco = j
        j--
      }
      cubeta[j + 1] = clave
      g.escribir()
      g.paso(arr, `${clave.valor} queda en su lugar dentro de la cubeta ${c + 1}.`, {
        linea: L.colocar,
        auxiliar: aux(c),
        porId: { [clave.id]: 'activo' },
      })
    }
  }

  g.paso(arr, 'Cada cubeta está ordenada, y todas las de la izquierda tienen valores menores que las de la derecha. Basta con vaciarlas en orden.', {
    linea: L.recoger,
    auxiliar: aux(),
  })

  // Fase 3: recoger.
  let pos = 0
  for (let c = 0; c < K; c++) {
    if (cubetas[c].length === 0) continue
    const desde = pos
    const valores = cubetas[c].map((e) => e.valor)
    for (const elemento of cubetas[c]) {
      arr[pos++] = elemento
      g.escribir()
    }
    cubetas[c] = []
    g.paso(
      arr,
      `Vaciamos la cubeta ${c + 1}: ${valores.join(', ')} ${valores.length === 1 ? 'pasa a la posición' : 'pasan a las posiciones'} ${desde}${valores.length > 1 ? ` a ${pos - 1}` : ''}.`,
      { linea: L.recoger, ordenados: indices(0, pos), auxiliar: aux(c) },
    )
  }

  g.paso(arr, 'Todas las cubetas se vaciaron: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, n),
    auxiliar: aux(),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'cubetas',
  familia: 'ordenamiento',
  nombreFuncion: 'cubetas',
  codigo,
  entradaPorDefecto: [29, 3, 47, 12, 38, 6, 41, 22, 15, 33],
  leyenda: { activo: 'Elemento que se mueve', comparando: 'Se compara dentro de la cubeta' },
  ejecutar,
}
