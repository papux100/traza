import { createClient } from '@supabase/supabase-js'

/**
 * Verifica las sesiones. Las cuentas las administra Supabase Auth: el
 * navegador inicia sesión ahí y manda su token en cada petición a esta API.
 * Aquí se le pregunta a Supabase si ese token es válido y de quién es.
 */
export function crearVerificador({ urlSupabase, clavePublicable }) {
  const supabase = createClient(urlSupabase, clavePublicable, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return async function verificarToken(token) {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) return null
    return { id: data.user.id, correo: data.user.email }
  }
}
