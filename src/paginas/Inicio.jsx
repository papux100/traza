import { Link } from 'react-router'
import { Lock } from 'lucide-react'
import { EstadoCarga } from '@/componentes/EstadoCarga'
import { Fragmentos, Grieta } from '@/componentes/Fragmentos'
import { buttonVariants } from '@/componentes/ui/button'
import { Visualizador } from '@/componentes/visualizador/Visualizador'
import { BLOQUES, FAMILIAS, algoritmosDelBloque, rutaDe } from '@/datos/catalogo'
import { cn } from '@/lib/utils'
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
      <header className="relative isolate pt-2 pb-6 lg:min-h-[26rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 -right-28 -z-10 h-[24rem] w-[15rem] opacity-30 sm:-right-12 sm:h-[30rem] sm:w-[20rem] sm:opacity-60 lg:-top-8 lg:right-[-2.5rem] lg:h-[34rem] lg:w-[23rem] lg:opacity-100"
        >
          <Fragmentos semilla={7} />
        </div>
        <div className="max-w-[36rem]">
          <h1 className="text-[2.6rem] leading-[1.05] sm:text-6xl">Mira cómo piensa un algoritmo, un paso a la vez</h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-foreground/85">
            Un catálogo de algoritmos de ordenamiento y búsqueda. Cada ficha explica cuándo conviene usar el algoritmo y
            te deja ejecutarlo con tus propios datos: avanza, retrocede y sigue en el código la línea que se está
            ejecutando.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogo" className={cn(buttonVariants(), 'h-10 px-5')}>
              Ver el catálogo
            </a>
            {!conSesion && (
              <Link to="/registro" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-5')}>
                Crear cuenta gratis
              </Link>
            )}
          </div>
        </div>
      </header>

      <Grieta semilla={5} className="mt-6 mb-8" />

      <section aria-labelledby="demostracion">
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
        <p className="facetado mt-10 max-w-[68ch] border bg-card px-4 py-3 text-[0.9375rem] text-foreground/90">
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

      <div id="catalogo" className="scroll-mt-20" />
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
              <ul className="facetado divide-y overflow-hidden border">
                {algoritmosDelBloque(algoritmos, bloque.id).map((algoritmo) => (
                  <Fila key={algoritmo.id} algoritmo={algoritmo} bloqueado={!conSesion && !algoritmo.publico} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      <Grieta semilla={13} className="mt-16" />
      <section aria-labelledby="mas" className="mt-8 grid gap-8 md:grid-cols-2">
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
