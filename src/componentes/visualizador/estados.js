/** Cómo se ve y cómo se llama cada estado de una barra. */
export const APARIENCIA = {
  vacio: { clase: 'bg-transparent', etiqueta: 'Posición vacía' },
  normal: { clase: 'bg-estado-normal', etiqueta: 'Sin procesar' },
  fuera: { clase: 'bg-estado-fuera', etiqueta: 'Fuera del tramo actual' },
  descartado: { clase: 'bg-estado-descartado', etiqueta: 'Descartado' },
  ordenado: { clase: 'bg-estado-ordenado', etiqueta: 'En su lugar' },
  activo: { clase: 'bg-estado-activo', etiqueta: 'Elemento activo' },
  pivote: { clase: 'bg-estado-pivote', etiqueta: 'Pivote' },
  comparando: { clase: 'bg-estado-comparando', etiqueta: 'Se está comparando' },
  encontrado: { clase: 'bg-estado-encontrado', etiqueta: 'Encontrado' },
}

/** Orden en que aparecen en la leyenda. */
export const ORDEN_LEYENDA = [
  'normal',
  'comparando',
  'activo',
  'pivote',
  'ordenado',
  'encontrado',
  'fuera',
  'descartado',
]

const ATENUADOS = new Set(['fuera', 'descartado', 'vacio'])

/** Texto que contrasta sobre el color de cada estado. */
export const TEXTO_SOBRE = {
  normal: 'text-foreground',
  fuera: 'text-tenue',
  descartado: 'text-tenue',
  ordenado: 'text-primary-foreground',
  activo: 'text-background',
  pivote: 'text-background',
  comparando: 'text-background',
  encontrado: 'text-background',
}

export function estaAtenuado(estado) {
  return ATENUADOS.has(estado)
}
