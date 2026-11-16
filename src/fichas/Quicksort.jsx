import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaQuicksort() {
  return (
    <Ficha
      id="quicksort"
      analogia={
        <>
          <p>
            Un profesor quiere formar a su grupo por estatura. Elige a un alumno cualquiera y dice: los más bajos que
            él, a su izquierda; los demás, a su derecha. Ese alumno ya está en su lugar definitivo, aunque los dos
            grupos sigan revueltos.
          </p>
          <p>
            Luego hace lo mismo dentro de cada grupo, con un nuevo alumno de referencia. Los grupos se van haciendo
            más pequeños hasta que cada uno tiene una sola persona, y entonces toda la fila está formada.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>Elige un elemento del tramo como pivote. Aquí se usa el último.</li>
            <li>
              Recorre el tramo. Cada elemento menor que el pivote se envía a la zona de menores, que crece desde la
              izquierda.
            </li>
            <li>
              Al terminar, coloca el pivote justo después de esa zona. A su izquierda quedaron los menores y a su
              derecha los demás: el pivote ya no se moverá.
            </li>
            <li>Repite el procedimiento en el tramo de la izquierda y en el de la derecha.</li>
            <li>Un tramo de uno o cero elementos ya está ordenado.</li>
          </ol>
          <p>
            A este reparto alrededor del pivote se le llama partición. La versión que se muestra es la de Lomuto, la
            más fácil de seguir; existe otra, la de Hoare, que hace menos intercambios.
          </p>
        </>
      }
      requisitos={
        <p>
          Necesita acceso directo a cualquier posición del arreglo. No requiere memoria para copiar datos, aunque sí
          usa la pila de llamadas para la recursión.
        </p>
      }
      complejidad={
        <>
          <p>
            Todo depende de qué tan parejo salga el reparto. Si el pivote cae cerca de la mitad, el problema se divide
            en dos partes similares y el costo es n log n. Si el pivote resulta ser siempre el menor o el mayor, un
            lado queda vacío, el problema apenas se reduce en un elemento y el costo sube a n².
          </p>
          <p>
            Con el pivote al final, ese peor caso ocurre justo con una entrada que parece inofensiva: un arreglo ya
            ordenado. Pruébalo en el visualizador con <code>1, 2, 3, 4, 5, 6, 7, 8</code> y compara las comparaciones
            con las de una entrada revuelta.
          </p>
          <p>
            La memoria adicional es la profundidad de la recursión: del orden de log n cuando los repartos son
            parejos, y hasta n en el peor caso.
          </p>
        </>
      }
      usarlo={[
        'Ordenas arreglos grandes en memoria y te importa la velocidad promedio. En la práctica suele ser el más rápido.',
        'No puedes gastar memoria en una copia del arreglo.',
        'No necesitas estabilidad.',
      ]}
      evitarlo={[
        'Necesitas un tiempo garantizado. Una entrada desfavorable, o elegida a propósito por alguien, puede llevarlo al caso cuadrático.',
        'Necesitas conservar el orden de los elementos iguales.',
        'Los datos suelen llegar ordenados o casi ordenados y usas un pivote fijo en un extremo.',
      ]}
      implementacion={[
        <>
          Elegir el pivote es la decisión más importante. Tomarlo al azar, o usar la mediana entre el primero, el del
          medio y el último, vuelve muy improbable el peor caso.
        </>,
        <>
          Las llamadas recursivas excluyen al pivote: van de <code>inicio</code> a <code>i - 1</code> y de{' '}
          <code>i + 1</code> a <code>fin</code>. Incluirlo puede provocar una recursión que nunca termina.
        </>,
        <>
          Con muchos elementos repetidos, esta partición reparte mal. Existe una variante de tres zonas (menores,
          iguales y mayores) pensada para ese caso.
        </>,
      ]}
      relaciones={[
        {
          id: 'mezcla',
          texto:
            'Ambos dividen y vencen. Quicksort trabaja antes de dividir y no necesita combinar; mezcla divide sin trabajo y combina después. Quicksort gana en memoria y velocidad promedio; mezcla gana en garantías y estabilidad.',
        },
        {
          id: 'monticulos',
          texto:
            'Introsort, el ordenamiento de la biblioteca estándar de C++, empieza con quicksort y cambia a montículos si la recursión se vuelve demasiado profunda. Así conserva la velocidad de uno y la garantía del otro.',
        },
        {
          id: 'insercion',
          texto:
            'Las implementaciones reales dejan de partir cuando el tramo es pequeño y lo terminan con inserción, que en tamaños chicos es más rápida.',
        },
      ]}
    />
  )
}
