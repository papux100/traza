/**
 * Estructura fija del catálogo: familias y bloques.
 *
 * Los algoritmos y el contenido de sus fichas ya no viven aquí: se leen de la
 * base de datos de Supabase (ver src/servicios/api.js y supabase/02-datos.sql).
 */

export const FAMILIAS = [
  {
    id: 'ordenamiento',
    nombre: 'Ordenamiento',
    descripcion: 'Reacomodan los elementos de un arreglo de menor a mayor.',
  },
  {
    id: 'busqueda',
    nombre: 'Búsqueda',
    descripcion: 'Localizan un valor dentro de un arreglo, o confirman que no está.',
  },
]

export const BLOQUES = [
  {
    id: 'cuadraticos',
    familia: 'ordenamiento',
    nombre: 'Cuadráticos',
    descripcion: 'Los más simples. Comparan vecinos, así que cada elemento avanza de una posición en una.',
  },
  {
    id: 'intervalos',
    familia: 'ordenamiento',
    nombre: 'Mejoras por intervalos',
    descripcion: 'La misma idea de los cuadráticos, pero comparando elementos lejanos y acortando la distancia poco a poco.',
  },
  {
    id: 'eficientes',
    familia: 'ordenamiento',
    nombre: 'Eficientes',
    descripcion: 'Dividen el problema o se apoyan en una estructura de datos para bajar a n log n.',
  },
  {
    id: 'sin-comparaciones',
    familia: 'ordenamiento',
    nombre: 'Sin comparaciones',
    descripcion: 'Ordenan sin preguntar cuál elemento es mayor, aprovechando lo que se sabe de los datos.',
  },
  {
    id: 'busqueda',
    familia: 'busqueda',
    nombre: 'Búsqueda en arreglos',
    descripcion: 'El arreglo no cambia: sólo se van descartando las zonas donde el valor no puede estar.',
  },
]

export function obtenerBloque(id) {
  return BLOQUES.find((bloque) => bloque.id === id) ?? null
}

export function obtenerFamilia(id) {
  return FAMILIAS.find((familia) => familia.id === id) ?? null
}

export function algoritmosDelBloque(algoritmos, bloqueId) {
  return algoritmos.filter((algoritmo) => algoritmo.bloque === bloqueId)
}

export function rutaDe(id) {
  return `/algoritmos/${id}`
}
