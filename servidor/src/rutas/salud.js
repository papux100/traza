/** Para comprobar que el servidor está vivo y llega a la base de datos. */
export default async function rutasSalud(app) {
  app.get('/api/salud', async (_peticion, respuesta) => {
    try {
      await app.consultas.comprobarConexion()
      return { estado: 'ok', baseDeDatos: 'ok' }
    } catch (err) {
      app.log.error(err, 'La base de datos no responde')
      return respuesta.code(503).send({ estado: 'error', baseDeDatos: 'sin conexión' })
    }
  })
}
