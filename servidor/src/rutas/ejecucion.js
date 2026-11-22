import { obtenerAlgoritmo } from '../algoritmos/registro.js'
import { error, parametrosId } from '../esquemas.js'

export const MIN_ELEMENTOS = 2
export const MAX_ELEMENTOS = 16
export const VALOR_MIN = 1
export const VALOR_MAX = 99

const cuerpo = {
  type: 'object',
  additionalProperties: false,
  properties: {
    entrada: {
      type: 'array',
      minItems: MIN_ELEMENTOS,
      maxItems: MAX_ELEMENTOS,
      items: { type: 'integer', minimum: VALOR_MIN, maximum: VALOR_MAX },
    },
    objetivo: { type: 'integer', minimum: VALOR_MIN, maximum: VALOR_MAX },
  },
}

const respuesta200 = {
  type: 'object',
  properties: {
    algoritmo: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        familia: { type: 'string' },
        nombreFuncion: { type: 'string' },
        codigo: { type: 'string' },
        valorMax: { type: 'integer' },
        ordenaEntrada: { type: 'boolean' },
        leyenda: { type: 'object', additionalProperties: { type: 'string' } },
      },
    },
    entrada: { type: 'array', items: { type: 'integer' } },
    objetivo: { type: ['integer', 'null'] },
    resultado: {},
    // Cada paso lleva el arreglo, los estados y, en algunos algoritmos, una
    // zona auxiliar con forma propia; se envían tal como los produce el motor.
    pasos: { type: 'array', items: { type: 'object', additionalProperties: true } },
  },
}

/**
 * Ejecuta un algoritmo en el servidor y devuelve su traza: la lista de pasos
 * que el visualizador del navegador sólo tiene que reproducir.
 *
 * Sin `entrada`, usa los datos de ejemplo del algoritmo.
 */
export default async function rutasEjecucion(app) {
  app.post(
    '/api/algoritmos/:id/ejecucion',
    {
      schema: {
        params: parametrosId,
        body: cuerpo,
        response: { 200: respuesta200, 400: error, 401: error, 404: error },
      },
    },
    async (peticion, respuesta) => {
      const { id } = peticion.params
      const algoritmo = obtenerAlgoritmo(id)
      const enCatalogo = await app.consultas.buscarAlgoritmo(id)

      if (!algoritmo || !enCatalogo) {
        return respuesta.code(404).send({ error: 'Ese algoritmo no existe.', codigo: 'no_encontrado' })
      }

      if (!enCatalogo.publico && !(await peticion.obtenerUsuario())) {
        return respuesta
          .code(401)
          .send({ error: 'Inicia sesión para ejecutar este algoritmo.', codigo: 'requiere_cuenta' })
      }

      const esBusqueda = algoritmo.familia === 'busqueda'
      const valorMax = algoritmo.valorMax ?? VALOR_MAX
      const entrada = peticion.body?.entrada ?? algoritmo.entradaPorDefecto
      const objetivo = esBusqueda ? (peticion.body?.objetivo ?? algoritmo.objetivoPorDefecto) : null

      // Algunos algoritmos aceptan un rango menor que el general (conteo, hasta 15).
      if (entrada.some((valor) => valor > valorMax)) {
        return respuesta.code(400).send({
          error: `Este algoritmo sólo acepta valores entre ${VALOR_MIN} y ${valorMax}.`,
          codigo: 'entrada_invalida',
        })
      }

      const { pasos, resultado } = algoritmo.ejecutar(entrada, objetivo)

      return {
        algoritmo: {
          id: algoritmo.id,
          familia: algoritmo.familia,
          nombreFuncion: algoritmo.nombreFuncion,
          codigo: algoritmo.codigo,
          valorMax,
          ordenaEntrada: Boolean(algoritmo.prepararEntrada),
          leyenda: algoritmo.leyenda ?? {},
        },
        entrada,
        objetivo,
        resultado,
        pasos,
      }
    },
  )
}
