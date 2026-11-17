import { supabase, supabaseConfigurado } from '@/lib/supabase'

/**
 * Todo lo que el sitio le pide al backend pasa por este archivo.
 * Los componentes no llaman a Supabase directamente: llaman a estas funciones,
 * igual que en la Pokédex se llamaba a la PokeAPI desde el store.
 */

export class ErrorApi extends Error {}

function cliente() {
  if (!supabaseConfigurado) {
    throw new ErrorApi(
      'Falta configurar la conexión con Supabase. Crea el archivo .env.local con VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY y reinicia pnpm dev.',
    )
  }
  return supabase
}

/** Mensajes de Supabase traducidos a algo que el usuario pueda entender. */
const MENSAJES = {
  invalid_credentials: 'El correo o la contraseña no son correctos.',
  user_already_exists: 'Ya existe una cuenta con ese correo. Inicia sesión.',
  email_exists: 'Ya existe una cuenta con ese correo. Inicia sesión.',
  weak_password: 'La contraseña es demasiado débil. Usa al menos 8 caracteres.',
  email_address_invalid: 'Ese correo no es válido.',
  validation_failed: 'Revisa el correo y la contraseña.',
  email_not_confirmed: 'Tu cuenta todavía no está confirmada. Revisa tu correo.',
  over_email_send_rate_limit: 'Se hicieron demasiados intentos. Espera unos minutos.',
  over_request_rate_limit: 'Se hicieron demasiados intentos. Espera unos minutos.',
  signup_disabled: 'El registro de cuentas nuevas está desactivado.',
}

function traducir(error) {
  if (error instanceof ErrorApi) return error
  if (MENSAJES[error?.code]) return new ErrorApi(MENSAJES[error.code])
  const texto = String(error?.message ?? '')
  if (/invalid login credentials/i.test(texto)) return new ErrorApi(MENSAJES.invalid_credentials)
  if (/already registered/i.test(texto)) return new ErrorApi(MENSAJES.user_already_exists)
  const minimo = texto.match(/at least (\d+) characters/i)
  if (minimo) return new ErrorApi(`La contraseña debe tener al menos ${minimo[1]} caracteres.`)
  if (/failed to fetch|network/i.test(texto)) {
    return new ErrorApi('No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.')
  }
  return new ErrorApi('Ocurrió un error inesperado. Intenta de nuevo.')
}

async function intentar(operacion) {
  try {
    const { data, error } = await operacion()
    if (error) throw error
    return data
  } catch (error) {
    throw traducir(error)
  }
}

/* ---------- Catálogo ---------- */

/** Convierte una fila de la tabla `algoritmos` al formato que usa la interfaz. */
function aAlgoritmo(fila) {
  return {
    id: fila.id,
    nombre: fila.nombre,
    nombreCorto: fila.nombre_corto,
    familia: fila.familia,
    bloque: fila.bloque,
    intencion: fila.intencion,
    complejidad: { mejor: fila.complejidad_mejor, promedio: fila.complejidad_promedio, peor: fila.complejidad_peor },
    espacio: fila.espacio,
    estable: fila.estable,
    enSitio: fila.en_sitio,
    requisito: fila.requisito,
    publico: fila.publico,
  }
}

function aFicha(fila) {
  return {
    analogia: fila.analogia,
    comoFunciona: fila.como_funciona,
    requisitos: fila.requisitos,
    complejidad: fila.complejidad,
    usarlo: fila.usarlo,
    evitarlo: fila.evitarlo,
    implementacion: fila.implementacion,
    relaciones: fila.relaciones,
  }
}

export async function obtenerAlgoritmos() {
  const filas = await intentar(() => cliente().from('algoritmos').select('*').order('orden'))
  return filas.map(aAlgoritmo)
}

/**
 * Devuelve la ficha, o null si no existe o si las reglas de acceso no
 * permiten leerla (por ejemplo, una ficha privada sin sesión iniciada).
 */
export async function obtenerFicha(id) {
  const fila = await intentar(() => cliente().from('fichas').select('*').eq('algoritmo_id', id).maybeSingle())
  return fila ? aFicha(fila) : null
}

/* ---------- Cuentas ---------- */

export async function registrar({ nombre, correo, contrasena }) {
  const datos = await intentar(() =>
    cliente().auth.signUp({ email: correo, password: contrasena, options: { data: { nombre } } }),
  )
  // Si el proyecto exige confirmar el correo, Supabase crea la cuenta sin sesión.
  return { requiereConfirmacion: !datos.session }
}

export async function iniciarSesion({ correo, contrasena }) {
  await intentar(() => cliente().auth.signInWithPassword({ email: correo, password: contrasena }))
}

export async function cerrarSesion() {
  await intentar(() => cliente().auth.signOut())
}

export async function obtenerPerfil(id) {
  return intentar(() => cliente().from('perfiles').select('nombre').eq('id', id).maybeSingle())
}

/**
 * Avisa cada vez que cambia la sesión (al cargar la página, al entrar y al
 * salir). Devuelve una función para dejar de escuchar.
 */
export function escucharSesion(alCambiar) {
  if (!supabaseConfigurado) {
    alCambiar(null)
    return () => {}
  }
  const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => alCambiar(sesion))
  return () => data.subscription.unsubscribe()
}
