import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaArbol() {
  return (
    <Ficha
      id="arbol"
      analogia={
        <>
          <p>
            Piensa en un juego de adivinanzas por bifurcaciones. Cada pregunta divide el camino: menor a la izquierda,
            mayor a la derecha. Cada número nuevo baja por esas preguntas hasta llegar a un lugar libre y se queda ahí.
          </p>
          <p>
            Al final, si recorres el árbol siempre visitando primero todo lo de la izquierda, luego el nodo y luego lo
            de la derecha, lees los números en orden.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>Tiene dos fases muy distintas.</p>
          <ol>
            <li>
              Construcción: cada elemento se inserta en un árbol binario de búsqueda. Empieza en la raíz y baja: si es
              menor que el nodo va a la izquierda, si no, a la derecha, hasta encontrar un lugar vacío.
            </li>
            <li>
              Recorrido en orden: se visita el subárbol izquierdo, luego el nodo, luego el subárbol derecho. Cada nodo
              visitado se escribe en la siguiente posición del arreglo.
            </li>
          </ol>
          <p>
            En el visualizador, los elementos salen del arreglo hacia el árbol y luego regresan ordenados. Prueba con{' '}
            <code>1, 2, 3, 4, 5, 6, 7, 8</code>: cada número va siempre a la derecha del anterior y el árbol se
            convierte en una sola rama larga.
          </p>
        </>
      }
      requisitos={
        <p>
          Necesita memoria para un nodo por cada elemento, con sus dos enlaces. Es bastante más de lo que usan los
          algoritmos que trabajan en el sitio.
        </p>
      }
      complejidad={
        <>
          <p>
            Si el árbol queda equilibrado, su altura es del orden de log n y cada inserción cuesta eso: el total es n
            log n. Si los datos llegan ordenados, el árbol degenera en una lista, cada inserción recorre todo lo
            anterior y el costo sube a n².
          </p>
          <p>
            Se puede garantizar n log n usando un árbol que se reequilibra solo, como un AVL o un árbol rojinegro, a
            cambio de un código bastante más complejo.
          </p>
          <p>
            Esta versión es estable: los elementos iguales a un nodo van a su derecha, así que el recorrido en orden
            los visita en el mismo orden en que llegaron.
          </p>
        </>
      }
      usarlo={[
        'Los datos llegan de uno en uno y necesitas tenerlos ordenados en todo momento, no sólo al final.',
        'Además de ordenar, quieres buscar, insertar y borrar elementos después. El árbol sirve para todo eso.',
      ]}
      evitarlo={[
        'Sólo necesitas ordenar una vez. Usa más memoria y suele ser más lento que quicksort o mezcla.',
        'Los datos pueden venir ordenados o casi ordenados y no usas un árbol que se reequilibre.',
      ]}
      implementacion={[
        <>
          La comparación es <code>valor &lt; nodo.valor</code>, y todo lo demás va a la derecha. Ese detalle es lo que
          hace estable al algoritmo.
        </>,
        <>
          El recorrido es recursivo. Con un árbol degenerado, la profundidad de la recursión llega a n y puede agotar
          la pila en lenguajes con un límite bajo.
        </>,
        <>
          La función <code>insertar</code> devuelve el nodo para poder reconstruir los enlaces al regresar de la
          recursión. Es la forma más corta de escribirla, aunque también hay versiones con un ciclo.
        </>,
      ]}
      relaciones={[
        {
          id: 'quicksort',
          texto:
            'Son parientes cercanos. La raíz de cada subárbol cumple el papel de un pivote: todo lo menor queda a un lado y lo demás al otro. Si quicksort usara como pivote el primer elemento de cada tramo y repartiera conservando el orden de llegada, haría exactamente las mismas comparaciones. La diferencia es que quicksort reparte en el sitio y el árbol guarda el reparto en una estructura.',
        },
        {
          id: 'busqueda-binaria',
          texto:
            'Un árbol binario de búsqueda es la búsqueda binaria convertida en estructura de datos: cada nodo es un punto medio y cada rama, la mitad que queda.',
        },
        {
          id: 'monticulos',
          texto:
            'También ordena con un árbol, pero con otra regla: el padre es mayor que sus hijos, sin importar izquierda o derecha. Esa regla más débil permite guardarlo dentro del mismo arreglo.',
        },
      ]}
    />
  )
}
