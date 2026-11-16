import insercion from './insercion'
import burbuja from './burbuja'
import seleccion from './seleccion'
import shell from './shell'
import mezcla from './mezcla'
import quicksort from './quicksort'
import monticulos from './monticulos'
import busquedaLineal from './busquedaLineal'
import busquedaBinaria from './busquedaBinaria'

/**
 * Registro de algoritmos ejecutables.
 *
 * Para sumar uno nuevo basta con escribir su módulo y añadirlo aquí.
 * El reproductor y el visualizador no necesitan cambios.
 */
const lista = [
  insercion,
  burbuja,
  seleccion,
  shell,
  mezcla,
  quicksort,
  monticulos,
  busquedaLineal,
  busquedaBinaria,
]

const porId = new Map(lista.map((algoritmo) => [algoritmo.id, algoritmo]))

export function obtenerAlgoritmo(id) {
  return porId.get(id) ?? null
}

export function listarAlgoritmos() {
  return lista
}
