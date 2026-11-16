import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Menu, X } from 'lucide-react'
import { Button } from '@/componentes/ui/button'
import { BLOQUES, FAMILIAS, algoritmosDelBloque, rutaDe } from '@/datos/catalogo'
import { cn } from '@/lib/utils'

const paginas = [
  { ruta: '/', nombre: 'Catálogo', exacta: true },
  { ruta: '/comparativa', nombre: 'Tabla comparativa' },
  { ruta: '/conceptos', nombre: 'Conceptos previos' },
]

const claseEnlace = ({ isActive }) =>
  cn(
    'block rounded-md px-3 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-sidebar-accent font-medium text-foreground shadow-[inset_2px_0_0_var(--primary)]'
      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-foreground',
  )

function Marca() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-md" aria-label="Traza, ir al catálogo">
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden="true">
        <rect x="2" y="16" width="5" height="10" rx="1.2" fill="var(--estado-normal)" />
        <rect x="9" y="11" width="5" height="15" rx="1.2" fill="var(--estado-normal)" />
        <rect x="16" y="6" width="5" height="20" rx="1.2" fill="var(--primary)" />
        <rect x="23" y="2" width="5" height="24" rx="1.2" fill="var(--primary)" />
      </svg>
      <span className="font-heading text-xl font-[650] tracking-tight [font-stretch:112%]">Traza</span>
    </Link>
  )
}

function Navegacion() {
  return (
    <nav aria-label="Principal" className="flex flex-col gap-6">
      <ul className="flex flex-col gap-0.5">
        {paginas.map((pagina) => (
          <li key={pagina.ruta}>
            <NavLink to={pagina.ruta} end={pagina.exacta} className={claseEnlace}>
              {pagina.nombre}
            </NavLink>
          </li>
        ))}
      </ul>

      {FAMILIAS.map((familia) => (
        <div key={familia.id}>
          <h2 className="px-3 pb-2 font-sans text-[0.8125rem] font-semibold tracking-normal text-foreground [font-stretch:100%]">
            {familia.nombre}
          </h2>
          <div className="flex flex-col gap-3">
            {BLOQUES.filter((bloque) => bloque.familia === familia.id).map((bloque) => {
              const disponibles = algoritmosDelBloque(bloque.id).filter((a) => a.disponible)
              if (disponibles.length === 0) return null
              return (
                <div key={bloque.id}>
                  {familia.id === 'ordenamiento' && (
                    <p className="px-3 pb-1 text-xs text-tenue">{bloque.nombre}</p>
                  )}
                  <ul className="flex flex-col gap-0.5">
                    {disponibles.map((algoritmo) => (
                      <li key={algoritmo.id}>
                        <NavLink to={rutaDe(algoritmo.id)} className={claseEnlace}>
                          {algoritmo.nombreCorto}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function Layout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { pathname } = useLocation()

  // Al cambiar de página, volver arriba.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // En pantallas pequeñas, elegir un enlace cierra el menú.
  function alElegirEnlace(evento) {
    if (evento.target.closest('a')) setMenuAbierto(false)
  }

  return (
    <div className="min-h-screen lg:pl-64">
      <a
        href="#contenido"
        className="sr-only rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Saltar al contenido
      </a>

      {/* Barra superior, sólo en pantallas pequeñas */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur lg:hidden">
        <Marca />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          aria-expanded={menuAbierto}
          aria-controls="menu-lateral"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuAbierto ? <X /> : <Menu />}
        </Button>
      </header>

      <aside
        id="menu-lateral"
        onClick={alElegirEnlace}
        className={cn(
          'fixed inset-y-0 left-0 z-20 w-64 overflow-y-auto border-r border-sidebar-border bg-sidebar px-3 pt-20 pb-8 lg:block lg:pt-6',
          menuAbierto ? 'block w-full sm:w-72' : 'hidden',
        )}
      >
        <div className="mb-7 hidden px-3 lg:block">
          <Marca />
          <p className="mt-2 text-xs leading-relaxed text-tenue">Algoritmos de ordenamiento y búsqueda, paso a paso.</p>
        </div>
        <Navegacion />
      </aside>

      <main id="contenido" className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <Outlet />
      </main>

      <footer className="mx-auto w-full max-w-5xl border-t px-5 py-8 text-sm text-tenue sm:px-8">
        Proyecto de la materia Aplicaciones Web, Facultad de Ingeniería, Arquitectura y Diseño, UABC.
      </footer>
    </div>
  )
}
