import { listarAlgoritmos } from '../algoritmos/registro.js'

/** Como máximo, cuántos cuadros lleva una vista previa. */
export const MAX_CUADROS = 60

/**
 * Reduce la traza de un algoritmo a lo que se ve en una miniatura: la altura
 * de cada barra y su estado, paso por paso. Sin código, sin descripciones y
 * sin la zona auxiliar, así que también puede mostrarse a quien no tiene cuenta.
 */
export function vistaPrevia(algoritmo) {
  const { pasos } = algoritmo.ejecutar(algoritmo.entradaPorDefecto, algoritmo.objetivoPorDefecto)
  // En trazas largas se toma un paso de cada tantos, sin perder el último.
  const salto = Math.max(1, Math.ceil(pasos.length / MAX_CUADROS))
  const elegidos = pasos.filter((_, i) => i % salto === 0 || i === pasos.length - 1)
  return {
    familia: algoritmo.familia,
    cuadros: elegidos.map((paso) => ({
      v: paso.elementos.map((e) => (e ? e.valor : null)),
      e: paso.estados.slice(),
    })),
  }
}

let cache = null
/** Las vistas no cambian mientras el servidor está encendido: se calculan una vez. */
export function todasLasVistas() {
  cache ??= Object.fromEntries(listarAlgoritmos().map((a) => [a.id, vistaPrevia(a)]))
  return cache
}

const respuesta200 = {
  type: 'object',
  properties: {
    vistas: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          familia: { type: 'string' },
          cuadros: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                v: { type: 'array', items: { type: ['integer', 'null'] } },
                e: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
      },
    },
  },
}

/** Miniaturas animadas del catálogo: una por algoritmo, en una sola petición. */
export default async function rutasVistasPrevias(app) {
  app.get('/api/vistas-previas', { schema: { response: { 200: respuesta200 } } }, async (_peticion, respuesta) => {
    respuesta.header('cache-control', 'public, max-age=3600')
    return { vistas: todasLasVistas() }
  })
}
