import pg from 'pg'

/**
 * Conexión a la base de datos PostgreSQL de Supabase.
 *
 * Se usa un pool: un grupo de conexiones abiertas que se reutilizan entre
 * peticiones, en lugar de abrir una conexión nueva cada vez.
 */
export function crearPool({ urlBaseDeDatos, sslBaseDeDatos, certificadoBaseDeDatos }) {
  let ssl = false
  if (sslBaseDeDatos) {
    // Con el certificado de Supabase se verifica la identidad del servidor.
    // Sin él, la conexión sigue cifrada, pero no se comprueba el certificado.
    ssl = certificadoBaseDeDatos
      ? { ca: certificadoBaseDeDatos, rejectUnauthorized: true }
      : { rejectUnauthorized: false }
  }

  return new pg.Pool({
    connectionString: urlBaseDeDatos,
    ssl,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })
}
