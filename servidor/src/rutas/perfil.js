import { error } from '../esquemas.js'

/** Datos de la cuenta con la sesión iniciada. */
export default async function rutasPerfil(app) {
  app.get(
    '/api/perfil',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              perfil: {
                type: 'object',
                properties: { id: { type: 'string' }, correo: { type: 'string' }, nombre: { type: 'string' } },
              },
            },
          },
          401: error,
        },
      },
    },
    async (peticion, respuesta) => {
      const usuario = await peticion.obtenerUsuario()
      if (!usuario) {
        return respuesta.code(401).send({ error: 'Inicia sesión para ver tu perfil.', codigo: 'requiere_cuenta' })
      }
      const perfil = await app.consultas.buscarPerfil(usuario.id)
      return {
        perfil: { id: usuario.id, correo: usuario.correo, nombre: perfil?.nombre ?? usuario.correo.split('@')[0] },
      }
    },
  )
}
