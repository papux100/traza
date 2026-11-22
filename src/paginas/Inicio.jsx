import { Link } from 'react-router'
import { Lock } from 'lucide-react'
import { EstadoCarga } from '@/componentes/EstadoCarga'
import { Visualizador } from '@/componentes/visualizador/Visualizador'
import { BLOQUES, FAMILIAS, algoritmosDelBloque, rutaDe } from '@/datos/catalogo'
import { useCatalogo } from '@/stores/catalogo'
import { useSesion } from '@/stores/sesion'

function Fila({ algoritmo, bloqueado }) {
  return (
    <li>
      <Link
        to={rutaDe(algoritmo.id)}
        className="group grid gap-x-6 gap-y-1 px-4 py-3.5 transition-colors hover:bg-card sm:grid-cols-[11rem_minmax(0,1fr)_auto] sm:items-baseline"
      >
        <span className="font-medium text-primary underline-offset-4 group-hover:underline">
          {algoritmo.nombreCorto}
        </span>
        <span className="text-[0.9375rem] leading-relaxed text-foreground/85">{algoritmo.intencion}</span>
        {bloqueado ? (
          <span className="flex items-center gap-1 text-xs whitespace-nowrap text-tenue">
            <Lock className="size-3.5" aria-hidden="true" />
            Requiere cuenta
          </span>
        ) : (
          <span className="font-mono text-xs text-muted-foreground" title="Complejidad en el caso promedio">
            {algoritmo.complejidad.promedio.startsWith('O') ? algoritmo.complejidad.promedio : 'Variable'}
          </span>
        )}
      </Link>
    </li>
  )
}

export default function Inicio() {
  const algoritmos = useCatalogo((s) => s.algoritmos)
  const cargando = useCatalogo((s) => s.cargando)
  const error = useCatalogo((s) => s.error)
  const conSesion = useSesion((s) => Boolean(s.usuario))
  const privados = algoritmos.filter((a) => !a.publico).length

  return (
    <>
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-[3.25rem]">Mira cómo piensa un algoritmo, un paso a la vez</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-foreground/85">
          Un catálogo de algoritmos de ordenamiento y búsqueda. Cada ficha explica cuándo conviene usar el algoritmo y
          te deja ejecutarlo con tus propios datos: avanza, retrocede y sigue en el código la línea que se está
          ejecutando.
        </p>
      </header>

      <section aria-labelledby="demostracion" className="mt-10">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id="demostracion" className="font-sans text-base font-medium tracking-normal text-muted-foreground [font-stretch:100%]">
            Inserción ordenando siete números
          </h2>
          <Link to={rutaDe('insercion')} className="text-sm text-primary underline-offset-4 hover:underline">
            Abrir la ficha con el código
          </Link>
        </div>
        <Visualizador algoritmoId="insercion" compacto autoReproducir />
      </section>

      {!conSesion && privados > 0 && (
        <p className="mt-10 max-w-[68ch] rounded-lg border bg-card px-4 py-3 text-[0.9375rem] text-foreground/90">
          Sin cuenta puedes abrir {algoritmos.length - privados} fichas.{' '}
          <Link to="/registro" className="text-primary underline underline-offset-4">
            Crea una cuenta gratis
          </Link>{' '}
          para ver las {algoritmos.length} completas.
        </p>
      )}

      {(cargando || error) && (
        <div className="mt-16">
          <EstadoCarga error={error} texto="Cargando el catálogo…" alReintentar={() => useCatalogo.getState().cargar({ forzar: true })} />
        </div>
      )}

      {algoritmos.length > 0 && FAMILIAS.map((familia) => (
        <section key={familia.id} aria-labelledby={`familia-${familia.id}`} className="mt-16">
          <h2 id={`familia-${familia.id}`} className="text-3xl">
            {familia.nombre}
          </h2>
          <p className="mt-2 text-muted-foreground">{familia.descripcion}</p>

          {BLOQUES.filter((bloque) => bloque.familia === familia.id).map((bloque) => (
            <div key={bloque.id} className="mt-8">
              {familia.id === 'ordenamiento' && (
                <div className="mb-3 max-w-[68ch]">
                  <h3 className="text-lg">{bloque.nombre}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{bloque.descripcion}</p>
                </div>
              )}
              <ul className="divide-y overflow-hidden rounded-lg border">
                {algoritmosDelBloque(algoritmos, bloque.id).map((algoritmo) => (
                  <Fila key={algoritmo.id} algoritmo={algoritmo} bloqueado={!conSesion && !algoritmo.publico} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <section aria-labelledby="mas" className="mt-16 grid gap-8 border-t pt-10 md:grid-cols-2">
        <h2 id="mas" className="sr-only">
          Más en el catálogo
        </h2>
        <div>
          <h3 className="text-lg">
            <Link to="/comparativa" className="text-primary underline-offset-4 hover:underline">
              Tabla comparativa
            </Link>
          </h3>
          <p className="mt-2 text-[0.9375rem] text-foreground/85">
            Todos los algoritmos lado a lado: complejidad, memoria, estabilidad y requisitos.
          </p>
        </div>
        <div>
          <h3 className="text-lg">
            <Link to="/conceptos" className="text-primary underline-offset-4 hover:underline">
              Conceptos previos
            </Link>
          </h3>
          <p className="mt-2 text-[0.9375rem] text-foreground/85">
            Qué significa O(n log n), qué es un ordenamiento estable y qué quiere decir trabajar en el sitio.
          </p>
        </div>
      </section>
    </>
  )
}
