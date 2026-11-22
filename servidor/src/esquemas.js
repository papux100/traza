/**
 * Esquemas JSON de las rutas. Fastify los usa para validar lo que entra
 * (parámetros) y para dar forma a lo que sale (respuestas): un campo que no
 * esté en el esquema de respuesta no se envía.
 */

export const error = {
  type: 'object',
  properties: {
    error: { type: 'string' },
    codigo: { type: 'string' },
  },
}

const texto = { type: 'string' }
const textoONulo = { type: ['string', 'null'] }
const logicoONulo = { type: ['boolean', 'null'] }

export const algoritmo = {
  type: 'object',
  properties: {
    id: texto,
    nombre: texto,
    nombreCorto: texto,
    familia: texto,
    bloque: texto,
    intencion: texto,
    complejidad: {
      type: 'object',
      properties: { mejor: texto, promedio: texto, peor: texto },
    },
    espacio: texto,
    estable: logicoONulo,
    enSitio: logicoONulo,
    requisito: textoONulo,
    publico: { type: 'boolean' },
  },
}

export const ficha = {
  type: 'object',
  properties: {
    analogia: texto,
    comoFunciona: texto,
    requisitos: texto,
    complejidad: texto,
    usarlo: { type: 'array', items: texto },
    evitarlo: { type: 'array', items: texto },
    implementacion: { type: 'array', items: texto },
    relaciones: {
      type: 'array',
      items: { type: 'object', properties: { id: texto, texto } },
    },
  },
}

/** Un id de algoritmo: letras minúsculas y guiones, como "busqueda-binaria". */
export const parametrosId = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', pattern: '^[a-z][a-z-]{0,39}$' },
  },
}
