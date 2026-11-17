/**
 * Lector de Markdown mínimo para el contenido de las fichas.
 *
 * Sólo entiende lo que usan las fichas: párrafos, listas numeradas, listas con
 * guiones, `código`, **negritas** y [enlaces](/ruta). No interpreta HTML, así
 * que el texto que viene de la base de datos nunca se inserta como código.
 */

const EN_LINEA = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)\s]+\))/g

/** Sólo se permiten rutas internas y direcciones web. */
function urlSegura(url) {
  return url.startsWith('/') || /^https?:\/\//.test(url)
}

/** Divide una línea de texto en fragmentos: texto, código, negrita o enlace. */
export function leerEnLinea(texto) {
  const fragmentos = []
  let desde = 0
  for (const coincidencia of texto.matchAll(EN_LINEA)) {
    const [completo, codigo, negrita, enlace] = coincidencia
    if (coincidencia.index > desde) {
      fragmentos.push({ tipo: 'texto', texto: texto.slice(desde, coincidencia.index) })
    }
    if (codigo) {
      fragmentos.push({ tipo: 'codigo', texto: codigo.slice(1, -1) })
    } else if (negrita) {
      fragmentos.push({ tipo: 'negrita', hijos: leerEnLinea(negrita.slice(2, -2)) })
    } else if (enlace) {
      const [, etiqueta, url] = enlace.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
      fragmentos.push(urlSegura(url) ? { tipo: 'enlace', texto: etiqueta, url } : { tipo: 'texto', texto: etiqueta })
    }
    desde = coincidencia.index + completo.length
  }
  if (desde < texto.length) fragmentos.push({ tipo: 'texto', texto: texto.slice(desde) })
  return fragmentos
}

/** Divide el texto en bloques: párrafos y listas. */
export function leerBloques(texto) {
  return (texto ?? '')
    .split(/\n\s*\n/)
    .map((bloque) => bloque.trim())
    .filter(Boolean)
    .map((bloque) => {
      const lineas = bloque.split('\n').map((linea) => linea.trim())
      if (lineas.every((linea) => /^\d+\.\s/.test(linea))) {
        return { tipo: 'numerada', elementos: lineas.map((l) => leerEnLinea(l.replace(/^\d+\.\s+/, ''))) }
      }
      if (lineas.every((linea) => /^-\s/.test(linea))) {
        return { tipo: 'vinetas', elementos: lineas.map((l) => leerEnLinea(l.replace(/^-\s+/, ''))) }
      }
      return { tipo: 'parrafo', fragmentos: leerEnLinea(lineas.join(' ')) }
    })
}
