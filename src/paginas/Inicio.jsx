import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router'
import { Lock } from 'lucide-react'
import { EstadoCarga } from '@/componentes/EstadoCarga'
import { Estallido, Grieta } from '@/componentes/Fragmentos'
import { VistaPrevia, cargarVistasPrevias } from '@/componentes/VistaPrevia'
import { buttonVariants } from '@/componentes/ui/button'
import { Visualizador } from '@/componentes/visualizador/Visualizador'
import { BLOQUES, FAMILIAS, algoritmosDelBloque, rutaDe } from '@/datos/catalogo'
import { cn } from '@/lib/utils'
import { useCatalogo } from '@/stores/catalogo'
import { useSesion } from '@/stores/sesion'

function Fila({ algoritmo, bloqueado }) {
  const idDescripcion = useId()
  // Con el cursor encima o el foco del teclado, la fila muestra la animación del algoritmo.
  const [activa, setActiva] = useState(false)
  const encender = () => setActiva(true)
  const apagar = () => setActiva(false)
  // Toda la fila lleva a la ficha, pero el nombre accesible es sólo el del
  // algoritmo; la descripción se lee aparte, como descripción del enlace.
  return (
    <li>
      <Link
        to={rutaDe(algoritmo.id)}
        aria-label={bloqueado ? `${algoritmo.nombreCorto} (requiere cuenta)` : algoritmo.nombreCorto}
        aria-describedby={idDescripcion}
        onPointerEnter={encender}
        onPointerLeave={apagar}
        onFocus={encender}
        onBlur={apagar}
        className="group grid gap-x-6 gap-y-2 px-4 py-3.5 transition-colors hover:bg-card sm:grid-cols-[11rem_minmax(0,1fr)_7.5rem] sm:items-center"
      >
        <span className="boton-ficha justify-self-start">{algoritmo.nombreCorto}</span>
        <span id={idDescripcion} className="text-[0.9375rem] leading-relaxed text-foreground/85">
          {algoritmo.intencion}
        </span>
        <span className="relative flex items-center sm:justify-end">
          <span className={cn('transition-opacity duration-150', activa && 'sm:opacity-0')}>
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
          </span>
          {activa && <VistaPrevia id={algoritmo.id} activa className="absolute inset-x-0 hidden sm:flex" />}
        </span>
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

  // Las miniaturas del catálogo se piden un momento después de cargar, para que el primer hover ya tenga qué mostrar.
  useEffect(() => {
    const espera = setTimeout(cargarVistasPrevias, 1500)
    return () => clearTimeout(espera)
  }, [])

  return (
    <>
      {/* Los fragmentos llegan hasta las orillas de la pantalla (o del menú lateral). */}
      <header className="relative isolate -mt-10 overflow-y-clip pt-20 pb-16 text-center lg:-mt-14 lg:pt-28 lg:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[calc(50%-50vw)] -z-10 w-[34vw] opacity-50 sm:opacity-80 lg:left-[calc(50%-50vw+8rem)] lg:w-[min(26vw,26rem)] lg:opacity-100 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
        >
          <Estallido semilla={3} lado="izquierdo" className="w-full" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[calc(50%-50vw)] -z-10 w-[34vw] opacity-50 sm:opacity-80 lg:right-[calc(50%-50vw+8rem)] lg:w-[min(26vw,26rem)] lg:opacity-100 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
        >
          <Estallido semilla={8} lado="derecho" className="w-full" />
        </div>
        <div className="mx-auto max-w-[34rem]">
          <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl">Mira cómo piensa un algoritmo, un paso a la vez</h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-foreground/85">
            Un catálogo de algoritmos de ordenamiento y búsqueda. Cada ficha explica cuándo conviene usar el algoritmo y
            te deja ejecutarlo con tus propios datos: avanza, retrocede y sigue en el código la línea que se está
            ejecutando.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#catalogo" className={cn(buttonVariants(), 'h-10 px-5')}>
              Ver el catálogo
            </a>
            {!conSesion && (
              <Link to="/registro" className={cn(buttonVariants({ variant: 'outline' }), 'h-10 bg-background px-5')}>
                Crear cuenta gratis
              </Link>
            )}
          </div>
        </div>
      </header>

      <Grieta semilla={5} className="mb-8" />

      <section aria-labelledby="demostracion">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h2 id="demostracion" className="font-sans text-base font-medium tracking-normal text-muted-foreground [font-stretch:100%]">
            Inserción ordenando siete números
          </h2>
          <Link to={rutaDe('insercion')} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            Abrir la ficha con el código
          </Link>
        </div>
        <Visualizador algoritmoId="insercion" compacto autoReproducir />
      </section>

      {!conSesion && privados > 0 && (
        <p className="facetado mt-10 max-w-[68ch] border bg-card px-4 py-3 text-[0.9375rem] text-foreground/90">
          Sin cuenta puedes abrir {algoritmos.length - privados} fichas.{' '}
          <Link to="/registro" className="enlace">
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

      {/* Destino de "Ver el catálogo". tabIndex -1 lleva ahí el foco del teclado, no sólo la vista. */}
      <div id="catalogo" tabIndex={-1} className="scroll-mt-20 outline-none" />
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
          <h3 className="text-lg">Tabla comparativa</h3>
          <p className="mt-2 text-[0.9375rem] text-foreground/85">
            Todos los algoritmos lado a lado: complejidad, memoria, estabilidad y requisitos.
          </p>
          <Link to="/comparativa" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-4')}>
            Abrir la tabla comparativa
          </Link>
        </div>
        <div>
          <h3 className="text-lg">Conceptos previos</h3>
          <p className="mt-2 text-[0.9375rem] text-foreground/85">
            Qué significa O(n log n), qué es un ordenamiento estable y qué quiere decir trabajar en el sitio.
          </p>
          <Link to="/conceptos" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-4')}>
            Leer los conceptos previos
          </Link>
        </div>
      </section>
    </>
  )
}
