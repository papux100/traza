const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const MIN_CONTRASENA = 8

/** Revisa los campos antes de enviarlos. Devuelve un objeto con los errores encontrados. */
export function validarCuenta({ nombre, correo, contrasena }, { conNombre }) {
  const errores = {}
  if (conNombre && !nombre.trim()) errores.nombre = 'Escribe tu nombre.'
  if (conNombre && nombre.trim().length > 60) errores.nombre = 'Usa 60 caracteres como máximo.'
  if (!correo.trim()) errores.correo = 'Escribe tu correo.'
  else if (!CORREO.test(correo.trim())) errores.correo = 'Ese correo no parece válido. Revisa que tenga @ y un dominio.'
  if (!contrasena) errores.contrasena = 'Escribe tu contraseña.'
  else if (conNombre && contrasena.length < MIN_CONTRASENA) {
    errores.contrasena = `Usa al menos ${MIN_CONTRASENA} caracteres.`
  }
  return errores
}

/** A dónde volver después de entrar: la página de la que venía, salvo las de cuenta. */
export function destinoTrasEntrar(estado) {
  const desde = estado?.desde
  if (!desde || desde === '/entrar' || desde === '/registro') return '/'
  return desde
}
