import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Lock } from 'lucide-react'
import { EstadoCarga } from '@/componentes/EstadoCarga'
import { EncabezadoFicha, Ficha, NavegacionFichas } from '@/componentes/ficha/Ficha'
import { buttonVariants } from '@/componentes/ui/button'
import { buscarAlgoritmo, useCatalogo } from '@/stores/catalogo'
import { useFichas } from '@/stores/fichas'
import { useSesion } from '@/stores/sesion'
import NoEncontrada from './NoEncontrada'

function FichaBloqueada({ datos, algoritmos }) {
  const { pathname } = useLocation()
  return (
    <article>
      <EncabezadoFicha datos={datos} />
      <section className="mt-12 max-w-xl rounded-xl border bg-card px-6 py-6">
        <Lock className="size-6 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-2xl">Esta ficha es para usuarios registrados</h2>
        <p className="mt-2 text-foreground/85">
          Crea una cuenta gratis para ver la explicación completa, ejecutar el algoritmo paso a paso y leer su código.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/registro" state={{ desde: pathname }} className={buttonVariants()}>
            Crear cuenta
          </Link>
          <Link to="/entrar" state={{ desde: pathname }} className={buttonVariants({ variant: 'outline' })}>
            Ya tengo cuenta
          </Link>
        </div>
      </section>
      <NavegacionFichas id={datos.id} algoritmos={algoritmos} />
    </article>
  )
}

export default function FichaAlgoritmo() {
  const { id } = useParams()
  const algoritmos = useCatalogo((s) => s.algoritmos)
  const errorCatalogo = useCatalogo((s) => s.error)
  const cargado = useCatalogo((s) => s.cargado)
  const sesionLista = useSesion((s) => s.lista)
  const conSesion = useSesion((s) => Boolean(s.usuario))
  const entrada = useFichas((s) => s.porId[id])
  const datos = buscarAlgoritmo(algoritmos, id)

  // Se pide la ficha cuando ya se sabe si hay sesión, porque de eso depende
  // lo que la base de datos permite leer.
  useEffect(() => {
    if (datos && sesionLista && !entrada) useFichas.getState().cargar(id)
  }, [datos, sesionLista, entrada, id])

  if (!cargado) {
    return <EstadoCarga error={errorCatalogo} texto="Cargando…" alReintentar={() => useCatalogo.getState().cargar({ forzar: true })} />
  }
  if (!datos) return <NoEncontrada />

  if (!entrada || entrada.estado === 'cargando') {
    return (
      <>
        <EncabezadoFicha datos={datos} />
        <div className="mt-12">
          <EstadoCarga texto="Cargando la ficha…" />
        </div>
      </>
    )
  }
  if (entrada.estado === 'error') {
    return (
      <>
        <EncabezadoFicha datos={datos} />
        <div className="mt-12">
          <EstadoCarga error={entrada.error} alReintentar={() => useFichas.getState().cargar(id)} />
        </div>
      </>
    )
  }
  if (entrada.estado === 'bloqueada') {
    if (conSesion) {
      return (
        <>
          <EncabezadoFicha datos={datos} />
          <div className="mt-12">
            <EstadoCarga error="El contenido de esta ficha no está en la base de datos." />
          </div>
        </>
      )
    }
    return <FichaBloqueada datos={datos} algoritmos={algoritmos} />
  }
  return <Ficha datos={datos} ficha={entrada.ficha} algoritmos={algoritmos} conSesion={conSesion} />
}
