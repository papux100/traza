import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaBurbuja() {
  return (
    <Ficha
      id="burbuja"
      analogia={
        <>
          <p>
            Piensa en una fila de personas que quieren acomodarse por estatura, pero cada quien sólo puede compararse
            con quien tiene al lado. Si la persona de la izquierda es más alta, cambian de lugar. Se repite a lo largo
            de toda la fila, una y otra vez.
          </p>
          <p>
            En cada recorrido, la persona más alta de las que faltan termina al final, igual que una burbuja que sube
            hasta la superficie. De ahí el nombre.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>Recorre el arreglo de izquierda a derecha comparando cada elemento con su vecino.</li>
            <li>Si el de la izquierda es mayor, intercámbialos.</li>
            <li>Al terminar la pasada, el mayor de los que faltaban quedó al final. Ya no hay que volver a revisarlo.</li>
            <li>Repite con el tramo que queda, que es una posición más corto.</li>
            <li>Si en una pasada completa no hubo ningún intercambio, el arreglo ya está ordenado y puedes detenerte.</li>
          </ol>
        </>
      }
      requisitos={<p>Ninguno. Sólo necesita poder comparar e intercambiar elementos vecinos.</p>}
      complejidad={
        <>
          <p>
            En el caso promedio y en el peor, hace del orden de n² comparaciones e intercambios. El mejor caso lineal
            existe sólo gracias a la bandera que detecta una pasada sin intercambios: con un arreglo ya ordenado basta
            una pasada para confirmarlo.
          </p>
          <p>
            Su problema no son tanto las comparaciones como los intercambios. Un elemento que está lejos de su lugar
            avanza una sola posición por intercambio, y cada intercambio son dos escrituras en el arreglo. Observa el
            contador de escrituras en el visualizador y compáralo con el de inserción para la misma entrada.
          </p>
        </>
      }
      usarlo={[
        'Estás aprendiendo. Es el ordenamiento más fácil de entender y de escribir de memoria.',
        'Sólo quieres comprobar si un arreglo ya está ordenado: una pasada sin intercambios lo confirma.',
      ]}
      evitarlo={[
        'Casi siempre. Inserción es igual de sencilla, igual de estable, y hace menos trabajo con cualquier entrada.',
        'Hay elementos pequeños cerca del final. Avanzan una sola posición por pasada, así que obligan a dar muchas vueltas.',
      ]}
      implementacion={[
        <>
          La bandera <code>huboIntercambio</code> no es opcional si quieres el mejor caso lineal. Sin ella, el
          algoritmo hace todas las pasadas aunque el arreglo ya esté ordenado.
        </>,
        <>
          Reducir <code>n</code> después de cada pasada evita volver a comparar los elementos que ya quedaron en su
          lugar al final.
        </>,
        <>
          La comparación es estricta, <code>arr[j] &gt; arr[j + 1]</code>, para no intercambiar elementos iguales y
          conservar la estabilidad.
        </>,
      ]}
      relaciones={[
        {
          id: 'insercion',
          texto:
            'Ambos mueven elementos una posición a la vez, pero inserción desplaza con una sola escritura por posición y deja de comparar en cuanto encuentra el lugar. En la práctica, inserción gana siempre.',
        },
        {
          id: 'seleccion',
          texto:
            'Los dos dejan un elemento en su lugar definitivo en cada pasada. Burbuja lo consigue con muchos intercambios; selección, con uno solo.',
        },
        {
          id: 'coctelera',
          texto:
            'Recorre en ambas direcciones para que los elementos pequeños del final no tarden tanto en llegar al principio.',
        },
        {
          id: 'peine',
          texto:
            'Compara elementos lejanos antes que vecinos. Con ese único cambio, burbuja pasa de inservible a competitivo.',
        },
      ]}
    />
  )
}
