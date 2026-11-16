/**
 * Grabador de trazas.
 *
 * Un algoritmo no anima nada: se ejecuta completo y va dejando aquí una lista
 * de pasos. Cada paso es una fotografía inmutable del arreglo, con lo que hay
 * que resaltar y una descripción. El reproductor sólo recorre esa lista.
 *
 * La copia del arreglo se hace en este archivo y en ningún otro. Así ningún
 * algoritmo puede olvidarla y terminar con todos sus pasos apuntando al mismo
 * arreglo ya ordenado.
 */

/** Estados posibles de una posición, de menor a mayor prioridad visual. */
export const ESTADOS = [
  'vacio',
  'normal',
  'fuera',
  'descartado',
  'ordenado',
  'activo',
  'pivote',
  'comparando',
  'encontrado',
]

/**
 * Convierte números en elementos con identidad propia.
 * El id permite seguir a cada barra mientras cambia de posición, y distingue
 * a dos elementos con el mismo valor (necesario para hablar de estabilidad).
 */
export function crearElementos(valores) {
  return valores.map((valor, posicion) => Object.freeze({ id: `e${posicion}`, valor }))
}

/** Lista de índices consecutivos: indices(2, 5) devuelve [2, 3, 4]. */
export function indices(desde, hastaSinIncluir) {
  const lista = []
  for (let i = desde; i < hastaSinIncluir; i++) lista.push(i)
  return lista
}

export function crearGrabador() {
  const pasos = []
  const contadores = { comparaciones: 0, intercambios: 0, escrituras: 0, descartados: 0 }

  function marcar(estados, lista, estado) {
    if (lista === undefined || lista === null) return
    const posiciones = typeof lista === 'number' ? [lista] : lista
    for (const i of posiciones) {
      if (i >= 0 && i < estados.length) estados[i] = estado
    }
  }

  return {
    pasos,

    comparar(veces = 1) {
      contadores.comparaciones += veces
    },

    escribir(veces = 1) {
      contadores.escrituras += veces
    },

    /** Un intercambio son dos escrituras en el arreglo. */
    intercambiar() {
      contadores.intercambios += 1
      contadores.escrituras += 2
    },

    descartar(total) {
      contadores.descartados = total
    },

    /**
     * Captura el estado actual.
     *
     * @param {Array} elementos   el arreglo vivo del algoritmo (aquí se copia)
     * @param {string} descripcion  qué está pasando, en lenguaje llano
     * @param {object} detalle
     *   linea       línea del código mostrado que corresponde a este paso
     *   rango       [desde, hasta] del tramo en el que se trabaja
     *   fuera       posiciones que no participan en este paso
     *   descartados posiciones ya descartadas (búsqueda)
     *   ordenados   posiciones que ya están en su lugar
     *   activo      elemento que se tiene "en la mano"
     *   pivote      posición del pivote
     *   comparando  posiciones que se comparan
     *   encontrado  posición del resultado
     *   marcadores  { etiqueta: posición } para mostrar bajo las barras
     *   auxiliar    zona extra: { tipo: 'cubetas' | 'conteo' | 'arbol', ... }
     *   porId       { idDelElemento: estado } para los elementos de la zona extra
     *
     * Una posición con null en `elementos` es un hueco: ese elemento salió
     * del arreglo y está en la zona auxiliar.
     */
    paso(elementos, descripcion, detalle = {}) {
      const estados = new Array(elementos.length).fill('normal')

      if (detalle.rango) {
        const [desde, hasta] = detalle.rango
        for (let i = 0; i < estados.length; i++) {
          if (i < desde || i > hasta) estados[i] = 'fuera'
        }
      }
      marcar(estados, detalle.fuera, 'fuera')
      marcar(estados, detalle.descartados, 'descartado')
      marcar(estados, detalle.ordenados, 'ordenado')
      marcar(estados, detalle.activo, 'activo')
      marcar(estados, detalle.pivote, 'pivote')
      marcar(estados, detalle.comparando, 'comparando')
      marcar(estados, detalle.encontrado, 'encontrado')

      // Una posición sin elemento es un hueco: el elemento está en otra zona.
      for (let i = 0; i < elementos.length; i++) {
        if (elementos[i] === null || elementos[i] === undefined) estados[i] = 'vacio'
      }

      const marcadores = Object.entries(detalle.marcadores ?? {})
        .filter(([, indice]) => indice >= 0 && indice < elementos.length)
        .map(([etiqueta, indice]) => ({ etiqueta, indice }))

      pasos.push(
        Object.freeze({
          elementos: Object.freeze(elementos.map((e) => e ?? null)),
          estados: Object.freeze(estados),
          marcadores: Object.freeze(marcadores),
          rango: detalle.rango ? Object.freeze([...detalle.rango]) : null,
          linea: detalle.linea ?? null,
          descripcion,
          contadores: Object.freeze({ ...contadores }),
          auxiliar: detalle.auxiliar ? copiaCongelada(detalle.auxiliar) : null,
          estadosPorId: Object.freeze({ ...(detalle.porId ?? {}) }),
        }),
      )
    },
  }
}

/**
 * Copia profunda y congelada de una estructura auxiliar (cubetas, conteos,
 * árbol). Los elementos ya están congelados, así que se comparten tal cual.
 */
function copiaCongelada(valor) {
  if (valor === null || typeof valor !== 'object' || Object.isFrozen(valor)) return valor
  if (Array.isArray(valor)) return Object.freeze(valor.map(copiaCongelada))
  const copia = {}
  for (const [clave, interno] of Object.entries(valor)) copia[clave] = copiaCongelada(interno)
  return Object.freeze(copia)
}

/**
 * Todos los elementos presentes en un paso, estén en el arreglo principal o
 * en una zona auxiliar. Sirve para comprobar que ningún elemento se pierde
 * ni se duplica al moverse entre zonas.
 */
export function elementosDelPaso(paso) {
  const lista = paso.elementos.filter(Boolean)
  const aux = paso.auxiliar
  if (!aux) return lista
  if (aux.tipo === 'cubetas') for (const cubeta of aux.cubetas) lista.push(...cubeta.elementos)
  if (aux.tipo === 'conteo') lista.push(...aux.salida.filter(Boolean))
  if (aux.tipo === 'arbol') lista.push(...aux.nodos.filter((n) => !n.devuelto).map((n) => n.elemento))
  return lista
}

/**
 * Prepara el código que se muestra en la ficha.
 *
 * El código fuente lleva marcas al final de algunas líneas, por ejemplo
 * `//@comparar`. Esta función las quita y devuelve en qué número de línea
 * estaba cada una. Así un paso puede decir `linea: L.comparar` sin contar
 * líneas a mano, y editar el código no desincroniza el resaltado.
 */
export function marcarCodigo(fuente) {
  const L = {}
  const lineas = fuente
    .replace(/^\n/, '')
    .trimEnd()
    .split('\n')
    .map((linea, i) => {
      const marca = linea.match(/\s*\/\/@(\w+)\s*$/)
      if (!marca) return linea
      L[marca[1]] = i + 1
      return linea.slice(0, marca.index)
    })
  return { codigo: lineas.join('\n'), L }
}
