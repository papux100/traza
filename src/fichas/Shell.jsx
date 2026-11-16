import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaShell() {
  return (
    <Ficha
      id="shell"
      analogia={
        <>
          <p>
            Cuando acomodas una baraja muy revuelta, no empiezas afinando carta por carta. Primero haces una
            separación gruesa: las bajas por un lado, las altas por otro. Después afinas cada grupo. El ajuste fino del
            final es rápido porque ninguna carta está ya muy lejos de su lugar.
          </p>
          <p>
            Shell hace lo mismo con un arreglo: primero acomodos gruesos entre elementos lejanos, después ajustes cada
            vez más finos.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            El defecto de <Link to="/algoritmos/insercion">inserción</Link> es que cada elemento avanza una posición
            por movimiento. Si un valor pequeño está al final, tiene que cruzar todo el arreglo paso a paso. Shell
            ataca justo ese defecto.
          </p>
          <ol>
            <li>Elige un salto. Aquí se empieza con la mitad del tamaño del arreglo.</li>
            <li>
              Aplica inserción, pero comparando cada elemento con el que está un salto atrás, en lugar de con su
              vecino.
            </li>
            <li>Reduce el salto a la mitad y repite.</li>
            <li>Cuando el salto llega a 1, la pasada es una inserción normal y el arreglo queda ordenado.</li>
          </ol>
          <p>
            En el visualizador, las barras atenuadas son las que no participan en ese momento: con un salto de 4, por
            ejemplo, sólo se comparan entre sí las posiciones que están a cuatro lugares de distancia.
          </p>
        </>
      }
      requisitos={
        <p>
          Necesita acceso directo a cualquier posición, porque salta de un lugar a otro del arreglo. Por eso no se
          adapta bien a listas enlazadas.
        </p>
      }
      complejidad={
        <>
          <p>
            Es el mejor ejemplo del catálogo de un algoritmo cuyo rendimiento depende de un parámetro. La sucesión de
            saltos que se usa aquí, dividir entre dos cada vez, es la original y la más fácil de recordar, pero en el
            peor caso sigue siendo cuadrática.
          </p>
          <p>
            Con otras sucesiones el resultado cambia por completo. La de Knuth (1, 4, 13, 40, …) baja el peor caso a
            aproximadamente n elevado a 1.5, y existen sucesiones encontradas por experimentación que rinden todavía
            mejor. El caso promedio exacto no se conoce para la mayoría de ellas.
          </p>
          <p>
            No es estable: al saltar, un elemento puede pasar por encima de otro igual a él sin compararse nunca con
            él.
          </p>
        </>
      }
      usarlo={[
        'El arreglo es de tamaño mediano y quieres algo mucho mejor que inserción sin recursión ni memoria adicional.',
        'Trabajas en un entorno con muy poca memoria o donde la recursión es un problema, como un sistema embebido.',
        'Quieres un código corto y fácil de verificar.',
      ]}
      evitarlo={[
        'El arreglo es grande. Mezcla, quicksort y montículos garantizan o promedian n log n; Shell no.',
        'Necesitas estabilidad.',
        'No puedes dedicar tiempo a elegir una buena sucesión de saltos: con la más simple, el peor caso es cuadrático.',
      ]}
      implementacion={[
        <>
          La condición del ciclo interior es <code>j &gt;= salto</code>, no <code>j &gt; 0</code>. De lo contrario
          leerías posiciones negativas.
        </>,
        <>
          El último salto tiene que ser 1. Es esa pasada final la que garantiza que el arreglo quede ordenado; las
          anteriores sólo lo preparan.
        </>,
        <>
          Cambiar la sucesión de saltos no requiere tocar el resto del código: sólo cambia cómo se calcula el
          siguiente valor de <code>salto</code>.
        </>,
      ]}
      relaciones={[
        {
          id: 'insercion',
          texto:
            'Shell con salto de 1 es exactamente inserción. Todo lo que Shell agrega son las pasadas previas, que acercan cada elemento a su lugar para que esa inserción final tenga poco que hacer.',
        },
        {
          id: 'peine',
          texto:
            'Aplica la misma idea de los saltos decrecientes, pero sobre burbuja. Que funcione en ambos casos muestra que la técnica no depende del algoritmo de base.',
        },
        {
          id: 'quicksort',
          texto:
            'Quicksort también mueve elementos a grandes distancias desde el principio, pero lo hace partiendo el problema en dos. Eso le da un promedio de n log n que Shell no alcanza.',
        },
      ]}
    />
  )
}
