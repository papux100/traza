import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaMonticulos() {
  return (
    <Ficha
      id="monticulos"
      analogia={
        <>
          <p>
            Un torneo por eliminación directa: en cada ronda gana el mejor de cada enfrentamiento y sube al siguiente
            nivel, hasta que queda un campeón arriba. Encontrar al campeón costó muchos partidos, pero encontrar al
            subcampeón cuesta muy pocos: basta revisar a quienes perdieron contra el campeón.
          </p>
          <p>
            Un montículo conserva esa estructura de torneo. Por eso, después de sacar al mayor, reacomodar para
            encontrar el siguiente mayor es barato.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            Un montículo es un árbol en el que cada padre es mayor o igual que sus hijos. No hace falta construir
            ningún árbol aparte: se lee directamente sobre el arreglo. Los hijos del elemento en la posición{' '}
            <code>p</code> están en <code>2p + 1</code> y <code>2p + 2</code>.
          </p>
          <ol>
            <li>
              Convierte el arreglo en un montículo. Para ello se recorren los padres de atrás hacia adelante y cada
              uno se hunde: si alguno de sus hijos es mayor, se intercambia con el mayor de ellos y sigue bajando.
            </li>
            <li>Ahora el mayor de todos está en la primera posición. Intercámbialo con el último elemento.</li>
            <li>
              El mayor quedó en su lugar definitivo. El montículo se encoge una posición y ya no lo incluye.
            </li>
            <li>El elemento que llegó a la raíz rompe la regla. Húndelo hasta restaurarla.</li>
            <li>Repite hasta que el montículo tenga un solo elemento.</li>
          </ol>
          <p>
            En el visualizador, los marcadores <code>padre</code>, <code>izq</code> y <code>der</code> señalan en cada
            comparación quién es quién dentro del árbol.
          </p>
        </>
      }
      requisitos={
        <p>
          Necesita acceso directo por posición, porque salta constantemente entre un padre y sus hijos. Conviene
          entender primero la idea de montículo; sin ella, los saltos sobre el arreglo parecen arbitrarios.
        </p>
      }
      complejidad={
        <>
          <p>
            Construir el montículo cuesta un tiempo lineal. Después hay n extracciones, y en cada una el elemento que
            llega a la raíz baja como mucho la altura del árbol, que es log n. El total es n log n con cualquier
            entrada.
          </p>
          <p>
            Es el único algoritmo del catálogo que reúne las dos garantías: tiempo n log n en el peor caso y ninguna
            memoria adicional.
          </p>
          <p>
            En la práctica suele ser más lento que quicksort. Los saltos entre padres e hijos recorren posiciones muy
            alejadas del arreglo, y eso aprovecha mal la memoria caché del procesador.
          </p>
        </>
      }
      usarlo={[
        'Necesitas un tiempo garantizado y además no puedes gastar memoria adicional.',
        'Sólo te interesan los k elementos mayores: puedes detener las extracciones en cuanto los tengas.',
        'Como respaldo de quicksort, para cortar su peor caso.',
      ]}
      evitarlo={[
        'Necesitas estabilidad. Los intercambios a larga distancia la rompen.',
        'Los datos ya vienen casi ordenados. Montículos no lo aprovecha: primero deshace ese orden para construir el montículo.',
        'Buscas la máxima velocidad promedio. Quicksort suele ganar.',
      ]}
      implementacion={[
        <>
          La construcción empieza en <code>Math.floor(n / 2) - 1</code>, el último elemento que tiene al menos un
          hijo. Los que vienen después son hojas y no hay nada que hundir.
        </>,
        <>
          Al hundir, compara al padre con el mayor de sus dos hijos, no con el primero que resulte mayor. De lo
          contrario, el que sube podría ser menor que su nuevo hermano.
        </>,
        <>
          El parámetro <code>limite</code> marca dónde termina el montículo. Sin él, los elementos ya extraídos al
          final volverían a entrar en las comparaciones.
        </>,
      ]}
      relaciones={[
        {
          id: 'seleccion',
          texto: (
            <>
              Hace lo mismo que <Link to="/algoritmos/seleccion">selección</Link>, pero al revés y con ayuda: extrae
              el mayor en lugar del menor, y lo encuentra en tiempo logarítmico gracias al montículo, en lugar de
              recorrer todo lo que falta.
            </>
          ),
        },
        {
          id: 'quicksort',
          texto:
            'Quicksort es más rápido en promedio pero tiene un peor caso cuadrático. Montículos es más lento en promedio pero nunca falla. Por eso introsort los combina.',
        },
        {
          id: 'mezcla',
          texto:
            'Los dos garantizan n log n. Mezcla es estable pero necesita memoria adicional; montículos trabaja en el sitio pero no es estable.',
        },
      ]}
    />
  )
}
