import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaPeine() {
  return (
    <Ficha
      id="peine"
      analogia={
        <>
          <p>
            Para desenredar el cabello no se empieza con un peine fino. Primero pasas uno de dientes separados, que
            deshace los nudos grandes; después uno cada vez más cerrado, hasta que el último deja todo liso.
          </p>
          <p>
            Este algoritmo compara primero elementos muy separados y va cerrando la distancia, igual que los dientes
            del peine.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            <Link to="/algoritmos/burbuja">Burbuja</Link> sólo compara vecinos, así que un valor pequeño atrapado al
            final necesita muchas pasadas para llegar al principio. Peine le da a burbuja la misma idea que{' '}
            <Link to="/algoritmos/shell">Shell</Link> le da a inserción.
          </p>
          <ol>
            <li>Empieza con un salto igual al tamaño del arreglo y divídelo entre 1.3, redondeando hacia abajo.</li>
            <li>Compara cada elemento con el que está un salto más adelante, e intercámbialos si están en desorden.</li>
            <li>Divide otra vez el salto entre 1.3 y repite.</li>
            <li>
              Cuando el salto llega a 1 es una pasada de burbuja normal. Se repite hasta que una pasada completa
              termina sin intercambios.
            </li>
          </ol>
          <p>
            El factor 1.3 no sale de una fórmula: se encontró probando, porque con él se obtenían los mejores
            resultados en la práctica.
          </p>
        </>
      }
      requisitos={<p>Necesita acceso directo por posición, para comparar elementos separados por un salto.</p>}
      complejidad={
        <>
          <p>
            En el peor caso sigue siendo cuadrático, y su mejor caso es n log n, porque recorre todos los saltos aunque
            el arreglo ya esté ordenado. Para el caso promedio no hay una fórmula sencilla: depende de p, la cantidad
            de saltos que se usan.
          </p>
          <p>
            Lo importante es lo que pasa en la práctica: con entradas comunes se acerca mucho al comportamiento de los
            algoritmos n log n, a pesar de ser apenas unas líneas más que burbuja.
          </p>
          <p>
            No es estable. Al intercambiar elementos lejanos, uno puede saltar por encima de otro igual a él.
          </p>
        </>
      }
      usarlo={[
        'Quieres algo mucho mejor que burbuja sin complicar el código.',
        'El arreglo es mediano y no necesitas estabilidad ni garantías.',
      ]}
      evitarlo={[
        'Necesitas un tiempo garantizado o estabilidad.',
        'El arreglo es grande y tienes a mano mezcla, quicksort o montículos.',
      ]}
      implementacion={[
        <>
          La bandera <code>ordenado</code> sólo puede terminar el ciclo cuando el salto ya es 1. Con saltos mayores,
          que no haya intercambios no significa que el arreglo esté ordenado.
        </>,
        <>
          El ciclo interior va mientras <code>i + salto &lt; arr.length</code>, para no comparar fuera del arreglo.
        </>,
        <>
          Hay variantes que nunca usan los saltos 9 y 10, sino 11 en su lugar, porque se observó que eso mejora el
          resultado.
        </>,
      ]}
      relaciones={[
        {
          id: 'burbuja',
          texto: 'Peine con salto 1 desde el principio sería burbuja. Las pasadas con saltos grandes son lo que lo vuelve útil.',
        },
        {
          id: 'shell',
          texto:
            'Aplica la misma técnica de saltos decrecientes, pero sobre inserción. Que funcione en ambos muestra que la idea no depende del algoritmo de base.',
        },
        {
          id: 'coctelera',
          texto: 'Ataca el mismo defecto de burbuja, los elementos pequeños al final, pero con mucho más éxito.',
        },
      ]}
    />
  )
}
