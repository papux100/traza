import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase. Los dos valores salen del archivo .env.local (en tu
 * computadora) o de las variables de entorno del hospedaje (al publicar).
 *
 * La clave publicable puede ir en el navegador: lo que protege los datos son
 * las reglas de acceso (RLS) definidas en supabase/01-esquema.sql.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const clave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabaseConfigurado = Boolean(url && clave)

export const supabase = supabaseConfigurado ? createClient(url, clave) : null
