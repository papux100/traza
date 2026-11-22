import { error, ficha, parametrosId } from '../esquemas.js'

/**
 * Contenido de una ficha. Aquí está la regla del sitio: las fichas públicas
 * las ve cualquiera; las demás, sólo quien tiene sesión iniciada.
 */
export default async function rutasFichas(app) {
  app.get(
    '/api/fichas/:id',
    {
      schema: {
        params: parametrosId,
        response: {
          200: { type: 'object', properties: { ficha } },
          401: error,
          404: error,
        },
      },
    },
    async (peticion, respuesta) => {
      const resultado = await app.consultas.buscarFicha(peticion.params.id)

      if (!resultado.existe) {
        return respuesta.code(404).send({ error: 'Ese algoritmo no existe.', codigo: 'no_encontrado' })
      }

      if (!resultado.publico) {
        const usuario = await peticion.obtenerUsuario()
        if (!usuario) {
          return respuesta
            .code(401)
            .send({ error: 'Inicia sesión para ver esta ficha.', codigo: 'requiere_cuenta' })
        }
      }

      if (!resultado.ficha) {
        return respuesta.code(404).send({ error: 'Esta ficha todavía no tiene contenido.', codigo: 'sin_contenido' })
      }

      return { ficha: resultado.ficha }
    },
  )
}
