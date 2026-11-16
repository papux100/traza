import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaMezcla() {
  return (
    <Ficha
      id="mezcla"
      analogia={
        <>
          <p>
            Dos personas tienen cada una un montón de exámenes ya ordenados por apellido y quieren juntarlos en uno
            solo. No hace falta revolver nada: cada quien muestra el examen de arriba de su montón, se toma el que va
            primero y se pone en el montón final. Se repite hasta que ambos montones se acaban.
          </p>
          <p>
            Juntar dos montones ordenados es fácil y rápido. El algoritmo completo consiste en llegar a esa situación:
            partir el trabajo hasta que cada montón tenga un solo examen, que por definición ya está ordenado.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            Sigue la estrategia de divide y vencerás: resolver un problema grande partiéndolo en problemas más
            pequeños del mismo tipo.
          </p>
          <ol>
            <li>Si el tramo tiene un solo elemento, ya está ordenado. No hay nada que hacer.</li>
            <li>Parte el tramo a la mitad.</li>
            <li>Ordena la mitad izquierda con este mismo procedimiento.</li>
            <li>Ordena la mitad derecha con este mismo procedimiento.</li>
            <li>
              Combina las dos mitades: compara el primer elemento de cada una, toma el menor y avanza en esa mitad.
              Cuando una mitad se acaba, copia lo que queda de la otra.
            </li>
          </ol>
          <p>
            En el visualizador, el corchete azul bajo las barras marca el tramo que se está procesando. Fíjate en que
            los tramos pequeños se resuelven primero y los grandes se arman a partir de ellos.
          </p>
        </>
      }
      requisitos={
        <p>
          Necesita espacio para copiar las dos mitades antes de combinarlas. Si la memoria disponible es muy
          limitada, eso puede ser un impedimento.
        </p>
      }
      complejidad={
        <>
          <p>
            Tarda lo mismo con cualquier entrada. El arreglo se parte a la mitad unas log n veces, y en cada nivel de
            esa partición se combinan n elementos en total. De ahí sale n log n, sin casos malos.
          </p>
          <p>
            El precio es la memoria: las copias de las mitades ocupan un espacio proporcional al tamaño del arreglo.
            Es el único algoritmo de este bloque que no trabaja en el sitio.
          </p>
          <p>
            Observa los contadores: no hay intercambios, sólo escrituras. Mezcla no intercambia elementos de lugar;
            los copia a su posición final.
          </p>
        </>
      }
      usarlo={[
        'Necesitas un tiempo garantizado, sin importar cómo venga la entrada.',
        'Necesitas estabilidad. Es el algoritmo eficiente y estable por excelencia.',
        'Ordenas una lista enlazada. Ahí la combinación no requiere memoria adicional y mezcla es la mejor opción.',
        'Los datos no caben en memoria. Se pueden ordenar por partes en disco y combinar los archivos resultantes.',
      ]}
      evitarlo={[
        'La memoria es escasa. Duplicar el espacio del arreglo puede no ser aceptable.',
        'El arreglo es pequeño. El costo de copiar y de las llamadas recursivas pesa más que el beneficio.',
      ]}
      implementacion={[
        <>
          La comparación al combinar debe ser <code>izq[i] &lt;= der[j]</code>. Con <code>&lt;</code>, ante dos
          elementos iguales se tomaría primero el de la derecha y se perdería la estabilidad.
        </>,
        <>
          Las mitades se copian antes de combinar. Si leyeras directamente del arreglo, las escrituras irían
          destruyendo elementos que todavía no has usado.
        </>,
        <>
          Los dos ciclos finales no pueden ejecutarse ambos: cuando el ciclo principal termina, a lo mucho una de las
          mitades conserva elementos.
        </>,
      ]}
      relaciones={[
        {
          id: 'quicksort',
          texto:
            'Los dos dividen y vencen, pero en orden contrario. Mezcla parte sin pensar y hace el trabajo al combinar. Quicksort hace el trabajo al partir y después no tiene nada que combinar. Mezcla garantiza n log n y es estable; quicksort no usa memoria adicional y suele ser más rápido.',
        },
        {
          id: 'insercion',
          texto:
            'Timsort, el ordenamiento de Python y el que Java usa para objetos, es una mezcla que aprovecha los tramos que ya vienen ordenados y usa inserción para los tramos cortos.',
        },
        {
          id: 'monticulos',
          texto:
            'Montículos también garantiza n log n y además trabaja en el sitio, pero no es estable.',
        },
      ]}
    />
  )
}
