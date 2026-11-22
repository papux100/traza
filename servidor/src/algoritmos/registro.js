import insercion from './insercion.js'
import insercionBinaria from './insercionBinaria.js'
import burbuja from './burbuja.js'
import coctelera from './coctelera.js'
import seleccion from './seleccion.js'
import shell from './shell.js'
import peine from './peine.js'
import mezcla from './mezcla.js'
import quicksort from './quicksort.js'
import monticulos from './monticulos.js'
import arbol from './arbol.js'
import conteo from './conteo.js'
import residuos from './residuos.js'
import cubetas from './cubetas.js'
import busquedaLineal from './busquedaLineal.js'
import busquedaBinaria from './busquedaBinaria.js'
import busquedaSaltos from './busquedaSaltos.js'
import busquedaInterpolacion from './busquedaInterpolacion.js'
import busquedaExponencial from './busquedaExponencial.js'

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
