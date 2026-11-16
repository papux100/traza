import { Link } from 'react-router'
import { Ficha } from '@/componentes/ficha/Ficha'

export default function FichaConteo() {
  return (
    <Ficha
      id="conteo"
      analogia={
        <>
          <p>
            Al terminar una elección escolar, nadie ordena las boletas comparándolas entre sí. Se hace una columna por
            candidato y se pone una marca por cada voto. Al final, el conteo dice todo lo que hace falta.
          </p>
          <p>
            Si además quisieras formar las boletas en una fila ordenada por candidato, el conteo te diría de inmediato
            dónde empieza el bloque de cada uno.
          </p>
        </>
      }
      comoFunciona={
        <>
          <ol>
            <li>Crea una casilla por cada valor posible, desde 0 hasta el mayor del arreglo.</li>
            <li>Recorre el arreglo y suma uno a la casilla de cada valor.</li>
            <li>
              Acumula: cada casilla pasa a valer la suma de sí misma y todas las anteriores. Ahora indica cuántos
              elementos son menores o iguales a ese valor, es decir, dónde termina su bloque en el arreglo final.
            </li>
            <li>
              Recorre el arreglo desde el final. Cada elemento va a la posición que indica su casilla menos uno, y la
              casilla se reduce para el siguiente elemento con el mismo valor.
            </li>
            <li>Copia el arreglo de salida sobre el original.</li>
          </ol>
          <p>
            Fíjate en el contador de comparaciones del visualizador: se queda en cero durante toda la ejecución.
          </p>
        </>
      }
      requisitos={
        <>
          <p>
            <strong>Los valores deben ser enteros dentro de un rango pequeño.</strong> Hace falta una casilla por cada
            valor posible, así que ordenar diez números entre 1 y un millón obligaría a crear un millón de casillas.
            Por eso, en este visualizador, el mayor valor permitido es 15.
          </p>
          <p>Necesita además un arreglo de salida del mismo tamaño que la entrada.</p>
        </>
      }
      complejidad={
        <>
          <p>
            Recorre el arreglo un número fijo de veces y recorre las casillas otro tanto. Si n es la cantidad de
            elementos y k la cantidad de valores posibles, el costo es n + k, con cualquier entrada.
          </p>
          <p>
            Eso es más rápido que el límite de n log n que tienen todos los algoritmos basados en comparar. No es una
            contradicción: ese límite sólo aplica a quien ordena preguntando cuál de dos elementos es mayor, y conteo
            nunca lo pregunta. A cambio, depende de k: si el rango de valores es enorme, deja de convenir.
          </p>
        </>
      }
      usarlo={[
        'Los valores son enteros en un rango reducido: calificaciones de 0 a 10, edades, días del mes.',
        'Hay muchos elementos y pocos valores distintos.',
        'Como paso interno de otro algoritmo, como el ordenamiento por residuos.',
      ]}
      evitarlo={[
        'Los valores tienen un rango muy grande en comparación con la cantidad de elementos.',
        'Los valores no son enteros ni se pueden convertir de forma natural a una posición, como nombres o decimales.',
        'La memoria es escasa. Necesita las casillas más un arreglo de salida completo.',
      ]}
      implementacion={[
        <>
          El recorrido final va de atrás hacia adelante. Así, de dos elementos iguales, el último en aparecer ocupa la
          última posición de su bloque, y el algoritmo resulta estable. Recorrerlo al revés lo rompe.
        </>,
        <>
          Si los valores pueden ser negativos o empezar lejos de cero, se resta el mínimo antes de usarlos como índice
          y se crean sólo <code>max - min + 1</code> casillas.
        </>,
        <>
          Existe una versión más corta que reescribe cada valor tantas veces como indica su casilla. Funciona con
          números sueltos, pero pierde los datos que acompañan a cada elemento y no sirve dentro de residuos.
        </>,
      ]}
      relaciones={[
        {
          id: 'residuos',
          texto:
            'Residuos aplica un ordenamiento estable como éste a cada cifra por separado. Así supera la limitación del rango pequeño: cada pasada sólo necesita diez casillas.',
        },
        {
          id: 'cubetas',
          texto:
            'Conteo es el caso extremo de cubetas: una cubeta por cada valor posible, tan pequeñas que no hace falta ordenarlas por dentro.',
        },
        {
          id: 'mezcla',
          texto: (
            <>
              <Link to="/algoritmos/mezcla">Mezcla</Link> y los demás algoritmos de comparación funcionan con
              cualquier tipo de dato que se pueda comparar. Conteo es más rápido, pero sólo cuando los datos cumplen
              sus condiciones.
            </>
          ),
        },
      ]}
    />
  )
}
