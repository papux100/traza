export const MIN_ELEMENTOS = 2
export const MAX_ELEMENTOS = 16
export const VALOR_MIN = 1
export const VALOR_MAX = 99

/**
 * Convierte el texto que escribe el usuario en un arreglo de enteros.
 * Devuelve { valores } si es válido o { error } con una explicación.
 */
export function leerArreglo(texto, { valorMax = VALOR_MAX } = {}) {
  const partes = texto
    .split(/[\s,;]+/)
    .map((parte) => parte.trim())
    .filter(Boolean)

  if (partes.length < MIN_ELEMENTOS) {
    return { error: `Escribe al menos ${MIN_ELEMENTOS} números separados por comas.` }
  }
  if (partes.length > MAX_ELEMENTOS) {
    return { error: `Usa ${MAX_ELEMENTOS} números como máximo para que las barras se distingan (escribiste ${partes.length}).` }
  }

  const valores = []
  for (const parte of partes) {
    if (!/^\d+$/.test(parte)) {
      return { error: `"${parte}" no es un entero. Usa sólo números entre ${VALOR_MIN} y ${valorMax}.` }
    }
    const valor = Number(parte)
    if (valor < VALOR_MIN || valor > valorMax) {
      return { error: `${valor} está fuera de rango. Usa números entre ${VALOR_MIN} y ${valorMax}.` }
    }
    valores.push(valor)
  }
  return { valores }
}

export function leerObjetivo(texto) {
  const limpio = texto.trim()
  if (!/^\d+$/.test(limpio)) {
    return { error: `Escribe el número que quieres buscar, entre ${VALOR_MIN} y ${VALOR_MAX}.` }
  }
  const valor = Number(limpio)
  if (valor < VALOR_MIN || valor > VALOR_MAX) {
    return { error: `El valor buscado debe estar entre ${VALOR_MIN} y ${VALOR_MAX}.` }
  }
  return { valor }
}

export function arregloAleatorio(cantidad = 8, { valorMax = VALOR_MAX, aleatorio = Math.random } = {}) {
  return Array.from({ length: cantidad }, () => VALOR_MIN + Math.floor(aleatorio() * (valorMax - VALOR_MIN + 1)))
}
