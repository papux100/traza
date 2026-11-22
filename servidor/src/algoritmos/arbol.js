import { crearElementos, crearGrabador, indices, marcarCodigo } from '../motor/traza.js'

const { codigo, L } = marcarCodigo(`
function arbol(arr) {
  let raiz = null;
  for (const valor of arr) {
    raiz = insertar(raiz, valor);                    //@insertarCada
  }
  let k = 0;
  function enOrden(nodo) {
    if (nodo === null) return;
    enOrden(nodo.izq);
    arr[k++] = nodo.valor;                           //@devolver
    enOrden(nodo.der);
  }
  enOrden(raiz);
  return arr;                                        //@fin
}

function insertar(nodo, valor) {
  if (nodo === null) {
    return { valor, izq: null, der: null };          //@crear
  }
  if (valor < nodo.valor) {                          //@comparar
    nodo.izq = insertar(nodo.izq, valor);            //@izquierda
  } else {
    nodo.der = insertar(nodo.der, valor);            //@derecha
  }
  return nodo;
}
`)

const TITULO = 'Árbol binario de búsqueda: a la izquierda de cada nodo, los menores; a la derecha, los mayores o iguales.'

function ejecutar(entrada) {
  const arr = crearElementos(entrada)
  const g = crearGrabador()
  const total = arr.length
  const nodos = []
  let raiz = null

  const aux = () => ({ tipo: 'arbol', titulo: TITULO, raiz, nodos: nodos.map((n) => ({ ...n })) })

  g.paso(arr, 'Arreglo inicial. Primero pasamos los elementos, uno por uno, a un árbol binario de búsqueda.', {
    auxiliar: aux(),
  })

  // Fase 1: insertar cada elemento en el árbol.
  for (let i = 0; i < total; i++) {
    const elemento = arr[i]

    if (raiz === null) {
      nodos.push({ elemento, izq: null, der: null, devuelto: false })
      raiz = 0
      arr[i] = null
      g.escribir()
      g.paso(arr, `${elemento.valor} es el primero: se convierte en la raíz del árbol.`, {
        linea: L.crear,
        auxiliar: aux(),
        porId: { [elemento.id]: 'activo' },
      })
      continue
    }

    let actual = raiz
    while (true) {
      const nodo = nodos[actual]
      g.comparar()
      const vaIzquierda = elemento.valor < nodo.elemento.valor
      g.paso(
        arr,
        vaIzquierda
          ? `${elemento.valor} es menor que ${nodo.elemento.valor}: bajamos por la izquierda.`
          : `${elemento.valor} no es menor que ${nodo.elemento.valor}: bajamos por la derecha.`,
        {
          linea: L.comparar,
          activo: i,
          auxiliar: aux(),
          porId: { [nodo.elemento.id]: 'comparando' },
          marcadores: { i },
        },
      )

      const lado = vaIzquierda ? 'izq' : 'der'
      if (nodo[lado] === null) {
        nodos.push({ elemento, izq: null, der: null, devuelto: false })
        nodo[lado] = nodos.length - 1
        arr[i] = null
        g.escribir()
        g.paso(
          arr,
          `El lugar ${vaIzquierda ? 'izquierdo' : 'derecho'} de ${nodo.elemento.valor} está libre: ahí colocamos ${elemento.valor}.`,
          {
            linea: vaIzquierda ? L.izquierda : L.derecha,
            auxiliar: aux(),
            porId: { [elemento.id]: 'activo' },
          },
        )
        break
      }
      actual = nodo[lado]
    }
  }

  g.paso(arr, 'Todos los elementos están en el árbol. Ahora lo recorremos en orden: subárbol izquierdo, nodo, subárbol derecho.', {
    linea: L.insertarCada,
    auxiliar: aux(),
  })

  // Fase 2: recorrido en orden, devolviendo cada valor al arreglo.
  let k = 0
  function enOrden(indice) {
    if (indice === null) return
    const nodo = nodos[indice]
    enOrden(nodo.izq)
    arr[k] = nodo.elemento
    g.escribir()
    nodo.devuelto = true
    g.paso(
      arr,
      nodo.izq === null
        ? `${nodo.elemento.valor} no tiene nada pendiente a su izquierda: es el menor que queda y va a la posición ${k}.`
        : `Ya salió todo lo que había a la izquierda de ${nodo.elemento.valor}. Ahora le toca a él: posición ${k}.`,
      {
        linea: L.devolver,
        ordenados: indices(0, k + 1),
        activo: k,
        auxiliar: aux(),
        marcadores: { k },
      },
    )
    k++
    enOrden(nodo.der)
  }
  enOrden(raiz)

  g.paso(arr, 'El recorrido en orden visitó los valores de menor a mayor: el arreglo está ordenado.', {
    linea: L.fin,
    ordenados: indices(0, total),
    auxiliar: aux(),
  })

  return { pasos: g.pasos, resultado: arr.map((e) => e.valor) }
}

export default {
  id: 'arbol',
  familia: 'ordenamiento',
  nombreFuncion: 'arbol',
  codigo,
  entradaPorDefecto: [42, 17, 68, 9, 30, 55, 81, 24],
  leyenda: { activo: 'Elemento que se mueve', comparando: 'Nodo con el que se compara', descartado: 'Ya devuelto al arreglo' },
  ejecutar,
}
