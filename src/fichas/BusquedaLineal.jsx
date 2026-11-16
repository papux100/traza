import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaBusquedaLineal() {
  return (
    <Ficha
      id="busqueda-lineal"
      analogia={
        <>
          <p>
            Buscas tus llaves en una casa donde nada tiene un lugar fijo. No hay atajo posible: revisas un sitio, luego
            el siguiente, y así hasta encontrarlas o hasta haber revisado todos.
          </p>
          <p>
            Puede que aparezcan en el primer lugar donde miras, o en el último. Lo único seguro es que, si están, las
            vas a encontrar.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>Empieza en la primera posición del arreglo.</li>
            <li>Compara el elemento de esa posición con el valor buscado.</li>
            <li>Si son iguales, terminaste: devuelve la posición.</li>
            <li>Si no, pasa a la siguiente posición y repite.</li>
            <li>Si llegas al final sin encontrarlo, el valor no está.</li>
          </ol>
          <p>
            Cada comparación descarta un solo elemento. En el visualizador, las barras que se apagan son las que ya se
            revisaron.
          </p>
        </>
      }
      requisitos={
        <p>
          Ninguno, y esa es su razón de ser. No exige que los datos estén ordenados ni que se pueda saltar a una
          posición cualquiera: basta con poder recorrerlos en secuencia. Funciona igual sobre arreglos, listas
          enlazadas o datos que se leen de un archivo.
        </p>
      }
      complejidad={
        <>
          <p>
            Si el valor está al inicio, basta una comparación. Si está al final, o no está, hay que revisar los n
            elementos. En promedio, cuando el valor sí está, se revisa la mitad.
          </p>
          <p>
            Confirmar que un valor no está es siempre el peor caso: no hay forma de saberlo sin revisar todo.
          </p>
        </>
      }
      usarlo={[
        'Los datos no están ordenados y sólo vas a buscar una o pocas veces. Ordenar primero costaría más que recorrer.',
        'El arreglo es pequeño. Con unas decenas de elementos, la diferencia con métodos más elaborados no se nota.',
        'Los datos sólo se pueden recorrer en secuencia, como en una lista enlazada.',
      ]}
      evitarlo={[
        'Vas a buscar muchas veces en los mismos datos. Conviene ordenarlos una vez y usar búsqueda binaria.',
        'El arreglo es grande y ya está ordenado. Estarías desperdiciando la información que da el orden.',
      ]}
      implementacion={[
        <>
          Devuelve en cuanto encuentres el valor. Seguir recorriendo después no cambia el resultado y desperdicia
          trabajo.
        </>,
        <>
          Devolver <code>-1</code> cuando no está es una convención: ninguna posición válida es negativa, así que no
          puede confundirse con un resultado real.
        </>,
        <>
          Si hay valores repetidos, esta versión devuelve la primera aparición. Para obtener todas, hay que seguir
          hasta el final y acumular las posiciones.
        </>,
      ]}
      relaciones={[
        {
          id: 'busqueda-binaria',
          texto: (
            <>
              Es la alternativa cuando los datos están ordenados. La lineal descarta un elemento por comparación; la{' '}
              <Link to="/algoritmos/busqueda-binaria">binaria</Link> descarta la mitad de los que quedan. En un
              millón de elementos, eso es la diferencia entre un millón de comparaciones y unas veinte.
            </>
          ),
        },
        {
          id: 'seleccion',
          texto:
            'El ciclo interior de selección, que busca el menor de los elementos restantes, es una búsqueda lineal. Por eso selección no puede bajar de n² comparaciones.',
        },
        {
          id: 'busqueda-saltos',
          texto:
            'Sobre datos ordenados, avanza a brincos y sólo hace búsqueda lineal dentro del último brinco.',
        },
      ]}
    />
  )
}
