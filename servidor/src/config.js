/**
 * Configuración del servidor, leída de las variables de entorno.
 * En tu computadora vienen del archivo .env; en Render, de su panel.
 */

function requerida(nombre) {
  const valor = process.env[nombre]
  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre}. Revisa tu archivo .env (usa .env.example como guía).`)
  }
  return valor
}

export function leerConfiguracion() {
  return {
    puerto: Number(process.env.PORT ?? 3000),
    // La cadena de conexión a PostgreSQL. Incluye la contraseña de la base de
    // datos, por eso sólo existe en el servidor y nunca llega al navegador.
    urlBaseDeDatos: requerida('DATABASE_URL'),
    // SSL activo salvo que se desactive a propósito (sólo para pruebas locales).
    sslBaseDeDatos: process.env.DATABASE_SSL !== 'false',
    certificadoBaseDeDatos: process.env.DATABASE_CA_CERT ?? null,
    urlSupabase: requerida('SUPABASE_URL'),
    clavePublicable: requerida('SUPABASE_PUBLISHABLE_KEY'),
    origenesPermitidos: (process.env.ORIGENES_PERMITIDOS ?? 'http://localhost:5173')
      .split(',')
      .map((origen) => origen.trim().replace(/\/$/, ''))
      .filter(Boolean),
  }
}
