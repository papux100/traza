/**
 * Datos del catálogo: lo que se muestra de cada algoritmo en el menú,
 * la portada, la tabla comparativa y el encabezado de su ficha.
 *
 * Aquí no hay lógica, sólo información. Si algún día el sitio tiene
 * backend, este archivo es lo que pasaría a servirse desde una API.
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

export const ALGORITMOS = [
  {
    id: 'insercion',
    nombre: 'Ordenamiento por inserción',
    nombreCorto: 'Inserción',
    familia: 'ordenamiento',
    bloque: 'cuadraticos',
    disponible: true,
    intencion:
      'Toma los elementos uno por uno y encaja cada uno en su lugar dentro de la parte que ya está ordenada.',
    complejidad: { mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)' },
    espacio: 'O(1)',
    estable: true,
    enSitio: true,
  },
  {
    id: 'insercion-binaria',
    nombre: 'Inserción binaria',
    nombreCorto: 'Inserción binaria',
    familia: 'ordenamiento',
    bloque: 'cuadraticos',
    disponible: true,
    intencion:
      'Igual que inserción, pero encuentra el lugar de cada elemento con búsqueda binaria en vez de recorrer la parte ordenada.',
    complejidad: { mejor: 'O(n log n)', promedio: 'O(n²)', peor: 'O(n²)' },
    espacio: 'O(1)',
    estable: true,
    enSitio: true,
  },
  {
    id: 'burbuja',
    nombre: 'Ordenamiento de burbuja',
    nombreCorto: 'Burbuja',
    familia: 'ordenamiento',
    bloque: 'cuadraticos',
    disponible: true,
    intencion:
      'Compara parejas de vecinos y las intercambia si están en desorden, pasada tras pasada, hasta que no queda nada que intercambiar.',
    complejidad: { mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)' },
    espacio: 'O(1)',
    estable: true,
    enSitio: true,
  },
  {
    id: 'coctelera',
    nombre: 'Ordenamiento de coctelera',
    nombreCorto: 'Coctelera',
    familia: 'ordenamiento',
    bloque: 'cuadraticos',
    disponible: true,
    intencion:
      'Burbuja en ambos sentidos: de ida lleva el mayor al final y de vuelta lleva el menor al principio.',
    complejidad: { mejor: 'O(n)', promedio: 'O(n²)', peor: 'O(n²)' },
    espacio: 'O(1)',
    estable: true,
    enSitio: true,
  },
  {
    id: 'seleccion',
    nombre: 'Ordenamiento por selección',
    nombreCorto: 'Selección',
    familia: 'ordenamiento',
    bloque: 'cuadraticos',
    disponible: true,
    intencion:
      'Busca el menor de los elementos que faltan y lo coloca al principio. Repite con el resto.',
    complejidad: { mejor: 'O(n²)', promedio: 'O(n²)', peor: 'O(n²)' },
    espacio: 'O(1)',
    estable: false,
    enSitio: true,
  },
  {
    id: 'shell',
    nombre: 'Ordenamiento Shell',
    nombreCorto: 'Shell',
    familia: 'ordenamiento',
    bloque: 'intervalos',
    disponible: true,
    intencion:
      'Aplica inserción entre elementos separados por un salto, y va reduciendo el salto hasta llegar a uno.',
    complejidad: { mejor: 'O(n log n)', promedio: 'Depende de los saltos', peor: 'O(n²)' },
    espacio: 'O(1)',
    estable: false,
    enSitio: true,
  },
  {
    id: 'peine',
    nombre: 'Ordenamiento de peine',
    nombreCorto: 'Peine',
    familia: 'ordenamiento',
    bloque: 'intervalos',
    disponible: true,
    intencion:
      'Burbuja que compara elementos lejanos y va acortando la distancia, dividiéndola entre 1.3 en cada pasada.',
    complejidad: { mejor: 'O(n log n)', promedio: 'Ω(n²/2ᵖ)', peor: 'O(n²)' },
    espacio: 'O(1)',
    estable: false,
    enSitio: true,
  },
  {
    id: 'mezcla',
    nombre: 'Ordenamiento por mezcla',
    nombreCorto: 'Mezcla',
    familia: 'ordenamiento',
    bloque: 'eficientes',
    disponible: true,
    intencion:
      'Parte el arreglo a la mitad, ordena cada mitad por separado y combina las dos mitades ordenadas en una sola.',
    complejidad: { mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n log n)' },
    espacio: 'O(n)',
    estable: true,
    enSitio: false,
  },
  {
    id: 'quicksort',
    nombre: 'Quicksort',
    nombreCorto: 'Quicksort',
    familia: 'ordenamiento',
    bloque: 'eficientes',
    disponible: true,
    intencion:
      'Elige un pivote, deja a su izquierda los menores y a su derecha los demás, y repite lo mismo en cada lado.',
    complejidad: { mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n²)' },
    espacio: 'O(log n)',
    estable: false,
    enSitio: true,
  },
  {
    id: 'monticulos',
    nombre: 'Ordenamiento por montículos',
    nombreCorto: 'Montículos',
    familia: 'ordenamiento',
    bloque: 'eficientes',
    disponible: true,
    intencion:
      'Organiza el arreglo como un montículo, donde el mayor siempre está arriba, y va extrayendo ese mayor hacia el final.',
    complejidad: { mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n log n)' },
    espacio: 'O(1)',
    estable: false,
    enSitio: true,
  },
  {
    id: 'arbol',
    nombre: 'Ordenamiento por árbol',
    nombreCorto: 'Árbol',
    familia: 'ordenamiento',
    bloque: 'eficientes',
    disponible: true,
    intencion:
      'Inserta todos los elementos en un árbol binario de búsqueda y los recupera recorriéndolo en orden.',
    complejidad: { mejor: 'O(n log n)', promedio: 'O(n log n)', peor: 'O(n²)' },
    espacio: 'O(n)',
    estable: true,
    enSitio: false,
  },
  {
    id: 'conteo',
    nombre: 'Ordenamiento por conteo',
    nombreCorto: 'Por conteo',
    familia: 'ordenamiento',
    bloque: 'sin-comparaciones',
    disponible: true,
    intencion:
      'Cuenta cuántas veces aparece cada valor y, con esos conteos, calcula directamente la posición final de cada elemento.',
    complejidad: { mejor: 'O(n + k)', promedio: 'O(n + k)', peor: 'O(n + k)' },
    espacio: 'O(n + k)',
    estable: true,
    enSitio: false,
  },
  {
    id: 'residuos',
    nombre: 'Ordenamiento por residuos',
    nombreCorto: 'Por residuos',
    familia: 'ordenamiento',
    bloque: 'sin-comparaciones',
    disponible: true,
    intencion:
      'Ordena cifra por cifra, de las unidades hacia arriba, repartiendo los elementos en diez cubetas en cada pasada.',
    complejidad: { mejor: 'O(d·(n + b))', promedio: 'O(d·(n + b))', peor: 'O(d·(n + b))' },
    espacio: 'O(n + b)',
    estable: true,
    enSitio: false,
  },
  {
    id: 'cubetas',
    nombre: 'Ordenamiento por cubetas',
    nombreCorto: 'Por cubetas',
    familia: 'ordenamiento',
    bloque: 'sin-comparaciones',
    disponible: true,
    intencion:
      'Reparte los elementos en cubetas según su magnitud, ordena cada cubeta por separado y las vacía en orden.',
    complejidad: { mejor: 'O(n + k)', promedio: 'O(n + k)', peor: 'O(n²)' },
    espacio: 'O(n + k)',
    estable: true,
    enSitio: false,
  },
  {
    id: 'busqueda-lineal',
    nombre: 'Búsqueda lineal',
    nombreCorto: 'Lineal',
    familia: 'busqueda',
    bloque: 'busqueda',
    disponible: true,
    intencion:
      'Revisa los elementos uno por uno, desde el inicio, hasta encontrar el valor o llegar al final.',
    complejidad: { mejor: 'O(1)', promedio: 'O(n)', peor: 'O(n)' },
    espacio: 'O(1)',
    requisito: 'Ninguno',
  },
  {
    id: 'busqueda-binaria',
    nombre: 'Búsqueda binaria',
    nombreCorto: 'Binaria',
    familia: 'busqueda',
    bloque: 'busqueda',
    disponible: true,
    intencion:
      'Mira el elemento del medio y descarta la mitad donde el valor no puede estar. Repite con la mitad que queda.',
    complejidad: { mejor: 'O(1)', promedio: 'O(log n)', peor: 'O(log n)' },
    espacio: 'O(1)',
    requisito: 'Datos ordenados',
  },
  {
    id: 'busqueda-saltos',
    nombre: 'Búsqueda por saltos',
    nombreCorto: 'Por saltos',
    familia: 'busqueda',
    bloque: 'busqueda',
    disponible: false,
    intencion: 'Avanza a brincos de tamaño fijo y luego retrocede linealmente.',
  },
  {
    id: 'busqueda-interpolacion',
    nombre: 'Búsqueda por interpolación',
    nombreCorto: 'Por interpolación',
    familia: 'busqueda',
    bloque: 'busqueda',
    disponible: false,
    intencion: 'Estima dónde debería estar el valor según su magnitud.',
  },
  {
    id: 'busqueda-exponencial',
    nombre: 'Búsqueda exponencial',
    nombreCorto: 'Exponencial',
    familia: 'busqueda',
    bloque: 'busqueda',
    disponible: false,
    intencion: 'Duplica el índice hasta pasarse y termina con búsqueda binaria.',
  },
]

const porId = new Map(ALGORITMOS.map((algoritmo) => [algoritmo.id, algoritmo]))

export const DISPONIBLES = ALGORITMOS.filter((algoritmo) => algoritmo.disponible)

export function obtenerDatos(id) {
  return porId.get(id) ?? null
}

export function obtenerBloque(id) {
  return BLOQUES.find((bloque) => bloque.id === id) ?? null
}

export function obtenerFamilia(id) {
  return FAMILIAS.find((familia) => familia.id === id) ?? null
}

export function algoritmosDelBloque(bloqueId) {
  return ALGORITMOS.filter((algoritmo) => algoritmo.bloque === bloqueId)
}

export function rutaDe(id) {
  return `/algoritmos/${id}`
}
