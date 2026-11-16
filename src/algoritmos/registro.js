import insercion from './insercion'

/**
 * Registro de algoritmos ejecutables.
 *
 * Para sumar uno nuevo basta con escribir su módulo y añadirlo aquí.
 * El reproductor y el visualizador no necesitan cambios.
 */
const lista = [
  insercion,
]

const porId = new Map(lista.map((algoritmo) => [algoritmo.id, algoritmo]))

export function obtenerAlgoritmo(id) {
  return porId.get(id) ?? null
}

export function listarAlgoritmos() {
  return lista
}
