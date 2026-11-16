import { Link } from 'react-router'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'
import { DISPONIBLES, obtenerBloque, rutaDe } from '@/datos/catalogo'

const ordenamientos = DISPONIBLES.filter((a) => a.familia === 'ordenamiento')
const busquedas = DISPONIBLES.filter((a) => a.familia === 'busqueda')

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
            Ningún algoritmo gana en todas las columnas. Mezcla es el único eficiente y estable, pero paga con
            memoria. Montículos garantiza el tiempo sin gastar memoria, pero pierde la estabilidad. Quicksort suele
            ser el más rápido y es el único de los tres con un peor caso cuadrático.
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
