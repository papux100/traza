import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function monticulos(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    hundir(arr, i, n);                                 //@construir
  }
  for (let fin = n - 1; fin > 0; fin--) {
    [arr[0], arr[fin]] = [arr[fin], arr[0]];           //@extraer
    hundir(arr, 0, fin);
  }
  return arr;                                          //@fin
}

function hundir(arr, raiz, limite) {
  while (true) {
    let mayor = raiz;
    const izq = 2 * raiz + 1;
    const der = 2 * raiz + 2;
    if (izq < limite && arr[izq] > arr[mayor]) mayor = izq;   //@compararIzq
    if (der < limite && arr[der] > arr[mayor]) mayor = der;   //@compararDer
    if (mayor === raiz) return;                               //@listo
    [arr[raiz], arr[mayor]] = [arr[mayor], arr[raiz]];        //@hundir
    raiz = mayor;
  }
}
`)

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length

  function hundir(raiz, limite) {
    const ordenados = indices(limite, total)
    while (true) {
      let mayor = raiz
      const izq = 2 * raiz + 1
      const der = 2 * raiz + 2

      if (izq < limite) {
        g.comparar()
        const gana = arr[izq].valor > arr[mayor].valor
        g.paso(
          arr,
          gana
            ? `El hijo izquierdo ${arr[izq].valor} es mayor que su padre ${arr[raiz].valor}.`
            : `El hijo izquierdo ${arr[izq].valor} no es mayor que su padre ${arr[raiz].valor}.`,
          { linea: L.compararIzq, ordenados, activo: raiz, comparando: izq, marcadores: { padre: raiz, izq } },
        )
        if (gana) mayor = izq
      }

      if (der < limite) {
        g.comparar()
        const gana = arr[der].valor > arr[mayor].valor
        g.paso(
          arr,
          gana
            ? `El hijo derecho ${arr[der].valor} es mayor que ${arr[mayor].valor}: es el mayor de los tres.`
            : `El hijo derecho ${arr[der].valor} no es mayor que ${arr[mayor].valor}.`,
          { linea: L.compararDer, ordenados, activo: raiz, comparando: der, marcadores: { padre: raiz, izq, der } },
        )
        if (gana) mayor = der
      }

      if (mayor === raiz) {
        g.paso(arr, `${arr[raiz].valor} es mayor o igual que sus hijos: este tramo ya cumple la regla del montículo.`, {
          linea: L.listo,
          ordenados,
          activo: raiz,
          marcadores: { padre: raiz },
        })
        return
      }

      const sube = arr[mayor].valor
      const baja = arr[raiz].valor
      ;[arr[raiz], arr[mayor]] = [arr[mayor], arr[raiz]]
      g.intercambiar()
      g.paso(arr, `Intercambiamos: ${sube} sube y ${baja} baja un nivel.`, {
        linea: L.hundir,
        ordenados,
        activo: mayor,
        marcadores: { padre: raiz, hijo: mayor },
      })
      raiz = mayor
    }
  }

  g.paso(arr, 'Arreglo inicial. Lo leemos como un árbol: los hijos de la posición p están en 2p + 1 y 2p + 2.')

  for (let i = Math.floor(total / 2) - 1; i >= 0; i--) {
    g.paso(arr, `Construcción: acomodamos el subárbol cuya raíz es ${arr[i].valor}, en la posición ${i}.`, {
      linea: L.construir,
      activo: i,
      marcadores: { padre: i },
    })
    hundir(i, total)
  }

  if (total > 0) {
    g.paso(arr, `El montículo está listo: el mayor, ${arr[0].valor}, quedó en la raíz.`, {
      linea: L.construir,
      activo: 0,
    })
  }

  for (let fin = total - 1; fin > 0; fin--) {
    const mayor = arr[0].valor
    ;[arr[0], arr[fin]] = [arr[fin], arr[0]]
    g.intercambiar()
    g.paso(arr, `Enviamos el mayor, ${mayor}, a la posición ${fin}. Ahí ya no se moverá, y el montículo se encoge.`, {
      linea: L.extraer,
      ordenados: indices(fin, total),
      activo: 0,
      marcadores: { fin },
    })
    hundir(0, fin)
  }

  g.paso(arr, 'Sólo queda un elemento en el montículo: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, total),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'monticulos',
  familia: 'ordenamiento',
  nombreFuncion: 'monticulos',
  codigo,
  entradaPorDefecto: [4, 9, 2, 7, 5, 8, 1],
  leyenda: { activo: 'Nodo que se acomoda' },
  ejecutar,
}
