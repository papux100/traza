import { supabase, supabaseConfigurado } from '@/lib/supabase'

/**
 * Todo lo que el sitio le pide al backend pasa por este archivo.
 *
 * - Los datos (catálogo, fichas, perfil) se piden a nuestra API de Fastify
 *   con fetch, igual que en la Pokédex se le pedían a la PokeAPI.
 * - Las cuentas (registro, inicio y cierre de sesión) las maneja Supabase Auth.
 *   El token de la sesión viaja a la API en el encabezado Authorization.
 */

export class ErrorApi extends Error {
  constructor(mensaje, { estado, codigo } = {}) {
    super(mensaje)
    this.estado = estado
    this.codigo = codigo
  }
}

/**
 * Dirección de la API. En desarrollo queda vacía y Vite reenvía /api al
 * servidor local (ver vite.config.js). Al publicar, se configura VITE_API_URL.
 */
const URL_API = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

async function tokenDeSesion() {
  if (!supabaseConfigurado) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function pedir(ruta, { metodo = 'GET', cuerpo } = {}) {
  if (import.meta.env.PROD && !URL_API) {
    throw new ErrorApi('Falta configurar la dirección de la API. Agrega VITE_API_URL en las variables de entorno del hospedaje.')
  }

  const token = await tokenDeSesion()
  let respuesta
  try {
    respuesta = await fetch(`${URL_API}${ruta}`, {
      method: metodo,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(cuerpo !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor. Revisa tu conexión o que la API esté encendida.')
  }

  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    throw new ErrorApi(datos?.error ?? 'Ocurrió un error inesperado. Intenta de nuevo.', {
      estado: respuesta.status,
      codigo: datos?.codigo,
    })
  }
  if (datos === null) throw new ErrorApi('El servidor respondió algo que no es JSON. Revisa la dirección de la API.')
  return datos
}

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

/* ---------- Catálogo (API de Fastify) ---------- */

export async function obtenerAlgoritmos() {
  const { algoritmos } = await pedir('/api/algoritmos')
  return algoritmos
}

/**
 * Devuelve la ficha, o null si es privada y no hay sesión iniciada
 * (la API responde 401 con el código requiere_cuenta).
 */
export async function obtenerFicha(id) {
  try {
    const { ficha } = await pedir(`/api/fichas/${encodeURIComponent(id)}`)
    return ficha
  } catch (error) {
    if (error.codigo === 'requiere_cuenta') return null
    throw error
  }
}

/**
 * Ejecuta un algoritmo en el servidor y devuelve su traza:
 * { algoritmo, entrada, objetivo, resultado, pasos }.
 * Sin entrada, el servidor usa los datos de ejemplo del algoritmo.
 */
export async function ejecutarAlgoritmo(id, { entrada, objetivo } = {}) {
  const cuerpo = {}
  if (entrada !== undefined) cuerpo.entrada = entrada
  if (objetivo !== undefined && objetivo !== null) cuerpo.objetivo = objetivo
  return pedir(`/api/algoritmos/${encodeURIComponent(id)}/ejecucion`, { metodo: 'POST', cuerpo })
}

/** Miniaturas animadas del catálogo: { [id]: { familia, cuadros: [{ v, e }] } }. */
export async function obtenerVistasPrevias() {
  const { vistas } = await pedir('/api/vistas-previas')
  return vistas
}

export async function obtenerPerfil() {
  const { perfil } = await pedir('/api/perfil')
  return perfil
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
