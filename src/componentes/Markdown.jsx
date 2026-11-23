import { Link } from 'react-router'
import { ExternalLink } from 'lucide-react'
import { leerBloques, leerEnLinea } from '@/lib/markdown'

function Fragmentos({ fragmentos }) {
  return fragmentos.map((f, i) => {
    if (f.tipo === 'codigo') return <code key={i}>{f.texto}</code>
    if (f.tipo === 'negrita') return <strong key={i}><Fragmentos fragmentos={f.hijos} /></strong>
    if (f.tipo === 'enlace') {
      return f.url.startsWith('/') ? (
        <Link key={i} to={f.url}>{f.texto}</Link>
      ) : (
        <a key={i} href={f.url} target="_blank" rel="noopener noreferrer">
          {f.texto}
          <ExternalLink className="ml-0.5 inline size-3.5 align-[-2px]" aria-hidden="true" />
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      )
    }
    return f.texto
  })
}

/** Texto con párrafos y listas, tal como viene de la base de datos. */
export function Markdown({ texto }) {
  return leerBloques(texto).map((bloque, i) => {
    if (bloque.tipo === 'numerada' || bloque.tipo === 'vinetas') {
      const Lista = bloque.tipo === 'numerada' ? 'ol' : 'ul'
      return (
        <Lista key={i}>
          {bloque.elementos.map((fragmentos, j) => (
            <li key={j}><Fragmentos fragmentos={fragmentos} /></li>
          ))}
        </Lista>
      )
    }
    return <p key={i}><Fragmentos fragmentos={bloque.fragmentos} /></p>
  })
}

/** Una sola línea: sin párrafos, sólo código, negritas y enlaces. */
export function MarkdownEnLinea({ texto }) {
  return <Fragmentos fragmentos={leerEnLinea(texto ?? '')} />
}
