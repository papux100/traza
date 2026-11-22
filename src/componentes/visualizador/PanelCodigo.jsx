import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Highlight } from 'prism-react-renderer'
import { Button } from '@/componentes/ui/button'
import { cn } from '@/lib/utils'

/** Colores del código, afinados a la paleta del sitio. */
const tema = {
  plain: { color: '#c9d6ea', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment'], style: { color: '#5f6f8a', fontStyle: 'italic' } },
    { types: ['keyword', 'operator'], style: { color: '#7fb6ff' } },
    { types: ['function'], style: { color: '#eef3fb' } },
    { types: ['number', 'boolean'], style: { color: '#f6b93f' } },
    { types: ['string'], style: { color: '#3ddc97' } },
    { types: ['punctuation'], style: { color: '#7c8ca8' } },
  ],
}

/**
 * Código del algoritmo con la línea en ejecución resaltada.
 * Es el mismo código que se evalúa en las pruebas, así que lo que se lee
 * aquí es lo que de verdad ordena.
 */
export function PanelCodigo({ codigo, lineaActiva }) {
  const [copiado, setCopiado] = useState(false)

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
        <span className="text-xs text-muted-foreground">JavaScript</span>
        <Button variant="ghost" size="sm" onClick={copiar}>
          {copiado ? <Check /> : <Copy />}
          {copiado ? 'Copiado' : 'Copiar código'}
        </Button>
      </div>

      <Highlight code={codigo} language="javascript" theme={tema}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="flex-1 overflow-x-auto py-3 text-[0.8125rem] leading-6">
            <code className="block min-w-max">
              {tokens.map((linea, i) => {
                const numero = i + 1
                const activa = numero === lineaActiva
                const { key: _clave, className, ...resto } = getLineProps({ line: linea })
                return (
                  <div
                    key={numero}
                    {...resto}
                    aria-current={activa ? 'step' : undefined}
                    className={cn(
                      className,
                      'flex border-l-2 pr-4 transition-colors duration-150',
                      activa ? 'border-primary bg-primary/15' : 'border-transparent',
                    )}
                  >
                    <span
                      className={cn(
                        'w-10 shrink-0 pr-3 text-right select-none',
                        activa ? 'text-enlace' : 'text-tenue',
                      )}
                    >
                      {numero}
                    </span>
                    <span>
                      {linea.map((token, j) => {
                        const { key: _k, ...propsToken } = getTokenProps({ token })
                        return <span key={j} {...propsToken} />
                      })}
                    </span>
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
