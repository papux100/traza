import { algoritmo, error } from '../esquemas.js'

/** Catálogo completo. Es público: cualquiera ve qué algoritmos existen. */
export default async function rutasAlgoritmos(app) {
  app.get(
    '/api/algoritmos',
    {
      schema: {
        response: {
          200: { type: 'object', properties: { algoritmos: { type: 'array', items: algoritmo } } },
          500: error,
        },
      },
    },
    async () => ({ algoritmos: await app.consultas.listarAlgoritmos() }),
  )
}
