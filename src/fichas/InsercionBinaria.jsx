import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaInsercionBinaria() {
  return (
    <Ficha
      id="insercion-binaria"
      analogia={
        <>
          <p>
            Vas a acomodar un libro nuevo en un estante ordenado por título. En lugar de leer los lomos uno por uno
            desde la izquierda, miras el del centro, decides si el tuyo va antes o después, y repites con la mitad que
            corresponde. En pocos vistazos sabes el lugar exacto.
          </p>
          <p>
            Pero saber el lugar no te ahorra el esfuerzo de hacer espacio: todos los libros que quedan a la derecha
            tienen que recorrerse igual.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            Es <Link to="/algoritmos/insercion">inserción</Link> con un solo cambio: la forma de encontrar dónde va
            cada elemento.
          </p>
          <ol>
            <li>Toma el siguiente elemento sin ordenar, la clave.</li>
            <li>
              Busca su lugar en la parte ordenada con{' '}
              <Link to="/algoritmos/busqueda-binaria">búsqueda binaria</Link>: mira el elemento del medio, descarta la
              mitad donde no puede ir y repite.
            </li>
            <li>Desplaza una posición a la derecha todos los elementos que quedan entre ese lugar y la clave.</li>
            <li>Coloca la clave en el hueco y continúa con el siguiente elemento.</li>
          </ol>
          <p>
            En el visualizador, mira los contadores: las comparaciones crecen mucho más despacio que en inserción, pero
            las escrituras son exactamente las mismas.
          </p>
        </>
      }
      requisitos={
        <p>
          Necesita acceso directo por posición, porque la búsqueda binaria salta al medio del tramo. En una lista
          enlazada no tendría sentido.
        </p>
      }
      complejidad={
        <>
          <p>
            Encontrar el lugar de cada elemento cuesta log n comparaciones en lugar de hasta n, así que en total hace
            del orden de n log n comparaciones. Los desplazamientos no cambian: en el peor caso siguen siendo del orden
            de n², y son ellos los que dominan el tiempo.
          </p>
          <p>
            Por eso el resultado es una mejora menor de lo que parece. Incluso su mejor caso es peor que el de
            inserción normal: con un arreglo ya ordenado, inserción hace una comparación por elemento y la versión
            binaria sigue haciendo log n.
          </p>
        </>
      }
      usarlo={[
        'Comparar es caro, por ejemplo con textos largos u objetos que se comparan por varios campos, y mover es barato.',
        'Necesitas un ordenamiento estable y sencillo para arreglos pequeños.',
      ]}
      evitarlo={[
        'Los datos ya vienen casi ordenados. Inserción normal lo aprovecha mejor.',
        'El arreglo es grande. Los desplazamientos lo mantienen cuadrático.',
      ]}
      implementacion={[
        <>
          Para conservar la estabilidad, la búsqueda debe encontrar la primera posición con un elemento estrictamente
          mayor que la clave. Por eso la condición es <code>arr[medio] &lt;= clave</code>: ante un igual, la búsqueda
          sigue hacia la derecha.
        </>,
        <>
          Aquí el límite superior empieza en <code>i</code>, no en <code>i - 1</code>, porque la clave también puede
          quedarse donde está.
        </>,
        <>
          En lenguajes con funciones para mover bloques de memoria, los desplazamientos se pueden hacer de una sola
          vez, lo que reduce bastante su costo real.
        </>,
      ]}
      relaciones={[
        {
          id: 'insercion',
          texto:
            'Es su variante directa. Ahorra comparaciones pero no movimientos, así que sólo gana cuando comparar es lo caro.',
        },
        {
          id: 'busqueda-binaria',
          texto: 'Es la búsqueda que usa por dentro, aplicada a la parte ya ordenada del arreglo.',
        },
        {
          id: 'mezcla',
          texto:
            'Timsort, que combina las ideas de mezcla e inserción, usa precisamente inserción binaria para ordenar sus tramos cortos.',
        },
      ]}
    />
  )
}
