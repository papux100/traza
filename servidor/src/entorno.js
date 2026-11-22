import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Carga servidor/.env si existe. En tu computadora ahí están las variables;
 * en Render no hay archivo y las variables llegan desde su panel.
 * No reemplaza variables que ya estén definidas.
 */
export function cargarArchivoEnv() {
  const ruta = fileURLToPath(new URL('../.env', import.meta.url))
  if (existsSync(ruta)) process.loadEnvFile(ruta)
}
