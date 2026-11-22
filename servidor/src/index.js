import { crearApp } from './app.js'
import { crearVerificador } from './auth.js'
import { leerConfiguracion } from './config.js'
import { crearConsultas } from './consultas.js'
import { crearPool } from './db.js'
import { cargarArchivoEnv } from './entorno.js'

/** Punto de entrada: lee la configuración, conecta todo y enciende el servidor. */
cargarArchivoEnv()
const config = leerConfiguracion()
const pool = crearPool(config)

const app = await crearApp({
  consultas: crearConsultas(pool),
  verificarToken: crearVerificador(config),
  origenesPermitidos: config.origenesPermitidos,
  registro: true,
})

// Al apagar el servidor, cerrar también las conexiones a la base de datos.
app.addHook('onClose', async () => {
  await pool.end()
})
for (const senal of ['SIGINT', 'SIGTERM']) {
  process.once(senal, () => app.close().then(() => process.exit(0)))
}

try {
  // 0.0.0.0 para aceptar conexiones de fuera del contenedor (lo exige Render).
  await app.listen({ port: config.puerto, host: '0.0.0.0' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
