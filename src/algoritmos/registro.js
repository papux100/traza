import insercion from './insercion'
import insercionBinaria from './insercionBinaria'
import burbuja from './burbuja'
import coctelera from './coctelera'
import seleccion from './seleccion'
import shell from './shell'
import peine from './peine'
import mezcla from './mezcla'
import quicksort from './quicksort'
import monticulos from './monticulos'
import arbol from './arbol'
import conteo from './conteo'
import residuos from './residuos'
import cubetas from './cubetas'
import busquedaLineal from './busquedaLineal'
import busquedaBinaria from './busquedaBinaria'
import busquedaSaltos from './busquedaSaltos'
import busquedaInterpolacion from './busquedaInterpolacion'
import busquedaExponencial from './busquedaExponencial'

/**
 * Registro de algoritmos ejecutables.
 *
 * Para sumar uno nuevo basta con escribir su módulo y añadirlo aquí.
 * El reproductor y el visualizador no necesitan cambios.
 */
const lista = [
  insercion,
  insercionBinaria,
  burbuja,
  coctelera,
  seleccion,
  shell,
  peine,
  mezcla,
  quicksort,
  monticulos,
  arbol,
  conteo,
  residuos,
  cubetas,
  busquedaLineal,
  busquedaBinaria,
  busquedaSaltos,
  busquedaInterpolacion,
  busquedaExponencial,
]

const porId = new Map(lista.map((algoritmo) => [algoritmo.id, algoritmo]))

export function obtenerAlgoritmo(id) {
  return porId.get(id) ?? null
}

export function listarAlgoritmos() {
  return lista
}
