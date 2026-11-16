import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaBusquedaBinaria() {
  return (
    <Ficha
      id="busqueda-binaria"
      analogia={
        <>
          <p>
            Buscas una palabra en un diccionario de papel. No empiezas por la primera página: lo abres más o menos a
            la mitad. Si la palabra que buscas va antes de las que ves, ya sabes que toda la mitad derecha no te
            sirve. Repites con la mitad izquierda, y así, hasta dar con la página.
          </p>
          <p>
            Funciona por una sola razón: el diccionario está en orden alfabético. Con las palabras revueltas, abrir a
            la mitad no te diría nada.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            Se mantiene un rango de posiciones donde el valor todavía podría estar. Al inicio, el rango es todo el
            arreglo.
          </p>
          <ol>
            <li>Calcula la posición del medio del rango.</li>
            <li>Si el elemento del medio es el valor buscado, terminaste.</li>
            <li>
              Si es menor que el valor buscado, el valor sólo puede estar a la derecha: el nuevo límite inferior es
              la posición siguiente al medio.
            </li>
            <li>
              Si es mayor, sólo puede estar a la izquierda: el nuevo límite superior es la posición anterior al medio.
            </li>
            <li>Repite mientras el rango tenga al menos un elemento. Si queda vacío, el valor no está.</li>
          </ol>
          <p>
            En el visualizador, los marcadores <code>inf</code>, <code>med</code> y <code>sup</code> muestran el
            rango en cada paso, y la línea punteada indica la altura del valor buscado.
          </p>
        </>
      }
      requisitos={
        <>
          <p>
            <strong>Los datos deben estar ordenados.</strong> Es el requisito que más se olvida y el que hace que el
            algoritmo devuelva resultados equivocados sin dar ningún error. Si el arreglo no está ordenado, descartar
            una mitad deja de ser válido.
          </p>
          <p>
            También necesita acceso directo a cualquier posición, para poder saltar al medio. En una lista enlazada,
            llegar al medio ya cuesta un recorrido, y la ventaja se pierde.
          </p>
        </>
      }
      complejidad={
        <>
          <p>
            Cada comparación reduce el rango a la mitad. La pregunta es cuántas veces se puede partir n a la mitad
            hasta llegar a uno, y la respuesta es log n. Para un millón de elementos son unas veinte comparaciones;
            para mil millones, unas treinta.
          </p>
          <p>
            Ese crecimiento tan lento es lo que la distingue. Duplicar el tamaño de los datos agrega una sola
            comparación.
          </p>
        </>
      }
      usarlo={[
        'Los datos ya están ordenados, o vas a buscar tantas veces que vale la pena ordenarlos una vez.',
        'El arreglo es grande. Mientras más grande, mayor es la ventaja sobre la búsqueda lineal.',
        'Buscas un límite más que un valor exacto: la primera posición que cumple una condición en una secuencia ordenada.',
      ]}
      evitarlo={[
        'Los datos no están ordenados y vas a buscar una sola vez. Ordenar cuesta más que una búsqueda lineal.',
        'Los datos cambian constantemente. Mantener el arreglo ordenado tras cada inserción puede costar más de lo que ahorra la búsqueda.',
        'No hay acceso directo por posición, como en una lista enlazada.',
      ]}
      implementacion={[
        <>
          El punto medio se calcula como <code>inf + Math.floor((sup - inf) / 2)</code>. La forma que parece más
          natural, <code>(inf + sup) / 2</code>, puede desbordarse en lenguajes con enteros de tamaño fijo, como Java
          o C++, cuando el arreglo es muy grande. Es un error famoso que pasó años sin detectarse en bibliotecas muy
          usadas.
        </>,
        <>
          La condición del ciclo es <code>inf &lt;= sup</code>, con el igual. Sin él, un rango de un solo elemento no
          se revisaría.
        </>,
        <>
          Los límites se mueven a <code>medio + 1</code> y <code>medio - 1</code>, nunca a <code>medio</code>. De lo
          contrario, el rango podría dejar de encogerse y el ciclo no terminaría.
        </>,
        <>
          Si hay valores repetidos, esta versión devuelve cualquiera de sus posiciones, no necesariamente la primera.
        </>,
      ]}
      relaciones={[
        {
          id: 'busqueda-lineal',
          texto: (
            <>
              La <Link to="/algoritmos/busqueda-lineal">búsqueda lineal</Link> no pide nada a los datos y paga por
              ello revisando todo. La binaria exige orden y a cambio descarta la mitad en cada paso. Cuál conviene
              depende de cuántas veces vayas a buscar.
            </>
          ),
        },
        {
          id: 'mezcla',
          texto:
            'Los ordenamientos existen, en buena medida, para hacer posible esta búsqueda. Ordenar una vez con un algoritmo de n log n y luego buscar muchas veces en log n es de las combinaciones más rentables de la computación.',
        },
        {
          id: 'insercion-binaria',
          texto:
            'Usa búsqueda binaria dentro de inserción para localizar dónde va cada elemento.',
        },
        {
          id: 'busqueda-interpolacion',
          texto:
            'En lugar de ir siempre al medio, estima la posición según el valor. Gana cuando los datos están repartidos de manera uniforme.',
        },
      ]}
    />
  )
}
