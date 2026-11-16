import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaBusquedaSaltos() {
  return (
    <Ficha
      id="busqueda-saltos"
      analogia={
        <>
          <p>
            Buscas un número de página en un libro grueso. Pasas las hojas de diez en diez hasta que el número que ves
            ya es mayor que el que buscas. Entonces sabes que te pasaste por poco, regresas al bloque anterior y lo
            recorres hoja por hoja.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>
              Elige un tamaño de salto. El mejor valor es la raíz cuadrada de la cantidad de elementos, redondeada
              hacia abajo.
            </li>
            <li>
              Avanza de bloque en bloque mirando sólo el último elemento de cada uno. Mientras sea menor que el valor
              buscado, el valor no puede estar en ese bloque.
            </li>
            <li>
              Cuando el último elemento de un bloque ya no es menor, el valor, si está, tiene que estar dentro de ese
              bloque.
            </li>
            <li>Recorre ese bloque uno por uno, como en la búsqueda lineal.</li>
          </ol>
        </>
      }
      requisitos={
        <p>
          <strong>Los datos deben estar ordenados</strong>, como en la búsqueda binaria. También necesita poder saltar
          hacia adelante a una posición concreta.
        </p>
      }
      complejidad={
        <>
          <p>
            Con bloques de tamaño √n hay como mucho √n bloques que saltar y √n elementos que revisar dentro del último:
            unas 2√n comparaciones en el peor caso. Para un millón de elementos son unas dos mil.
          </p>
          <p>
            Es mucho mejor que la búsqueda lineal y mucho peor que la binaria, que necesitaría unas veinte. Su interés
            no está en la cantidad de comparaciones, sino en el tipo de movimiento que hace.
          </p>
        </>
      }
      usarlo={[
        'Retroceder es caro y avanzar es barato, como en datos que se leen en secuencia desde un medio lento. Esta búsqueda sólo retrocede una vez.',
        'Quieres algo más rápido que la búsqueda lineal pero con un código igual de sencillo de verificar.',
      ]}
      evitarlo={[
        'Tienes acceso directo y barato a cualquier posición. La búsqueda binaria es mucho más rápida.',
        'Los datos no están ordenados.',
      ]}
      implementacion={[
        <>
          Se usa <code>Math.min(actual, n) - 1</code> para mirar el final del bloque. El último bloque puede ser más
          corto que los demás y no hay que leer fuera del arreglo.
        </>,
        <>
          El ciclo de saltos se detiene si <code>anterior</code> llega a <code>n</code>: significa que todos los
          bloques terminaron en valores menores y el buscado no está.
        </>,
        <>Con valores repetidos, devuelve la primera aparición dentro del bloque donde la encuentra.</>,
      ]}
      relaciones={[
        {
          id: 'busqueda-lineal',
          texto: 'Es la búsqueda que hace dentro del último bloque. Los saltos sólo sirven para no tener que empezar desde el principio.',
        },
        {
          id: 'busqueda-binaria',
          texto: (
            <>
              Con datos ordenados y acceso directo, la{' '}
              <Link to="/algoritmos/busqueda-binaria">binaria</Link> siempre necesita menos comparaciones. Saltos sólo
              gana cuando retroceder cuesta más que comparar.
            </>
          ),
        },
        {
          id: 'busqueda-exponencial',
          texto: 'También avanza a saltos, pero cada vez más largos, y termina con búsqueda binaria en lugar de lineal.',
        },
      ]}
    />
  )
}
