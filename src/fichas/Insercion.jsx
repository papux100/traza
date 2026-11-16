import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaInsercion() {
  return (
    <Ficha
      id="insercion"
      analogia={
        <>
          <p>
            Es lo que haces al recibir cartas en una partida. Tienes en la mano las cartas que ya acomodaste. Llega una
            nueva, la comparas de derecha a izquierda con las que tienes y la metes justo donde le toca. Las cartas
            mayores se recorren un lugar para hacerle espacio.
          </p>
          <p>
            Nunca reacomodas toda la mano: sólo buscas el lugar de la carta que acaba de llegar.
          </p>
        </>
      }
      comoFunciona={
        <>
          <p>
            El arreglo se divide mentalmente en dos partes: a la izquierda, una parte ordenada que al inicio tiene un
            solo elemento; a la derecha, lo que falta por procesar.
          </p>
          <ol>
            <li>Toma el primer elemento de la parte sin procesar. Lo llamaremos la clave.</li>
            <li>Compárala con los elementos de la parte ordenada, de derecha a izquierda.</li>
            <li>Cada elemento mayor que la clave se desplaza una posición a la derecha.</li>
            <li>Al encontrar uno que no es mayor, o al llegar al inicio, coloca la clave en el hueco que quedó.</li>
            <li>Repite con el siguiente elemento hasta que no quede ninguno.</li>
          </ol>
        </>
      }
      requisitos={
        <p>
          Ninguno. Funciona con cualquier arreglo cuyos elementos se puedan comparar entre sí, y puede ordenar datos
          que van llegando de uno en uno, sin necesidad de conocerlos todos por adelantado.
        </p>
      }
      complejidad={
        <>
          <p>
            El costo depende de qué tan desordenada esté la entrada. Si el arreglo ya está ordenado, cada clave se
            compara una sola vez y no se mueve nada: el recorrido es lineal. Si está en orden inverso, cada clave
            tiene que cruzar toda la parte ordenada, y el trabajo crece con el cuadrado del tamaño.
          </p>
          <p>
            Esa sensibilidad a la entrada es su mayor virtud. En un arreglo casi ordenado, donde cada elemento está
            cerca de su lugar final, se comporta prácticamente como un algoritmo lineal.
          </p>
        </>
      }
      usarlo={[
        'El arreglo es pequeño, de unas pocas decenas de elementos. Ahí su sencillez le gana a los algoritmos más elaborados.',
        'Los datos ya vienen casi ordenados y sólo hay que corregir unos cuantos elementos fuera de lugar.',
        'Los datos llegan poco a poco y quieres mantenerlos ordenados en todo momento.',
        'Necesitas un ordenamiento estable que no use memoria adicional.',
      ]}
      evitarlo={[
        'El arreglo es grande y no sabes nada de su orden. Con miles de elementos, el costo cuadrático se vuelve inaceptable.',
        'Mover un elemento es caro. Inserción hace muchos desplazamientos; selección hace muchos menos.',
      ]}
      implementacion={[
        <>
          La comparación debe ser estricta: <code>arr[j] &gt; clave</code>. Si usas <code>&gt;=</code>, los elementos
          iguales se saltan entre sí y el algoritmo deja de ser estable.
        </>,
        <>
          Guarda la clave en una variable antes de empezar a desplazar. El primer desplazamiento escribe encima de su
          posición original.
        </>,
        <>
          El orden de las condiciones del <code>while</code> importa: primero <code>j &gt;= 0</code>, para no leer
          fuera del arreglo.
        </>,
      ]}
      relaciones={[
        {
          id: 'seleccion',
          texto:
            'También construye una parte ordenada a la izquierda, pero selección decide qué elemento sigue y lo pone al final de esa parte; inserción toma el que sigue y decide dónde va. Selección compara siempre lo mismo; inserción se ahorra trabajo cuando la entrada ayuda.',
        },
        {
          id: 'shell',
          texto:
            'Es inserción aplicada primero entre elementos lejanos. Así los elementos recorren distancias grandes en pocos movimientos y la pasada final, que es una inserción normal, encuentra el arreglo casi ordenado.',
        },
        {
          id: 'mezcla',
          texto:
            'Las bibliotecas reales combinan ambos: parten el arreglo como lo hace mezcla, pero ordenan los tramos pequeños con inserción, porque en tamaños chicos es más rápida.',
        },
        {
          id: 'insercion-binaria',
          texto:
            'Usa búsqueda binaria para encontrar el lugar de la clave. Reduce las comparaciones, pero los desplazamientos siguen siendo los mismos.',
        },
      ]}
    />
  )
}

