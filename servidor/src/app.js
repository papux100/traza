import Fastify from 'fastify'
import compress from '@fastify/compress'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import rutasAlgoritmos from './rutas/algoritmos.js'
import rutasEjecucion from './rutas/ejecucion.js'
import rutasFichas from './rutas/fichas.js'
import rutasPerfil from './rutas/perfil.js'
import rutasSalud from './rutas/salud.js'
import rutasVistasPrevias from './rutas/vistasPrevias.js'

/**
 * Arma la aplicación Fastify. Recibe sus dependencias (las consultas a la
 * base de datos y el verificador de sesiones) en lugar de crearlas, para que
 * las pruebas puedan sustituirlas por versiones falsas.
 */
export async function crearApp({ consultas, verificarToken, origenesPermitidos = [], registro = false }) {
  const app = Fastify({
    logger: registro,
    // En Render, las peticiones llegan a través de un proxy; así se toma la IP real.
    trustProxy: true,
  })

  app.decorate('consultas', consultas)

  await app.register(cors, {
    origin: origenesPermitidos,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  })

  // Las trazas pueden pesar cientos de KB en JSON; comprimidas, una décima parte.
  await app.register(compress, { threshold: 1024 })

  // Límite de peticiones por dirección IP, para frenar abusos.
  await app.register(rateLimit, {
    max: 120,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'Demasiadas peticiones. Espera un momento e intenta de nuevo.',
      codigo: 'demasiadas_peticiones',
    }),
  })

  /**
   * Usuario de la petición, a partir del encabezado "Authorization: Bearer <token>".
   * Se verifica sólo cuando una ruta lo necesita, y una sola vez por petición.
   */
  app.decorateRequest('usuarioVerificado', null)
  app.decorateRequest('obtenerUsuario', async function () {
    if (this.usuarioVerificado !== null) return this.usuarioVerificado || null
    const encabezado = this.headers.authorization ?? ''
    const [tipo, token] = encabezado.split(' ')
    let usuario = null
    if (tipo === 'Bearer' && token) {
      try {
        usuario = await verificarToken(token)
      } catch (err) {
        this.log.warn(err, 'No se pudo verificar el token')
      }
    }
    this.usuarioVerificado = usuario ?? false
    return usuario
  })

  app.setErrorHandler((err, peticion, respuesta) => {
    if (err.validation) {
      return respuesta.code(400).send({
        error: 'Los datos enviados no son válidos. Usa entre 2 y 16 enteros del 1 al 99.',
        codigo: 'peticion_invalida',
      })
    }
    if (err.statusCode === 400 || err.statusCode === 415) {
      return respuesta.code(err.statusCode).send({ error: 'La petición no es válida.', codigo: 'peticion_invalida' })
    }
    if (err.statusCode === 429) return respuesta.code(429).send(err)
    peticion.log.error(err)
    return respuesta.code(500).send({ error: 'Ocurrió un error en el servidor. Intenta de nuevo.', codigo: 'error_interno' })
  })

  app.setNotFoundHandler((_peticion, respuesta) =>
    respuesta.code(404).send({ error: 'Esa ruta no existe.', codigo: 'ruta_inexistente' }),
  )

  await app.register(rutasSalud)
  await app.register(rutasAlgoritmos)
  await app.register(rutasEjecucion)
  await app.register(rutasFichas)
  await app.register(rutasPerfil)
  await app.register(rutasVistasPrevias)

  return app
}
