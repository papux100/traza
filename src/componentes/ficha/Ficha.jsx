import { Link } from 'react-router'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { Badge } from '@/componentes/ui/badge'
import { Visualizador } from '@/componentes/visualizador/Visualizador'
import { DISPONIBLES, obtenerBloque, obtenerDatos, obtenerFamilia, rutaDe } from '@/datos/catalogo'

function Seccion({ id, titulo, children }) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="mb-4 text-2xl">
        {titulo}
      </h2>
      {children}
    </section>
  )
}

function Lista({ icono, titulo, elementos, tono }) {
  const Icono = icono
  return (
    <div>
      <h3 className="mb-3 font-sans text-base font-semibold tracking-normal [font-stretch:100%]">{titulo}</h3>
      <ul className="flex flex-col gap-3">
        {elementos.map((elemento, i) => (
          <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-foreground/90">
            <Icono className={`mt-1 size-4 shrink-0 ${tono}`} aria-hidden="true" />
            <span>{elemento}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Complejidad({ datos, nota }) {
  const casos = [
    { etiqueta: 'Mejor caso', valor: datos.complejidad.mejor },
    { etiqueta: 'Caso promedio', valor: datos.complejidad.promedio },
    { etiqueta: 'Peor caso', valor: datos.complejidad.peor },
    { etiqueta: 'Memoria adicional', valor: datos.espacio },
  ]
  return (
    <>
      <dl className="grid grid-cols-2 overflow-hidden rounded-lg border sm:grid-cols-4">
        {casos.map((caso, i) => (
          <div
            key={caso.etiqueta}
            className={`bg-card px-4 py-3 ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t sm:border-t-0' : ''} sm:border-l sm:first:border-l-0`}
          >
            <dt className="text-xs text-muted-foreground">{caso.etiqueta}</dt>
            <dd className="mt-1 font-mono text-[0.9375rem] font-medium">{caso.valor}</dd>
          </div>
        ))}
      </dl>

      {datos.familia === 'ordenamiento' && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant={datos.estable ? 'si' : 'no'}>{datos.estable ? 'Estable' : 'No estable'}</Badge>
          <Badge variant={datos.enSitio ? 'si' : 'no'}>
            {datos.enSitio ? 'Trabaja en el sitio' : 'Necesita memoria adicional'}
          </Badge>
          <Link to="/conceptos" className="self-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
            ¿Qué significan estos términos?
          </Link>
        </div>
      )}

      <div className="prosa mt-5">{nota}</div>
    </>
  )
}

/**
 * Plantilla de ficha. Todas las fichas pasan por aquí, de modo que el orden
 * de las secciones es el mismo en todo el catálogo y no depende de quien
 * escribe cada una.
 */
export function Ficha({
  id,
  analogia,
  comoFunciona,
  requisitos,
  complejidad,
  usarlo,
  evitarlo,
  implementacion,
  relaciones,
}) {
  const datos = obtenerDatos(id)
  const familia = obtenerFamilia(datos.familia)
  const bloque = obtenerBloque(datos.bloque)
  const posicion = DISPONIBLES.findIndex((a) => a.id === id)
  const anterior = DISPONIBLES[posicion - 1]
  const siguiente = DISPONIBLES[posicion + 1]

  return (
    <article>
      <header>
        <p className="mb-3 text-sm text-muted-foreground">
          {familia.nombre}
          {datos.familia === 'ordenamiento' && <span className="text-tenue"> / {bloque.nombre}</span>}
        </p>
        <h1 className="text-4xl sm:text-5xl">{datos.nombre}</h1>
        <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-foreground/90 sm:text-xl">{datos.intencion}</p>
      </header>

      <Seccion id="analogia" titulo="Analogía">
        <div className="prosa">{analogia}</div>
      </Seccion>

      <Seccion id="como-funciona" titulo="Cómo funciona">
        <div className="prosa">{comoFunciona}</div>
      </Seccion>

      <Seccion id="visualizador" titulo="Pruébalo paso a paso">
        <p className="mb-4 max-w-[68ch] text-[0.9375rem] text-muted-foreground">
          Reproduce la ejecución o avanza a tu ritmo. Con el foco dentro del visualizador puedes usar las flechas
          izquierda y derecha para moverte un paso, y la barra espaciadora para reproducir o pausar.
        </p>
        <Visualizador key={id} algoritmoId={id} />
      </Seccion>

      <Seccion id="requisitos" titulo="Requisitos previos">
        <div className="prosa">{requisitos}</div>
      </Seccion>

      <Seccion id="complejidad" titulo="Complejidad">
        <Complejidad datos={datos} nota={complejidad} />
      </Seccion>

      <Seccion id="cuando" titulo="Cuándo usarlo y cuándo no">
        <div className="grid max-w-4xl gap-8 md:grid-cols-2">
          <Lista icono={Check} titulo="Conviene cuando" elementos={usarlo} tono="text-primary" />
          <Lista icono={X} titulo="Mejor evitarlo cuando" elementos={evitarlo} tono="text-estado-pivote" />
        </div>
      </Seccion>

      <Seccion id="implementacion" titulo="Implementación">
        <div className="prosa">
          <p>
            El código completo está en el visualizador de arriba, con la línea en ejecución resaltada. Estos son los
            detalles que conviene no pasar por alto al escribirlo:
          </p>
          <ul>
            {implementacion.map((detalle, i) => (
              <li key={i}>{detalle}</li>
            ))}
          </ul>
        </div>
      </Seccion>

      <Seccion id="relaciones" titulo="Relación con otros algoritmos">
        <ul className="flex max-w-[68ch] flex-col divide-y rounded-lg border">
          {relaciones.map((relacion) => {
            const otro = obtenerDatos(relacion.id)
            return (
              <li key={relacion.id} className="px-4 py-3.5">
                {otro.disponible ? (
                  <Link to={rutaDe(otro.id)} className="font-medium text-primary underline-offset-4 hover:underline">
                    {otro.nombre}
                  </Link>
                ) : (
                  <span className="font-medium">
                    {otro.nombre} <span className="text-xs font-normal text-tenue">(ficha en preparación)</span>
                  </span>
                )}
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-foreground/85">{relacion.texto}</p>
              </li>
            )
          })}
        </ul>
      </Seccion>

      <nav aria-label="Otras fichas" className="mt-16 flex flex-wrap justify-between gap-4 border-t pt-6 text-sm">
        {anterior ? (
          <Link to={rutaDe(anterior.id)} className="group flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>
              <span className="block text-xs text-tenue">Ficha anterior</span>
              {anterior.nombre}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {siguiente && (
          <Link to={rutaDe(siguiente.id)} className="group flex items-center gap-2 text-right text-muted-foreground hover:text-foreground">
            <span>
              <span className="block text-xs text-tenue">Ficha siguiente</span>
              {siguiente.nombre}
            </span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  )
}
