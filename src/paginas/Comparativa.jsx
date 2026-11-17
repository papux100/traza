import { Link } from 'react-router'
import { EstadoCarga } from '@/componentes/EstadoCarga'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'
import { obtenerBloque, rutaDe } from '@/datos/catalogo'
import { useCatalogo } from '@/stores/catalogo'

function Nombre({ algoritmo }) {
  return (
    <TableCell className="font-medium">
      <Link to={rutaDe(algoritmo.id)} className="text-primary underline-offset-4 hover:underline">
        {algoritmo.nombreCorto}
      </Link>
    </TableCell>
  )
}

const SiNo = ({ valor }) => (
  <TableCell className={valor ? 'text-foreground' : 'text-tenue'}>{valor ? 'Sí' : 'No'}</TableCell>
)

const Mono = ({ children }) => <TableCell className="font-mono text-[0.8125rem]">{children}</TableCell>

export default function Comparativa() {
  const algoritmos = useCatalogo((s) => s.algoritmos)
  const error = useCatalogo((s) => s.error)
  const ordenamientos = algoritmos.filter((a) => a.familia === 'ordenamiento')
  const busquedas = algoritmos.filter((a) => a.familia === 'busqueda')

  if (algoritmos.length === 0) {
    return <EstadoCarga error={error} texto="Cargando la tabla…" alReintentar={() => useCatalogo.getState().cargar({ forzar: true })} />
  }

  return (
    <>
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">Tabla comparativa</h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-foreground/85">
          Los algoritmos del catálogo lado a lado. Si algún término no te resulta familiar, está explicado en{' '}
          <Link to="/conceptos" className="text-primary underline underline-offset-4">
            conceptos previos
          </Link>
          .
        </p>
      </header>

      <section aria-labelledby="tabla-ordenamiento" className="mt-12">
        <h2 id="tabla-ordenamiento" className="mb-4 text-2xl">
          Ordenamiento
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-card">
              <TableHead>Algoritmo</TableHead>
              <TableHead>Bloque</TableHead>
              <TableHead>Mejor caso</TableHead>
              <TableHead>Promedio</TableHead>
              <TableHead>Peor caso</TableHead>
              <TableHead>Memoria</TableHead>
              <TableHead>Estable</TableHead>
              <TableHead>En el sitio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordenamientos.map((algoritmo) => (
              <TableRow key={algoritmo.id}>
                <Nombre algoritmo={algoritmo} />
                <TableCell className="text-muted-foreground">{obtenerBloque(algoritmo.bloque).nombre}</TableCell>
                <Mono>{algoritmo.complejidad.mejor}</Mono>
                <Mono>{algoritmo.complejidad.promedio}</Mono>
                <Mono>{algoritmo.complejidad.peor}</Mono>
                <Mono>{algoritmo.espacio}</Mono>
                <SiNo valor={algoritmo.estable} />
                <SiNo valor={algoritmo.enSitio} />
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="prosa mt-6">
          <p>
            Ningún algoritmo gana en todas las columnas. Entre los que comparan elementos, mezcla es el único que
            garantiza n log n y además es estable, pero paga con memoria. Montículos garantiza el tiempo sin gastar
            memoria, pero pierde la estabilidad. Quicksort suele ser el más rápido, y aun así tiene un peor caso
            cuadrático.
          </p>
          <p>
            Los tres del bloque sin comparaciones parecen ganar a todos, pero sus columnas esconden condiciones: k es
            el rango de valores, d la cantidad de cifras y b la base. Sólo convienen cuando los datos tienen la forma
            que esos algoritmos necesitan.
          </p>
          <p>
            Por eso las bibliotecas estándar no usan ninguno en estado puro: combinan varios y eligen según el tamaño
            y la forma de los datos.          </p>
        </div>
      </section>

      <section aria-labelledby="tabla-busqueda" className="mt-14">
        <h2 id="tabla-busqueda" className="mb-4 text-2xl">
          Búsqueda
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-card">
              <TableHead>Algoritmo</TableHead>
              <TableHead>Requisito</TableHead>
              <TableHead>Mejor caso</TableHead>
              <TableHead>Promedio</TableHead>
              <TableHead>Peor caso</TableHead>
              <TableHead>Memoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {busquedas.map((algoritmo) => (
              <TableRow key={algoritmo.id}>
                <Nombre algoritmo={algoritmo} />
                <TableCell>{algoritmo.requisito}</TableCell>
                <Mono>{algoritmo.complejidad.mejor}</Mono>
                <Mono>{algoritmo.complejidad.promedio}</Mono>
                <Mono>{algoritmo.complejidad.peor}</Mono>
                <Mono>{algoritmo.espacio}</Mono>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="prosa mt-6">
          <p>
            La columna que decide es la del requisito. Si vas a buscar una sola vez en datos desordenados, la
            búsqueda lineal gana, porque ordenar cuesta más que recorrer. Si vas a buscar muchas veces, el costo de
            ordenar se reparte entre todas las búsquedas y la binaria domina.
          </p>
        </div>
      </section>
    </>
  )
}
