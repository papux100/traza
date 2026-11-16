import { Link } from 'react-router'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/componentes/ui/table'

const formato = new Intl.NumberFormat('es-MX')

const crecimiento = [16, 1000, 1000000].map((n) => ({
  n,
  log: Math.round(Math.log2(n)),
  nlog: Math.round(n * Math.log2(n)),
  cuadrado: n * n,
}))

function Concepto({ id, titulo, children }) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="mb-4 text-2xl">
        {titulo}
      </h2>
      <div className="prosa">{children}</div>
    </section>
  )
}

export default function Conceptos() {
  return (
    <>
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">Conceptos previos</h1>
        <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-foreground/85">
          Cuatro ideas que aparecen en todas las fichas. No hace falta dominarlas para usar el catálogo, pero ayudan a
          leer la sección de complejidad de cada algoritmo.
        </p>
      </header>

      <Concepto id="notacion" titulo="Notación asintótica">
        <p>
          Cuando una ficha dice que un algoritmo es <code>O(n²)</code>, no habla de segundos. Habla de cómo crece el
          trabajo cuando crece la entrada. Si <code>n</code> es la cantidad de elementos, un algoritmo{' '}
          <code>O(n²)</code> hace aproximadamente cuatro veces más trabajo cuando la entrada se duplica; uno{' '}
          <code>O(n)</code>, el doble; uno <code>O(log n)</code>, apenas un paso más.
        </p>
        <p>
          La notación ignora los detalles pequeños a propósito. No importa si son <code>3n²</code> o{' '}
          <code>n² + 50</code> operaciones: con entradas grandes, lo que manda es la forma del crecimiento.
        </p>
        <p>Esta tabla muestra cuántas operaciones representa cada forma para tres tamaños de entrada:</p>
      </Concepto>

      <div className="mt-5 max-w-3xl">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-card">
              <TableHead>Elementos (n)</TableHead>
              <TableHead>log n</TableHead>
              <TableHead>n</TableHead>
              <TableHead>n log n</TableHead>
              <TableHead>n²</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crecimiento.map((fila) => (
              <TableRow key={fila.n}>
                <TableCell className="font-mono">{formato.format(fila.n)}</TableCell>
                <TableCell className="font-mono">{formato.format(fila.log)}</TableCell>
                <TableCell className="font-mono">{formato.format(fila.n)}</TableCell>
                <TableCell className="font-mono">{formato.format(fila.nlog)}</TableCell>
                <TableCell className="font-mono">{formato.format(fila.cuadrado)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="prosa mt-5">
        <p>
          Con 16 elementos, todas las columnas son manejables, y por eso en arreglos pequeños gana el algoritmo más
          simple. Con un millón, la diferencia entre <code>n log n</code> y <code>n²</code> es la diferencia entre
          veinte millones de operaciones y un billón.
        </p>
        <p>
          Cada ficha da tres valores: el <strong>mejor caso</strong>, con la entrada más favorable; el{' '}
          <strong>caso promedio</strong>, con una entrada cualquiera; y el <strong>peor caso</strong>, con la entrada
          más desfavorable. Que dos algoritmos compartan el promedio no los hace equivalentes: el peor caso de{' '}
          <Link to="/algoritmos/quicksort">quicksort</Link> es muy distinto del de{' '}
          <Link to="/algoritmos/mezcla">mezcla</Link>.
        </p>
      </div>

      <Concepto id="estabilidad" titulo="Estabilidad">
        <p>
          Un ordenamiento es estable si los elementos con el mismo valor conservan, al terminar, el orden que tenían
          entre sí al empezar.
        </p>
        <p>
          Con números sueltos da igual: un 3 es idéntico a otro 3. Importa cuando cada elemento lleva más datos de los
          que se usan para ordenar. Supón una lista de alumnos ordenada por nombre que ahora quieres ordenar por
          calificación. Con un algoritmo estable, los alumnos con la misma calificación siguen en orden alfabético.
          Con uno que no lo es, ese orden previo puede perderse.
        </p>
        <p>
          La estabilidad suele depender de un detalle mínimo del código, como usar <code>&gt;</code> en lugar de{' '}
          <code>&gt;=</code>. En el visualizador puedes comprobarla escribiendo valores repetidos:{' '}
          <Link to="/algoritmos/seleccion">selección</Link> con <code>3, 3, 1</code> invierte los dos 3, mientras que{' '}
          <Link to="/algoritmos/insercion">inserción</Link> los deja como estaban.
        </p>
      </Concepto>

      <Concepto id="en-sitio" titulo="Trabajar en el sitio">
        <p>
          Un algoritmo trabaja en el sitio cuando reacomoda los elementos dentro del mismo arreglo, usando sólo unas
          cuantas variables auxiliares. La memoria que necesita no crece con el tamaño de la entrada, o crece muy
          poco.
        </p>
        <p>
          <Link to="/algoritmos/mezcla">Mezcla</Link> es el ejemplo contrario: para combinar dos mitades necesita
          copiarlas, así que ocupa un espacio adicional proporcional al arreglo. Con datos que apenas caben en
          memoria, esa diferencia decide qué algoritmo se puede usar.
        </p>
      </Concepto>

      <Concepto id="contadores" titulo="Comparaciones, intercambios y escrituras">
        <p>El visualizador cuenta tres cosas mientras se ejecuta un ordenamiento:</p>
        <ul>
          <li>
            <strong>Comparaciones:</strong> cuántas veces se preguntó si un elemento es mayor o menor que otro.
          </li>
          <li>
            <strong>Intercambios:</strong> cuántas veces dos elementos cambiaron de lugar entre sí.
          </li>
          <li>
            <strong>Escrituras:</strong> cuántas veces se guardó un valor en una posición del arreglo. Un
            intercambio son dos escrituras; un desplazamiento es una.
          </li>
        </ul>
        <p>
          Conviene mirarlas por separado porque no cuestan lo mismo en todos los contextos. Comparar dos números es
          barato; comparar dos textos largos no. Escribir en memoria es barato; escribir en ciertos dispositivos no.
          Un algoritmo que compara mucho y escribe poco, como selección, puede ser mejor o peor que otro según qué
          operación sea la cara.
        </p>
        <p>
          En las búsquedas, el arreglo no cambia. Ahí se cuentan las comparaciones y cuántos elementos quedaron
          descartados sin haberlos revisado uno por uno.
        </p>
      </Concepto>
    </>
  )
}
