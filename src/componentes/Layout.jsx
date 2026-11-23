import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Lock, LogOut, Menu, X } from 'lucide-react'
import { Grieta, Logotipo } from '@/componentes/Fragmentos'
import { Button, buttonVariants } from '@/componentes/ui/button'
import { BLOQUES, FAMILIAS, algoritmosDelBloque, rutaDe } from '@/datos/catalogo'
import { cn } from '@/lib/utils'
import { useCatalogo } from '@/stores/catalogo'
import { nombreVisible, useSesion } from '@/stores/sesion'

const paginas = [
  { ruta: '/', nombre: 'Catálogo', exacta: true },
  { ruta: '/comparativa', nombre: 'Tabla comparativa' },
  { ruta: '/conceptos', nombre: 'Conceptos previos' },
]

const claseEnlace = ({ isActive }) =>
  cn(
    'block rounded-[3px] px-3 py-1.5 text-sm transition-colors',
    isActive
      ? 'enlace-activo bg-sidebar-accent font-medium text-foreground'
      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-foreground',
  )

function Marca() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-md" aria-label="Traza, ir al catálogo">
      <Logotipo />
      <span className="font-heading text-xl font-[650] tracking-tight [font-stretch:112%]">Traza</span>
    </Link>
  )
}

function Cuenta() {
  const usuario = useSesion((s) => s.usuario)
  const perfil = useSesion((s) => s.perfil)
  const lista = useSesion((s) => s.lista)
  const cerrarSesion = useSesion((s) => s.cerrarSesion)
  const { pathname } = useLocation()

  if (!lista) return <div className="h-9" aria-hidden="true" />

  if (usuario) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-[3px] bg-sidebar-accent/60 py-1.5 pr-1.5 pl-3">
        <div className="min-w-0">
          <p className="text-xs text-tenue">Sesión iniciada</p>
          <p className="truncate text-sm font-medium">{nombreVisible({ usuario, perfil })}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => cerrarSesion().catch(() => {})} aria-label="Cerrar sesión" title="Cerrar sesión">
          <LogOut />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Link to="/entrar" state={{ desde: pathname }} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex-1')}>
        Iniciar sesión
      </Link>
      <Link to="/registro" state={{ desde: pathname }} className={cn(buttonVariants({ size: 'sm' }), 'flex-1')}>
        Crear cuenta
      </Link>
    </div>
  )
}

function Navegacion() {
  const algoritmos = useCatalogo((s) => s.algoritmos)
  const cargando = useCatalogo((s) => s.cargando)
  const error = useCatalogo((s) => s.error)
  const conSesion = useSesion((s) => Boolean(s.usuario))

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

      {cargando && <p className="px-3 text-sm text-tenue">Cargando algoritmos…</p>}
      {error && <p className="px-3 text-sm text-destructive">No se pudo cargar el catálogo.</p>}

      {algoritmos.length > 0 && FAMILIAS.map((familia) => (
        <div key={familia.id}>
          <h2 className="px-3 pb-2 font-sans text-[0.8125rem] font-semibold tracking-normal text-foreground [font-stretch:100%]">
            {familia.nombre}
          </h2>
          <div className="flex flex-col gap-3">
            {BLOQUES.filter((bloque) => bloque.familia === familia.id).map((bloque) => {
              const disponibles = algoritmosDelBloque(algoritmos, bloque.id)
              if (disponibles.length === 0) return null
              return (
                <div key={bloque.id}>
                  {familia.id === 'ordenamiento' && (
                    <p className="px-3 pb-1 text-xs text-tenue">{bloque.nombre}</p>
                  )}
                  <ul className="flex flex-col gap-0.5">
                    {disponibles.map((algoritmo) => (
                      <li key={algoritmo.id}>
                        <NavLink to={rutaDe(algoritmo.id)} className={(e) => cn(claseEnlace(e), 'flex items-center justify-between gap-2')}>
                          {algoritmo.nombreCorto}
                          {!conSesion && !algoritmo.publico && (
                            <>
                              <Lock className="size-3.5 shrink-0 text-tenue" aria-hidden="true" />
                              <span className="sr-only"> (requiere cuenta)</span>
                            </>
                          )}
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

  // Al abrir el sitio: seguir la sesión y traer el catálogo de la base de datos.
  useEffect(() => useSesion.getState().escuchar(), [])
  useEffect(() => {
    useCatalogo.getState().cargar()
  }, [])

  // Al cambiar de página, volver arriba.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // En pantallas pequeñas, elegir un enlace cierra el menú.
  function alElegirEnlace(evento) {
    if (evento.target.closest('a')) setMenuAbierto(false)
  }

  return (
    <div className="min-h-screen overflow-x-clip lg:pl-64">
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
        <div className="mb-5 hidden px-3 lg:block">
          <Marca />
          <p className="mt-2 text-xs leading-relaxed text-tenue">Algoritmos de ordenamiento y búsqueda, paso a paso.</p>
        </div>
        <div className="mb-6 px-1">
          <Cuenta />
        </div>
        <Navegacion />
      </aside>

      <main id="contenido" className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
        <Outlet />
      </main>

      <footer className="mx-auto w-full max-w-5xl px-5 pb-8 text-sm text-tenue sm:px-8">
        <Grieta semilla={9} className="mb-6" />
        Proyecto de la materia Aplicaciones Web, Facultad de Ingeniería, Arquitectura y Diseño, UABC.
      </footer>
    </div>
  )
}
